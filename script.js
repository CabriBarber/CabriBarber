
const horariosContainer = document.getElementById('horarios');
const fechaInput = document.getElementById('fecha');
let horaSeleccionada = null;

const formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSeJqbI3642cqmoJM4nHHJxtSCMYJT88nFAXl8oxVbLdgpvZQQ/formResponse';
const fields = {
  nombre: 'entry.626323476',
  servicio: 'entry.1149814508',
  fecha: 'entry.879764160',
  hora: 'entry.237894632'
};

const generarHoras = () => {
  horariosContainer.innerHTML = '';
  const ocupados = JSON.parse(localStorage.getItem('turnos')) || {};
  const fecha = fechaInput.value;
  if (!fecha) return;

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

fechaInput.addEventListener('change', generarHoras);

document.getElementById('reservaForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const servicio = document.getElementById('servicio').value;
  const fecha = fechaInput.value;

  if (!horaSeleccionada) {
    alert("Seleccioná un horario disponible");
    return;
  }

  const turnoID = fecha + " " + horaSeleccionada;
  let ocupados = JSON.parse(localStorage.getItem('turnos')) || {};
  if (ocupados[turnoID]) {
    alert("Ese turno ya está reservado.");
    return;
  }

  ocupados[turnoID] = nombre + " - " + servicio;
  localStorage.setItem('turnos', JSON.stringify(ocupados));
  document.getElementById('mensajeExito').style.display = 'block';

  const mensaje = 'Nuevo turno reservado para Cabri Barber:\nNombre: ' + nombre + '\nServicio: ' + servicio + '\nDía: ' + fecha + '\nHora: ' + horaSeleccionada;
  const url = 'https://wa.me/5491157487583?text=' + encodeURIComponent(mensaje);
  window.open(url, '_blank');

  // Enviar a Google Form
  const formData = new FormData();
  formData.append(fields.nombre, nombre);
  formData.append(fields.servicio, servicio);
  formData.append(fields.fecha, fecha);
  formData.append(fields.hora, horaSeleccionada);

  fetch(formURL, {
    method: 'POST',
    mode: 'no-cors',
    body: formData
  });

  generarHoras();
  mostrarTurnosAdmin();
});

function mostrarTurnosAdmin() {
  const turnosDiv = document.getElementById('turnosOcupados');
  turnosDiv.innerHTML = '<h3>Turnos Reservados</h3>';
  const ocupados = JSON.parse(localStorage.getItem('turnos')) || {};

  Object.keys(ocupados).forEach(turno => {
    const div = document.createElement('div');
    div.className = 'turno ocupado';
    div.innerText = turno + " - " + ocupados[turno];

    const nombre = document.getElementById('nombre').value;
    if (nombre === 'admin123') {
      const btn = document.createElement('button');
      btn.innerText = 'Eliminar';
      btn.className = 'delete-btn';
      btn.onclick = () => {
        delete ocupados[turno];
        localStorage.setItem('turnos', JSON.stringify(ocupados));
        generarHoras();
        mostrarTurnosAdmin();
      };
      div.appendChild(btn);
    }

    turnosDiv.appendChild(div);
  });
}

document.getElementById('nombre').addEventListener('input', () => {
  mostrarTurnosAdmin();
});

