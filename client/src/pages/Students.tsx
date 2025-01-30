import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentForm from "../components/StudentForm";
import EditStudentForm from "../components/EditStudentForm";
import EnrollStudentForm from "../components/EnrollStudentForm";
import Popup from "reactjs-popup";
import { InView } from "react-intersection-observer";

interface Student {
  id: number;
  name: string;
  age: number;
}

interface Enrollment {
  id: number;
  student_id: number;
  unit: { title: string };
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [enrollingStudent, setEnrollingStudent] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<{ [key: number]: Enrollment[] }>({});

  // Popup
  const contentStyle = { 
    background: 'rgb(219, 219, 219)',
    padding: '10px',
    margin: 'auto'
  };
  const overlayStyle = { background: 'rgba(0,0,0,0.8)' };
  const arrowStyle = { color: '#000' }; // style for an svg element

  const fetchStudents = () => {
    axios
      .get("http://localhost:5000/students")
      .then((response) => {
        setStudents(response.data)
      })
      .catch((error) => console.error("Error fetching students:", error));
  };

  const fetchEnrollments = (studentId: number) => {
    axios
      .get("http://localhost:5000/enrollments")
      .then((response) => {
        const studentEnrollments = response.data.filter(
          (enrollment: Enrollment) => enrollment.student_id === studentId
        );
        setEnrollments((prev) => ({
          ...prev,
          [studentId]: studentEnrollments,
        }));
      })
      .catch((error) => console.error("Error fetching enrollments:", error));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      axios
        .delete(`http://localhost:5000/students/${id}`)
        .then(() => {
          setStudents((prev) => prev.filter((student) => student.id !== id));
        })
        .catch((error) => console.error("Error deleting student:", error));
    }
  };
  
  useEffect(() => {
    fetchStudents()
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student List</h1>

      {/* Add Student Form */}
      <Popup 
          modal={true}
          position="center center"
          contentStyle={contentStyle}
          overlayStyle={overlayStyle}
          arrowStyle={arrowStyle}
          closeOnDocumentClick={true}
          trigger={<button className="mt-3 ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Add Student</button>}
        >
          <StudentForm setStudents={setStudents} />
      </Popup>

      {/* Edit Student Form (Conditional) */}
      {editingStudent && (
        <Popup 
          key={editingStudent.id}
          modal={true}
          open={true}
          position="center center"
          contentStyle={contentStyle}
          overlayStyle={overlayStyle}
          arrowStyle={arrowStyle}
          closeOnDocumentClick={false}
        >
          <EditStudentForm
            student={editingStudent}
            setStudents={setStudents}
            onClose={() => setEditingStudent(null)}
          />
        </Popup>
      )}

      {/* Enroll Student Form (Conditional) */}
      {enrollingStudent !== null && (
        <Popup 
          key={enrollingStudent?.id}
          modal={true}
          open={true}
          position="center center"
          contentStyle={contentStyle}
          overlayStyle={overlayStyle}
          arrowStyle={arrowStyle}
          closeOnDocumentClick={false}
        >
          <EnrollStudentForm
            student={enrollingStudent}
            onClose={() =>  setEnrollingStudent(null)}
          />
        </Popup>
      )}

      {/* Student List */}
      <table id="students-table" className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Enrolled Units</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
            <InView key={student.id} className="border" as="tr" onChange={(inView) => {
                if(inView) fetchEnrollments(student.id)
              }
            }>
              {/* <tr key={student.id} className="border"> */}
                <td className="border p-2">{student.id}</td>
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.age}</td>
                <td className="border p-2">
                  <ul>
                    {enrollments[student.id]?.length > 0 ? (
                      enrollments[student.id].map((enrollment) => (
                        <li key={enrollment.id}>{enrollment.unit.title}</li>
                      ))
                    ) : (
                      <li>No enrollments</li>
                    )}
                  </ul>
                </td>
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
                  <button
                    onClick={() => setEnrollingStudent(student)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Enroll
                  </button>
                </td>
              {/* </tr> */}
              </InView>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}