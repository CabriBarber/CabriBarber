
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

  // Limpiar opciones anteriores
  horaSelect.innerHTML = "<option value=''>Seleccioná un horario</option>";

  // Obtener turnos ocupados de Firebase
  const ocupadosSnapshot = await db.collection("turnos")
    .where("fecha", "==", fecha)
    .get();

  const horariosOcupados = ocupadosSnapshot.docs.map(doc => doc.data().hora);

  // Generar todos los horarios posibles
  for (let h = 10; h < 21; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      const horaCompleta = `${hour}:${minute}`;
      
      // Formatear a AM/PM
      const date = new Date(`${fecha}T${horaCompleta}`);
      const options = { hour: 'numeric', minute: '2-digit', hour12: true };
      const horaAMPM = date.toLocaleTimeString('en-US', options);

      let deshabilitado = false;
      let texto = horaAMPM;

      // Marcar como pasado si la fecha es hoy y el horario ya pasó
      if (fecha === hoy && date < hoyDate) {
        deshabilitado = true;
        texto += " (Pasado)";
      }

      // Marcar como ocupado si ya está reservado
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
