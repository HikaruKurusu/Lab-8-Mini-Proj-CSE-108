import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './addCourse.css';

function AddCourse() {
  const [name, setName] = useState([]);
  const [courses, setCourses] = useState([]); // State for storing all courses
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
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

  // Fetch all available courses from the API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/courses'); // Adjust URL if necessary
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleAddCourse = async (courseId) => {
    try {
      const studentId = localStorage.getItem('userId'); // Assume student ID is stored in localStorage
      if (!studentId) {
        alert('Student ID not found. Please log in again.');
        return;
      }

      const response = await fetch(`http://127.0.0.1:5000/enroll_student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId, courseId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add course');
      }

      alert('Successfully enrolled in the course!');
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Could not enroll in the course. Please try again.');
    }
  };

  const handleButtonClick = (buttonName) => {
    if (buttonName === 'addCourses') {
      navigate('/add-course');
    } else if (buttonName === 'yourCourses') {
      navigate('/student-home');
    } else if (buttonName === 'signOut') {
      localStorage.clear();
      navigate('/');
    }
  };

  return (
    <div className="outeraddCourseHome">
      <div className="outerHeader">
        <span className="left">Welcome {name}</span>
        <span className="center">ACME University</span>
        <button className="right" onClick={handleLogout}>
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
          className="rights"
          onClick={() => handleButtonClick('addCourses')}
        >
          Add Courses
        </button>
      </div>
      <div className="innerTeacherHome">
        <h2 className="innerHeader">Available Courses</h2>
        <table className="courses">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Teacher</th>
              <th>Time</th>
              <th>Students Enrolled</th>
              <th>Add Class</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.name}</td>
                <td>{course.instructorName}</td>
                <td>{course.timeslot}</td>
                <td>{course.maxEnrolled}</td>
                <td>
                  <button
                    onClick={() => handleAddCourse(course.id)}
                    className="add-button"
                  >
                    Enroll
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AddCourse;
