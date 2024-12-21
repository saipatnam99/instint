"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useRouter } from "next/navigation";
import { MdHelpOutline } from "react-icons/md";
import {IoIosNotificationsOutline} from "react-icons/io"
import { LuMessageSquareMore } from "react-icons/lu";
import { LuSettings2 } from "react-icons/lu";

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
  const [selectedCohort, setSelectedCohort] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Function to format the date as DD.MM.YYYY (for Date Joined)
  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Function to format the date and time as DD.MM.YYYY hh:mm:ss AM/PM (for Last Login)
  const formatDateTime = (date: string) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();

    // 12-hour format for time
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const seconds = d.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
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
    const filtered = students.filter((student) => {
      const matchesSearchTerm =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCohort = selectedCohort
        ? student.cohort === selectedCohort
        : true;
      const matchesCourse = selectedCourse
        ? student.course === selectedCourse
        : true;

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
          {/* Icons and Profile Section */}
          <div className="flex items-center space-x-4">
            <div className="p-2 flex space-x-8 items-center"> 
           <MdHelpOutline className="w-6 h-6 text-gray-600"/>
            <LuMessageSquareMore className="w-6 h-6 text-gray-600"/>
            <LuSettings2 className="w-6 h-6 text-gray-600"/>
            <IoIosNotificationsOutline className="w-6 h-6 text-gray-600"/>
            </div>

            {/* Profile Section */}
            <div className="flex items-center space-x-2">
              <img
                src="https://via.placeholder.com/150" // Replace with actual profile picture URL
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium text-gray-700">
                Adeline H. Dancy
              </span>
            </div>
          </div>
          </div>
        

        {/* Filters */}
        <div className="bg-white"> 
        <div className="bg-white p-2 mb-4 flex  justify-between ">
          <div className="px-2 space-x-4">
            <select
              className="border p-2 rounded bg-gray-300"
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
            >
              <option value="">All Cohorts</option>
              <option value="AY 2022-2023">AY 2022-2023</option>
              <option value="AY 2023-2024">AY 2023-2024</option>
              <option value="AY 2024-2025">AY 2024-2025</option>
            </select>
            <select
              className="border p-2 rounded bg-gray-300"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">All Courses</option>
              <option value="CBSE 8">CBSE 8</option>
              <option value="CBSE 9">CBSE 9</option>
              <option value="CBSE 10 ">CBSE 10</option>
            </select>
          </div>

          <button
            className="bg-gray-400 text-white px-4 py-2 rounded justify-end"
            onClick={() => router.push("/addStudent")}
          >
            + Add new Student
          </button>
        </div>

        {/* Table */}
        <table className="w-full border-collapse rounded-md bg-white">
          <thead>
            <tr>
              <th className="p-2 text-left">Student Name</th>
              <th className="p-2 text-left">Cohort</th>
              <th className="p-2 text-left">Courses</th>
              <th className="p-2 text-left">Date Joined</th>
              <th className="p-2 text-left">Last Login</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-100">
                <td className="border-t p-2">{student.name}</td>
                <td className="border-t p-2">{student.cohort}</td>
                <td className="border-t p-2">{student.course}</td>
                <td className="border-t p-2">
                  {formatDate(student.dateJoined)}
                </td>
                <td className="border-t p-2">
                  {formatDateTime(student.lastLogin)}
                </td>
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
    </div>
  );
};

export default StudentDashboard;
