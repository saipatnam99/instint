"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useRouter } from "next/navigation";
import { MdHelpOutline } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { LuMessageSquareMore, LuSettings2 } from "react-icons/lu";
import swal from "sweetalert";

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

  // Handle double-click for edit
  const handleEdit = (student: Student) => {
    swal({
      title: "Edit Student",
      text: `Do you want to edit details for ${student.name}?`,
      icon: "info",

    }).then((willEdit) => {
      if (willEdit) {
        router.push(`/editStudent/${student.id}`);
      }
    });
  };
  
  //handle delete
  const handleDelete = async (student: Student, event: React.MouseEvent) => {
    event.preventDefault(); // Prevent context menu
    const confirmDelete = await swal({
      title: "Delete Student",
      text: `Are you sure you want to delete ${student.name}?`,
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    });
  
    if (confirmDelete) {
      try {
        // API call to delete the student
        const response = await fetch(`/api/students?id=${student.id}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          swal("Deleted!", `${student.name} has been deleted.`, "success");
  
          // Update the students state to remove the deleted student
          setStudents((prevStudents) =>
            prevStudents.filter((s) => s.id !== student.id)
          );
          setFilteredStudents((prevStudents) =>
            prevStudents.filter((s) => s.id !== student.id)
          );
        } else {
          const errorData = await response.json();
          swal("Error!", errorData.message || "Failed to delete student.", "error");
        }
      } catch (error) {
        swal("Error!", "Something went wrong while deleting the student.", "error");
      }
    }
  };
  
  
  
  

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-6 px-4 bg-gray-200">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search your course or student"
            className="border p-2 rounded w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center space-x-4">
            <div className="p-2 flex space-x-8 items-center">
              <MdHelpOutline className="w-6 h-6 text-gray-600" />
              <LuMessageSquareMore className="w-6 h-6 text-gray-600" />
              <LuSettings2 className="w-6 h-6 text-gray-600" />
              <IoIosNotificationsOutline className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="/profile.avif"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium text-gray-700">Adeline H. Dancy</span>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="bg-white p-2 mb-4 flex justify-between">
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
                <option value="CBSE 10">CBSE 10</option>
              </select>
            </div>

            <button
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => router.push("/addStudent")}
            >
              + Add new Student
            </button>
          </div>

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
                <tr
                  key={student.id}
                  className="hover:bg-gray-100"
                  onDoubleClick={() => handleEdit(student)}
                  onContextMenu={(e) => handleDelete(student, e)}
                >
                  <td className="border-t p-2">{student.name}</td>
                  <td className="border-t p-2">{student.cohort}</td>
                  <td className="border-t p-2">{student.course}</td>
                  <td className="border-t p-2">
                    {new Date(student.dateJoined).toLocaleDateString()}
                  </td>
                  <td className="border-t p-2">
                    {new Date(student.lastLogin).toLocaleString()}
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
