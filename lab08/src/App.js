import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginRegister from "./LoginPage/LoginRegister";
import StudentHome from "./student_pages/StudentHome";
import TeacherHome from "./teacher_pages/TeacherHome";
import AdminHome from "./admin_pages/AdminHome";
import AddCourse from "./student_pages/addCourse"; // Ensure the name matches your file
import TeacherCourseView from "./teacher_pages/TeacherCourseView"; // Ensure the name matches your file
import AdminInstructorTeach from './admin_pages/AdminInstructorTeach';
import AdminStudentEnroll from './admin_pages/AdminStudentEnroll';
import AdminUserInfo from './admin_pages/AdminUserInfo';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/student-home" element={<StudentHome />} />
          <Route path="/teacher-home" element={<TeacherHome />} />
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/admin-instructor-teach" element={<AdminInstructorTeach />} />
          <Route path="/admin-user-info" element={<AdminUserInfo />} />
          <Route path="/admin-student-enroll" element={<AdminStudentEnroll />} />
          <Route path="/add-course" element={<AddCourse />} />
          {/* Use a unique route */}
          <Route path="/teacher-course-view" element={<TeacherCourseView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
