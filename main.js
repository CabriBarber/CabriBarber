
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

fechaInput.addEventListener("change", async () => {
  const fecha = fechaInput.value;
  const fechaSeleccionada = new Date(fecha);

  // Limpiar opciones anteriores
  horaSelect.innerHTML = "<option value=''>Seleccioná un horario</option>";

  // Generar todos los horarios posibles
  const horarios = [];
  for (let h = 10; h < 21; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hora = h.toString().padStart(2, "0");
      const minuto = m.toString().padStart(2, "0");
      horarios.push(`${hora}:${minuto}`);
    }
  }

  // Consultar horarios ocupados desde Firebase
  const snapshot = await db.collection("turnos")
    .where("fecha", "==", fecha)
    .get();

  const horariosOcupados = snapshot.docs.map(doc => doc.data().hora);

  // Mostrar todos los horarios, tachando los ya ocupados
  horarios.forEach(hora => {
    const option = document.createElement("option");
    option.value = hora;
    option.textContent = hora;
    if (horariosOcupados.includes(hora)) {
      option.disabled = true;
      option.textContent += " (Ocupado)";
      option.style.textDecoration = "line-through";
      option.style.color = "#888";
    }
    horaSelect.appendChild(option);
  });
});

// Guardar turno al enviar el formulario
const form = document.getElementById("turnoForm");

form.addEventListener("submit", async (e) => {

  const mensaje = `Nombre: ${nombre}\nservicio: ${servicio}\ndia: ${fecha}\nhora: ${hora}`;
  window.open("https://wa.me/5491157487583?text=" + encodeURIComponent(mensaje), "_blank");

  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const servicio = document.getElementById("servicio").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;

  if (!nombre || !servicio || !fecha || !hora) {
    alert("Por favor completá todos los campos.");
    return;
  }

  try {
    // Verificar que el turno no esté ocupado antes de guardar
    const snapshot = await db.collection("turnos")
      .where("fecha", "==", fecha)
      .where("hora", "==", hora)
      .get();

    if (!snapshot.empty) {
      alert("Ese horario ya está ocupado. Elegí otro.");
      return;
    }

    // Guardar en Firestore
    await db.collection("turnos").add({
      nombre,
      servicio,
      fecha,
      hora,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("¡Turno reservado con éxito!");

    const mensaje = `Nombre: ${nombre}\nservicio: ${servicio}\ndia: ${fecha}\nhora: ${hora}`;
    window.open("https://wa.me/5491157487583?text=" + encodeURIComponent(mensaje), "_blank");

    form.reset();
    horaSelect.innerHTML = "<option value=''>Seleccioná un horario</option>";
  } catch (error) {
    console.error("Error al guardar el turno:", error);
    alert("Ocurrió un error al reservar el turno.");
  }
});
