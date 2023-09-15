// Obtén el pathname actual (la parte de la URL después del dominio)
const currentPage = window.location.pathname;

// Obtén los enlaces por sus IDs
const loginLink = document.getElementById('loginLink');
const registerLink = document.getElementById('registerLink');
const lineregister = document.getElementById('lineregister'); // Obtén el elemento de la línea
const linerlogin = document.getElementById('linelogin');
// Verifica si la página actual es "/login" o "/register" y agrega/quita clases CSS en consecuencia
if (currentPage === '/login') {
    loginLink.classList.add('active');
    registerLink.classList.remove('active');
    lineregister.classList.add('active');
    linerlogin.classList.remove('active');

} else if (currentPage === '/register') {
    registerLink.classList.add('active');
    loginLink.classList.remove('active');
    lineregister.classList.remove('active');
    linerlogin.classList.add('active');
}else if (currentPage === '/registerprofesional') {
    registerLink.classList.add('active');
    loginLink.classList.remove('active');
    lineregister.classList.remove('active');
    linerlogin.classList.add('active');
}


