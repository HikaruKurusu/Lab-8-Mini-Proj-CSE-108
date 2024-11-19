import React, { useState } from 'react';
import './LoginRegister.css';
import { useNavigate } from "react-router-dom";


const LoginRegister = () => {
  const navigate = useNavigate(); // For navigation after login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            setMessage(data.message);

            // Save userID to localStorage
            localStorage.setItem('userId', data.userID);

            // Redirect based on userType
            if (data.userType === "student") {
                navigate('/student-home');
            } else if (data.userType === "teacher") {
                navigate("/teacher-home");
            } else if (data.userType === "admin") {
                navigate("/admin-home");
            }
        } else {
            setMessage(data.error);
        }
    } catch (error) {
        setMessage("An error occurred. Please try again.");
    }
};

  

  


  return (
    <div className="login">
      <h1>Login/Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">Username:</label>
          <input 
            className="textInput" 
            name="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label className="label">Password:</label>
          <input 
            className="passwordInput" 
            type="password" 
            name="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <button className="signInButton" type="submit">Sign In</button>
      </form>
      {message && <p>{message}</p>}

    </div>
    
  );
}

export default LoginRegister;
