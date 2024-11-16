from app import db, UserInfo, app  # Import the app, db, and Student model from your main app file

# Create a new Student instance
new_user = UserInfo(name="Kyle", password="123", userType="student", id=3)


# Use app context to interact with the database
with app.app_context():
    delete = UserInfo.query.filter_by(name="Jason").delete()
    db.session.add(new_user)
    db.session.commit()

print("User added successfully!")
