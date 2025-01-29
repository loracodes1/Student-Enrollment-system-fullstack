import React from "react";
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
}

export default function StudentForm({ setStudents }: StudentFormProps) {
  return (
    <Formik
      initialValues={{ name: "", age: "" }}
      validationSchema={Yup.object({
        name: Yup.string().required("Name is required"),
        age: Yup.number()
          .required("Age is required")
          .min(10, "Age must be at least 10"),
      })}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        axios
          .post("http://localhost:5555/students", values)
          .then((response) => {
            setStudents((prev) => [...prev, response.data]);
            resetForm();
          })
          .catch((error) => console.error("Error adding student:", error))
          .finally(() => setSubmitting(false));
      }}
    >
      {({ isSubmitting }) => (
        <Form className="bg-white p-4 rounded shadow-md mt-4">
          <h2 className="text-lg font-semibold mb-2">Add New Student</h2>

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
            className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {isSubmitting ? "Saving..." : "Add Student"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
