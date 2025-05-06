
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

  const ocupadosSnapshot = await db.collection("turnos")
    .where("fecha", "==", fecha)
    .get();

  const horariosOcupados = ocupadosSnapshot;

  const horarios = [];
  let start = new Date();
  start.setHours(10, 0, 0, 0);
  const end = new Date();
  end.setHours(21, 0, 0, 0);

  while (start <= end) {
    horarios.push(new Date(start));
    start.setMinutes(start.getMinutes() + 30);
  }

  const ahora = new Date();
  horarios.forEach(horario => {
    const horaTexto = horario.toTimeString().substring(0, 5);
    const option = document.createElement("option");
    option.value = horaTexto;
    option.textContent = horaTexto;

    const ocupado = horariosOcupados.docs.some(doc => doc.data().hora === horaTexto);
    const pasada = fechaSeleccionada.toDateString() === hoyDate.toDateString() && horario < ahora;

    if (ocupado || pasada) {
      option.disabled = true;
      option.style.textDecoration = "line-through";
    }

    horaSelect.appendChild(option);
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
