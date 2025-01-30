import React, { useState } from "react";
import axios from "axios";

interface Student {
  id: number;
  name: string;
  age: number;
}

interface EnrollStudentFormProps {
  student: Student;
  onClose: () => void;
}

export default function EnrollStudentForm({ student, onClose }: EnrollStudentFormProps) {
  const [unitId, setUnitId] = useState("");

  const handleEnroll = () => {
    axios
      .post("http://localhost:5000/enrollments", {
        student_id: student.id,
        unit_id: unitId,
      })
      .then(() => {
        alert("Student enrolled successfully!");
        window.location.reload(); // Refreshes the page to fetch updated enrollments
      })
      .catch((error) => console.error("Error enrolling student:", error));
  };


  return (
    <div className="p-4 border rounded shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4">Enroll Student</h2>
      <label className="block mb-2">Unit ID:</label>
      <input
        type="text"
        value={unitId}
        onChange={(e) => setUnitId(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <button onClick={handleEnroll} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700">
        Enroll
      </button>
      <button onClick={onClose} className="ml-2 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700">
        Cancel
      </button>
    </div>
  );
}
