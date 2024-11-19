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
    courseID = db.Column(db.Integer, primary_key=True)  
    name = db.Column(db.String(20))
    instructorName = db.Column(db.String(20))
    maxEnrolled = db.Column(db.Integer, nullable=True)
    timeslot = db.Column(db.String(20))
class UserInfo(db.Model):
    userID = db.Column(db.String(10), primary_key=True)  
    name = db.Column(db.String(100), unique=True, nullable=False)  
    password = db.Column(db.String(100), nullable=False)  
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


    user = UserInfo.query.filter_by(name=username, password=password).first()
    if user:
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
        student_count_subquery = (
            db.session.query(
                studentEnrolledin.courseID,
                func.count(studentEnrolledin.studentID).label('studentsEnrolled')
            )
            .group_by(studentEnrolledin.courseID)
            .subquery()  #
        )

        enrolled_courses = (
            db.session.query(
                Courses.name,
                Courses.instructorName,
                Courses.maxEnrolled,
                Courses.timeslot,
                student_count_subquery.c.studentsEnrolled  
            )
            .join(studentEnrolledin, studentEnrolledin.courseID == Courses.courseID)  
            .join(student_count_subquery, student_count_subquery.c.courseID == Courses.courseID)  
            .filter(studentEnrolledin.studentID == student_id)  
        )
        
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
        enrolled_courses = (
            db.session.query(Courses)
            .join(instructorTeaches, Courses.courseID == instructorTeaches.courseID)
            .filter(instructorTeaches.teacherID == teacher_id)
            .all()
        )
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
            db.session.query(UserInfo.name, studentEnrolledin.grade, studentEnrolledin.enrollmentID)
            .join(UserInfo, UserInfo.userID == studentEnrolledin.studentID)
            .filter(studentEnrolledin.courseID == course_id)
            .all()
        )
        student_list = [
            {
                "enrollmentID": enrollment_id,
                "name": student_name,
                "grade": float(grade) if grade else None  
            }
            for student_name, grade, enrollment_id in student_grades
        ]

        return jsonify(student_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/edit_grade', methods=['PUT'])
def edit_grade():
    try:
        data = request.json
        enrollment_id = data.get('enrollmentID')
        new_grade = data.get('grade')

        if enrollment_id is None or new_grade is None:
            return jsonify({"error": "Missing enrollmentID or grade"}), 400

        enrollment = studentEnrolledin.query.filter_by(enrollmentID=enrollment_id).first()
        if not enrollment:
            return jsonify({"error": "Enrollment not found"}), 404

        enrollment.grade = new_grade
        db.session.commit()
        return jsonify({"message": "Grade updated successfully"}), 200

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
        
        current_enrollment_count = db.session.query(func.count(studentEnrolledin.studentID)) \
            .filter(studentEnrolledin.courseID == course_id) \
            .scalar()  
        
        course = db.session.query(Courses.maxEnrolled).filter_by(courseID=course_id).first()
        
        if not course:
            return jsonify({"error": "Course not found"}), 404
        
        if current_enrollment_count >= course.maxEnrolled:
            return jsonify({"error": "Course is full, cannot enroll"}), 400
        
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
        enrollment = studentEnrolledin.query.filter_by(studentID=student_id, courseID=course_id).first()      
        if not enrollment:
            return jsonify({"error": "Student is not enrolled in this course"}), 404
        

        db.session.delete(enrollment)
        db.session.commit()
        return jsonify({"message": "Unenrollment successful"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
@app.route('/create_course', methods=['POST'])
def create_course():
    data = request.get_json()

    name = data.get('name')
    instructor_name = data.get('instructorName')
    max_enrolled = data.get('maxEnrolled')
    timeslot = data.get('timeslot')

    if not name or not instructor_name or not max_enrolled or not timeslot:
        return jsonify({"error": "All fields are required"}), 400

    try:
        new_course = Courses(
            name=name,
            instructorName=instructor_name,
            maxEnrolled=max_enrolled,
            timeslot=timeslot
        )

        db.session.add(new_course)
        db.session.commit()

        return jsonify({"message": "Course created successfully", "courseID": new_course.courseID}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
@app.route('/delete_course/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):
    try:
        course = Courses.query.get(course_id)  
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
        teachers = db.session.query(instructorTeaches).all()
        teachers_list = [
            {
                "instructionID": teacher.instructionID,
                "teacherID": teacher.teacherID,
                "courseID": teacher.courseID
            }
            for teacher in teachers
        ]

        return jsonify(teachers_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/add_teacher', methods=['POST'])
def add_teacher():
    data = request.get_json()
    instructionID = data.get('instructionID')
    teacherID = data.get('teacherID')
    courseID = data.get('courseID')

    if not instructionID or not teacherID or not courseID:
        return jsonify({"error": "All fields are required"}), 400
    
    try:
        existing_assignment = instructorTeaches.query.filter_by(instructionID=instructionID).first()
        if existing_assignment:
            return jsonify({"error": "instruction ID already exsits"}), 400
        new_instruction = instructorTeaches(instructionID = instructionID, teacherID = teacherID, courseID = courseID)
        db.session.add(new_instruction)
        db.session.commit()
        return jsonify({
            "instructionID": new_instruction.instructionID,
            "teacherID": new_instruction.teacherID,
            "courseID": new_instruction.courseID
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
@app.route('/delete_teacher/<instructionID>', methods=['DELETE'])
def delete_teacher(instructionID):
    try:
        instructionAssignment = instructorTeaches.query.filter_by(instructionID=instructionID).first()

        if not instructionAssignment:
            return jsonify({"error": "Instruction assignment not found"}), 404

        db.session.delete(instructionAssignment)
        db.session.commit()

        return jsonify({"message": "Teacher deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@app.route('/add_student', methods=['POST'])
def add_student():
    data = request.get_json()

    enrollmentID = data.get('enrollmentID')
    studentID = data.get('studentID')
    courseID = data.get('courseID')
    grade = data.get('grade') 

    if not enrollmentID or not studentID or not courseID or not grade:
        return jsonify({"error": "All fields are required, and userType must be 'student'"}), 400

    try:
        existing_user = studentEnrolledin.query.filter_by(enrollmentID=enrollmentID).first()
        if existing_user:
            return jsonify({"error": "User ID already exists"}), 400

        new_enrollment = studentEnrolledin(enrollmentID=enrollmentID, studentID=studentID, courseID=courseID, grade=grade)
        db.session.add(new_enrollment)
        db.session.commit()

        return jsonify({
            "enrollmentID": new_enrollment.enrollmentID,
            "studentID": new_enrollment.studentID,
            "courseID": new_enrollment.courseID,
            "grade": new_enrollment.grade
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/delete_student/<enrollmentID>', methods=['DELETE'])
def delete_student(enrollmentID):
    try:
        student = studentEnrolledin.query.filter_by(enrollmentID=enrollmentID).first()

        if not student:
            return jsonify({"error": "Student not found"}), 404

        student_enrollments = studentEnrolledin.query.filter_by(enrollmentID=enrollmentID).all()
        for enrollment in student_enrollments:
            db.session.delete(enrollment)

        db.session.delete(student)
        db.session.commit()

        return jsonify({"message": "Student deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
@app.route('/get_students', methods=['GET'])
def get_students():
    try:
        students = db.session.query(studentEnrolledin).all()

        students_list = [
            {
                "enrollmentID": student.enrollmentID,
                "studentID": student.studentID,
                "courseID": student.courseID,
                "grade": student.grade
            }
            for student in students
        ]

        return jsonify(students_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_all_users', methods=['GET'])
def get_all_users():
    try:
        users = UserInfo.query.all()
        users_list = [
            {
                "userID": user.userID,
                "name": user.name,
                "password": user.password, 
                "userType": user.userType
            }
            for user in users
        ]

        return jsonify(users_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/add_user', methods=['POST'])
def add_user():
    try:
        data = request.get_json()  

        userID = data.get('userID')
        name = data.get('name')
        userType = data.get('userType')
        password = data.get('password')


        if not userID or not name or not userType or not password:
            return jsonify({"error": "All fields are required"}), 400

        new_user = UserInfo(userID = userID, name = name, userType = userType, password = password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({
            "userID": new_user.userID,
            "name": new_user.name,
            "userType": new_user.userType,
            "password": new_user.password
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/delete_user/<userID>', methods=['DELETE'])
def delete_user(userID):
    try:
        user = UserInfo.query.filter_by(userID=userID).first()

        if not user:
            return jsonify({"error": "User not found"}), 404
        db.session.delete(user)
        db.session.commit()

        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/update_course/<int:course_id>', methods=['PUT'])
def update_course(course_id):
    try:
        data = request.get_json()

        course = Courses.query.filter_by(courseID=course_id).first()
        
        if not course:
            return jsonify({"error": "Course not found"}), 404

        course.name = data.get('name', course.name)
        course.instructorName = data.get('instructorName', course.instructorName)
        course.maxEnrolled = data.get('maxEnrolled', course.maxEnrolled)
        course.timeslot = data.get('timeslot', course.timeslot)

        db.session.commit()

        return jsonify({"message": "Course updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/update_instructor_teaches/<int:instruction_id>', methods=['PUT'])
def update_instructor_teaches(instruction_id):
    try:
        data = request.get_json()

        instruction = instructorTeaches.query.filter_by(instructionID=instruction_id).first()

        if not instruction:
            return jsonify({"error": "Record not found"}), 404

        instruction.teacherID = data.get('teacherID', instruction.teacherID)
        instruction.courseID = data.get('courseID', instruction.courseID)

        db.session.commit()

        return jsonify({"message": "Record updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@app.route('/update_enrollment/<int:enrollmentID>', methods=['PUT'])
def update_enrollment(enrollmentID):
    enrollment = studentEnrolledin.query.get_or_404(enrollmentID)

    data = request.get_json()
    if 'studentID' in data:
        enrollment.studentID = data['studentID']
    if 'courseID' in data:
        enrollment.courseID = data['courseID']
    if 'grade' in data:
        try:
            enrollment.grade = float(data['grade'])
        except ValueError:
            return jsonify({'error': 'Invalid grade value'}), 400

    try:
        db.session.commit()
        return jsonify({'message': 'Enrollment updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
        
@app.route('/update_user/<string:userID>', methods=['PUT'])
def update_user(userID):
    user = UserInfo.query.get_or_404(userID)

    data = request.get_json()

    if 'userID' in data and data['userID'] != user.userID:
        return jsonify({'error': 'userID cannot be changed'}), 400
    
    if 'name' in data:
        user.name = data['name']
    if 'password' in data:
        user.password = data['password']
    if 'userType' in data:
        user.userType = data['userType']

    try:
        db.session.commit()
        return jsonify({'message': 'User updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
