from fastapi import FastAPI, APIRouter, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime
import csv
import io

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'filmschedule')]

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Mount static files for uploads - must be after API routes are registered
# Will mount this after including the router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Models
class ScheduleRow(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str  # 'item' or 'text'
    time: str = ""
    scene: str = ""
    location: str = ""
    cast: str = ""
    notes: str = ""


class ScheduleDay(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: str  # DD-MM-YYYY format
    rows: List[ScheduleRow] = []
    position: int = 0


class CalltimeRow(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    time: str = ""
    name: str = ""
    type: str = "item"  # 'item' or 'text'


class CalltimeHeaders(BaseModel):
    time: str = "Time"
    name: str = "Name"


class Calltime(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = "Calltime"
    headers: Optional[CalltimeHeaders] = None
    rows: List[CalltimeRow] = []
    position: int = 0


class ColumnWidths(BaseModel):
    time: int = 15
    scene: int = 15
    location: int = 23
    cast: int = 23
    notes: int = 24


class ColumnHeaders(BaseModel):
    time: str = "Time"
    scene: str = "Scene"
    location: str = "Location"
    cast: str = "Cast"
    notes: str = "Notes"


class Project(BaseModel):
    name: str
    notes: str = ""
    logo_url: str = ""
    column_widths: Optional[ColumnWidths] = None
    column_headers: Optional[ColumnHeaders] = None
    days: List[ScheduleDay] = []
    calltimes: List[Calltime] = []
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    archived: bool = False


class ProjectResponse(BaseModel):
    id: str
    name: str
    notes: str
    logo_url: str
    column_widths: ColumnWidths
    column_headers: ColumnHeaders
    calltime_headers: CalltimeHeaders
    days: List[ScheduleDay]
    calltimes: List[Calltime]
    created_at: str
    updated_at: str
    archived: bool


class ProjectListItem(BaseModel):
    id: str
    name: str
    created_at: str
    updated_at: str
    archived: bool
    day_count: int


# Helper functions
def serialize_doc(doc: Dict) -> Dict:
    """Convert MongoDB document to JSON-serializable format"""
    if doc is None:
        return None
    
    result = {}
    for key, value in doc.items():
        if key == '_id':
            result['id'] = str(value)
        elif isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.strftime("%d-%m-%Y %H:%M:%S")
        else:
            result[key] = value
    
    return result


def format_date_dd_mm_yyyy(date_str: str) -> str:
    """Ensure date is in DD-MM-YYYY format"""
    return date_str


def parse_date(date_str: str) -> datetime:
    """Parse DD-MM-YYYY date string to datetime"""
    try:
        return datetime.strptime(date_str, "%d-%m-%Y")
    except:
        return datetime.now()


def is_project_archived(project: Dict) -> bool:
    """Check if project should be archived based on dates"""
    if not project.get('days'):
        return False
    
    today = datetime.now().date()
    for day in project['days']:
        day_date = parse_date(day['date']).date()
        if day_date >= today:
            return False
    
    return True


# Endpoints
@api_router.get("/health")
async def health_check():
    """Test MongoDB connectivity"""
    try:
        await client.admin.command('ping')
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.now().strftime("%d-%m-%Y %H:%M:%S")
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail="Database connection failed")


@api_router.post("/uploads/logo")
async def upload_logo(file: UploadFile = File(...)):
    """Upload logo (JPG/PNG) and return URL"""
    try:
        if file.content_type not in ["image/jpeg", "image/jpg", "image/png"]:
            raise HTTPException(status_code=400, detail="Only JPG and PNG files are allowed")
        
        # Check file size (max 5MB)
        content = await file.read()
        if len(content) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size must be less than 5MB")
        
        # Generate safe filename
        file_ext = file.filename.split('.')[-1]
        safe_filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = UPLOAD_DIR / safe_filename
        
        # Save file
        with open(file_path, 'wb') as f:
            f.write(content)
        
        logo_url = f"/api/media/{safe_filename}"
        logger.info(f"Logo uploaded: {logo_url}")
        
        return {
            "success": True,
            "url": logo_url,
            "filename": safe_filename
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Logo upload failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/projects")
async def list_projects(include_archived: bool = False):
    """List all projects, grouped by active/archived"""
    try:
        cursor = db.projects.find({}, {"_id": 1, "name": 1, "created_at": 1, "updated_at": 1, "archived": 1, "days": 1})
        projects = await cursor.to_list(length=None)
        
        active = []
        archived = []
        
        for proj in projects:
            # Auto-archive check
            should_be_archived = is_project_archived(proj)
            if should_be_archived and not proj.get('archived', False):
                await db.projects.update_one(
                    {"_id": proj["_id"]},
                    {"$set": {"archived": True}}
                )
                proj['archived'] = True
            
            item = ProjectListItem(
                id=str(proj["_id"]),
                name=proj["name"],
                created_at=proj.get("created_at", ""),
                updated_at=proj.get("updated_at", ""),
                archived=proj.get("archived", False),
                day_count=len(proj.get("days", []))
            )
            
            if item.archived:
                archived.append(item.model_dump())
            else:
                active.append(item.model_dump())
        
        return {
            "active": active,
            "archived": archived if include_archived else []
        }
    except Exception as e:
        logger.error(f"List projects failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/projects/save")
async def save_project(project: Project):
    """Save project - upsert by exact name match"""
    try:
        now = datetime.now().strftime("%d-%m-%Y %H:%M:%S")
        
        # Check if project exists by name
        existing = await db.projects.find_one({"name": project.name})
        
        # Set default column widths if not provided
        if project.column_widths is None:
            project.column_widths = ColumnWidths()
        
        # Set default column headers if not provided
        if project.column_headers is None:
            project.column_headers = ColumnHeaders()
        
        # Set default calltime headers if not provided
        if project.calltime_headers is None:
            project.calltime_headers = CalltimeHeaders()
        
        # Auto-archive check
        project_dict = project.model_dump()
        project_dict['archived'] = is_project_archived(project_dict)
        
        if existing:
            # Update existing project
            project_dict['created_at'] = existing.get('created_at', now)
            project_dict['updated_at'] = now
            
            await db.projects.update_one(
                {"_id": existing["_id"]},
                {"$set": project_dict}
            )
            
            updated = await db.projects.find_one({"_id": existing["_id"]})
            return serialize_doc(updated)
        else:
            # Create new project
            project_dict['created_at'] = now
            project_dict['updated_at'] = now
            
            result = await db.projects.insert_one(project_dict)
            created = await db.projects.find_one({"_id": result.inserted_id})
            return serialize_doc(created)
    except Exception as e:
        logger.error(f"Save project failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/projects/{project_id}")
async def get_project(project_id: str):
    """Get project by ID"""
    try:
        project = await db.projects.find_one({"_id": ObjectId(project_id)})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return serialize_doc(project)
    except Exception as e:
        logger.error(f"Get project failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.put("/projects/{project_id}")
async def update_project(project_id: str, project: Project):
    """Update project by ID"""
    try:
        now = datetime.now().strftime("%d-%m-%Y %H:%M:%S")
        
        existing = await db.projects.find_one({"_id": ObjectId(project_id)})
        if not existing:
            raise HTTPException(status_code=404, detail="Project not found")
        
        if project.column_widths is None:
            project.column_widths = ColumnWidths()
        
        if project.column_headers is None:
            project.column_headers = ColumnHeaders()
        
        if project.calltime_headers is None:
            project.calltime_headers = CalltimeHeaders()
        
        project_dict = project.model_dump()
        project_dict['created_at'] = existing.get('created_at', now)
        project_dict['updated_at'] = now
        project_dict['archived'] = is_project_archived(project_dict)
        
        await db.projects.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": project_dict}
        )
        
        updated = await db.projects.find_one({"_id": ObjectId(project_id)})
        return serialize_doc(updated)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update project failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    """Delete project by ID"""
    try:
        result = await db.projects.delete_one({"_id": ObjectId(project_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return {"success": True, "message": "Project deleted"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete project failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/projects/{project_id}/archive")
async def toggle_archive_project(project_id: str):
    """Toggle archive status of a project"""
    try:
        project = await db.projects.find_one({"_id": ObjectId(project_id)})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        new_archived_status = not project.get('archived', False)
        
        await db.projects.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": {"archived": new_archived_status}}
        )
        
        return {
            "success": True,
            "archived": new_archived_status,
            "message": "Project archived" if new_archived_status else "Project unarchived"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Archive project failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/projects/{project_id}/duplicate")
async def duplicate_project(project_id: str):
    """Duplicate a project with a new name"""
    try:
        project = await db.projects.find_one({"_id": ObjectId(project_id)})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Remove _id and create new name
        project.pop('_id', None)
        original_name = project['name']
        project['name'] = f"{original_name} (Copy)"
        
        # Update timestamps
        now = datetime.now().strftime("%d-%m-%Y %H:%M:%S")
        project['created_at'] = now
        project['updated_at'] = now
        project['archived'] = False
        
        # Generate new IDs for all nested items
        for day in project.get('days', []):
            day['id'] = str(uuid.uuid4())
            for row in day.get('rows', []):
                row['id'] = str(uuid.uuid4())
        
        for calltime in project.get('calltimes', []):
            calltime['id'] = str(uuid.uuid4())
            for row in calltime.get('rows', []):
                row['id'] = str(uuid.uuid4())
        
        # Insert duplicate
        result = await db.projects.insert_one(project)
        duplicated = await db.projects.find_one({"_id": result.inserted_id})
        
        return serialize_doc(duplicated)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Duplicate project failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/projects/{project_id}/export.csv")
async def export_project_csv(project_id: str):
    """Export project to CSV with DD-MM-YYYY dates"""
    try:
        project = await db.projects.find_one({"_id": ObjectId(project_id)})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write schedule days
        if project.get('days'):
            writer.writerow(['SCHEDULE'])
            writer.writerow(['Date', 'Time', 'Scene', 'Location', 'Cast', 'Notes'])
            
            for day in project.get('days', []):
                date_formatted = format_date_dd_mm_yyyy(day['date'])
                for row in day.get('rows', []):
                    if row['type'] == 'item':
                        writer.writerow([
                            date_formatted,
                            row.get('time', ''),
                            row.get('scene', ''),
                            row.get('location', ''),
                            row.get('cast', ''),
                            row.get('notes', '')
                        ])
                    elif row['type'] == 'text':
                        writer.writerow([date_formatted, '', row.get('notes', ''), '', '', ''])
            
            writer.writerow([])  # Empty row separator
        
        # Write calltimes
        if project.get('calltimes'):
            writer.writerow(['CALLTIMES'])
            writer.writerow(['Time', 'Name'])
            
            for calltime in project.get('calltimes', []):
                for row in calltime.get('rows', []):
                    writer.writerow([
                        row.get('time', ''),
                        row.get('name', '')
                    ])
                writer.writerow([])  # Empty row between calltimes
        
        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={project['name']}.csv"}
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"CSV export failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Include the router in the main app
app.include_router(api_router)

# Mount static files AFTER router - serve uploaded files
app.mount("/api/media", StaticFiles(directory=str(UPLOAD_DIR)), name="media")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
