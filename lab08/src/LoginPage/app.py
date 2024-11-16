from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///login.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Courses(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Primary key as an auto-incrementing ID
    name = db.Column(db.String(20))
    maxEnrolled = db.Column(db.Integer, nullable=True)

class UserInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Primary key as an auto-incrementing ID
    name = db.Column(db.String(100), unique=True, nullable=False)  # Unique username
    password = db.Column(db.String(100), nullable=False)  # Password, not unique
    userType = db.Column(db.String(20), nullable=False)
class instructorTeaches(db.Model):
    instructorID = db.Column(db.Integer, primary_key = True)
    courseID = db.Column(db.Integer)
class studentEnrolledin(db.Model):
    studentID = db.Column(db.Integer, primary_key=True)
    courseID = db.Column(db.Integer)



# Initialize the database
with app.app_context():
    db.create_all()

# Login route
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
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

if __name__ == '__main__':
    app.run(debug=True)
