import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import StudentForm from "../components/StudentForm";

export default function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5555/students")
      .then(response => setStudents(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Students</h1>
      <StudentForm />
      <ul>
        {students.map((student: any) => (
          <li key={student.id}>{student.name} - Age {student.age}</li>
        ))}
      </ul>
    </div>
  );
}
