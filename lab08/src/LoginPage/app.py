from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import func
import sqlite3
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///login.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Courses(db.Model):
    courseID = db.Column(db.Integer, primary_key=True)  # Primary key as an auto-incrementing ID
    name = db.Column(db.String(20))
    instructorName = db.Column(db.String(20))
    maxEnrolled = db.Column(db.Integer, nullable=True)
    timeslot = db.Column(db.String(20))
class UserInfo(db.Model):
    userID = db.Column(db.String(10), primary_key=True)  # Primary key as an auto-incrementing ID
    name = db.Column(db.String(100), unique=True, nullable=False)  # Unique username
    password = db.Column(db.String(100), nullable=False)  # Password, not unique
    userType = db.Column(db.String(20), nullable=False)
class studentEnrolledin(db.Model):
    enrollmentID = db.Column(db.Integer, primary_key=True)
    studentID = db.Column(db.String(10))
    courseID = db.Column(db.Integer)
    grade = db.Column(db.Numeric(4,2), nullable=True)
class instructorTeaches(db.Model):
    instructionID = db.Column(db.Integer, primary_key=True)
    teacherID = db.Column(db.String(10))
    courseID = db.Column(db.Integer)



# Initialize the database
with app.app_context():
    db.create_all()

# Login route
# @app.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     username = data.get('username')
#     password = data.get('password')
    
#     if not username or not password:
#         return jsonify({"error": "Username and password are required"}), 400
    
