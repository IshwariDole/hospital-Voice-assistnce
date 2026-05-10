import fs from "fs";

const FILE_PATH = "./data/appointments.json";

// Read all appointments
export const getAppointments = () => {
  const data = fs.readFileSync(FILE_PATH);
  return JSON.parse(data);
};

// Save new appointment
export const saveAppointment = (appointment) => {
  const appointments = getAppointments();
  appointments.push(appointment);
  fs.writeFileSync(FILE_PATH, JSON.stringify(appointments, null, 2));
};