import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const StudentSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  age: Yup.number().min(18, "Minimum age is 18").required("Age is required"),
});

export default function StudentForm() {
  return (
    <Formik
      initialValues={{ name: "", age: "" }}
      validationSchema={StudentSchema}
      onSubmit={(values, { resetForm }) => {
        axios.post("http://localhost:5555/students", values)
          .then(() => resetForm())
          .catch(error => console.error(error));
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <label>Name:</label>
            <Field type="text" name="name" className="border p-2" />
            <ErrorMessage name="name" component="div" className="text-red-500" />
          </div>
          <div>
            <label>Age:</label>
            <Field type="number" name="age" className="border p-2" />
            <ErrorMessage name="age" component="div" className="text-red-500" />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}
