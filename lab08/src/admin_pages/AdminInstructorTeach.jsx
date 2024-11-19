import React, { useState, useEffect } from 'react';
import "./AdminInstructorTeach.css";
import { useNavigate } from "react-router-dom";

function AdminInstructorTeach() {
  const [name, setName] = useState([]);
  const [teachers, setTeachers] = useState([]); // State for storing teachers
  const [newTeacher, setNewTeacher] = useState({ name: "", userID: "", password: "", userType: "teacher" }); // State for new teacher
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!newTeacher.name || !newTeacher.userID || !newTeacher.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/add_teacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTeacher),
      });

      if (response.ok) {
        alert("Teacher added successfully!");
        // After adding the teacher, update the teacher list
        const addedTeacher = await response.json();
        setTeachers(prevTeachers => [...prevTeachers, addedTeacher]);
        setNewTeacher({ name: "", userID: "", password: "", userType: "teacher" }); // Reset form fields
      } else {
        throw new Error('Failed to add teacher');
      }
    } catch (error) {
      console.error('Error adding teacher:', error);
      alert("Error adding teacher");
    }
  };

  const handleDeleteTeacher = async (userID) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/delete_teacher/${userID}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert("Teacher deleted successfully!");
        // Remove the deleted teacher from the list
        setTeachers(prevTeachers => prevTeachers.filter(teacher => teacher.userID !== userID));
      } else {
        throw new Error('Failed to delete teacher');
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
      alert("Error deleting teacher");
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
      
      {/* Add Teacher Form */}
      <div className="addTeacherForm">
        <h2>Add New Teacher</h2>
        <form onSubmit={handleAddTeacher}>
          <input
            type="text"
            name="instructionID"
            value={newTeacher.name}
            onChange={handleInputChange}
            placeholder="instructionID"
            required
          />
          <input
            type="text"
            name="userID"
            value={newTeacher.userID}
            onChange={handleInputChange}
            placeholder="teacherID"
            required
          />
          <input
            type="text"
            name="courseID"
            value={newTeacher.password}
            onChange={handleInputChange}
            placeholder="courseID"
            required
          />
          <button type="submit">Add Teacher</button>
        </form>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.userID}>
                <td>{teacher.userID}</td>
                <td>{teacher.name}</td>
                <td>{teacher.userType}</td>
                <td>
                  <button onClick={() => handleDeleteTeacher(teacher.userID)} className="deleteButton">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminInstructorTeach;
