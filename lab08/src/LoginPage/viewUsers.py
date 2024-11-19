from app import db, Student, app 

with app.app_context():
    users = Student.query.all()
    for user in users:
        print(f"Name: {user.name}, Password: {user.password}")
