import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "../pages/Home";
import Students from "../pages/Students"; // ✅ Ensure this import path is correct!
import Enrollments from "../pages/Enrollments";

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
