from app import db, UserInfo, Courses, studentEnrolledin, instructorTeaches, app  # Import the app, db, and Student model from your main app file

# Create a new Student instance
new_user1 = UserInfo(name="Ethan", password="123", userType="teacher", userID="T001")
new_user2 = UserInfo(name="Jason", password="123", userType="admin", userID="A001")
new_user3 = UserInfo(name="Hikaru", password="123", userType="student", userID="S001")
new_user4 = UserInfo(name="Kyle", password="123", userType="student", userID="S002")

#Create Courses
new_course1 = Courses(courseID=1,name='CSE111', maxEnrolled=120, instructorName="Santosh",timeslot="MW 9:30-10:45 AM")
new_course2 = Courses(courseID=2, name='CSE108', maxEnrolled=120, instructorName="Hepworth",timeslot="H 5:00-7:20 PM")
new_course3 = Courses(courseID=3, name='Math141', maxEnrolled=60, instructorName="Ethan",timeslot="TH 12:30-1:45 PM" )
#Enroll students in courses

enrollStudent1 = studentEnrolledin(enrollmentID=1, studentID="S001", courseID=1)
enrollStudent2 = studentEnrolledin(enrollmentID=2, studentID="S002", courseID=1)   
enrollStudent3 = studentEnrolledin(enrollmentID=3, studentID="S002", courseID=2) 

#Assign teachers to instruct courses

assignInstructor1 = instructorTeaches(instructionID=1,teacherID="T001", courseID=3)

# Use app context to interact with the database
with app.app_context():
    # delete = UserInfo.query.filter_by(name="Jason").delete()
    db.session.add(new_user1)
    db.session.add(new_user2)
    db.session.add(new_user3)
    db.session.add(new_user4)
    db.session.add(new_course1)
    db.session.add(new_course2)
    db.session.add(new_course3)
    db.session.add(enrollStudent1)
    db.session.add(enrollStudent2)
    db.session.add(enrollStudent3)
    db.session.add(assignInstructor1)
    db.session.commit()



print("Databse initialized")
