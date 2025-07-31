#!/usr/bin/env python3
"""
ConfianceBoost Backend API Test Suite
Tests all backend endpoints for the ConfianceBoost application
"""

import requests
import json
import os
import sys
from datetime import datetime
from pathlib import Path

# Get the backend URL from frontend .env file
def get_backend_url():
    frontend_env_path = Path(__file__).parent / "frontend" / ".env"
    if frontend_env_path.exists():
        with open(frontend_env_path, 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    return "http://localhost:8001"

BASE_URL = get_backend_url()
API_BASE = f"{BASE_URL}/api"

class ConfianceBoostAPITester:
    def __init__(self):
        self.base_url = API_BASE
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name, success, details="", response_data=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if not success and response_data:
            print(f"   Response: {response_data}")
        print()
    
    def test_health_check(self):
        """Test GET /api/ - Health check endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/")
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "version" in data:
                    self.log_test(
                        "Health Check (GET /api/)", 
                        True, 
                        f"API is running - {data['message']}, version {data['version']}"
                    )
                    return True
                else:
                    self.log_test(
                        "Health Check (GET /api/)", 
                        False, 
                        "Response missing required fields",
                        data
                    )
            else:
                self.log_test(
                    "Health Check (GET /api/)", 
                    False, 
                    f"HTTP {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Health Check (GET /api/)", 
                False, 
                f"Connection error: {str(e)}"
            )
        return False
    
    def test_get_all_modules(self):
        """Test GET /api/modules - Get all training modules"""
        try:
            response = self.session.get(f"{self.base_url}/modules")
            
            if response.status_code == 200:
                modules = response.json()
                if isinstance(modules, list) and len(modules) > 0:
                    # Validate module structure
                    first_module = modules[0]
                    required_fields = ["id", "title", "description", "duration", "lessons", "content"]
                    
                    if all(field in first_module for field in required_fields):
                        self.log_test(
                            "Get All Modules (GET /api/modules)", 
                            True, 
                            f"Retrieved {len(modules)} modules successfully"
                        )
                        return modules
                    else:
                        missing_fields = [f for f in required_fields if f not in first_module]
                        self.log_test(
                            "Get All Modules (GET /api/modules)", 
                            False, 
                            f"Module missing required fields: {missing_fields}",
                            first_module
                        )
                else:
                    self.log_test(
                        "Get All Modules (GET /api/modules)", 
                        False, 
                        "No modules returned or invalid format",
                        modules
                    )
            else:
                self.log_test(
                    "Get All Modules (GET /api/modules)", 
                    False, 
                    f"HTTP {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Get All Modules (GET /api/modules)", 
                False, 
                f"Request error: {str(e)}"
            )
        return None
    
    def test_get_specific_module(self, module_id=1):
        """Test GET /api/modules/{id} - Get specific module"""
        try:
            response = self.session.get(f"{self.base_url}/modules/{module_id}")
            
            if response.status_code == 200:
                module = response.json()
                required_fields = ["id", "title", "description", "duration", "lessons", "content"]
                
                if all(field in module for field in required_fields):
                    if module["id"] == module_id:
                        self.log_test(
                            f"Get Specific Module (GET /api/modules/{module_id})", 
                            True, 
                            f"Retrieved module '{module['title']}' successfully"
                        )
                        return module
                    else:
                        self.log_test(
                            f"Get Specific Module (GET /api/modules/{module_id})", 
                            False, 
                            f"Module ID mismatch: expected {module_id}, got {module['id']}",
                            module
                        )
                else:
                    missing_fields = [f for f in required_fields if f not in module]
                    self.log_test(
                        f"Get Specific Module (GET /api/modules/{module_id})", 
                        False, 
                        f"Module missing required fields: {missing_fields}",
                        module
                    )
            elif response.status_code == 404:
                self.log_test(
                    f"Get Specific Module (GET /api/modules/{module_id})", 
                    False, 
                    "Module not found (404)",
                    response.text
                )
            else:
                self.log_test(
                    f"Get Specific Module (GET /api/modules/{module_id})", 
                    False, 
                    f"HTTP {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                f"Get Specific Module (GET /api/modules/{module_id})", 
                False, 
                f"Request error: {str(e)}"
            )
        return None
    
    def test_update_module_progress(self, module_id=1):
        """Test PUT /api/modules/{id}/progress - Update module progress"""
        try:
            # Test data for progress update
            progress_data = {
                "progress": 50,
                "completed": False
            }
            
            response = self.session.put(
                f"{self.base_url}/modules/{module_id}/progress",
                json=progress_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                updated_module = response.json()
                
                if (updated_module.get("progress") == progress_data["progress"] and 
                    updated_module.get("completed") == progress_data["completed"]):
                    self.log_test(
                        f"Update Module Progress (PUT /api/modules/{module_id}/progress)", 
                        True, 
                        f"Progress updated to {progress_data['progress']}%"
                    )
                    
                    # Test completing the module
                    complete_data = {
                        "progress": 100,
                        "completed": True
                    }
                    
                    complete_response = self.session.put(
                        f"{self.base_url}/modules/{module_id}/progress",
                        json=complete_data,
                        headers={"Content-Type": "application/json"}
                    )
                    
                    if complete_response.status_code == 200:
                        completed_module = complete_response.json()
                        if completed_module.get("completed") == True:
                            self.log_test(
                                f"Complete Module (PUT /api/modules/{module_id}/progress)", 
                                True, 
                                "Module marked as completed successfully"
                            )
                            return True
                        else:
                            self.log_test(
                                f"Complete Module (PUT /api/modules/{module_id}/progress)", 
                                False, 
                                "Module not marked as completed",
                                completed_module
                            )
                    else:
                        self.log_test(
                            f"Complete Module (PUT /api/modules/{module_id}/progress)", 
                            False, 
                            f"HTTP {complete_response.status_code}",
                            complete_response.text
                        )
                else:
                    self.log_test(
                        f"Update Module Progress (PUT /api/modules/{module_id}/progress)", 
                        False, 
                        "Progress not updated correctly",
                        updated_module
                    )
            elif response.status_code == 404:
                self.log_test(
                    f"Update Module Progress (PUT /api/modules/{module_id}/progress)", 
                    False, 
                    "Module not found (404)",
                    response.text
                )
            else:
                self.log_test(
                    f"Update Module Progress (PUT /api/modules/{module_id}/progress)", 
                    False, 
                    f"HTTP {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                f"Update Module Progress (PUT /api/modules/{module_id}/progress)", 
                False, 
                f"Request error: {str(e)}"
            )
        return False
    
    def test_get_user_profile(self):
        """Test GET /api/user/profile - Get user profile"""
        try:
            response = self.session.get(f"{self.base_url}/user/profile")
            
            if response.status_code == 200:
                user = response.json()
                required_fields = ["id", "name", "email", "enrollmentDate", "completedModules", "totalProgress"]
                
                if all(field in user for field in required_fields):
                    self.log_test(
                        "Get User Profile (GET /api/user/profile)", 
                        True, 
                        f"Retrieved profile for user '{user['name']}' ({user['email']})"
                    )
                    return user
                else:
                    missing_fields = [f for f in required_fields if f not in user]
                    self.log_test(
                        "Get User Profile (GET /api/user/profile)", 
                        False, 
                        f"User profile missing required fields: {missing_fields}",
                        user
                    )
            elif response.status_code == 404:
                self.log_test(
                    "Get User Profile (GET /api/user/profile)", 
                    False, 
                    "User not found (404)",
                    response.text
                )
            else:
                self.log_test(
                    "Get User Profile (GET /api/user/profile)", 
                    False, 
                    f"HTTP {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Get User Profile (GET /api/user/profile)", 
                False, 
                f"Request error: {str(e)}"
            )
        return None
    
    def test_get_user_progress(self):
        """Test GET /api/user/progress - Get user global progress"""
        try:
            response = self.session.get(f"{self.base_url}/user/progress")
            
            if response.status_code == 200:
                progress = response.json()
                required_fields = ["totalProgress", "completedModules", "totalModules"]
                
                if all(field in progress for field in required_fields):
                    self.log_test(
                        "Get User Progress (GET /api/user/progress)", 
                        True, 
                        f"Progress: {progress['totalProgress']}% ({progress['completedModules']}/{progress['totalModules']} modules)"
                    )
                    return progress
                else:
                    missing_fields = [f for f in required_fields if f not in progress]
                    self.log_test(
                        "Get User Progress (GET /api/user/progress)", 
                        False, 
                        f"Progress data missing required fields: {missing_fields}",
                        progress
                    )
            else:
                self.log_test(
                    "Get User Progress (GET /api/user/progress)", 
                    False, 
                    f"HTTP {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Get User Progress (GET /api/user/progress)", 
                False, 
                f"Request error: {str(e)}"
            )
        return None
    
    def test_get_module_exercises(self, module_id=1):
        """Test GET /api/modules/{id}/exercises - Get module exercises"""
        try:
            response = self.session.get(f"{self.base_url}/modules/{module_id}/exercises")
            
            if response.status_code == 200:
                exercises = response.json()
                if isinstance(exercises, list):
                    self.log_test(
                        f"Get Module Exercises (GET /api/modules/{module_id}/exercises)", 
                        True, 
                        f"Retrieved {len(exercises)} exercises for module {module_id}"
                    )
                    return exercises
                else:
                    self.log_test(
                        f"Get Module Exercises (GET /api/modules/{module_id}/exercises)", 
                        False, 
                        "Invalid exercises format (not a list)",
                        exercises
                    )
            else:
                self.log_test(
                    f"Get Module Exercises (GET /api/modules/{module_id}/exercises)", 
                    False, 
                    f"HTTP {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                f"Get Module Exercises (GET /api/modules/{module_id}/exercises)", 
                False, 
                f"Request error: {str(e)}"
            )
        return None
    
    def test_get_certificates(self):
        """Test GET /api/certificates - Get user certificates"""
        try:
            response = self.session.get(f"{self.base_url}/certificates")
            
            if response.status_code == 200:
                certificates = response.json()
                if isinstance(certificates, list):
                    self.log_test(
                        "Get Certificates (GET /api/certificates)", 
                        True, 
                        f"Retrieved {len(certificates)} certificates"
                    )
                    return certificates
                else:
                    self.log_test(
                        "Get Certificates (GET /api/certificates)", 
                        False, 
                        "Invalid certificates format (not a list)",
                        certificates
                    )
            else:
                self.log_test(
                    "Get Certificates (GET /api/certificates)", 
                    False, 
                    f"HTTP {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Get Certificates (GET /api/certificates)", 
                False, 
                f"Request error: {str(e)}"
            )
        return None
    
    def test_get_stats(self):
        """Test GET /api/stats - Get platform statistics"""
        try:
            response = self.session.get(f"{self.base_url}/stats")
            
            if response.status_code == 200:
                stats = response.json()
                required_fields = ["totalStudents", "completionRate", "averageRating", "moduleCount"]
                
                if all(field in stats for field in required_fields):
                    self.log_test(
                        "Get Platform Stats (GET /api/stats)", 
                        True, 
                        f"Stats: {stats['totalStudents']} students, {stats['completionRate']}% completion, {stats['averageRating']} rating"
                    )
                    return stats
                else:
                    missing_fields = [f for f in required_fields if f not in stats]
                    self.log_test(
                        "Get Platform Stats (GET /api/stats)", 
                        False, 
                        f"Stats missing required fields: {missing_fields}",
                        stats
                    )
            else:
                self.log_test(
                    "Get Platform Stats (GET /api/stats)", 
                    False, 
                    f"HTTP {response.status_code}",
                    response.text
                )
        except Exception as e:
            self.log_test(
                "Get Platform Stats (GET /api/stats)", 
                False, 
                f"Request error: {str(e)}"
            )
        return None
    
    def test_database_initialization(self):
        """Test that database is properly initialized with default data"""
        try:
            # Check if modules are initialized
            modules = self.test_get_all_modules()
            if modules and len(modules) >= 6:
                # Check if user is initialized
                user = self.test_get_user_profile()
                if user:
                    self.log_test(
                        "Database Initialization", 
                        True, 
                        f"Database properly initialized with {len(modules)} modules and demo user"
                    )
                    return True
                else:
                    self.log_test(
                        "Database Initialization", 
                        False, 
                        "Demo user not found in database"
                    )
            else:
                self.log_test(
                    "Database Initialization", 
                    False, 
                    f"Expected at least 6 modules, found {len(modules) if modules else 0}"
                )
        except Exception as e:
            self.log_test(
                "Database Initialization", 
                False, 
                f"Database check error: {str(e)}"
            )
        return False
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print(f"🚀 Starting ConfianceBoost Backend API Tests")
        print(f"📍 Testing API at: {self.base_url}")
        print("=" * 60)
        
        # Test sequence as requested
        tests_passed = 0
        total_tests = 0
        
        # 1. Health check
        total_tests += 1
        if self.test_health_check():
            tests_passed += 1
        
        # 2. Get all modules
        total_tests += 1
        modules = self.test_get_all_modules()
        if modules:
            tests_passed += 1
        
        # 3. Get specific module
        total_tests += 1
        if self.test_get_specific_module(1):
            tests_passed += 1
        
        # 4. Update module progress
        total_tests += 1
        if self.test_update_module_progress(1):
            tests_passed += 1
        
        # 5. Get user profile
        total_tests += 1
        if self.test_get_user_profile():
            tests_passed += 1
        
        # 6. Get user progress
        total_tests += 1
        if self.test_get_user_progress():
            tests_passed += 1
        
        # 7. Get platform stats
        total_tests += 1
        if self.test_get_stats():
            tests_passed += 1
        
        # Additional tests
        total_tests += 1
        if self.test_get_module_exercises(1):
            tests_passed += 1
        
        total_tests += 1
        if self.test_get_certificates():
            tests_passed += 1
        
        total_tests += 1
        if self.test_database_initialization():
            tests_passed += 1
        
        # Summary
        print("=" * 60)
        print(f"📊 TEST SUMMARY")
        print(f"✅ Passed: {tests_passed}/{total_tests}")
        print(f"❌ Failed: {total_tests - tests_passed}/{total_tests}")
        print(f"📈 Success Rate: {(tests_passed/total_tests)*100:.1f}%")
        
        if tests_passed == total_tests:
            print("🎉 ALL TESTS PASSED! Backend API is working correctly.")
        else:
            print("⚠️  Some tests failed. Check the details above.")
        
        return tests_passed, total_tests, self.test_results

def main():
    """Main test execution"""
    tester = ConfianceBoostAPITester()
    passed, total, results = tester.run_all_tests()
    
    # Save detailed results to file
    results_file = Path(__file__).parent / "backend_test_results.json"
    with open(results_file, 'w') as f:
        json.dump({
            "summary": {
                "passed": passed,
                "total": total,
                "success_rate": (passed/total)*100,
                "timestamp": datetime.now().isoformat()
            },
            "tests": results
        }, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: {results_file}")
    
    # Exit with appropriate code
    sys.exit(0 if passed == total else 1)

if __name__ == "__main__":
    main()