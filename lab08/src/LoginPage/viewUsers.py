from app import db, Student, app  # Import necessary components from your app

with app.app_context():
    users = Student.query.all()  # Retrieve all users from the Student table
    for user in users:
        print(f"Name: {user.name}, Password: {user.password}")  # Display each user's details
