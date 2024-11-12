import React from "react";
import "./StudentHome.css";
import { useNavigate } from "react-router-dom";

function StudentHome() {
  const navigate = useNavigate();
  const studentName = localStorage.getItem("studentName") || "Student";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="student-home">
      <header className="header-container">
        <div className="top-header">
          <h2 className="welcome-message">Welcome {studentName}!</h2>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <h1 className="welcome-message">University Of California Merced</h1>
      </header>
    </div>
  );
}

export default StudentHome;
