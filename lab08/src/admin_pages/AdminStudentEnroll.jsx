import React, { useState, useEffect } from 'react';
import "./AdminStudentEnroll.css";
import { useNavigate } from "react-router-dom";

function AdminStudentEnroll() {
  const [name, setName] = useState([]);
  const [enrollmentID, setEnrollmentID] = useState('');
  const [studentID, setStudentID] = useState('');
  const [courseID, setCourseID] = useState('');
  const [grade, setGrade] = useState('');
  const [students, setStudents] = useState([]);;
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

  const fetchAllStudents = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/get_students');
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();

      if (data && Array.isArray(data)) {
        setStudents(data);
      } else {
        console.error('Invalid data format:', data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudentName();
    fetchAllStudents(); // Fetch all students when component mounts
  }, []);

  // Add Student API Call
  const addStudent = async () => {
    const studentData = {
      enrollmentID: enrollmentID,
      studentID: studentID,
      courseID: courseID,
      grade: grade,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/add_student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Enrollment added successfully");
        fetchAllStudents(); // Refresh the student list after adding
      } else {
        alert(data.error || "Failed to add student");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Error adding student");
    }
  };

  // Delete Student API Call
  const deleteStudent = async (enrollmentID) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/delete_student/${enrollmentID}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (response.ok) {
        alert('Student deleted successfully');
        fetchAllStudents();  // Refresh the student list after deletion
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
      <h3>Add Enrollment</h3>
      <label>Enrollment ID:</label>
      <input
        type="text"
        value={enrollmentID}
        onChange={(e) => setEnrollmentID(e.target.value)}
      />
      <label>Student ID:</label>
      <input
        type="text"
        value={studentID}
        onChange={(e) => setStudentID(e.target.value)}
      />
      <label>Course ID:</label>
      <input
        type="text"
        value={courseID}
        onChange={(e) => setCourseID(e.target.value)}
      />
      <label>Grade:</label>
      <input
        type="text"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
      />
      <button onClick={addStudent}>Add Enrollment</button>
    </div>

      {/* Display List of Students */}
      <div className="studentsList">
        <h3>All Students</h3>
        <table>
          <thead>
            <tr>
              <th>Enrollment ID</th>
              <th>Student Name</th>
              <th>Course ID</th>
              <th>Grade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.enrollmentID}>
                <td>{student.enrollmentID}</td>
                <td>{student.studentID}</td>
                <td>{student.courseID}</td>
                <td>{student.grade}</td>
                <td>
                  <button onClick={() => deleteStudent(student.enrollmentID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminStudentEnroll;
