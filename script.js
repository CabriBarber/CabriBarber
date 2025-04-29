
const horariosContainer = document.getElementById('horarios');
const fechaInput = document.getElementById('fecha');
let horaSeleccionada = null;

// Función para obtener los turnos ocupados desde Firestore
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

  for (let h = 11; h <= 21; h++) {
    ["00", "30"].forEach(min => {
      if (h === 21 && min === "30") return;
      const hora = (h < 10 ? "0" : "") + h + ":" + min;
      const id = fecha + " " + hora;
      const ocupado = ocupados[id];

      const btn = document.createElement('button');
      btn.className = "hora-btn";
      btn.innerText = hora;
      if (ocupado) {
        btn.classList.add("ocupado");
        btn.disabled = true;
      } else {
        btn.onclick = () => {
          document.querySelectorAll('.hora-btn').forEach(b => b.classList.remove('seleccionado'));
          btn.classList.add('seleccionado');
          horaSeleccionada = hora;
        };
      }
      horariosContainer.appendChild(btn);
    });
  }
};

document.getElementById('reservar-btn').addEventListener('click', async () => {
  const nombre = document.getElementById('nombre').value;
  const fecha = fechaInput.value;

  if (!nombre || !fecha || !horaSeleccionada) {
    alert("Por favor completá todos los campos y seleccioná una hora.");
    return;
  }

  try {
    await db.collection("turnos").add({
      nombre: nombre,
      fecha: fecha,
      hora: horaSeleccionada
    });
    alert("¡Turno reservado con éxito!");
    generarHoras();  // refresca los botones
  } catch (error) {
    console.error("Error al reservar el turno:", error);
    alert("Hubo un error al reservar el turno.");
  }
});

fechaInput.addEventListener('change', generarHoras);
