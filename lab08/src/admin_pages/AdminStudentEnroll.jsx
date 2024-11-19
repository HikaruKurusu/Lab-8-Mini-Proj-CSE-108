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
  const [editingEnrollmentID, setEditingEnrollmentID] = useState(null);  
  const [editingStudentID, setEditingStudentID] = useState('');
  const [editingCourseID, setEditingCourseID] = useState('');
  const [editingGrade, setEditingGrade] = useState('');
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
    fetchAllStudents(); 
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
        fetchAllStudents(); 
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
        fetchAllStudents();  
      } else {
        alert(data.error || 'Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Error deleting student');
    }
  };

  // Edit Student API Call
  const updateEnrollment = async () => {
    const updatedData = {
      studentID: editingStudentID,
      courseID: editingCourseID,
      grade: editingGrade
    };

    try {
      const response = await fetch(`http://127.0.0.1:5000/update_enrollment/${editingEnrollmentID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();

      if (response.ok) {
        alert('Enrollment updated successfully');
        fetchAllStudents();  
        setEditingEnrollmentID(null);  
      } else {
        alert(data.error || 'Failed to update enrollment');
      }
    } catch (error) {
      console.error('Error updating enrollment:', error);
      alert('Error updating enrollment');
    }
  };


  const startEditing = (student) => {
    setEditingEnrollmentID(student.enrollmentID);
    setEditingStudentID(student.studentID);
    setEditingCourseID(student.courseID);
    setEditingGrade(student.grade);
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
  <div className="content">
  <div className="leftSection">

      {/* Add Student Form */}
      <div className="addStudentForm">
      <span
            className="innerHeader"
            style={{ fontSize: "1.5em", fontWeight: "bold", color: "black" }}
          >Add Enrollment</span>
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
  


 
      {/* Edit Enrollment Form */}
      {editingEnrollmentID && (
        <div className="editEnrollmentForm">
          <h3>Edit Enrollment</h3>
          <label>Student ID:</label>
          <input
            type="text"
            value={editingStudentID}
            onChange={(e) => setEditingStudentID(e.target.value)}
          />
          <label>Course ID:</label>
          <input
            type="number"
            value={editingCourseID}
            onChange={(e) => setEditingCourseID(e.target.value)}
          />
          <label>Grade:</label>
          <input
            type="number"
            value={editingGrade}
            onChange={(e) => setEditingGrade(e.target.value)}
          />
          <button onClick={updateEnrollment}>Update Enrollment</button>
          <button onClick={() => setEditingEnrollmentID(null)}>Cancel</button>
        </div>
         
      )}
       </div>

       <div className="rightSection">
      {/* Display List of Students */}
      <div className="studentsList">
  
        <table>
          <thead>
            <tr>
              <th>Enrollment ID</th>
              <th>Student ID</th>
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
                  <button onClick={() => startEditing(student)}className="editButton">Edit</button>
                  <button onClick={() => deleteStudent(student.enrollmentID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      </div>
    </div>
  );
}

export default AdminStudentEnroll;
