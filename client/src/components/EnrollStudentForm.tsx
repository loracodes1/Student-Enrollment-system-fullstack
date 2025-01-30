import React, { useState, useEffect } from "react";
import axios from "axios";

interface Student {
  id: number;
  name: string;
  age: number;
}

interface Unit {
  id: number;
  title: string;
}

interface EnrollStudentFormProps {
  student: Student;
  onClose: () => void;
}

export default function EnrollStudentForm({ student, onClose }: EnrollStudentFormProps) {
  const [unitId, setUnitId] = useState("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [enrollmentDate, setEnrollmentDate] = useState("");

  // Fetch available units
  useEffect(() => {
    axios
      .get("http://localhost:5000/units") // ✅ Ensure this matches your Flask route
      .then((response) => setUnits(response.data))
      .catch((error) => console.error("Error fetching units:", error));
  }, []);

  const handleEnroll = () => {
    if (!unitId || !enrollmentDate) {
      alert("Please select a unit and provide an enrollment date.");
      return;
    }

    axios
      .post("http://localhost:5000/enrollments", {
        student_id: student.id,
        unit_id: parseInt(unitId), // Ensure it's an integer
        enrollment_date: enrollmentDate, // ✅ Send required field
      })
      .then(() => {
        alert("Student enrolled successfully!");
        onClose();
      })
      .catch((error) => console.error("Error enrolling student:", error));
  };

  return (
    <div className="p-4 border rounded shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4">Enroll Student</h2>

      {/* Unit Selection */}
      <label className="block mb-2">Select a Unit:</label>
      <select
        value={unitId}
        onChange={(e) => setUnitId(e.target.value)}
        className="border p-2 w-full mb-4"
      >
        <option value="">-- Select a Unit --</option>
        {units.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.title}
          </option>
        ))}
      </select>

      {/* Enrollment Date */}
      <label className="block mb-2">Enrollment Date:</label>
      <input
        type="date"
        value={enrollmentDate}
        onChange={(e) => setEnrollmentDate(e.target.value)}
        className="border p-2 w-full mb-4"
        required
      />

      {/* Submit & Cancel Buttons */}
      <button
        onClick={handleEnroll}
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
      >
        Enroll
      </button>
      <button
        onClick={onClose}
        className="ml-2 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700"
      >
        Cancel
      </button>
    </div>
  );
}
