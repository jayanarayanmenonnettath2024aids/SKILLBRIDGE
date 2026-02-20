from models import StudentProfile

class ProfileService:
    @staticmethod
    def validate_profile(data):
        required_fields = ['name', 'email']
        for field in required_fields:
            if not data.get(field):
                return False, f"Missing required field: {field}"
        return True, "Valid profile"

    @staticmethod
    def create_profile(data):
        # In a real app, save to database
        # For now, just return the object to simulate saving
        return StudentProfile(data)
