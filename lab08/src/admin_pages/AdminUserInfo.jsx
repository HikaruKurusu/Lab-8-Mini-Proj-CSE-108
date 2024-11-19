import React, { useState, useEffect } from 'react';
import "./AdminUserInfo.css";
import { useNavigate } from "react-router-dom";

function AdminUserInfo() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    userID: '',
    name: '',
    userType: '',
    password: ''
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

  const handleDeleteUser = async (userID) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/delete_user/${userID}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Remove the deleted user from the state
        setUsers(users.filter((user) => user.userID !== userID));
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="outerAdminHome">
      <div className="outerHeader">
        <span className="left">Welcome Admin</span>
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

        <h3>Add New User</h3>
        <form onSubmit={handleAddUser}>
          <input 
            type="text" 
            name="userID" 
            value={newUser.userID} 
            onChange={handleInputChange} 
            placeholder="User ID" 
            required 
          />
          <input 
            type="text" 
            name="name" 
            value={newUser.name} 
            onChange={handleInputChange} 
            placeholder="Name" 
            required 
          />
          <input 
            type="text" 
            name="userType" 
            value={newUser.userType} 
            onChange={handleInputChange} 
            placeholder="User Type" 
            required 
          />
          <input 
            type="password" 
            name="password" 
            value={newUser.password} 
            onChange={handleInputChange} 
            placeholder="Password" 
            required 
          />
          <button type="submit">Add User</button>
        </form>
      </div>
    </div>
  );
}

export default AdminUserInfo;
