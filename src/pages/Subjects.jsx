import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    subject_code: "",
    subject_name: "",
    instructor: "",
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  async function fetchSubjects() {
    const { data, error } = await supabase.from("subjects").select("*");
    if (error) console.error("Fetch error:", error);
    else setSubjects(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editMode) {
      const { error } = await supabase
        .from("subjects")
        .update({
          subject_code: formData.subject_code,
          subject_name: formData.subject_name,
          instructor: formData.instructor,
        })
        .eq("id", formData.id);
      if (error) console.error("Update error:", error);
    } else {
      const { error } = await supabase.from("subjects").insert([
        {
          subject_code: formData.subject_code,
          subject_name: formData.subject_name,
          instructor: formData.instructor,
        },
      ]);
      if (error) console.error("Insert error:", error);
    }

    setFormData({
      id: null,
      subject_code: "",
      subject_name: "",
      instructor: "",
    });
    setEditMode(false);
    setModalOpen(false);
    fetchSubjects();
  }

  async function deleteSubject(id) {
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (error) console.error("Delete error:", error);
    else fetchSubjects();
  }

  function openEditModal(subject) {
    setFormData({
      id: subject.id,
      subject_code: subject.subject_code,
      subject_name: subject.subject_name,
      instructor: subject.instructor,
    });
    setEditMode(true);
    setModalOpen(true);
  }

  return (
    <div className="p-6">
      {/* Add navigation bar */}
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

      <h1 className="text-2xl font-bold mb-4">Subjects</h1>
      <button
        onClick={() => {
          setModalOpen(true);
          setEditMode(false);
          setFormData({
            id: null,
            subject_code: "",
            subject_name: "",
            instructor: "",
          });
        }}
        className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
      >
        Add Subject
      </button>

      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border">Code</th>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Instructor</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.id} className="border-t hover:bg-gray-50">
              <td className="p-3 border">{subject.subject_code}</td>
              <td className="p-3 border">{subject.subject_name}</td>
              <td className="p-3 border">{subject.instructor}</td>
              <td className="p-3 border space-x-2">
                <button
                  onClick={() => openEditModal(subject)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSubject(subject.id)}
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
              {editMode ? "Edit Subject" : "Add Subject"}
            </h2>

            <div>
              <label className="block text-sm font-medium mb-1">Subject Code</label>
              <input
                type="text"
                value={formData.subject_code}
                onChange={(e) =>
                  setFormData({ ...formData, subject_code: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject Name</label>
              <input
                type="text"
                value={formData.subject_name}
                onChange={(e) =>
                  setFormData({ ...formData, subject_name: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Instructor</label>
              <input
                type="text"
                value={formData.instructor}
                onChange={(e) =>
                  setFormData({ ...formData, instructor: e.target.value })
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