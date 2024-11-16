import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherCourseView.css';

const TeacherCourseView = () => {
    const [name, setName] = React.useState('Teacher Home');
    const [courseName, setCourseName] = React.useState('');
    const navigate = useNavigate();

    return(
        <div className="outerTeacherCourseView">
            <div className="outerHeader">
                <span className="left">Welcome {name}</span>
                <span className="center">ACME University</span>
                <button className="right" onClick={() => alert('Signing out...')}>Sign out</button>
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
                </table>
                <button onClick={() => navigate('/teacher-home')}>Go to Teacher Home</button>
            </div>
        </div>
    )
}

export default TeacherCourseView