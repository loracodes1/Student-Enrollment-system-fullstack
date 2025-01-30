import React, { useState } from "react";
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
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    const newStudent = { name, age: Number(age) };

    try {
      const response = await axios.post("http://localhost:5000/students", newStudent);
      setStudents((prev) => [...prev, response.data]);
      setName("");
      setAge("");
    } catch (error) {
      console.error("Error adding student:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 form">
      <div className="mb-2">
        <label className="block text-sm font-medium form__label">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded form__input"
          required
          autoComplete="name"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium form__label">Age</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full border p-2 rounded form__input"
          required
          autoComplete="age"
          placeholder="Age"
        />
      </div>
      <button
        type="submit"
        onSubmit={(e) => isSaving ? e.preventDefault() : true}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 form__input"
      >
        {isSaving ? "Saving..." : "Add Student"}
      </button>

    </form>
  );
}
