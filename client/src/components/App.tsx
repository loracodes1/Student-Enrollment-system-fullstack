import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Students from "../pages/Students";
import Enrollments from "../pages/Enrollments";
import Navbar from "./Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="/enrollments" element={<Enrollments />} />
      </Routes>
    </BrowserRouter>
  );
}
