import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PatientForm from "./pages/PatientForm";
import Assignment from "./pages/Assignment";
import BookAppointment from "./pages/BookAppointment";



function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Assignment />} />
        <Route path="/book" element={<BookAppointment />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;