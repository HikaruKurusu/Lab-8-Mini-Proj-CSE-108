import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentHome.css';

function StudentHome() {
    const [name, setName] = useState('Student');
    const navigate = useNavigate();

    const handleButtonClick = (buttonName) => {
        if (buttonName === 'addCourses') {
            navigate('/add-course');
        } else if (buttonName === 'yourCourses') {
            alert('Your course');
        } else if (buttonName === 'signOut') {
            alert('Signing out...');
        }
    };

    return (
        <div className="outerStudentHome">
            <div className="outerHeader">
                <span className="left">Welcome {name}</span>
                <span className="center">ACME University</span>
                <button className="right" onClick={() => handleButtonClick('signOut')}>
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

export default StudentHome;
