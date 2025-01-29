import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentForm from "../components/StudentForm";
import EditStudentForm from "../components/EditStudentForm";

interface Student {
  id: number;
  name: string;
  age: number;
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios
      .get("http://localhost:5555/students")
      .then((response) => setStudents(response.data))
      .catch((error) => console.error("Error fetching students:", error));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      axios
        .delete(`http://localhost:5555/students/${id}`)
        .then(() => {
          setStudents((prev) => prev.filter((student) => student.id !== id));
        })
        .catch((error) => console.error("Error deleting student:", error));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student List</h1>

      {/* Add Student Form */}
      <StudentForm setStudents={setStudents} />

      {/* Edit Student Form (Conditional) */}
      {editingStudent && (
        <EditStudentForm
          student={editingStudent}
          setStudents={setStudents}
          onClose={() => setEditingStudent(null)}
        />
      )}

      {/* Student List */}
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.id} className="border">
                <td className="border p-2">{student.id}</td>
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.age}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => setEditingStudent(student)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
