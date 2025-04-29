
const horariosContainer = document.getElementById('horarios');
const fechaInput = document.getElementById('fecha');
let horaSeleccionada = null;

const obtenerTurnosOcupados = async (fecha) => {
  const snapshot = await db.collection("turnos").where("fecha", "==", fecha).get();
  const ocupados = {};
  snapshot.forEach(doc => {
    const data = doc.data();
    ocupados[data.fecha + " " + data.hora] = true;
  });
  return ocupados;
};

const generarHoras = async () => {
  horariosContainer.innerHTML = '';
  const fecha = fechaInput.value;
  if (!fecha) return;

  const ocupados = await obtenerTurnosOcupados(fecha);
  const hoy = new Date();
  const esHoy = fecha === hoy.toISOString().split('T')[0];
  const horaActual = hoy.getHours() + hoy.getMinutes() / 60;

  const horas = [];

  // Generar horarios desde 10:30 hasta 21:30
  for (let h = 10; h <= 21; h++) {
    ["00", "30"].forEach(min => {
      if (h === 10 && min === "00") return; // Saltar 10:00, empezamos en 10:30
      const hora = (h < 10 ? "0" : "") + h + ":" + min;
      horas.push(hora);
    });
  }

  horas.forEach(hora => {
    const id = fecha + " " + hora;
    const ocupado = ocupados[id];

    const btn = document.createElement('button');
    btn.className = "hora-btn";
    btn.innerText = hora;

    const [hStr, mStr] = hora.split(":");
    const horaDecimal = parseInt(hStr) + (mStr === "30" ? 0.5 : 0);
    const vencido = esHoy && horaDecimal < horaActual;

    if (ocupado) {
      btn.classList.add("ocupado");
      btn.style.textDecoration = "line-through";
      btn.disabled = true;
    } else if (vencido) {
      btn.classList.add("vencido");
      btn.disabled = true;
    } else {
      btn.onclick = () => {
        document.querySelectorAll('.hora-btn.selected').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        horaSeleccionada = hora;
      };
    }

    horariosContainer.appendChild(btn);
  });
};

fechaInput.addEventListener('change', generarHoras);
