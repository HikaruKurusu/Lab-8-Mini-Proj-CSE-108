import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherCourseView.css';

const TeacherCourseView = () => {
    const [name, setName] = useState([]);
    const [courseName, setCourseName] = useState('');
    const [grades, setGrades] = useState([]); 
    const [editingIndex, setEditingIndex] = useState(null); 
    const [newGrade, setNewGrade] = useState(''); 
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
      };
      useEffect(() => {
        const fetchName = async () => {
          try {
            const studentId = localStorage.getItem('userId'); 
            if (!studentId) {
              console.error('Student ID not found');
              return;
            }
            const response = await fetch(`http://127.0.0.1:5000/get_name/${studentId}`);
            if (!response.ok) {
              throw new Error('Failed to fetch name');
            }
            const data = await response.json();
    
            if (data.name) {
              setName(data.name); 
            } else {
              console.error('Invalid name data format:', data);
            }
          } catch (error) {
            console.error('Error fetching name:', error);
          }
        };
    
        fetchName();
      }, []);
    

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
                    setGrades(data); 
                    setCourseName(`Course ID: ${courseId}`); 
                } else {
                    console.error('Invalid data format:', data);
                }
            } catch (error) {
                console.error('Error fetching grades:', error);
            }
        };

        fetchGrades();
    }, []);
    const handleEditGrade = async (enrollmentID) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/edit_grade', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    enrollmentID,
                    grade: newGrade,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to edit grade');
            }
    
            const data = await response.json();
            console.log(data.message);
            setGrades(grades.map(g => 
                g.enrollmentID === enrollmentID ? { ...g, grade: newGrade } : g
            ));
            setEditingIndex(null);
            setNewGrade('');
        } catch (error) {
            console.error('Error editing grade:', error);
        }
    };
    
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
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades.map((student, index) => (
                            <tr key={index}>
                                <td>{student.name || 'N/A'}</td>
                                <td>
                                    {editingIndex === index ? (
                                        <input
                                            type="text"
                                            value={newGrade}
                                            onChange={(e) => setNewGrade(e.target.value)}
                                        />
                                    ) : (
                                        student.grade ?? 'N/A'
                                    )}
                                </td>
                                <td>
                                    {editingIndex === index ? (
                                        <>
                                            <button onClick={() => handleEditGrade(student.enrollmentID)}>Save</button>
                                            <button onClick={() => setEditingIndex(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <button onClick={() => {
                                            setEditingIndex(index);
                                            setNewGrade(student.grade ?? '');
                                        }}>
                                            Edit
                                        </button>
                                    )}
                                </td>
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
