import React, { useState, useEffect } from 'react';
import "./AdminUserInfo.css";
import { useNavigate } from "react-router-dom";

function AdminUserInfo() {
  const [name, setName] = useState([]);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    userID: '',
    name: '',
    userType: '',
    password: ''
  });
  const [editUser, setEditUser] = useState(null); // For handling user edit
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
  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/get_all_users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);  // Store the fetched users in the state
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);
  useEffect(() => {
    fetchStudentName();
    }, []);

  // Add a new user to the backend
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/add_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const addedUser = await response.json();
        setUsers([...users, addedUser]);  // Add the new user to the state
        setNewUser({ userID: '', name: '', userType: '', password: '' });  // Reset form
      } else {
        console.error('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle input changes for editing a user
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle deleting a user
  const handleDeleteUser = async (userID) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/delete_user/${userID}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setUsers(users.filter((user) => user.userID !== userID));  // Remove the deleted user from the state
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Handle updating a user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:5000/update_user/${editUser.userID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editUser),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map((user) => (user.userID === updatedUser.userID ? updatedUser : user)));  // Update the user in the state
        setEditUser(null);  // Close the edit form
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
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
          className="Courses"
          onClick={() => handleButtonClick("admincourses")}
        >
          Courses
        </button>
        <button
          className="navButton1"
          onClick={() => handleButtonClick("admininstructorteaches")}
        >
          Instructor
        </button>
        <button
          className="navButton2"
          onClick={() => handleButtonClick("adminstudentenrolledin")}
        >
          Student
        </button>
        <button
          className="navButton3"
          onClick={() => handleButtonClick("adminuserinfo")}
        >
          User Info
        </button>
      </div>

      <div className="userList">
        <h2>All Users</h2>
        <table className="userTable">
          <thead>
            <tr>
              <th>UserID</th>
              <th>Name</th>
              <th>User Type</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userID}>
                <td>{user.userID}</td>
                <td>{user.name}</td>
                <td>{user.userType}</td>
                <td>{user.password}</td>
                <td>
                  <button onClick={() => setEditUser(user)} className="editButton">
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user.userID)} 
                    className="deleteButton"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>{editUser ? "Edit User" : "Add New User"}</h3>
        <form onSubmit={editUser ? handleUpdateUser : handleAddUser}>
          <input 
            type="text" 
            name="userID" 
            value={editUser ? editUser.userID : newUser.userID} 
            onChange={editUser ? handleEditInputChange : handleInputChange} 
            placeholder="User ID" 
            required 
            disabled={editUser}  // Disable ID when editing
          />
          <input 
            type="text" 
            name="name" 
            value={editUser ? editUser.name : newUser.name} 
            onChange={editUser ? handleEditInputChange : handleInputChange} 
            placeholder="Name" 
            required 
          />
          <input 
            type="text" 
            name="userType" 
            value={editUser ? editUser.userType : newUser.userType} 
            onChange={editUser ? handleEditInputChange : handleInputChange} 
            placeholder="User Type" 
            required 
          />
          <input 
            type="password" 
            name="password" 
            value={editUser ? editUser.password : newUser.password} 
            onChange={editUser ? handleEditInputChange : handleInputChange} 
            placeholder="Password" 
            required 
          />
          <button type="submit">{editUser ? "Update User" : "Add User"}</button>
        </form>
      </div>
    </div>
  );
}

export default AdminUserInfo;
