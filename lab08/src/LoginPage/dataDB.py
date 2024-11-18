from app import db, UserInfo, Courses, studentEnrolledin, instructorTeaches, app  # Import the app, db, and Student model from your main app file

# Additional Users
new_user5 = UserInfo(name="Sarah", password="123", userType="student", userID="S003")
new_user6 = UserInfo(name="Mike", password="123", userType="student", userID="S004")
new_user7 = UserInfo(name="Emma", password="123", userType="teacher", userID="T002")
new_user8 = UserInfo(name="Olivia", password="123", userType="admin", userID="A002")
new_user9 = UserInfo(name="Hepworth", password="123", userType="teacher", userID="T003")
new_user10 = UserInfo(name="Santosh", password="123", userType="teacher", userID="T004")

# Additional Courses
new_course4 = Courses(courseID=4, name='CSE120', maxEnrolled=100, instructorName="Santosh", timeslot="MWF 11:00-12:15 PM")
new_course5 = Courses(courseID=5, name='CSE170', maxEnrolled=80, instructorName="Hepworth", timeslot="TH 2:00-3:15 PM")
new_course6 = Courses(courseID=6, name='Physics101', maxEnrolled=60, instructorName="Emma", timeslot="MW 3:00-4:15 PM")

# Additional Student Enrollments
enrollStudent6 = studentEnrolledin(enrollmentID=6, studentID="S003", courseID=1)
enrollStudent7 = studentEnrolledin(enrollmentID=7, studentID="S004", courseID=2)
enrollStudent8 = studentEnrolledin(enrollmentID=8, studentID="S003", grade=85.00, courseID=3)
enrollStudent9 = studentEnrolledin(enrollmentID=9, studentID="S004", courseID=5)
enrollStudent10 = studentEnrolledin(enrollmentID=10, studentID="S004", courseID=6)

# Additional Instructors Assigned to Courses
assignInstructor2 = instructorTeaches(instructionID=2, teacherID="T003", courseID=5)
assignInstructor3 = instructorTeaches(instructionID=3, teacherID="T002", courseID=6)
assignInstructor4 = instructorTeaches(instructionID=4, teacherID="T004", courseID=4)
assignInstructor5 = instructorTeaches(instructionID=5, teacherID="T004", courseID=1)
assignInstructor6 = instructorTeaches(instructionID=6, teacherID="T003", courseID=2)

# Use app context to interact with the database
with app.app_context():
    db.session.add(new_user5)
    db.session.add(new_user6)
    db.session.add(new_user7)
    db.session.add(new_user8)
    db.session.add(new_user9)
    db.session.add(new_user10)
    db.session.add(new_course4)
    db.session.add(new_course5)
    db.session.add(new_course6)
    db.session.add(enrollStudent6)
    db.session.add(enrollStudent7)
    db.session.add(enrollStudent8)
    db.session.add(enrollStudent9)
    db.session.add(enrollStudent10)
    db.session.add(assignInstructor2)
    db.session.add(assignInstructor3)
    db.session.add(assignInstructor4)
    db.session.add(assignInstructor5)
    db.session.add(assignInstructor6)
    db.session.commit()

print("Additional data has been added to the database.")
