document.addEventListener('DOMContentLoaded', function() {
  const tbodyTurnos = document.getElementById('tbodyTurnos');

  db.collection('turnos').get().then((querySnapshot) => {
    if (querySnapshot.empty) {
      tbodyTurnos.innerHTML = '<tr><td colspan="5">No hay turnos reservados todavía.</td></tr>';
      return;
    }

    querySnapshot.forEach((doc) => {
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
  }).catch((error) => {
    console.error("Error al traer turnos: ", error);
    tbodyTurnos.innerHTML = '<tr><td colspan="5">Error cargando turnos.</td></tr>';
  });
});

function eliminarTurno(id) {
  if (confirm('¿Estás seguro que querés eliminar este turno?')) {
    db.collection('turnos').doc(id).delete().then(() => {
      alert('Turno eliminado.');
      window.location.reload();
    }).catch((error) => {
      console.error("Error eliminando turno: ", error);
    });
  }
}