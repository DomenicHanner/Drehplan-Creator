import requests
import sys
import io
from datetime import datetime, timedelta

BACKEND_URL = "https://filmschedule-5.preview.emergentagent.com/api"

class FilmScheduleAPITester:
    def __init__(self):
        self.tests_run = 0
        self.tests_passed = 0
        self.project_id = None
        self.logo_url = None

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None, response_type='json'):
        """Run a single API test"""
        url = f"{BACKEND_URL}/{endpoint}"
        headers = {}
        
        if data and not files:
            headers['Content-Type'] = 'application/json'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                if files:
                    response = requests.post(url, files=files)
                else:
                    response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if response_type == 'json' and response.content:
                    try:
                        return success, response.json()
                    except:
                        return success, {}
                else:
                    return success, response.content
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health(self):
        """Test health check endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "health",
            200
        )
        if success:
            print(f"   Database: {response.get('database', 'unknown')}")
        return success

    def test_logo_upload(self):
        """Test logo upload"""
        # Create a small test image (1x1 PNG)
        png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
        
        files = {'file': ('test_logo.png', io.BytesIO(png_data), 'image/png')}
        
        success, response = self.run_test(
            "Logo Upload",
            "POST",
            "uploads/logo",
            200,
            files=files
        )
        
        if success and response.get('url'):
            self.logo_url = response['url']
            print(f"   Logo URL: {self.logo_url}")
        return success

    def test_create_project(self):
        """Test creating a new project"""
        today = datetime.now()
        date_str = today.strftime("%d-%m-%Y")
        
        project_data = {
            "name": f"Test Project {datetime.now().strftime('%H%M%S')}",
            "notes": "Test project notes",
            "logo_url": self.logo_url or "",
            "column_widths": {
                "time_from": 8,
                "time_to": 8,
                "scene": 15,
                "location": 20,
                "cast": 25,
                "notes": 24
            },
            "days": [
                {
                    "id": "day1",
                    "date": date_str,
                    "rows": [
                        {
                            "id": "row1",
                            "type": "item",
                            "time_from": "08:00",
                            "time_to": "10:00",
                            "scene": "Scene 1A",
                            "location": "Studio A",
                            "cast": "Actor 1, Actor 2",
                            "notes": "Morning shoot"
                        }
                    ]
                }
            ]
        }
        
        success, response = self.run_test(
            "Create Project",
            "POST",
            "projects/save",
            200,
            data=project_data
        )
        
        if success and response.get('id'):
            self.project_id = response['id']
            print(f"   Project ID: {self.project_id}")
            print(f"   Project Name: {response.get('name')}")
        return success

    def test_list_projects(self):
        """Test listing projects"""
        success, response = self.run_test(
            "List Projects",
            "GET",
            "projects?include_archived=true",
            200
        )
        
        if success:
            active_count = len(response.get('active', []))
            archived_count = len(response.get('archived', []))
            print(f"   Active: {active_count}, Archived: {archived_count}")
        return success

    def test_get_project(self):
        """Test getting a specific project"""
        if not self.project_id:
            print("⚠️  Skipped - No project ID available")
            return False
        
        success, response = self.run_test(
            "Get Project",
            "GET",
            f"projects/{self.project_id}",
            200
        )
        
        if success:
            print(f"   Retrieved: {response.get('name')}")
            print(f"   Days: {len(response.get('days', []))}")
        return success

    def test_update_project(self):
        """Test updating a project"""
        if not self.project_id:
            print("⚠️  Skipped - No project ID available")
            return False
        
        # First get the project
        url = f"{BACKEND_URL}/projects/{self.project_id}"
        response = requests.get(url)
        if response.status_code != 200:
            print("❌ Failed to get project for update")
            return False
        
        project = response.json()
        project['notes'] = "Updated notes"
        
        # Add a new day
        tomorrow = datetime.now() + timedelta(days=1)
        date_str = tomorrow.strftime("%d-%m-%Y")
        
        project['days'].append({
            "id": "day2",
            "date": date_str,
            "rows": [
                {
                    "id": "row2",
                    "type": "text",
                    "time_from": "",
                    "time_to": "",
                    "scene": "",
                    "location": "",
                    "cast": "",
                    "notes": "Afternoon Session"
                }
            ]
        })
        
        success, response = self.run_test(
            "Update Project",
            "PUT",
            f"projects/{self.project_id}",
            200,
            data=project
        )
        
        if success:
            print(f"   Updated: {response.get('name')}")
            print(f"   Days: {len(response.get('days', []))}")
        return success

    def test_export_csv(self):
        """Test CSV export"""
        if not self.project_id:
            print("⚠️  Skipped - No project ID available")
            return False
        
        success, content = self.run_test(
            "Export CSV",
            "GET",
            f"projects/{self.project_id}/export.csv",
            200,
            response_type='csv'
        )
        
        if success:
            lines = content.decode('utf-8').split('\n')
            print(f"   CSV Lines: {len(lines)}")
            print(f"   Header: {lines[0] if lines else 'N/A'}")
        return success

    def test_auto_archive(self):
        """Test auto-archive functionality with past dates"""
        # Create a project with past dates
        past_date = (datetime.now() - timedelta(days=5)).strftime("%d-%m-%Y")
        
        project_data = {
            "name": f"Past Project {datetime.now().strftime('%H%M%S')}",
            "notes": "Project with past dates",
            "logo_url": "",
            "column_widths": {
                "time_from": 8,
                "time_to": 8,
                "scene": 15,
                "location": 20,
                "cast": 25,
                "notes": 24
            },
            "days": [
                {
                    "id": "past_day",
                    "date": past_date,
                    "rows": [
                        {
                            "id": "past_row",
                            "type": "item",
                            "time_from": "08:00",
                            "time_to": "10:00",
                            "scene": "Scene 1",
                            "location": "Location",
                            "cast": "Cast",
                            "notes": "Notes"
                        }
                    ]
                }
            ]
        }
        
        success, response = self.run_test(
            "Create Past Project (Auto-Archive Test)",
            "POST",
            "projects/save",
            200,
            data=project_data
        )
        
        if success:
            archived = response.get('archived', False)
            print(f"   Auto-archived: {archived}")
            if archived:
                print("   ✅ Auto-archive working correctly")
            else:
                print("   ⚠️  Project not auto-archived")
        
        return success

    def test_delete_project(self):
        """Test deleting a project"""
        if not self.project_id:
            print("⚠️  Skipped - No project ID available")
            return False
        
        success, response = self.run_test(
            "Delete Project",
            "DELETE",
            f"projects/{self.project_id}",
            200
        )
        
        if success:
            print(f"   Message: {response.get('message', 'Deleted')}")
        return success

def main():
    print("=" * 60)
    print("Film Schedule API Testing")
    print("=" * 60)
    
    tester = FilmScheduleAPITester()
    
    # Run all tests in sequence
    tests = [
        tester.test_health,
        tester.test_logo_upload,
        tester.test_create_project,
        tester.test_list_projects,
        tester.test_get_project,
        tester.test_update_project,
        tester.test_export_csv,
        tester.test_auto_archive,
        tester.test_delete_project,
    ]
    
    for test in tests:
        test()
    
    # Print summary
    print("\n" + "=" * 60)
    print(f"📊 Tests Summary: {tester.tests_passed}/{tester.tests_run} passed")
    print("=" * 60)
    
    if tester.tests_passed == tester.tests_run:
        print("✅ All tests passed!")
        return 0
    else:
        print(f"❌ {tester.tests_run - tester.tests_passed} test(s) failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
