import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="p-4 bg-blue-500 text-white flex justify-between">
      <h1 className="text-lg font-bold">Enrollment System</h1>
      <div>
        <Link to="/" className="px-4">Home</Link>
        <Link to="/students" className="px-4">Students</Link>
        <Link to="/enrollments" className="px-4">Enrollments</Link>
      </div>
    </nav>
  );
}
