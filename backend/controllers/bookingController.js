import { saveAppointment, getAppointments } from "../services/bookingService.js";

export const bookAppointment = (req, res) => {
  try {
    const { name, phone, department, date } = req.body;

    const newAppointment = {
      id: Date.now(),
      name,
      phone,
      department,
      date,
    };

    saveAppointment(newAppointment);

    res.json({
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment" });
  }
};

export const getAllAppointments = (req, res) => {
  try {
    const appointments = getAppointments();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
};