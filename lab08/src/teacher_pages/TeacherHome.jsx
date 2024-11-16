import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherHome.css';


const TeacherHome = () => {
    const [name, setName] = React.useState('Teacher Home');
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
      };

    return(
        <div className="outerTeacherHome">
            <div className="outerHeader">
                <span className="left">Welcome {name}</span>
                <span className="center">ACME University</span>
                <button className="right" onClick={handleLogout}>Sign out</button>
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
                <button onClick={() => navigate('/teacher-course-view')}>Go to Teacher Course View</button>
            </div>
        </div>
    )

}

export default TeacherHome
