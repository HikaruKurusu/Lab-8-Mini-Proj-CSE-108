import React from 'react';
import './TeacherHome.css';

const TeacherHome = () => {
    const [name, setName] = React.useState('Teacher Home');

    return(
        <div className="outerTeacherHome">
            <div className="outerHeader">
                <span className="left">Welcome {name}</span>
                <span className="center">ACME University</span>
                <span className="right">Sign out</span>
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
    )

}

export default TeacherHome
