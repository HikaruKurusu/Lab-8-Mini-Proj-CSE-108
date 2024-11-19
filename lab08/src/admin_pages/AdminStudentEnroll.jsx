import React, { useState, useEffect } from 'react';
import "./AdminStudentEnroll.css";
import { useNavigate } from "react-router-dom";

function AdminStudentEnroll() {
  const [name, setName] = useState([]);
  const [studentID, setStudentID] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleButtonClick = (buttonName) => {
    if (buttonName === "admincourses") {
      navigate("/admin-home");
    } else if (buttonName === "admininstructorteaches") {
      navigate("/admin-instructor-teach");
    } else if (buttonName === "adminstudentenrolledin") {
      navigate("/admin-student-enroll");
    } else if (buttonName === "adminuserinfo") {
      navigate("/admin-user-info");
    }
  };

  const fetchStudentName = async () => {
    try {
      const studentId = localStorage.getItem('userId');
      if (!studentId) {
        console.error('Student ID not found');
        return;
      }
      const response = await fetch(`http://127.0.0.1:5000/get_name/${studentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch name');
      }
      const data = await response.json();

      if (data.name) {
        setName(data.name);
      } else {
        console.error('Invalid name data format:', data);
      }
    } catch (error) {
      console.error('Error fetching name:', error);
    }
  };

  useEffect(() => {
    fetchStudentName();
  }, []);

  // Add Student API Call
  const addStudent = async () => {
    const studentData = {
      name: studentName,
      userID: studentID,
      password: studentPassword,
      userType: userType
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/add_student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      const data = await response.json();

      if (response.ok) {
        alert('Student added successfully');
        // Optionally, clear the form or update the UI
      } else {
        alert(data.error || 'Failed to add student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Error adding student');
    }
  };

  // Delete Student API Call
  const deleteStudent = async (userID) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/delete_student/${userID}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (response.ok) {
        alert('Student deleted successfully');
      } else {
        alert(data.error || 'Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Error deleting student');
    }
  };

  return (
    <div className="outerAdminHome">
      <div className="outerHeader">
        <span className="left">Welcome {name}</span>
        <span className="center">ACME University</span>
        <button className="right" onClick={handleLogout}>
          Sign out
        </button>
      </div>
      <div className="Header">
        <button
          className="navButton"
          onClick={() => handleButtonClick("admincourses")}
        >
          Courses
        </button>
        <button
          className="navButton"
          onClick={() => handleButtonClick("admininstructorteaches")}
        >
          Instructor
        </button>
        <button
          className="navButton"
          onClick={() => handleButtonClick("adminstudentenrolledin")}
        >
          Student
        </button>
        <button
          className="navButton"
          onClick={() => handleButtonClick("adminuserinfo")}
        >
          User Info
        </button>
      </div>

      {/* Add Student Form */}
      <div className="addStudentForm">
        <h3>Add Student</h3>
        <label>Student ID:</label>
        <input
          type="text"
          value={studentID}
          onChange={(e) => setStudentID(e.target.value)}
        />
        <label>Name:</label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          value={studentPassword}
          onChange={(e) => setStudentPassword(e.target.value)}
        />
        <label>User Type:</label>
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <button onClick={addStudent}>Add Student</button>
      </div>

      {/* Delete Student Button */}
      <div className="deleteStudent">
        <h3>Delete Student</h3>
        <button onClick={() => deleteStudent(studentID)}>
          Delete Student
        </button>
      </div>
    </div>
  );
}

export default AdminStudentEnroll;
