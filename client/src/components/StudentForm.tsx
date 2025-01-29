import React from "react"; // Remove `useEffect`
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

interface Student {
  id: number;
  name: string;
  age: number;
}

interface StudentFormProps {
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  editingStudent: Student | null;
  setEditingStudent: React.Dispatch<React.SetStateAction<Student | null>>;
}

export default function StudentForm({ setStudents, editingStudent, setEditingStudent }: StudentFormProps) {
  return (
    <Formik
      initialValues={{
        name: editingStudent ? editingStudent.name : "",
        age: editingStudent ? editingStudent.age : "",
      }}
      enableReinitialize={true} // Ensures form updates when editingStudent changes
      validationSchema={Yup.object({
        name: Yup.string().required("Name is required"),
        age: Yup.number().required("Age is required").min(10, "Must be at least 10"),
      })}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        if (editingStudent) {
          // Update existing student
          axios
            .patch(`http://localhost:5555/students/${editingStudent.id}`, values)
            .then((response) => {
              setStudents((prev) =>
                prev.map((s) => (s.id === response.data.id ? response.data : s))
              );
              setEditingStudent(null);
              resetForm();
            })
            .catch((error) => console.error("Error updating student:", error))
            .finally(() => setSubmitting(false));
        } else {
          // Add new student
          axios
            .post("http://localhost:5555/students", values)
            .then((response) => {
              setStudents((prev) => [...prev, response.data]);
              resetForm();
            })
            .catch((error) => console.error("Error adding student:", error))
            .finally(() => setSubmitting(false));
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold mb-2">{editingStudent ? "Edit Student" : "Add Student"}</h2>

          <div className="mb-2">
            <label className="block text-gray-700">Name:</label>
            <Field name="name" type="text" className="w-full p-2 border rounded" />
            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Age:</label>
            <Field name="age" type="number" className="w-full p-2 border rounded" />
            <ErrorMessage name="age" component="div" className="text-red-500 text-sm" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isSubmitting ? "Saving..." : editingStudent ? "Update Student" : "Add Student"}
          </button>

          {editingStudent && (
            <button
              type="button"
              onClick={() => setEditingStudent(null)}
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </Form>
      )}
    </Formik>
  );
}
