import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './addCourse.css';

function AddCourse() {
  const [name, setName] = useState('Student');
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleButtonClick = (buttonName) => {
    if (buttonName === 'addCourses') {
      navigate('/add-course');
    } else if (buttonName === 'yourCourses') {
      navigate('/student-home');
    } else if (buttonName === 'signOut') {
      alert('Signing out...');
    }
  };

  return (
    <div className="outeraddCourseHome">
      <div className="outerHeader">
        <span className="left">Welcome {name}</span>
        <span className="center">ACME University</span>
        <button className="right" onClick={handleLogout}>
          Sign out
        </button>
      </div>
      <div className="Header">
        <button
          className="left"
          onClick={() => handleButtonClick('yourCourses')}
        >
          Your Courses
        </button>
        <button
          className="rights"
          onClick={() => handleButtonClick('addCourses')}
        >
          Add Courses
        </button>
      </div>
      <div className="innerTeacherHome">
        <h2 className="innerHeader">Add Courses</h2>
        <table className="courses">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Teacher</th>
              <th>Time</th>
              <th>Students Enrolled</th>
              <th>Add Class</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
}

export default AddCourse;
