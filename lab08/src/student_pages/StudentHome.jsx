import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentHome.css';

function StudentHome() {
  const [name, setName] = useState([]);
  const [courses, setCourses] = useState([]); // State for storing courses
  const navigate = useNavigate();

  // Fetch student's name on component load
  useEffect(() => {
    const fetchName = async () => {
      try {
        const studentId = localStorage.getItem('userId'); // Assume student ID is stored in localStorage
        if (!studentId) {
          console.error('Student ID not found');
          return;
        }
        const response = await fetch(`http://127.0.0.1:5000/get_name/${studentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch name');
        }
        const data = await response.json();

        // Assuming the API returns an object with a 'name' property
        if (data.name) {
          setName(data.name); // Set the fetched name in the state
        } else {
          console.error('Invalid name data format:', data);
        }
      } catch (error) {
        console.error('Error fetching name:', error);
      }
    };

    fetchName();
  }, []);

  // Fetch courses on component load
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const studentId = localStorage.getItem('userId'); // Assume student ID is stored in localStorage
        if (!studentId) {
          console.error('Student ID not found');
          return;
        }
        const response = await fetch(`http://127.0.0.1:5000/get_student_courses/${studentId}`);
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
        <button className="lefts" onClick={() => handleButtonClick('yourCourses')}>
          Your Courses
        </button>
        <button className="right" onClick={() => handleButtonClick('addCourses')}>
          Add Courses
        </button>
      </div>
      <div className="innerTeacherHome">
        <span className="innerHeader">Your Courses</span>
        <table className="courses">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Teacher</th>
              <th>Time</th>
              <th>Students Enrolled</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <tr key={index}>
                  <td>{course.name}</td>
                  <td>{course.instructorName}</td>
                  <td>{course.timeslot}</td>
                  <td>{course.studentsEnrolled}/{course.maxEnrolled}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No courses found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentHome;
