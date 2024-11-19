import React, { useState, useEffect } from 'react';
import "./AdminInstructorTeach.css";
import { useNavigate } from "react-router-dom";

function AdminInstructorTeach() {
  const [name, setName] = useState([]);
  const [teachers, setTeachers] = useState([]); // State for storing teachers
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

  useEffect(() => {
    const fetchName = async () => {
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

    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/get_teachers');
        if (!response.ok) {
          throw new Error('Failed to fetch teachers');
        }
        const data = await response.json();
        setTeachers(data); // Set the fetched teachers in the state
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchName();
    fetchTeachers(); // Fetch teachers when component mounts
  }, []);

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
        <button className="navButton" onClick={() => handleButtonClick("admincourses")}>
          Courses
        </button>
        <button className="navButton" onClick={() => handleButtonClick("admininstructorteaches")}>
          Instructor
        </button>
        <button className="navButton" onClick={() => handleButtonClick("adminstudentenrolledin")}>
          Student
        </button>
        <button className="navButton" onClick={() => handleButtonClick("adminuserinfo")}>
          User Info
        </button>
      </div>
      
      {/* Teachers Table */}
      <div className="teachersTableContainer">
        <h2>Teachers List</h2>
        <table className="teachersTable">
          <thead>
            <tr>
              <th>UserID</th>
              <th>Name</th>
              <th>User Type</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.userID}>
                <td>{teacher.userID}</td>
                <td>{teacher.name}</td>
                <td>{teacher.userType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminInstructorTeach;
