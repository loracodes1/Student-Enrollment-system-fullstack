import React from "react"; // ✅ Required in TypeScript
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Students from "../pages/Students";
import Enrollments from "../pages/Enrollments";
import Navbar from "./Navbar";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="/enrollments" element={<Enrollments />} />
      </Routes>
    </Router>
  );
}
