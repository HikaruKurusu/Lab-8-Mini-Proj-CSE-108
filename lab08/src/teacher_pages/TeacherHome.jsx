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
        const fetchCourses = async () => {
          try {
            const teacherId = localStorage.getItem('userId'); // Assume teacher ID is stored in localStorage
            if (!teacherId) {
              console.error('Teacher ID not found');
              return;
            }
            const response = await fetch(`http://127.0.0.1:5000/get_teacher_courses/${teacherId}`);
            if (!response.ok) {
              throw new Error('Failed to fetch courses');
            }
            const data = await response.json();
    
            // Check if the data structure is correct
            if (Array.isArray(data)) {
              setCourses(data); // Set the courses in state
            } else {
              console.error('Invalid courses data format:', data);
            }
          } catch (error) {
            console.error('Error fetching courses:', error);
          }
        };
    
        fetchCourses();
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
                            <th>View Students</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length > 0 ? (
                            courses.map(course => (
                                <tr key={course.id}>
                                    <td>{course.name}</td>
                                    <td>{course.instructorName}</td>
                                    <td>{course.maxEnrolled}</td>
                                    <td>{course.timeslot}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No courses available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <button onClick={() => navigate('/teacher-home')}>Go to Teacher Home</button>
            </div>
        </div>
    );
};

export default TeacherCourseView;
