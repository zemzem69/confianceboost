import requests
import sys
import json
from datetime import datetime

class ConfianceBoostAPITester:
    def __init__(self, base_url="https://194b492a-09c5-423b-a413-931d15cc5c57.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_user_email = f"test_user_{datetime.now().strftime('%H%M%S')}@test.com"
        self.demo_user_email = "demo@confianceboost.fr"
        self.demo_password = "demo123"

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Network Error: {str(e)}")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "health",
            200
        )
        return success

    def test_stats(self):
        """Test stats endpoint"""
        success, response = self.run_test(
            "Get Stats",
            "GET", 
            "stats",
            200
        )
        if success:
            print(f"   Stats: {response}")
        return success

    def test_register_new_user(self):
        """Test user registration"""
        success, response = self.run_test(
            "Register New User",
            "POST",
            "auth/register",
            200,
            data={
                "email": self.test_user_email,
                "password": "TestPass123!",
                "first_name": "Test",
                "last_name": "User"
            }
        )
        if success and 'token' in response:
            self.token = response['token']
            if 'user' in response:
                self.user_id = response['user'].get('id')
            print(f"   Registered user: {self.test_user_email}")
            return True
        return False

    def test_login_demo_user(self):
        """Test login with demo credentials"""
        success, response = self.run_test(
            "Login Demo User",
            "POST",
            "auth/login",
            200,
            data={
                "email": self.demo_user_email,
                "password": self.demo_password
            }
        )
        if success and 'token' in response:
            self.token = response['token']
            if 'user' in response:
                self.user_id = response['user'].get('id')
            print(f"   Logged in as: {self.demo_user_email}")
            return True
        return False

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        success, response = self.run_test(
            "Login Invalid Credentials",
            "POST",
            "auth/login",
            401,
            data={
                "email": "invalid@test.com",
                "password": "wrongpassword"
            }
        )
        return success

    def test_get_modules(self):
        """Test getting all modules"""
        success, response = self.run_test(
            "Get All Modules",
            "GET",
            "modules",
            200
        )
        if success:
            print(f"   Found {len(response)} modules")
            return response
        return []

    def test_get_single_module(self, module_id):
        """Test getting a single module"""
        success, response = self.run_test(
            f"Get Module {module_id}",
            "GET",
            f"modules/{module_id}",
            200
        )
        if success:
            print(f"   Module: {response.get('title', 'Unknown')}")
        return success, response

    def test_get_user_progress(self):
        """Test getting user progress (requires auth)"""
        if not self.token:
            print("❌ No token available for progress test")
            return False
            
        success, response = self.run_test(
            "Get User Progress",
            "GET",
            "progress",
            200
        )
        if success:
            print(f"   Found progress for {len(response)} modules")
        return success, response

    def test_start_module(self, module_id):
        """Test starting a module"""
        if not self.token:
            print("❌ No token available for start module test")
            return False
            
        success, response = self.run_test(
            f"Start Module {module_id}",
            "POST",
            f"progress/{module_id}/start",
            200
        )
        return success

    def test_complete_lesson(self, module_id, lesson_id):
        """Test completing a lesson"""
        if not self.token:
            print("❌ No token available for complete lesson test")
            return False
            
        success, response = self.run_test(
            f"Complete Lesson {lesson_id}",
            "POST",
            f"progress/{module_id}/complete-lesson/{lesson_id}",
            200
        )
        return success

    def test_get_dashboard(self):
        """Test getting dashboard data (requires auth)"""
        if not self.token:
            print("❌ No token available for dashboard test")
            return False
            
        success, response = self.run_test(
            "Get Dashboard",
            "GET",
            "dashboard",
            200
        )
        if success:
            stats = response.get('stats', {})
            print(f"   Dashboard stats: {stats}")
        return success, response

    def test_payment_create_checkout(self):
        """Test creating payment checkout"""
        success, response = self.run_test(
            "Create Payment Checkout",
            "POST",
            "payment/create-checkout",
            200,
            data={
                "user_email": self.test_user_email,
                "user_name": "Test User"
            }
        )
        if success:
            print(f"   Checkout created: {response.get('checkout_url', 'No URL')}")
        return success, response

    def test_unauthorized_access(self):
        """Test accessing protected endpoints without token"""
        # Temporarily remove token
        temp_token = self.token
        self.token = None
        
        success, _ = self.run_test(
            "Unauthorized Dashboard Access",
            "GET",
            "dashboard",
            401
        )
        
        # Restore token
        self.token = temp_token
        return success

def main():
    print("🚀 Starting ConfianceBoost API Tests")
    print("=" * 50)
    
    tester = ConfianceBoostAPITester()
    
    # Test 1: Health Check
    print("\n📋 BASIC ENDPOINTS")
    tester.test_health_check()
    tester.test_stats()
    
    # Test 2: Authentication
    print("\n🔐 AUTHENTICATION TESTS")
    tester.test_register_new_user()
    tester.test_login_invalid_credentials()
    
    # Test with demo user
    if not tester.test_login_demo_user():
        print("⚠️  Demo user login failed, continuing with registered user")
    
    # Test 3: Modules
    print("\n📚 MODULES TESTS")
    modules = tester.test_get_modules()
    
    if modules:
        # Test getting first module details
        first_module = modules[0]
        module_id = first_module.get('id')
        if module_id:
            success, module_data = tester.test_get_single_module(module_id)
            
            # Test 4: Progress and Learning
            print("\n📈 PROGRESS TESTS")
            tester.test_get_user_progress()
            
            if success and module_data:
                # Test starting module
                tester.test_start_module(module_id)
                
                # Test completing first lesson if available
                lessons = module_data.get('lessons', [])
                if lessons:
                    first_lesson_id = lessons[0].get('id')
                    if first_lesson_id:
                        tester.test_complete_lesson(module_id, first_lesson_id)
    
    # Test 5: Dashboard
    print("\n📊 DASHBOARD TESTS")
    tester.test_get_dashboard()
    
    # Test 6: Payment
    print("\n💳 PAYMENT TESTS")
    tester.test_payment_create_checkout()
    
    # Test 7: Security
    print("\n🔒 SECURITY TESTS")
    tester.test_unauthorized_access()
    
    # Final Results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS")
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())