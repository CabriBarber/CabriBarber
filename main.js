
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

const fechaInput = document.getElementById("fecha");
const hoy = new Date().toISOString().split("T")[0];
fechaInput.min = hoy;

const horaSelect = document.getElementById("hora");

// Validar domingos
fechaInput.addEventListener("change", async () => {
  const fechaSeleccionada = new Date(fechaInput.value);
  if (fechaSeleccionada.getDay() === 0) {
    alert("No se pueden reservar turnos los domingos.");
    fechaInput.value = "";
    horaSelect.innerHTML = "";
    return;
  }

  horaSelect.innerHTML = "";

  const snapshot = await db.collection("turnos")
    .where("fecha", "==", fechaInput.value)
    .get();

  const horariosOcupados = snapshot.docs.map(doc => doc.data().hora);

  for (let h = 10; h <= 20; h++) {
    ["30", "00"].forEach(min => {
      if (h === 10 && min === "00") return;
      const hora = `${h.toString().padStart(2, '0')}:${min}`;
      const option = document.createElement("option");
      option.value = hora;
      if (horariosOcupados.includes(hora)) {
        option.textContent = `${hora} (Ocupado)`;
        option.disabled = true;
        option.className = "text-gray-400";
      } else {
        option.textContent = hora;
      }
      horaSelect.appendChild(option);
    });
  }
});

document.getElementById("turnoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const servicio = document.getElementById("servicio").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;

  const turno = { nombre, servicio, fecha, hora };
  await db.collection("turnos").add(turno);

  const mensaje = encodeURIComponent(
    `CABRI BARBER

🧍 Nombre: ${nombre}
✂️ Servicio: ${servicio}
📅 Día: ${fecha}
⏰ Horario: ${hora}`
  );
  const numero = "5491157487583";
  window.open(`https://wa.me/${numero}?text=${mensaje}`, "_blank");

  // Feedback visual
  const boton = document.querySelector("button[type='submit']");
  boton.textContent = "Reservado ✔";
  boton.classList.remove("bg-green-500", "hover:bg-green-600");
  boton.classList.add("bg-red-600", "hover:bg-red-700");

  const mensajeEl = document.getElementById("mensaje");
  mensajeEl.textContent = "¡Tu turno fue reservado con éxito!";
  mensajeEl.classList.add("text-red-400", "font-bold");

  setTimeout(() => {
    mensajeEl.textContent = "";
    boton.textContent = "Reservar";
    boton.classList.remove("bg-red-600", "hover:bg-red-700");
    boton.classList.add("bg-green-500", "hover:bg-green-600");
  }, 3000);

  e.target.reset();
});
