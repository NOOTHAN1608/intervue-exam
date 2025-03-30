import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/home";
import StudentLogin from "./components/studentlogin";
import TeacherLogin from "./components/teacherlogin";
import TeacherDashboard from "./components/teacherdashboard";
import RegisterCandidates from "./components/registerCandidates";
import AddQuestion from "./components/addQuestionnaires";
import StudentDashboard from "./components/studentdashboard";
import TeacherAssign from "./components/techerassign";
import OldQuiz from "./components/oldquiz";







function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/components/studentlogin" element={<StudentLogin />} />
        <Route path="/components/teacherlogin" element={<TeacherLogin/>} />
        <Route path="/components/teacherdashboard" element={<TeacherDashboard/>} />
        <Route path="/components/registerCandidates" element={<RegisterCandidates/>} />
        <Route path="/components/addQuestionnaires" element={<AddQuestion/>} />
        <Route path="/components/studentdashboard" element={<StudentDashboard/>} />
        <Route path="/components/techerassign" element={<TeacherAssign/>} />
        <Route path="/components/oldquiz" element={<OldQuiz/>} />
        
      </Routes>
    </Router>
  );
}

export default App;
