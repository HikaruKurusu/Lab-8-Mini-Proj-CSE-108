import React, { useState, useEffect } from "react";
import "./AdminHome.css";
import { useNavigate } from "react-router-dom";

function AdminHome() {
  const [name, setName] = useState([]);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [maxEnrolled, setMaxEnrolled] = useState("");
  const [timeslot, setTimeslot] = useState("");
  const [editingCourseId, setEditingCourseId] = useState(null);

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
    fetchCourses();
  }, []);

  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    const updatedCourse = {
      name: courseName,
      instructorName: instructorName,
      maxEnrolled: maxEnrolled,
      timeslot: timeslot,
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/update_course/${editingCourseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCourse),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Course updated successfully!");
        fetchCourses();
        setEditingCourseId(null);
        clearForm();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course");
    }
  };

  const handleEditClick = (course) => {
    setEditingCourseId(course.id);
    setCourseName(course.name);
    setInstructorName(course.instructorName);
    setMaxEnrolled(course.maxEnrolled);
    setTimeslot(course.timeslot);
  };

  const clearForm = () => {
    setCourseName("");
    setInstructorName("");
    setMaxEnrolled("");
    setTimeslot("");
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
        fetchCourses();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course");
    }
  };
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
        fetchCourses();
        clearForm();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course");
    }
  };
  useEffect(() => {
    const fetchName = async () => {
      try {
        const studentId = localStorage.getItem("userId");
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
          setName(data.name);
        } else {
          console.error("Invalid name data format:", data);
        }
      } catch (error) {
        console.error("Error fetching name:", error);
      }
    };
    fetchName();
  }, []);

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
        <button className="navButton" onClick={() => navigate("/admin-home")}>
          Courses
        </button>
        <button
          className="navButton"
          onClick={() => navigate("/admin-instructor-teach")}
        >
          Instructor
        </button>
        <button
          className="navButton"
          onClick={() => navigate("/admin-student-enroll")}
        >
          Student
        </button>
        <button
          className="navButton"
          onClick={() => navigate("/admin-user-info")}
        >
          User Info
        </button>
      </div>

      <div className="content">
        {/* Left Section: Create/Edit Course Form */}
        <div className="leftSection">
          <span
            className="innerHeader"
            style={{ fontSize: "1.5em", fontWeight: "bold", color: "black" }}
          >
            {editingCourseId ? "Edit Course" : "Create Course"}
          </span>
          <form
            onSubmit={editingCourseId ? handleUpdateCourse : handleCourseSubmit}
          >
            {/* <input
              type="text"
              placeholder="Course ID"
              value={editingCourseId}
              onChange={(e) => setEditingCourseId(e.target.value)}
              required
            /> */}
            <input
              style={{ backgroundColor: "lightblue" }}
              type="text"
              placeholder="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
            <input
            style={{ backgroundColor: "lightblue" }}
              type="text"
              placeholder="Instructor Name"
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              required
            />
            <input
            style={{ backgroundColor: "lightblue" }}
              type="text"
              placeholder="Max Enrolled"
              value={maxEnrolled}
              onChange={(e) => setMaxEnrolled(e.target.value)}
              required
            />
            <input
            style={{ backgroundColor: "lightblue" }}
              type="text"
              placeholder="Timeslot"
              value={timeslot}
              onChange={(e) => setTimeslot(e.target.value)}
              required
            />
            <button type="submit">
              {editingCourseId ? "Update Course" : "Add Course"}
            </button>
            {editingCourseId && (
              <button type="button" onClick={() => setEditingCourseId(null)}>
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Right Section: Display Courses Table */}
        <div className="rightSection">
          <table>
            <thead>
              <tr>
                <th>Course ID</th>
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
                  <td>{course.id}</td>
                  <td>{course.name}</td>
                  <td>{course.instructorName}</td>
                  <td>{course.timeslot}</td>
                  <td>{course.maxEnrolled}</td>
                  <td>
                    <button onClick={() => handleEditClick(course)}className="editButton">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteCourse(course.id)}>
                      Delete
                    </button>
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
