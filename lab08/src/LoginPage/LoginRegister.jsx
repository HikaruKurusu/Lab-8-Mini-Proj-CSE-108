import React from 'react';
import './LoginRegister.css';
import { useNavigate } from "react-router-dom";


const LoginRegister = () => {
//comment
  const navigate = useNavigate(); // For navigation after login


  return (
    <div className="login">
      <h1>Login/Register</h1>
      <form>
        <div className="form-group">
          <label className="label">Username:</label>
          <input className="textInput" name="username" />
        </div>
        <div className="form-group">
          <label className="label">Password:</label>
          <input className="passwordInput" name="password" />
        </div>
        <button className="signInButton" type="submit">Sign In</button>
      </form>

      <div
          className="button-container"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button
            variant="contained"
            className="circle-button"
            onClick={() => navigate("/student-home")}
            style={{ borderRadius: "50%", padding: "20px 30px" }}
          >
            Student
          </button>
          <button
            variant="contained"
            className="circle-button"
            onClick={() => navigate("/teacher-home")}
            style={{ borderRadius: "50%", padding: "20px 30px" }}
          >
            Teacher
          </button>
          <button
            variant="contained"
            className="circle-button"
            onClick={() => navigate("/admin-home")}
            style={{ borderRadius: "50%", padding: "20px 30px" }}
          >
            Admin
          </button>
      </div>
      
    </div>
    
  );
}

export default LoginRegister;
