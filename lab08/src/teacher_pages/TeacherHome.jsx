import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherHome.css';

const TeacherHome = () => {
  const [name, setName] = useState([]);
  const [courses, setCourses] = useState([]); 
  const navigate = useNavigate();
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
    const fetchCourses = async () => {
      try {
        const teacherId = localStorage.getItem('userId'); 
        if (!teacherId) {
          console.error('Teacher ID not found');
          return;
        }
        const response = await fetch(`http://127.0.0.1:5000/get_teacher_courses/${teacherId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          setCourses(data); 
        } else {
          console.error('Invalid courses data format:', data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };


  const handleView = (courseId) => {
    localStorage.setItem('selectedCourseID', courseId);
    navigate('/teacher-course-view');
  };

  return (
    <div className="outerTeacherHome">
      <div className="outerHeader">
        <span className="left">Welcome {name}</span>
        <span className="center">ACME University</span>
        <button className="right" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    
      <div className="innerTeacherHome">
        <span className="innerHeader" style={{ fontSize: '1.5em', fontWeight: 'bold' }}>Available Courses</span>
        <table className="courses">
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
              courses.map((course, index) => (
                <tr key={index}>
                  <td>{course.name}</td>
                  <td>{course.instructorName}</td>
                  <td>{course.maxEnrolled}</td>
                  <td>{course.timeslot}</td>
                  <td>
                    <button className="right" onClick={() => handleView(course.id)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No courses available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherHome;
