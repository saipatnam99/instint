'use client';

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const EditStudent = () => {
  const { id } = useParams(); // Get the dynamic route parameter 'id'
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    cohort: "",
    course: "",
    dateJoined: "",
    lastLogin: "",
    status: true, // Default to active
  });

  const cohorts = ["AY 2022-2023", "AY 2023-2024", "AY 2024-2025"];

  useEffect(() => {
    if (id) {
      const fetchStudentData = async () => {
        const res = await fetch(`/api/students?id=${id}`);
        const data = await res.json();
        setForm(data); // Populate the form with student data
      };
      fetchStudentData();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "status" ? value === "true" : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/students/`, {
      method: "PUT", // Update request
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Student updated successfully!");
      router.push("/"); // Redirect to the dashboard
    } else {
      const errorData = await res.json();
      alert(`Error: ${errorData.error}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl mb-6">Edit Student</h1>
      <form className="bg-white p-6 rounded-md shadow-md w-1/3" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Cohort */}
        <div className="mb-4">
          <label className="block text-gray-700">Cohort</label>
          <select
            name="cohort"
            className="w-full border p-2 rounded"
            value={form.cohort}
            onChange={handleChange}
            required
          >
            <option value="">Select Cohort</option>
            {cohorts.map((cohort) => (
              <option key={cohort} value={cohort}>
                {cohort}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Course</label>
          <input
            type="text"
            name="course"
            className="w-full border p-2 rounded"
            value={form.course}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date Joined</label>
          <input
            type="date"
            name="dateJoined"
            className="w-full border p-2 rounded"
            value={form.dateJoined}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Last Login</label>
          <input
            type="datetime-local"
            name="lastLogin"
            className="w-full border p-2 rounded"
            value={form.lastLogin}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            name="status"
            className="w-full border p-2 rounded"
            value={form.status ? "true" : "false"} // Ensures boolean mapping to string "true" or "false"
            onChange={handleChange}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          Update Student
        </button>
      </form>
    </div>
  );
};

export default EditStudent;
