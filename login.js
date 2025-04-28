// login.js
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  
  const usuario = document.getElementById('usuario').value;
  const password = document.getElementById('password').value;

  if (usuario === 'cabri' && password === 'barber123') {
    window.location.href = 'admin.html'; // Si está bien, redirige al panel
  } else {
    alert('Usuario o contraseña incorrectos.');
  }
});
