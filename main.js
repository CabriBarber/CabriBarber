
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
  const hoyDate = new Date();
  const fechaSeleccionada = new Date(fecha + "T00:00");

  horaSelect.innerHTML = "<option value=''>Seleccioná un horario</option>";

  const ocupadosSnapshot = await db.collection("turnos")
    .where("fecha", "==", fecha)
    .get();

  const horariosOcupados = ocupadosSnapshot.docs.map(doc => doc.data().hora);

  for (let h = 10; h < 21; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      const horaCompleta = `${hour}:${minute}`;

      const horarioFecha = new Date(`${fecha}T${horaCompleta}`);

      const options = { hour: '2-digit', minute: '2-digit', hour12: false };
      const horaLabel = horarioFecha.toLocaleTimeString('es-AR', options).slice(0, 5);

      let deshabilitado = false;
      let texto = horaLabel;

      const esHoy = fecha === hoy;
      if (esHoy && horarioFecha < hoyDate) {
        deshabilitado = true;
        texto += " (Pasado)";
      }

      if (horariosOcupados.includes(horaCompleta)) {
        deshabilitado = true;
        texto += " (Ocupado)";
      }

      const option = document.createElement("option");
      option.value = horaCompleta;
      option.textContent = texto;

      if (deshabilitado) {
        option.disabled = true;
        option.style.textDecoration = "line-through";
        option.style.color = "#888";
      }

      horaSelect.appendChild(option);
    }
  }
});