#     # Check if user exists and password matches
#     user = UserInfo.query.filter_by(name=username, password=password).first()
#     if user:
#         return jsonify({"message": "Login successful"}), 200
#     else:
#         return jsonify({"error": "Invalid username or password"}), 401

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    # Check if user exists and password matches
    user = UserInfo.query.filter_by(name=username, password=password).first()
    if user:
        # Return userType and userID in the response
        return jsonify({"message": "Login successful", "userType": user.userType, "userID": user.userID}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401


@app.route('/api/courses', methods=['GET'])
def get_courses():
    courses = (
        db.session.query(
            Courses.courseID,
            Courses.name,
            Courses.instructorName,
            Courses.maxEnrolled.label("maxSeats"),
            Courses.timeslot,
            func.count(studentEnrolledin.studentID).label("studentsEnrolled")
        )
        .join(studentEnrolledin, Courses.courseID == studentEnrolledin.courseID, isouter=True)
        .group_by(
            Courses.courseID,
        )
        .all()
    )

    courses_list = [
        {
            "id": course.courseID,
            "name": course.name,
            "instructorName": course.instructorName,
            "maxEnrolled": course.maxSeats,
            "timeslot": course.timeslot,
            "studentsEnrolled": course.studentsEnrolled


        } for course in courses
    ]
    return jsonify(courses_list), 200

@app.route('/get_student_courses/<string:student_id>', methods=['GET'])
def get_student_courses(student_id):
    try:
        # Create a subquery to count students enrolled in each course
        student_count_subquery = (
            db.session.query(
                studentEnrolledin.courseID,
                func.count(studentEnrolledin.studentID).label('studentsEnrolled')
            )
            .group_by(studentEnrolledin.courseID)
            .subquery()  # Turn this query into a subquery
        )

        # Now query the main Courses table and join with the student enrollment table
        enrolled_courses = (
            db.session.query(
                Courses.name,
                Courses.instructorName,
                Courses.maxEnrolled,
                Courses.timeslot,
                student_count_subquery.c.studentsEnrolled  # Reference the studentsEnrolled from the subquery
            )
            .join(studentEnrolledin, studentEnrolledin.courseID == Courses.courseID)  # Join studentEnrolledin for filtering
            .join(student_count_subquery, student_count_subquery.c.courseID == Courses.courseID)  # Join the subquery for student counts
            .filter(studentEnrolledin.studentID == student_id)  # Filter for the specific student
            .all()
        )
        
        # Format the result into a list of dictionaries
        courses_list = [
            {
                "name": course.name,
                "instructorName": course.instructorName,
                "maxEnrolled": course.maxEnrolled,
                "timeslot": course.timeslot,
                "studentsEnrolled": course.studentsEnrolled
            }
            for course in enrolled_courses
        ]

        return jsonify(courses_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



    
@app.route('/get_teacher_courses/<string:teacher_id>', methods=['GET'])
def get_teacher_courses(teacher_id):
    try:
        # Query the database for courses the student is enrolled in
        enrolled_courses = (
            db.session.query(Courses)
            .join(instructorTeaches, Courses.courseID == instructorTeaches.courseID)
            .filter(instructorTeaches.teacherID == teacher_id)
            .all()
        )
        
        # Format the result into a list of dictionaries
        courses_list = [
            {
                "id": course.courseID,
                "name": course.name,
                "instructorName": course.instructorName,
                "maxEnrolled": course.maxEnrolled,
                "timeslot": course.timeslot
            }
            for course in enrolled_courses
        ]

        return jsonify(courses_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/get_student_grades/<string:course_id>', methods=['GET'])
def get_student_grades(course_id):
    try:
        student_grades = (
            db.session.query(UserInfo.name, studentEnrolledin.grade)
            .join(UserInfo, UserInfo.userID == studentEnrolledin.studentID)
            .filter(studentEnrolledin.courseID == course_id)
            .all()
        )
        student_list = [
            {
                "name": student_name,
                "grade": float(grade) if grade else None  # Handle null grades
            }
            for student_name, grade in student_grades
        ]

        return jsonify(student_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/enroll_student', methods=['POST'])
def enroll_student():
    data = request.get_json()
    student_id = data.get('studentId')
    course_id = data.get('courseId')

    if not student_id or not course_id:
        return jsonify({"error": "Student ID and Course ID are required"}), 400

    try:
        existing_enrollment = studentEnrolledin.query.filter_by(studentID=student_id, courseID=course_id).first()
        if existing_enrollment:
            return jsonify({"error": "Student is already enrolled in this course"}), 400
        enrollment = studentEnrolledin(studentID=student_id, courseID=course_id)
        db.session.add(enrollment)
        db.session.commit()
        return jsonify({"message": "Enrollment successful"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

@app.route('/get_name/<string:student_id>', methods=['GET'])
def get_name(student_id):
    try:
        student = UserInfo.query.filter_by(userID=student_id).first()
        if student:
            return jsonify({"name": student.name}), 200
        else:
            return jsonify({"error": "Student not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/unenroll_student', methods=['POST'])
def unenroll_student():
    data = request.get_json()
    student_id = data.get('studentId')
    course_id = data.get('courseId')

    if not student_id or not course_id:
        return jsonify({"error": "Student ID and Course ID are required"}), 400

    try:
        # Find the enrollment record
        enrollment = studentEnrolledin.query.filter_by(studentID=student_id, courseID=course_id).first()
        
        if not enrollment:
            return jsonify({"error": "Student is not enrolled in this course"}), 404
        
        # Remove the enrollment
        db.session.delete(enrollment)
        db.session.commit()
        return jsonify({"message": "Unenrollment successful"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
@app.route('/create_course', methods=['POST'])
def create_course():
    data = request.get_json()

    # Get course details from the request data
    name = data.get('name')
    instructor_name = data.get('instructorName')
    max_enrolled = data.get('maxEnrolled')
    timeslot = data.get('timeslot')

    # Validate that all fields are provided
    if not name or not instructor_name or not max_enrolled or not timeslot:
        return jsonify({"error": "All fields are required"}), 400

    try:
        # Create a new course
        new_course = Courses(
            name=name,
            instructorName=instructor_name,
            maxEnrolled=max_enrolled,
            timeslot=timeslot
        )

        # Add the new course to the database
        db.session.add(new_course)
        db.session.commit()

        return jsonify({"message": "Course created successfully", "courseID": new_course.courseID}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
@app.route('/delete_course/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):
    # Logic to delete the course from the database
    try:
        course = Courses.query.get(course_id)  # Corrected from 'Course' to 'Courses'
        if not course:
            return jsonify({'error': 'Course not found'}), 404
        db.session.delete(course)
        db.session.commit()
        return jsonify({'message': 'Course deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/get_teachers', methods=['GET'])
def get_teachers():
    try:
        # Query the UserInfo table for all users with userType = "teacher"
        teachers = UserInfo.query.filter_by(userType="teacher").all()

        # Format the result into a list of dictionaries
        teachers_list = [
            {
                "userID": teacher.userID,
                "name": teacher.name,
                "userType": teacher.userType
            }
            for teacher in teachers
        ]

        return jsonify(teachers_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/add_teacher', methods=['POST'])
def add_teacher():
    data = request.get_json()

    name = data.get('name')
    userID = data.get('userID')
    password = data.get('password')
    userType = data.get('userType')

    if not name or not userID or not password or not userType:
        return jsonify({"error": "All fields are required"}), 400

    try:
        # Check if userID already exists
        existing_user = UserInfo.query.filter_by(userID=userID).first()
        if existing_user:
            return jsonify({"error": "User ID already exists"}), 400

        # Create new teacher
        new_teacher = UserInfo(name=name, userID=userID, password=password, userType=userType)
        db.session.add(new_teacher)
        db.session.commit()

        return jsonify({
            "userID": new_teacher.userID,
            "name": new_teacher.name,
            "userType": new_teacher.userType
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
@app.route('/delete_teacher/<userID>', methods=['DELETE'])
def delete_teacher(userID):
    try:
        # Find the teacher by userID
        teacher = UserInfo.query.filter_by(userID=userID).first()

        if not teacher:
            return jsonify({"error": "Teacher not found"}), 404

        # Delete the teacher
        db.session.delete(teacher)
        db.session.commit()

        return jsonify({"message": "Teacher deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@app.route('/add_student', methods=['POST'])
def add_student():
    data = request.get_json()

    name = data.get('name')
    userID = data.get('userID')
    password = data.get('password')
    userType = data.get('userType')  # Ensure userType is set to "student"

    if not name or not userID or not password or userType != "student":
        return jsonify({"error": "All fields are required, and userType must be 'student'"}), 400

    try:
        # Check if userID already exists
        existing_user = UserInfo.query.filter_by(userID=userID).first()
        if existing_user:
            return jsonify({"error": "User ID already exists"}), 400

        # Create new student
        new_student = UserInfo(name=name, userID=userID, password=password, userType="student")
        db.session.add(new_student)
        db.session.commit()

        return jsonify({
            "userID": new_student.userID,
            "name": new_student.name,
            "userType": new_student.userType
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/delete_student/<userID>', methods=['DELETE'])
def delete_student(userID):
    try:
        # Find the student by userID
        student = UserInfo.query.filter_by(userID=userID).first()

        if not student:
            return jsonify({"error": "Student not found"}), 404

        # Check if the student is enrolled in any courses, handle foreign key constraints if needed
        # Example: you may want to delete any related enrollments before deleting the student
        student_enrollments = studentEnrolledin.query.filter_by(studentID=userID).all()
        for enrollment in student_enrollments:
            db.session.delete(enrollment)

        # Delete the student
        db.session.delete(student)
        db.session.commit()

        return jsonify({"message": "Student deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




if __name__ == '__main__':
    app.run(debug=True)
