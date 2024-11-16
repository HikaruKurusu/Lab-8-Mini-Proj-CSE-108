import React, { useState } from "react";
import "./AdminHome.css";
import { useNavigate } from "react-router-dom";

function AdminHome() {
  const [name, setName] = useState("Admin");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleButtonClick = (buttonName) => {
    if (buttonName === "admin-courses") {
      navigate("/add-course");
    } else if (buttonName === "admin-instructor-teaches") {
      navigate("/student-home");
    } else if (buttonName === "admin-student-enrolledin") {
      navigate("/student-home");
    } else if (buttonName === "admin-user-info") {
      navigate("/student-home");
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
          onClick={() => handleButtonClick("yourCourses")}
        >
          Your Courses
        </button>
        <button
          className="navButton"
          onClick={() => handleButtonClick("addCourses")}
        >
          Add Courses
        </button>
      </div>
    </div>
  );
}

export default AdminHome;
