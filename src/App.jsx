import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Students from "./pages/Students";
import Subjects from "./pages/Subjects";
import Grades from "./pages/Grades";
import Report from "./pages/Report";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/students" element={<Students />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;