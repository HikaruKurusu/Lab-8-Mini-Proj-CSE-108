from app import db, UserInfo, app  # Import the app, db, and Student model from your main app file

# Create a new Student instance
new_user = UserInfo(name="Hikaru", password="123", userType="student")

# Use app context to interact with the database
with app.app_context():
    db.session.add(new_user)
    db.session.commit()

print("User added successfully!")
