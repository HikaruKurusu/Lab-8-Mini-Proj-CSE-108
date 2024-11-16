from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
# hi
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///login.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Courses(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Primary key as an auto-incrementing ID
    name = db.Column(db.String(20))
    instructorName = db.Column(db.String(20))
    maxEnrolled = db.Column(db.Integer, nullable=True)
    timeslot = db.Column(db.String(20))
class UserInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Primary key as an auto-incrementing ID
    name = db.Column(db.String(100), unique=True, nullable=False)  # Unique username
    password = db.Column(db.String(100), nullable=False)  # Password, not unique
    userType = db.Column(db.String(20), nullable=False)
class studentEnrolledin(db.Model):
    studentID = db.Column(db.Integer, primary_key=True)
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
        # Return the user type along with the success message
        return jsonify({"message": "Login successful", "userType": user.userType}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

@app.route('/api/courses', methods=['GET'])
def get_courses():
    courses = Courses.query.all()  # Fetch all courses
    courses_list = [
        {
            "id": course.id,
            "name": course.name,
            "instructorName": course.instructorName,
            "maxEnrolled": course.maxEnrolled,
            "timeslot": course.timeslot
        } for course in courses
    ]
    return jsonify(courses_list), 200

@app.route('/api/student-courses/<int:student_id>', methods=['GET'])
def get_student_courses(student_id):
    # Get all courses the student is enrolled in
    enrolled_courses = (
        db.session.query(Courses)
        .join(studentEnrolledin, studentEnrolledin.courseID == Courses.id)
        .filter(studentEnrolledin.studentID == student_id)
        .all()
    )
    courses_list = [
        {
            "id": course.id,
            "name": course.name,
            "instructorName": course.instructorName,
            "maxEnrolled": course.maxEnrolled,
            "timeslot": course.timeslot
        } for course in enrolled_courses
    ]
    return jsonify(courses_list), 200



if __name__ == '__main__':
    app.run(debug=True)
