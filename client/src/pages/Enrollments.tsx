import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/enrollments")
      .then(response => setEnrollments(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Enrollments</h1>
      <ul>
        {enrollments.map((enrollment: any) => (
          <li key={enrollment.id}>Student "{enrollment.student.name}" enrolled in Unit "{enrollment.unit.title}"</li>
        ))}
      </ul>
    </div>
  );
}
