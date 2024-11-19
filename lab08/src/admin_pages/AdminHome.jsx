import React, { useState, useEffect } from "react";
import "./AdminHome.css";
import { useNavigate } from "react-router-dom";

function AdminHome() {
  const [name, setName] = useState([]);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]); // State for storing courses
  const [courseName, setCourseName] = useState(""); // State for course name
  const [instructorName, setInstructorName] = useState(""); // State for instructor name
  const [maxEnrolled, setMaxEnrolled] = useState(""); // State for max enrolled
  const [timeslot, setTimeslot] = useState(""); // State for timeslot

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/courses");
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses(); // Initial fetch of courses when the component loads
  }, []);

  const handleButtonClick = (buttonName) => {
    if (buttonName === "admincourses") {
      navigate("/admin-home");
    } else if (buttonName === "admininstructorteaches") {
      navigate("/admin-instructor-teach");
    } else if (buttonName === "adminstudentenrolledin") {
      navigate("/admin-student-enroll");
    } else if (buttonName === "adminuserinfo") {
      navigate("/admin-user-info");
    }
  };

  useEffect(() => {
    const fetchName = async () => {
      try {
        const studentId = localStorage.getItem("userId"); // Assume student ID is stored in localStorage
        if (!studentId) {
          console.error("Student ID not found");
          return;
        }
        const response = await fetch(
          `http://127.0.0.1:5000/get_name/${studentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch name");
        }
        const data = await response.json();

        if (data.name) {
          setName(data.name); // Set the fetched name in the state
        } else {
          console.error("Invalid name data format:", data);
        }
      } catch (error) {
        console.error("Error fetching name:", error);
      }
    };

    fetchName();
  }, []);

  const handleCourseSubmit = async (e) => {
    e.preventDefault();

    const newCourse = {
      name: courseName,
      instructorName: instructorName,
      maxEnrolled: maxEnrolled,
      timeslot: timeslot,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/create_course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCourse),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Course created successfully! Course ID: ${data.courseID}`);
        fetchCourses(); // Refresh the list of courses after adding a new one
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/delete_course/${courseId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Course deleted successfully!");
        fetchCourses(); // Refresh the list of courses after deletion
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course");
    }
  };

  return (
    <div className="outerAdminHome">
      <div className="outerHeader">
        <span className="left">Welcome {name}</span>
        <span className="center">ACME University</span>
        <button className="right" onClick={handleLogout}>
          Sign out
        </button>
      </div>
      <div className="Header">
        <button
          className="navButton"
          onClick={() => handleButtonClick("admincourses")}
        >
          Courses
        </button>
        <button
          className="navButton"
          onClick={() => handleButtonClick("admininstructorteaches")}
        >
          Instructor
        </button>
        <button
          className="navButton"
          onClick={() => handleButtonClick("adminstudentenrolledin")}
        >
          Student
        </button>
        <button
          className="navButton"
          onClick={() => handleButtonClick("adminuserinfo")}
        >
          User Info
        </button>
      </div>

  
      <div className="content">
  {/* Left Section: Create Course Form */}
  <div className="leftSection">
    <span
      className="innerHeader"
      style={{ fontSize: "1.5em", fontWeight: "bold", color: "white" }}
    >
      Create Course
    </span>
    <form onSubmit={handleCourseSubmit}>
      <input
        type="text"
        placeholder="Course Name"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Instructor Name"
        value={instructorName}
        onChange={(e) => setInstructorName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Max Enrolled"
        value={maxEnrolled}
        onChange={(e) => setMaxEnrolled(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Timeslot"
        value={timeslot}
        onChange={(e) => setTimeslot(e.target.value)}
        required
      />
      <button type="submit">Add Course</button>
    </form>
  </div>

  {/* Right Section: Display Courses Table */}
  <div className="rightSection">
    <table>
      <thead>
        <tr>
          <th>Course Name</th>
          <th>Teacher</th>
          <th>Time</th>
          <th>Students Enrolled</th>
          <th>Actions</th>
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
              <button onClick={() => handleDeleteCourse(course.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

     
    </div>
  );
}

export default AdminHome;
