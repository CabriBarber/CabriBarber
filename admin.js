// admin.js
document.addEventListener('DOMContentLoaded', async () => {
  const tbodyTurnos = document.getElementById('tbodyTurnos');

  try {
    const snapshot = await db.collection('turnos').get();
    
    if (snapshot.empty) {
      tbodyTurnos.innerHTML = '<tr><td colspan="5">No hay turnos reservados todavía.</td></tr>';
      return;
    }

    snapshot.forEach(doc => {
      const turno = doc.data();
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${turno.nombre}</td>
        <td>${turno.servicio}</td>
        <td>${turno.fecha}</td>
        <td>${turno.hora}</td>
        <td><button class="btn" onclick="eliminarTurno('${doc.id}')">Eliminar</button></td>
      `;

      tbodyTurnos.appendChild(tr);
    });

  } catch (error) {
    console.error('Error al traer turnos:', error);
    tbodyTurnos.innerHTML = '<tr><td colspan="5">Error cargando turnos.</td></tr>';
  }
});

async function eliminarTurno(id) {
  if (confirm('¿Estás seguro que querés eliminar este turno?')) {
    await db.collection('turnos').doc(id).delete();
    alert('Turno eliminado.');
    window.location.reload(); // Recarga la página para actualizar la lista
  }
}