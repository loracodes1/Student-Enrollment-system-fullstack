import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

interface Student {
  id: number;
  name: string;
  age: number;
}

interface EditStudentFormProps {
  student: Student;
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  onClose: () => void;
}

export default function EditStudentForm({ student, setStudents, onClose }: EditStudentFormProps) {
  return (
    <Formik
      initialValues={{ name: student.name, age: student.age }}
      validationSchema={Yup.object({
        name: Yup.string().required("Name is required"),
        age: Yup.number().required("Age is required").min(10, "Age must be at least 10"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        axios
          .patch(`http://localhost:5000/students/${student.id}`, values)
          .then((response) => {
            setStudents((prev) =>
              prev.map((s) => (s.id === student.id ? response.data : s))
            );
            onClose();
          })
          .catch((error) => console.error("Error updating student:", error))
          .finally(() => setSubmitting(false));
      }}
    >
      {({ isSubmitting }) => (
        <Form className="bg-white p-4 rounded shadow-md mt-4">
          <h2 className="text-lg font-semibold mb-2">Edit Student</h2>

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
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isSubmitting ? "Saving..." : "Update Student"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="mt-3 ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </Form>
      )}
    </Formik>
  );
}
