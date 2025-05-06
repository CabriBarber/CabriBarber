
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

  const horariosOcupados = ocupadosSnapshot.docs.map(doc => doc.data().hora);

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
