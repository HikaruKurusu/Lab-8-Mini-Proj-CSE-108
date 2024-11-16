import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherCourseView.css';

const TeacherCourseView = () => {
    const [name, setName] = useState('Teacher Home');
    const [courses, setCourses] = useState([]); // State to store courses
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
      };
    useEffect(() => {
        // Fetch courses from the API
        fetch('http://127.0.0.1:5000/api/courses') // Adjust URL if needed
            .then(response => response.json())
            .then(data => {
                setCourses(data); // Update courses state with API response
            })
            .catch(error => console.error('Error fetching courses:', error));
    }, []);

    return (
        <div className="outerTeacherCourseView">
            <div className="outerHeader">
                <span className="left">Welcome {name}</span>
                <span className="center">ACME University</span>
                <button className="right" onClick={handleLogout}>
                    Sign out
                </button>
            </div>
            <div className="innerTeacherCourseView">
                <span className="innerHeader" style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
                    Available Courses
                </span>
                <table className="students">
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Instructor</th>
                            <th>Max Enrollment</th>
                            <th>Timeslot</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course.id}>
                                <td>{course.name}</td>
                                <td>{course.instructorName}</td>
                                <td>{course.maxEnrolled}</td>
                                <td>{course.timeslot}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={() => navigate('/teacher-home')}>Go to Teacher Home</button>
            </div>
        </div>
    );
};

export default TeacherCourseView;
