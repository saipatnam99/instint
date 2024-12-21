'use client'
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useRouter } from "next/navigation";

interface Student {
  id: number;
  name: string;
  cohort: string;
  course: string;
  dateJoined: string;
  lastLogin: string;
  status: boolean;
}

const StudentDashboard = () => {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedCohort, setSelectedCohort] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Function to format the date as DD.MM.YYYY (for Date Joined)
  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Function to format the date and time as DD.MM.YYYY hh:mm:ss AM/PM (for Last Login)
  const formatDateTime = (date: string) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();

    // 12-hour format for time
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;

    return `${day}.${month}.${year} ${formattedTime}`;
  };

  // Fetch students data from API
  useEffect(() => {
    const fetchStudents = async () => {
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(data);
      setFilteredStudents(data); // Initially set all students
    };
    fetchStudents();
  }, []);

  // Filter students based on search term, selected cohort, and selected course
  useEffect(() => {
    const filtered = students.filter(student => {
      const matchesSearchTerm =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCohort = selectedCohort ? student.cohort === selectedCohort : true;
      const matchesCourse = selectedCourse ? student.course === selectedCourse : true;

      return matchesSearchTerm && matchesCohort && matchesCourse;
    });

    setFilteredStudents(filtered);
  }, [searchTerm, selectedCohort, selectedCourse, students]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 px-4 bg-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search your course or student"
            className="border p-2 rounded w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Adeline H. Dancy</span>
            <div className="h-10 w-10 rounded-full bg-gray-300"></div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-3 mb-4 flex  justify-between ">
          <div>        
            
            <select
              className="border p-2 rounded bg-gray-400"
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
            >
              <option value="">All Cohorts</option>
              <option value="AY 2022-2023">AY 2022-2023</option>
              <option value="AY 2023-2024">AY 2023-2024</option>
              <option value="AY 2024-2025">AY 2024-2025</option>
            </select> 
          </div>

          <div>
            <select
              className="border p-2 rounded bg-gray-400"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">All Courses</option>
              <option value="CBSE 9 Science">CBSE 9 Science</option>
              <option value="CBSE 9 Math">CBSE 9 Math</option>
              <option value="CBSE 9 English">CBSE 9 English</option>
            </select>
          </div>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded justify-end"
            onClick={() => router.push("/addStudent")}
          >
            + Add new Student
          </button>
        </div>

        {/* Table */}
        <table className="w-full border-collapse rounded-md bg-white">
          <thead className="bg-white">
            <tr>
              <th className="p-2">Student Name</th>
              <th className="p-2">Cohort</th>
              <th className="p-2">Courses</th>
              <th className="p-2">Date Joined</th>
              <th className="p-2">Last Login</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-100">
                <td className="border-t p-2">{student.name}</td>
                <td className="border-t p-2">{student.cohort}</td>
                <td className="border-t p-2">{student.course}</td>
                <td className="border-t p-2">{formatDate(student.dateJoined)}</td>
                <td className="border-t p-2">{formatDateTime(student.lastLogin)}</td>
                <td className="border-t p-2">
                  <span
                    className={`inline-block h-4 w-4 rounded-full ${
                      student.status ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDashboard;
