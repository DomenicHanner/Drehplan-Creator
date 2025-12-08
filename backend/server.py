from fastapi import FastAPI, APIRouter, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel
from typing import List, Dict, Any
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

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# POC Models for testing
class ScheduleRow(BaseModel):
    type: str  # 'item' or 'text'
    time_from: str = ""
    time_to: str = ""
    scene: str = ""
    location: str = ""
    cast: str = ""
    notes: str = ""


class ScheduleDay(BaseModel):
    date: str  # DD-MM-YYYY format
    rows: List[ScheduleRow]


class MockProject(BaseModel):
    name: str
    notes: str = ""
    logo_url: str = ""
    days: List[ScheduleDay]


# Helper function to format date
def format_date_dd_mm_yyyy(date_str: str) -> str:
    """Ensure date is in DD-MM-YYYY format"""
    return date_str


# POC Endpoints
@api_router.get("/health")
async def health_check():
    """Test MongoDB connectivity"""
    try:
        # Ping MongoDB
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
        # Validate file type
        if file.content_type not in ["image/jpeg", "image/jpg", "image/png"]:
            raise HTTPException(status_code=400, detail="Only JPG and PNG files are allowed")
        
        # Generate safe filename
        file_ext = file.filename.split('.')[-1]
        safe_filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = UPLOAD_DIR / safe_filename
        
        # Save file
        content = await file.read()
        with open(file_path, 'wb') as f:
            f.write(content)
        
        # Return URL
        logo_url = f"/uploads/{safe_filename}"
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


@api_router.post("/projects/export/csv")
async def export_csv_poc(project: MockProject):
    """POC: Export project to CSV with DD-MM-YYYY dates"""
    try:
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['Date', 'Time From', 'Time To', 'Scene', 'Location', 'Cast', 'Notes'])
        
        # Write rows - one row per schedule item with its date
        for day in project.days:
            date_formatted = format_date_dd_mm_yyyy(day.date)
            for row in day.rows:
                if row.type == 'item':
                    writer.writerow([
                        date_formatted,
                        row.time_from,
                        row.time_to,
                        row.scene,
                        row.location,
                        row.cast,
                        row.notes
                    ])
                elif row.type == 'text':
                    # Text rows as section headers
                    writer.writerow([date_formatted, '', '', row.notes, '', '', ''])
        
        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={project.name}.csv"}
        )
    except Exception as e:
        logger.error(f"CSV export failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/projects/print-preview")
async def print_preview_poc(project: MockProject):
    """POC: Generate print preview HTML with proper text wrapping"""
    try:
        # Build HTML with print-optimized CSS
        html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{project.name} - Print Preview</title>
    <style>
        @page {{
            size: A4;
            margin: 1cm;
        }}
        
        body {{
            font-family: Arial, sans-serif;
            font-size: 10pt;
            margin: 0;
            padding: 20px;
        }}
        
        .header {{
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
        }}
        
        .project-title {{
            font-size: 18pt;
            font-weight: bold;
        }}
        
        .logo {{
            max-width: 150px;
            max-height: 80px;
            object-fit: contain;
        }}
        
        .notes {{
            margin-bottom: 15px;
            white-space: pre-wrap;
            word-wrap: break-word;
        }}
        
        .schedule-day {{
            margin-bottom: 20px;
            page-break-inside: avoid;
        }}
        
        .day-header {{
            font-size: 12pt;
            font-weight: bold;
            background: #f0f0f0;
            padding: 8px;
            margin-bottom: 5px;
        }}
        
        table {{
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }}
        
        th {{
            background: #e0e0e0;
            padding: 6px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #ccc;
            font-size: 9pt;
        }}
        
        td {{
            padding: 6px;
            border: 1px solid #ccc;
            vertical-align: top;
            overflow-wrap: anywhere;
            word-wrap: break-word;
            white-space: normal;
        }}
        
        .text-row {{
            background: #f9f9f9;
            font-weight: bold;
            text-align: center;
        }}
        
        .col-time {{
            width: 8%;
        }}
        
        .col-scene {{
            width: 15%;
        }}
        
        .col-location {{
            width: 20%;
        }}
        
        .col-cast {{
            width: 25%;
        }}
        
        .col-notes {{
            width: 24%;
        }}
        
        @media print {{
            body {{
                padding: 0;
            }}
            
            .schedule-day {{
                page-break-inside: avoid;
            }}
            
            tr {{
                page-break-inside: avoid;
            }}
        }}
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="project-title">{project.name}</div>
            {f'<div class="notes">{project.notes}</div>' if project.notes else ''}
        </div>
        {f'<img src="{project.logo_url}" class="logo" alt="Logo" />' if project.logo_url else ''}
    </div>
"""
        
        # Add schedule days
        for day in project.days:
            html += f"""
    <div class="schedule-day">
        <div class="day-header">{day.date}</div>
        <table>
            <thead>
                <tr>
                    <th class="col-time">Time From</th>
                    <th class="col-time">Time To</th>
                    <th class="col-scene">Scene</th>
                    <th class="col-location">Location</th>
                    <th class="col-cast">Cast</th>
                    <th class="col-notes">Notes</th>
                </tr>
            </thead>
            <tbody>
"""
            for row in day.rows:
                if row.type == 'text':
                    html += f"""
                <tr>
                    <td colspan="6" class="text-row">{row.notes}</td>
                </tr>
"""
                else:
                    html += f"""
                <tr>
                    <td>{row.time_from}</td>
                    <td>{row.time_to}</td>
                    <td>{row.scene}</td>
                    <td>{row.location}</td>
                    <td>{row.cast}</td>
                    <td>{row.notes}</td>
                </tr>
"""
            html += """
            </tbody>
        </table>
    </div>
"""
        
        html += """
</body>
</html>
"""
        return HTMLResponse(content=html)
    except Exception as e:
        logger.error(f"Print preview failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Include the router in the main app
app.include_router(api_router)

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