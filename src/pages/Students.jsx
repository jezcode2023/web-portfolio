import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    student_number: "",
    first_name: "",
    last_name: "",
    course: "",
    year_level: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    const { data, error } = await supabase.from("students").select("*");
    if (error) console.error("Fetch error:", error);
    else setStudents(data || []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editMode) {
      const { error } = await supabase
        .from("students")
        .update({
          student_number: formData.student_number,
          first_name: formData.first_name,
          last_name: formData.last_name,
          course: formData.course,
          year_level: formData.year_level,
        })
        .eq("id", formData.id);
      if (error) console.error("Update error:", error);
    } else {
      const { error } = await supabase.from("students").insert([
        {
          student_number: formData.student_number,
          first_name: formData.first_name,
          last_name: formData.last_name,
          course: formData.course,
          year_level: formData.year_level,
        },
      ]);
      if (error) console.error("Insert error:", error);
    }

    setFormData({
      id: null,
      student_number: "",
      first_name: "",
      last_name: "",
      course: "",
      year_level: "",
    });
    setEditMode(false);
    setModalOpen(false);
    fetchStudents();
  }

  async function deleteStudent(id) {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) console.error("Delete error:", error);
    else fetchStudents();
  }

  function openEditModal(student) {
    setFormData({
      id: student.id,
      student_number: student.student_number,
      first_name: student.first_name,
      last_name: student.last_name,
      course: student.course,
      year_level: student.year_level,
    });
    setEditMode(true);
    setModalOpen(true);
  }

  return (
    <div className="p-6">
      {/* navigation buttons as requested */}
      <div className="flex gap-4 mb-6">
        <Link
          to="/"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium"
        >
          Home
        </Link>
        <Link
          to="/students"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium"
        >
          Students
        </Link>
        <Link
          to="/subjects"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium"
        >
          Subjects
        </Link>
        <Link
          to="/grades"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium"
        >
          Grades
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">Students</h1>
      <button
        onClick={() => {
          setModalOpen(true);
          setEditMode(false);
          setFormData({
            id: null,
            student_number: "",
            first_name: "",
            last_name: "",
            course: "",
            year_level: "",
          });
        }}
        className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
      >
        Add Student
      </button>

      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border">Student #</th>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Course</th>
            <th className="p-3 border">Year</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-t hover:bg-gray-50">
              <td className="p-3 border">{student.student_number}</td>
              <td className="p-3 border">
                {student.first_name} {student.last_name}
              </td>
              <td className="p-3 border">{student.course}</td>
              <td className="p-3 border">{student.year_level}</td>
              <td className="p-3 border space-x-2">
                <button
                  onClick={() => openEditModal(student)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteStudent(student.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
          >
            <h2 className="text-xl font-semibold">
              {editMode ? "Edit Student" : "Add Student"}
            </h2>

            <div>
              <label className="block text-sm font-medium mb-1">Student Number</label>
              <input
                type="text"
                value={formData.student_number}
                onChange={(e) =>
                  setFormData({ ...formData, student_number: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Course</label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) =>
                  setFormData({ ...formData, course: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Year Level</label>
              <input
                type="number"
                value={formData.year_level}
                onChange={(e) =>
                  setFormData({ ...formData, year_level: parseInt(e.target.value || "0", 10) })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setEditMode(false);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              >
                {editMode ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}