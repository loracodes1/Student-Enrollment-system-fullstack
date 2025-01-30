import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <ul className="flex space-x-6">
        <li>
          <Link to="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link to="/students" className="hover:underline">
            Students
          </Link>
        </li>
        <li>
          <Link to="/enrollments" className="hover:underline">
            Enrollments
          </Link>
        </li>
        <li>
          <Link to="/instructors" className="hover:underline">
            Instructors
          </Link>
        </li>
        <li>
          <Link to="/instructors" className="hover:underline">
            Units
          </Link>
        </li>
      </ul>
    </nav>
  );
}
