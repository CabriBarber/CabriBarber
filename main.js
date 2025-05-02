
// Inicializar Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBlJvTey3YXLMr0lVyUGzlcYhiFGzAFWN0",
  authDomain: "cabriweb.firebaseapp.com",
  projectId: "cabriweb",
  storageBucket: "cabriweb.firebasestorage.app",
  messagingSenderId: "1083893391061",
  appId: "1:1083893391061:web:14c6fd57798d3705f90c5c",
  measurementId: "G-686H031B6Z"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Fecha mínima: hoy
const fechaInput = document.getElementById("fecha");
const hoy = new Date().toISOString().split("T")[0];
fechaInput.min = hoy;

// Generar horarios: 10:30 a 21:00 cada 30min
const horaSelect = document.getElementById("hora");
for (let h = 10; h <= 20; h++) {
  ["30", "00"].forEach(min => {
    if (h === 10 && min === "00") return;
    const hora = `${h.toString().padStart(2, '0')}:${min}`;
    const option = document.createElement("option");
    option.value = hora;
    option.textContent = hora;
    horaSelect.appendChild(option);
  });
}

// Enviar turno por WhatsApp y guardar en Firebase
document.getElementById("turnoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const servicio = document.getElementById("servicio").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;

  const turno = { nombre, servicio, fecha, hora };
  await db.collection("turnos").add(turno);

  const mensaje = encodeURIComponent(`Nuevo turno Cabri Barber:%0ANombre: ${nombre}%0AServicio: ${servicio}%0AFecha: ${fecha}%0AHora: ${hora}`);
  const numero = "5491157487583";
  window.open(`https://wa.me/${numero}?text=${mensaje}`, "_blank");

  document.getElementById("mensaje").textContent = "¡Turno reservado y enviado por WhatsApp!";
  e.target.reset();
});
