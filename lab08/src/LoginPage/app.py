from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
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
    # try:
    #     courses_taught = (
    #         db.session.Query(Courses)
    #         .join(instructorTeaches, Courses.courseID == instructorTeaches.courseID)
    #         .filter(instructorTeaches.teacherID == instructorID)
    #     )
    #     courses_list = [
    #         {
    #             "name": course.name,
    #             "instructorName": course.instructorName,
    #             "maxEnrolled": course.maxEnrolled,
    #             "timeslot": course.timeslot
    #         }
    #         for course in courses_taught
    #     ]

    #     return jsonify(courses_list), 200
    # except Exception as e:
    #     return jsonify({"error": str(e)}), 500
    courses = Courses.query.all()  # Fetch all courses
    courses_list = [
        {
            "id": course.courseID,
            "name": course.name,
            "instructorName": course.instructorName,
            "maxEnrolled": course.maxEnrolled,
            "timeslot": course.timeslot
        } for course in courses
    ]
    return jsonify(courses_list), 200

@app.route('/get_student_courses/<string:student_id>', methods=['GET'])
def get_student_courses(student_id):
    try:
        # Query the database for courses the student is enrolled in
        enrolled_courses = (
            db.session.query(Courses)
            .join(studentEnrolledin, Courses.courseID == studentEnrolledin.courseID)
            .filter(studentEnrolledin.studentID == student_id)
            .all()
        )
        
        # Format the result into a list of dictionaries
        courses_list = [
            {
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





if __name__ == '__main__':
    app.run(debug=True)
