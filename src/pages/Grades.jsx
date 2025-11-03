import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import { PDFViewer } from "@react-pdf/renderer";
import Report from "./Report";
import { askAI } from "../lib/ai";

export default function Grades() {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    student_id: "",
    prelim: "",
    midterm: "",
    semifinal: "",
    final: "",
  });

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) fetchGrades(selectedSubject);
    else setGrades([]);
  }, [selectedSubject]);

  async function fetchStudents() {
    const { data, error } = await supabase.from("students").select("id, first_name, last_name");
    if (error) console.error("Student fetch error:", error);
    else setStudents(data || []);
  }

  async function fetchSubjects() {
    const { data, error } = await supabase.from("subjects").select("id, subject_name");
    if (error) console.error("Subject fetch error:", error);
    else setSubjects(data || []);
  }

  async function fetchGrades(subjectId) {
    const { data, error } = await supabase
      .from("grades")
      .select("*")
      .eq("subject_id", subjectId);
    if (error) console.error("Grade fetch error:", error);
    else setGrades(data || []);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedSubject) {
      alert("Please select a subject before saving.");
      return;
    }

    const payload = {
      student_id: formData.student_id || null,
      subject_id: selectedSubject,
      prelim: formData.prelim === "" ? null : parseFloat(formData.prelim),
      midterm: formData.midterm === "" ? null : parseFloat(formData.midterm),
      semifinal: formData.semifinal === "" ? null : parseFloat(formData.semifinal),
      final: formData.final === "" ? null : parseFloat(formData.final),
    };

    try {
      if (editMode) {
        const { error } = await supabase.from("grades").update(payload).eq("id", formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("grades").insert([payload]);
        if (error) throw error;
      }

      // reset & refresh
      setFormData({ id: null, student_id: "", prelim: "", midterm: "", semifinal: "", final: "" });
      setEditMode(false);
      setModalOpen(false);
      fetchGrades(selectedSubject);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save grade: " + (err.message || err));
    }
  }

  async function deleteGrade(id) {
    const { error } = await supabase.from("grades").delete().eq("id", id);
    if (error) console.error("Delete error:", error);
    else fetchGrades(selectedSubject);
  }

  function openEditModal(grade) {
    setFormData({
      id: grade.id,
      student_id: grade.student_id ?? "",
      prelim: grade.prelim ?? "",
      midterm: grade.midterm ?? "",
      semifinal: grade.semifinal ?? "",
      final: grade.final ?? "",
    });
    setEditMode(true);
    setModalOpen(true);
  }

  async function generateAnalysis() {
    if (!selectedSubject) {
      alert("Please select a subject first.");
      return;
    }

    try {
      // fetch latest grades and students for the selected subject
      const { data: gradesData, error: gradesErr } = await supabase
        .from("grades")
        .select("*")
        .eq("subject_id", selectedSubject);
      if (gradesErr) throw gradesErr;

      const { data: studentsData, error: studentsErr } = await supabase
        .from("students")
        .select("id, first_name, last_name");
      if (studentsErr) throw studentsErr;

      // build payload for the AI (stringified)
      const payload = {
        subjectId: selectedSubject,
        students: studentsData || [],
        grades: gradesData || [],
      };

      const prompt = JSON.stringify(payload);

      const aiText = await askAI(prompt); // askAI returns text

      let parsed;
      try {
        parsed = JSON.parse(aiText);
      } catch {
        // fallback: AI returned plain text, wrap it
        parsed = {
          analysis: aiText,
          passedStudents: [],
          failedStudents: [],
        };
      }

      setAnalysisData(parsed);
    } catch (err) {
      console.error("AI analysis error:", err);
      alert("AI analysis failed: " + (err.message || err));
    }
  }

  return (
    <div className="p-6">
      {/* Navigation */}
      <div className="flex gap-4 mb-6">
        <Link to="/" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium">Home</Link>
        <Link to="/students" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium">Students</Link>
        <Link to="/subjects" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium">Subjects</Link>
        <Link to="/grades" className="px-4 py-2 bg-gray-300 rounded text-sm font-medium font-semibold">Grades</Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">Grades</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Subject</label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full max-w-md p-2 border rounded"
        >
          <option value="">Choose subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.subject_name}</option>
          ))}
        </select>
      </div>

      {selectedSubject && (
        <>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => {
                setModalOpen(true);
                setEditMode(false);
                setFormData({
                  id: null,
                  student_id: "",
                  prelim: "",
                  midterm: "",
                  semifinal: "",
                  final: "",
                });
              }}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
            >
              Add Grade
            </button>

            <button
              onClick={generateAnalysis}
              className="ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Generate AI Analysis Report
            </button>
          </div>

          <table className="w-full mt-6 border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Student</th>
                <th className="p-3 border">Prelim</th>
                <th className="p-3 border">Midterm</th>
                <th className="p-3 border">Semifinal</th>
                <th className="p-3 border">Final</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => {
                const student = students.find((s) => s.id === grade.student_id);
                return (
                  <tr key={grade.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 border">{student ? `${student.first_name} ${student.last_name}` : "—"}</td>
                    <td className="p-3 border">{grade.prelim}</td>
                    <td className="p-3 border">{grade.midterm}</td>
                    <td className="p-3 border">{grade.semifinal}</td>
                    <td className="p-3 border">{grade.final}</td>
                    <td className="p-3 border space-x-2">
                      <button onClick={() => openEditModal(grade)} className="text-blue-500 hover:underline">Edit</button>
                      <button onClick={() => deleteGrade(grade.id)} className="text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {analysisData && (
            <div className="mt-6">
              <PDFViewer width="100%" height="600">
                <Report {...analysisData} />
              </PDFViewer>
            </div>
          )}
        </>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
          >
            <h2 className="text-xl font-semibold">{editMode ? "Edit Grade" : "Add Grade"}</h2>

            <div>
              <label className="block text-sm font-medium mb-1">Student</label>
              <select
                value={formData.student_id}
                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.first_name} {s.last_name}
                  </option>
                ))}
              </select>
            </div>

            {["prelim", "midterm", "semifinal", "final"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)} Grade
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setEditMode(false);
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
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