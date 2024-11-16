import React, { useState } from 'react';
import './AdminHome.css';
import { useNavigate } from 'react-router-dom';

function AdminHome() {

    const [name, setName] = useState('Admin');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };
    
    const handleButtonClick = (buttonName) => {
        if (buttonName === 'addCourses') {
            navigate('/add-course');
        } else if (buttonName === 'yourCourses') {
            navigate('/student-home');
        }
    };


    return (
        <div className="outerStudentHome">
        <div className="outerHeader">
            <span className="left">Welcome {name}</span>
            <span className="center">ACME University</span>
            <button className="right" onClick={handleLogout}>
                Sign out
            </button>
        </div>
        <div className="Header">
            <button
                className="lefts"
                onClick={() => handleButtonClick('yourCourses')}
            >
                Your Courses
            </button>
            <button
                className="right"
                onClick={() => handleButtonClick('addCourses')}
            >
                Add Courses
            </button>
        </div>
        <div className="innerTeacherHome">
            <h2 className="innerHeader">Your Courses</h2>
            <table className="courses">
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Teacher</th>
                        <th>Time</th>
                        <th>Students Enrolled</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>

    );
}

export default AdminHome;
