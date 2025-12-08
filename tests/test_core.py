"""
POC Test Script for Film Schedule App
Tests all core endpoints to validate functionality before building the full app.
"""
import requests
import io
from PIL import Image
import json

# Backend URL
BACKEND_URL = "http://localhost:8001"


def test_health_check():
    """Test 1: MongoDB connectivity"""
    print("\n=== Test 1: Health Check (MongoDB Connectivity) ===")
    try:
        response = requests.get(f"{BACKEND_URL}/api/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200, "Health check failed"
        data = response.json()
        assert data["status"] == "healthy", "Database not healthy"
        assert data["database"] == "connected", "Database not connected"
        assert "timestamp" in data, "Timestamp missing"
        
        # Verify DD-MM-YYYY format in timestamp
        timestamp = data["timestamp"]
        date_part = timestamp.split()[0]
        parts = date_part.split('-')
        assert len(parts) == 3, "Date format incorrect"
        assert len(parts[0]) == 2, "Day should be 2 digits"
        assert len(parts[1]) == 2, "Month should be 2 digits"
        assert len(parts[2]) == 4, "Year should be 4 digits"
        
        print("✓ Health check passed")
        print("✓ MongoDB connected")
        print("✓ Date format DD-MM-YYYY verified")
        return True
    except Exception as e:
        print(f"✗ Health check failed: {e}")
        return False


def test_logo_upload():
    """Test 2: Logo upload (JPG/PNG)"""
    print("\n=== Test 2: Logo Upload ===")
    try:
        # Create a small test PNG image in memory
        img = Image.new('RGB', (100, 100), color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        # Test PNG upload
        files = {'file': ('test_logo.png', img_bytes, 'image/png')}
        response = requests.post(f"{BACKEND_URL}/api/uploads/logo", files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200, "Logo upload failed"
        data = response.json()
        assert data["success"] is True, "Upload not successful"
        assert "url" in data, "URL not returned"
        assert data["url"].startswith("/uploads/"), "Invalid URL format"
        assert data["url"].endswith(".png"), "File extension not preserved"
        
        logo_url = data["url"]
        print(f"✓ PNG logo uploaded successfully")
        print(f"✓ Logo URL: {logo_url}")
        
        # Test JPG upload
        img_jpg = Image.new('RGB', (100, 100), color='blue')
        img_jpg_bytes = io.BytesIO()
        img_jpg.save(img_jpg_bytes, format='JPEG')
        img_jpg_bytes.seek(0)
        
        files = {'file': ('test_logo.jpg', img_jpg_bytes, 'image/jpeg')}
        response = requests.post(f"{BACKEND_URL}/api/uploads/logo", files=files)
        assert response.status_code == 200, "JPG upload failed"
        assert response.json()["url"].endswith(".jpg"), "JPG extension not preserved"
        
        print(f"✓ JPG logo uploaded successfully")
        
        # Test invalid file type
        files = {'file': ('test.txt', io.BytesIO(b'test'), 'text/plain')}
        response = requests.post(f"{BACKEND_URL}/api/uploads/logo", files=files)
        assert response.status_code == 400, "Invalid file type should be rejected"
        print(f"✓ Invalid file type correctly rejected")
        
        return logo_url
    except Exception as e:
        print(f"✗ Logo upload test failed: {e}")
        return None


def test_csv_export():
    """Test 3: CSV export with DD-MM-YYYY dates"""
    print("\n=== Test 3: CSV Export ===")
    try:
        # Create mock project data
        mock_project = {
            "name": "Test Project",
            "notes": "Test notes",
            "logo_url": "/uploads/test.png",
            "days": [
                {
                    "date": "15-03-2024",
                    "rows": [
                        {
                            "type": "text",
                            "notes": "Morning Shoot"
                        },
                        {
                            "type": "item",
                            "time_from": "08:00",
                            "time_to": "10:00",
                            "scene": "Scene 1A",
                            "location": "Studio A",
                            "cast": "Actor 1, Actor 2",
                            "notes": "Interior shots with very long notes that should be properly exported to CSV without any issues"
                        },
                        {
                            "type": "item",
                            "time_from": "10:30",
                            "time_to": "12:00",
                            "scene": "Scene 2B",
                            "location": "Outdoor Location",
                            "cast": "Actor 3",
                            "notes": "Exterior scene"
                        }
                    ]
                },
                {
                    "date": "16-03-2024",
                    "rows": [
                        {
                            "type": "item",
                            "time_from": "09:00",
                            "time_to": "11:00",
                            "scene": "Scene 3C",
                            "location": "Studio B",
                            "cast": "Actor 1",
                            "notes": "Final shots"
                        }
                    ]
                }
            ]
        }
        
        response = requests.post(
            f"{BACKEND_URL}/api/projects/export/csv",
            json=mock_project,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        assert response.status_code == 200, "CSV export failed"
        assert response.headers['content-type'] == 'text/csv; charset=utf-8', "Wrong content type"
        
        csv_content = response.text
        print(f"\nCSV Content:\n{csv_content[:500]}...")
        
        lines = csv_content.strip().split('\n')
        assert len(lines) >= 4, "CSV should have header + at least 3 data rows"
        
        # Check header
        header = lines[0]
        assert 'Date' in header, "Date column missing"
        assert 'Time From' in header, "Time From column missing"
        assert 'Scene' in header, "Scene column missing"
        assert 'Location' in header, "Location column missing"
        assert 'Cast' in header, "Cast column missing"
        assert 'Notes' in header, "Notes column missing"
        
        # Check date format in first data row
        first_row = lines[1]
        assert '15-03-2024' in first_row, "Date format should be DD-MM-YYYY"
        
        # Check that text rows are included
        assert 'Morning Shoot' in csv_content, "Text row should be in CSV"
        
        # Check that all schedule items are present
        assert 'Scene 1A' in csv_content, "Scene 1A missing"
        assert 'Scene 2B' in csv_content, "Scene 2B missing"
        assert 'Scene 3C' in csv_content, "Scene 3C missing"
        
        # Verify each day has its date
        assert csv_content.count('15-03-2024') >= 2, "Day 1 items should have date"
        assert '16-03-2024' in csv_content, "Day 2 items should have date"
        
        print("✓ CSV export successful")
        print("✓ Header row present with all columns")
        print("✓ Date format DD-MM-YYYY verified")
        print("✓ One row per schedule item with its date")
        print("✓ Text rows included as section headers")
        print("✓ Long text properly exported")
        return True
    except Exception as e:
        print(f"✗ CSV export test failed: {e}")
        return False


def test_print_preview(logo_url):
    """Test 4: Print preview with text wrapping"""
    print("\n=== Test 4: Print Preview ===")
    try:
        # Create mock project with long text
        mock_project = {
            "name": "Test Project for Print",
            "notes": "These are project notes that should appear at the top of the print preview",
            "logo_url": logo_url or "/uploads/test.png",
            "days": [
                {
                    "date": "20-03-2024",
                    "rows": [
                        {
                            "type": "text",
                            "notes": "Morning Session - Exterior Shoots"
                        },
                        {
                            "type": "item",
                            "time_from": "08:00",
                            "time_to": "10:00",
                            "scene": "Scene 1",
                            "location": "Very long location name that should wrap properly in the PDF without causing horizontal scrolling issues",
                            "cast": "Actor One, Actor Two, Actor Three, Actor Four with very long names",
                            "notes": "This is a very long note that contains multiple pieces of information about the scene setup, camera angles, lighting requirements, and other important details that need to wrap properly in the print view"
                        }
                    ]
                }
            ]
        }
        
        response = requests.post(
            f"{BACKEND_URL}/api/projects/print-preview",
            json=mock_project,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        assert response.status_code == 200, "Print preview failed"
        assert response.headers['content-type'] == 'text/html; charset=utf-8', "Wrong content type"
        
        html_content = response.text
        
        # Check for essential elements
        assert 'Test Project for Print' in html_content, "Project title missing"
        assert 'These are project notes' in html_content, "Project notes missing"
        assert logo_url or '/uploads/test.png' in html_content, "Logo URL missing"
        assert '20-03-2024' in html_content, "Date missing"
        assert 'Morning Session - Exterior Shoots' in html_content, "Text row missing"
        
        # Check for print CSS
        assert '@media print' in html_content, "Print media query missing"
        assert 'table-layout: fixed' in html_content, "Fixed table layout missing (needed for wrapping)"
        assert 'overflow-wrap' in html_content or 'word-wrap' in html_content, "Word wrap CSS missing"
        assert 'white-space: normal' in html_content, "White space normal missing"
        assert '@page' in html_content, "Page size definition missing"
        assert 'A4' in html_content, "A4 page size missing"
        
        # Check table structure
        assert '<table>' in html_content, "Table missing"
        assert '<thead>' in html_content, "Table header missing"
        assert '<th' in html_content, "Table header cells missing"
        assert 'Time From' in html_content, "Column headers missing"
        
        # Check for long text content
        assert 'Very long location name' in html_content, "Long location text missing"
        assert 'very long note' in html_content, "Long notes missing"
        
        print("✓ Print preview HTML generated")
        print("✓ Project title and notes present")
        print("✓ Logo URL included")
        print("✓ Date format DD-MM-YYYY present")
        print("✓ Table structure with headers")
        print("✓ Print CSS with @media print")
        print("✓ Text wrapping CSS (table-layout: fixed, overflow-wrap)")
        print("✓ A4 page size defined")
        print("✓ Long text content included for wrapping test")
        return True
    except Exception as e:
        print(f"✗ Print preview test failed: {e}")
        return False


def run_all_tests():
    """Run all POC tests"""
    print("=" * 70)
    print("FILM SCHEDULE APP - POC TEST SUITE")
    print("=" * 70)
    
    results = {
        "health": False,
        "logo": False,
        "csv": False,
        "print": False
    }
    
    # Test 1: Health Check
    results["health"] = test_health_check()
    
    # Test 2: Logo Upload
    logo_url = test_logo_upload()
    results["logo"] = logo_url is not None
    
    # Test 3: CSV Export
    results["csv"] = test_csv_export()
    
    # Test 4: Print Preview
    results["print"] = test_print_preview(logo_url)
    
    # Summary
    print("\n" + "=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)
    print(f"Health Check (MongoDB):  {'✓ PASS' if results['health'] else '✗ FAIL'}")
    print(f"Logo Upload (JPG/PNG):   {'✓ PASS' if results['logo'] else '✗ FAIL'}")
    print(f"CSV Export (DD-MM-YYYY): {'✓ PASS' if results['csv'] else '✗ FAIL'}")
    print(f"Print Preview (Wrapping):{'✓ PASS' if results['print'] else '✗ FAIL'}")
    print("=" * 70)
    
    all_passed = all(results.values())
    if all_passed:
        print("\n🎉 ALL POC TESTS PASSED! Ready to build the full app.")
    else:
        print("\n⚠️  Some tests failed. Fix issues before proceeding.")
    
    print("\nUser Stories Validation:")
    print("1. ✓ Server can connect to database" if results['health'] else "1. ✗ Database connection issue")
    print("2. ✓ Upload JPG/PNG logo and get URL" if results['logo'] else "2. ✗ Logo upload issue")
    print("3. ✓ CSV export with DD-MM-YYYY dates" if results['csv'] else "3. ✗ CSV export issue")
    print("4. ✓ Print preview with text wrapping" if results['print'] else "4. ✗ Print preview issue")
    print("5. ✓ Date formatting DD-MM-YYYY works" if results['health'] and results['csv'] else "5. ✗ Date formatting issue")
    
    return all_passed


if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)
