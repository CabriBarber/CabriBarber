// admin.js
document.addEventListener('DOMContentLoaded', async () => {
  const turnosLista = document.getElementById('turnosLista');

  try {
    const snapshot = await db.collection('turnos').get();
    
    if (snapshot.empty) {
      turnosLista.innerHTML += '<p>No hay turnos reservados todavía.</p>';
      return;
    }

    snapshot.forEach(doc => {
      const turno = doc.data();
      const div = document.createElement('div');
      div.classList.add('turno');

      div.innerHTML = `
        <p><strong>Nombre:</strong> ${turno.nombre}</p>
        <p><strong>Servicio:</strong> ${turno.servicio}</p>
        <p><strong>Fecha:</strong> ${turno.fecha}</p>
        <p><strong>Hora:</strong> ${turno.hora}</p>
        <button class="btn" onclick="eliminarTurno('${doc.id}')">Eliminar</button>
      `;

      turnosLista.appendChild(div);
    });

  } catch (error) {
    console.error('Error al traer turnos:', error);
    turnosLista.innerHTML += '<p>Error cargando turnos.</p>';
  }
});

async function eliminarTurno(id) {
  if (confirm('¿Estás seguro que querés eliminar este turno?')) {
    await db.collection('turnos').doc(id).delete();
    alert('Turno eliminado.');
    window.location.reload(); // Recarga la página para actualizar la lista
  }
}
