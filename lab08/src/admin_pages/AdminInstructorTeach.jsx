import React, { useState, useEffect } from 'react';
import "./AdminInstructorTeach.css";
import { useNavigate } from "react-router-dom";

function AdminInstructorTeach() {
  const [name, setName] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({
    instructionID: "",
    teacherID: "",
    courseID: ""
  });
  const [editTeacher, setEditTeacher] = useState({
    instructionID: "",
    teacherID: "",
    courseID: ""
  }); 
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
        setTeachers(data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchName();
    fetchTeachers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditTeacher((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!newTeacher.instructionID || !newTeacher.teacherID || !newTeacher.courseID) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:5000/add_teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newTeacher)
      });
      if (response.ok) {
        alert("Teacher assignment added successfully!");
        const addedTeacher = await response.json();
        setTeachers((prevTeachers) => [...prevTeachers, addedTeacher]);
        setNewTeacher({ instructionID: "", teacherID: "", courseID: "" });
      } else {
        throw new Error("Failed to add teacher assignment");
      }
    } catch (error) {
      console.error("Error adding teacher assignment:", error);
      alert("Error adding teacher assignment");
    }
  };

  const handleDeleteTeacher = async (instructionID) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/delete_teacher/${instructionID}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert("Teacher deleted successfully!");
        setTeachers(prevTeachers => prevTeachers.filter(teacher => teacher.instructionID !== instructionID));
      } else {
        throw new Error('Failed to delete teacher');
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
      alert("Error deleting teacher");
    }
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:5000/update_instructor_teaches/${editTeacher.instructionID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editTeacher)
      });
      if (response.ok) {
        alert("Teacher assignment updated successfully!");
        const updatedTeacher = await response.json();
        setTeachers(prevTeachers =>
          prevTeachers.map(teacher =>
            teacher.instructionID === updatedTeacher.instructionID ? updatedTeacher : teacher
          )
        );
        setEditTeacher({ instructionID: "", teacherID: "", courseID: "" });
      } else {
        throw new Error("Failed to update teacher assignment");
      }
    } catch (error) {
      console.error("Error updating teacher assignment:", error);
      alert("Error updating teacher assignment");
    }
  };

  return (
    <div className="outerAdminHome">
      <div className="outerHeader">
        <span className="left">Welcome {name}</span>
        <span className="center">ACME University</span>
        <button className="right" onClick={handleLogout}>Sign out</button>
      </div>
      <div className="Header">
        <button className="navButton" onClick={() => handleButtonClick("admincourses")}>Courses</button>
        <button className="navButton" onClick={() => handleButtonClick("admininstructorteaches")}>Instructor</button>
        <button className="navButton" onClick={() => handleButtonClick("adminstudentenrolledin")}>Student</button>
        <button className="navButton" onClick={() => handleButtonClick("adminuserinfo")}>User Info</button>
      </div>

      {/* Add Teacher Form */}
      <div className="addTeacherForm">
        <h2>Add New Instructor Assignment</h2>
        <form onSubmit={handleAddTeacher}>
          <input type="text" name="instructionID" value={newTeacher.instructionID} onChange={handleInputChange} placeholder="instructionID" required />
          <input type="text" name="teacherID" value={newTeacher.teacherID} onChange={handleInputChange} placeholder="teacherID" required />
          <input type="text" name="courseID" value={newTeacher.courseID} onChange={handleInputChange} placeholder="courseID" required />
          <button type="submit">Add Teacher</button>
        </form>
      </div>

      {/* Update Teacher Form */}
      <div className="updateTeacherForm">
        <h2>Update Instructor Assignment</h2>
        <form onSubmit={handleUpdateTeacher}>
          <input type="text" name="instructionID" value={editTeacher.instructionID} onChange={handleEditInputChange} placeholder="instructionID" required />
          <input type="text" name="teacherID" value={editTeacher.teacherID} onChange={handleEditInputChange} placeholder="teacherID" required />
          <input type="text" name="courseID" value={editTeacher.courseID} onChange={handleEditInputChange} placeholder="courseID" required />
          <button type="submit">Update Teacher</button>
        </form>
      </div>

      {/* Teachers Table */}
      <div className="teachersTableContainer">
        <h2>Instructor Assignments</h2>
        <table className="teachersTable">
          <thead>
            <tr>
              <th>instructionID</th>
              <th>teacherID</th>
              <th>courseID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.instructionID}>
                <td>{teacher.instructionID}</td>
                <td>{teacher.teacherID}</td>
                <td>{teacher.courseID}</td>
                <td>
                  <button onClick={() => handleDeleteTeacher(teacher.instructionID)} className="deleteButton">
                    Delete
                  </button>
                  <button onClick={() => setEditTeacher({ ...teacher })} className="editButton">
                    Edit
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
