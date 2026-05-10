import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <h2>🏥 AI Hospital Assistant</h2>

      <div>
        <Link to="/">Chat</Link>
        <Link to="/book">Book Appointment</Link>
      </div>
    </div>
  );
}

export default Navbar;