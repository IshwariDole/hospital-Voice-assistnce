import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Assignment from "./pages/Assignment";
import Login from "./pages/Login";
import Doctors from "./pages/Doctors";
import ChatAssistant from "./ChatAssistant";
import Assistant from "./pages/Assistant";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Assignment />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/chat" element={<ChatAssistant />} />
        <Route path="/assistant" element={<Assistant />} />
      </Routes>
    </Router>
  );
}
