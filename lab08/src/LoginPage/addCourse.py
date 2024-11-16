from app import db, Courses, app  # Import the app, db, and Student model from your main app file

new_course = Courses(id= 1,name='CSE111', maxEnrolled=120)

# Use app context to interact with the database
with app.app_context():
    db.session.add(new_course)
    db.session.commit()

print("Course added successfully!")
