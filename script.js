
const horariosContainer = document.getElementById('horarios');
const fechaInput = document.getElementById('fecha');
let horaSeleccionada = null;

const webAppURL = 'https://script.google.com/macros/s/AKfycbyK2POKBwuXz2ryV4jCrroA4E6bHmQSxTXLwIxLOVYCzYVLcHdYU0IKh2XSH6XkcTxN/exec';

const generarHoras = () => {
  horariosContainer.innerHTML = '';
  const fecha = fechaInput.value;
  if (!fecha) return;

  for (let h = 11; h <= 21; h++) {
    ["00", "30"].forEach(min => {
      if (h === 21 && min === "30") return;
      const hora = `${h.toString().padStart(2, '0')}:${min}`;
      const btn = document.createElement('button');
      btn.className = "hora-btn";
      btn.innerText = hora;
      btn.onclick = () => {
        document.querySelectorAll('.hora-btn').forEach(b => b.classList.remove('seleccionado'));
        btn.classList.add('seleccionado');
        horaSeleccionada = hora;
      };
      horariosContainer.appendChild(btn);
    });
  }
};

fechaInput.addEventListener('change', generarHoras);

document.getElementById('formulario').addEventListener('submit', function(e) {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const servicio = document.getElementById('servicio').value;
  const fecha = fechaInput.value;

  if (!horaSeleccionada) {
    alert("Seleccioná un horario disponible");
    return;
  }

  const datos = {
    nombre,
    servicio,
    fecha,
    hora: horaSeleccionada
  };

  fetch(webAppURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  }).then(response => {
    document.getElementById('mensaje-exito').style.display = 'block';
    setTimeout(() => {
      document.getElementById('mensaje-exito').style.display = 'none';
    }, 4000);
    const mensaje = `Nuevo turno reservado:\nNombre: ${nombre}\nServicio: ${servicio}\nFecha: ${fecha}\nHora: ${horaSeleccionada}`;
    const whatsappURL = 'https://wa.me/5491157487583?text=' + encodeURIComponent(mensaje);
    window.open(whatsappURL, '_blank');
    generarHoras();
  }).catch(error => {
    console.error('Error:', error);
    alert('Hubo un error al reservar el turno. Intentalo nuevamente.');
  });
});
