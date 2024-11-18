import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherCourseView.css';

const TeacherCourseView = () => {
    const [name, setName] = useState('Teacher Home');
    const [courseName, setCourseName] = useState('');
    const [grades, setGrades] = useState([]); // Array to store student grades
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
      };
    

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const courseId = localStorage.getItem('selectedCourseID');
                if (!courseId) {
                    console.error('Course ID not found');
                    return;
                }
                const response = await fetch(`http://127.0.0.1:5000/get_student_grades/${courseId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch grades');
                }
                const data = await response.json();
                if (data && Array.isArray(data)) {
                    setGrades(data); // Store fetched grades in state
                    setCourseName(`Course ID: ${courseId}`); // Optionally set course name for display
                } else {
                    console.error('Invalid data format:', data);
                }
            } catch (error) {
                console.error('Error fetching grades:', error);
            }
        };

        fetchGrades();
    }, []);

    return (
        <div className="outerTeacherCourseView">
            <div className="outerHeader">
                <span className="left">Welcome {name}</span>
                <span className="center">ACME University</span>
                <button className="right" onClick={handleLogout}>Sign out</button>
            </div>
            <div className="innerTeacherCourseView">
                <span className="innerHeader" style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{courseName}</span>
                <table className="students">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades.map((student, index) => (
                            <tr key={index}>
                                <td>{student.name || 'N/A'}</td>
                                <td>{student.grade ?? 'N/A'}</td>

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
