
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
const horaSelect = document.getElementById("hora");

// Configurar fecha mínima
const hoy = new Date().toISOString().split("T")[0];
fechaInput.min = hoy;

const todosLosHorarios = [
  "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00"
];

fechaInput.addEventListener("change", async () => {
  const fecha = fechaInput.value;
  const fechaSeleccionada = new Date(fecha);
  const hoyDate = new Date();
  hoyDate.setHours(0, 0, 0, 0);
  const esHoy = fechaSeleccionada.toDateString() === hoyDate.toDateString();

  horaSelect.innerHTML = "<option value=''>Seleccioná un horario</option>";

  try {
    const ocupadosSnapshot = await db.collection("turnos").where("fecha", "==", fecha).get();
    const horariosOcupados = ocupadosSnapshot.docs.map(doc => doc.data().hora);

    const ahora = new Date();
    const horaActualDecimal = ahora.getHours() + ahora.getMinutes() / 60;

    todosLosHorarios.forEach(hora => {
      const [h, m] = hora.split(":").map(Number);
      const horaDecimal = h + m / 60;

      if (esHoy && horaDecimal <= horaActualDecimal) return;

      const option = document.createElement("option");
      option.value = hora;
      option.textContent = horariosOcupados.includes(hora) ? hora + " - Ocupado" : hora;

      if (horariosOcupados.includes(hora)) {
        option.disabled = true;
        option.style.textDecoration = "line-through";
      }

      horaSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar los horarios:", error);
  }
});

// Reservar turno
document.getElementById("reservar").addEventListener("click", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const servicio = document.getElementById("servicio").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;

  if (!nombre || !servicio || !fecha || !hora) {
    alert("Por favor completá todos los campos.");
    return;
  }

  await db.collection("turnos").add({
    nombre,
    servicio,
    fecha,
    hora,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  document.getElementById("confNombre").textContent = nombre;
  document.getElementById("confServicio").textContent = servicio;
  document.getElementById("confHora").textContent = hora;
  document.getElementById("confFecha").textContent = fecha;
  document.getElementById("modalConfirmacion").style.display = "flex";
});

// Confirmar turno por WhatsApp
document.getElementById("btnConfirmarTurno").addEventListener("click", function() {
  const nombre = document.getElementById("nombre").value;
  const servicio = document.getElementById("servicio").value;
  const hora = document.getElementById("hora").value;
  const fecha = document.getElementById("fecha").value;

  const mensaje = `Hola ${nombre}, tu turno en CabriBarber está reservado:%0A- Servicio: ${servicio}%0A- Hora: ${hora}%0A- Día: ${fecha}`;
  const telefono = "5491122334455";

  window.open(`https://wa.me/${telefono}?text=${mensaje}`, "_blank");
  document.getElementById("modalConfirmacion").style.display = "none";
});
