const form = document.getElementById("bookingForm");
const list = document.getElementById("appointmentList");
const errorMsg = document.getElementById("errorMsg");

// Load saved appointments
document.addEventListener("DOMContentLoaded", loadAppointments);

// Handle booking
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const service = document.getElementById("service").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (!name || !service || !date || !time) {
    errorMsg.textContent = "All fields are required.";
    return;
  }

  const appointment = { name, service, date, time };

  if (isDuplicate(appointment)) {
    errorMsg.textContent = "This time slot is already booked.";
    return;
  }

  errorMsg.textContent = "";

  saveAppointment(appointment);
  displayAppointment(appointment);
  form.reset();
});

// Save to LocalStorage
function saveAppointment(appointment) {
  const appointments = getAppointments();
  appointments.push(appointment);
  localStorage.setItem("appointments", JSON.stringify(appointments));
}

// Load appointments
function loadAppointments() {
  getAppointments().forEach(displayAppointment);
}

// Get appointments
function getAppointments() {
  return JSON.parse(localStorage.getItem("appointments")) || [];
}

// Prevent duplicate bookings
function isDuplicate(newAppointment) {
  return getAppointments().some(a =>
    a.date === newAppointment.date &&
    a.time === newAppointment.time
  );
}

// Display appointment
function displayAppointment(appointment) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${appointment.name}</td>
    <td>${appointment.service}</td>
    <td>${appointment.date}</td>
    <td>${appointment.time}</td>
    <td class="delete">Cancel</td>
  `;

  row.querySelector(".delete").addEventListener("click", () => {
    removeAppointment(appointment);
    row.remove();
  });

  list.appendChild(row);
}

// Remove appointment
function removeAppointment(appointment) {
  let appointments = getAppointments();
  appointments = appointments.filter(a =>
    !(a.date === appointment.date && a.time === appointment.time)
  );
  localStorage.setItem("appointments", JSON.stringify(appointments));
}
