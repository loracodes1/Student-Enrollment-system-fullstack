import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5555/enrollments")
      .then(response => setEnrollments(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Enrollments</h1>
      <ul>
        {enrollments.map((enrollment: any) => (
          <li key={enrollment.id}>Student {enrollment.student_id} enrolled in Unit {enrollment.unit_id}</li>
        ))}
      </ul>
    </div>
  );
}
