
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
  const hoyDate = new Date();
  horaSelect.innerHTML = "<option value=''>Seleccioná un horario</option>";

  const ocupadosSnapshot = await db.collection("turnos").where("fecha", "==", fecha).get();
  const horariosOcupados = ocupadosSnapshot.docs.map(doc => doc.data().hora);

  const ahora = new Date();
  const esHoy = fechaSeleccionada.toDateString() === hoyDate.toDateString();
  const horaActualDecimal = ahora.getHours() + ahora.getMinutes() / 60;

  const todosLosHorarios = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00"
  ];

  todosLosHorarios.forEach(hora => {
    const partes = hora.split(":");
    const horaDecimal = parseInt(partes[0]) + parseInt(partes[1]) / 60;

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
});

  });


  for (let h = 10; h <= 20; h++) {
    const horaTexto = h.toString().padStart(2, '0') + ":00";
    const opcion = document.createElement("option");
    opcion.value = horaTexto;
    opcion.textContent = horaTexto;

    const horaCompleta = new Date(fecha + "T" + horaTexto);
    const esPasada = fechaSeleccionada.toDateString() === hoyDate.toDateString() && horaCompleta < hoyDate;
    const estaOcupada = horariosOcupados.includes(horaTexto);

    if (esPasada || estaOcupada) {
      opcion.disabled = true;
      opcion.style.textDecoration = "line-through";
    }

    horaSelect.appendChild(opcion);
  }
});



document.getElementById("reservar").addEventListener("click", async () => {
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

  const mensaje = `Nombre: ${nombre}%0AServicio: ${servicio}%0AFecha: ${fecha}%0AHora: ${hora}`;
  const numero = "1157487583";
  const url = `https://wa.me/549${numero}?text=${mensaje}`;

  alert("¡Tu turno se reservó con éxito!");
  window.open(url, "_blank");
});



document.getElementById("reservar").addEventListener("click", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const servicio = document.getElementById("servicio").value;
  const hora = document.getElementById("hora").value;
  const fecha = document.getElementById("fecha").value;

  if (!nombre || !servicio || !hora || !fecha) {
    alert("Por favor completá todos los campos.");
    return;
  }

  document.getElementById("confNombre").textContent = nombre;
  document.getElementById("confServicio").textContent = servicio;
  document.getElementById("confHora").textContent = hora;
  document.getElementById("confFecha").textContent = fecha;

  document.getElementById("modalConfirmacion").style.display = "flex";
});

document.getElementById("btnConfirmarTurno").addEventListener("click", function() {
  const nombre = document.getElementById("nombre").value;
  const servicio = document.getElementById("servicio").value;
  const hora = document.getElementById("hora").value;
  const fecha = document.getElementById("fecha").value;

  const mensaje = `Hola ${nombre}, tu turno en CabriBarber está reservado:%0A- Servicio: ${servicio}%0A- Hora: ${hora}%0A- Día: ${fecha}`;
  const telefono = "5491122334455"; // Número de prueba

  window.open(`https://wa.me/${telefono}?text=${mensaje}`, "_blank");
  document.getElementById("modalConfirmacion").style.display = "none";
});
