let moodle_url= 'http://localhost:9090/moodle/login/token.php';
let service = 'inscripciones';

function tryLogin(username, password) {
    $.get(moodle_url + '?service=' + service + '&username=' + username + '&password='+password, function(data, status) {
        if (typeof data.token != 'undefined') {
            sessionStorage.setItem('token', data.token);
            window.location.href = "./../main/main.html";
        } else {
            Swal.fire({
                title: 'Credenciales Incorrectos',
                text: 'Los credenciales ingresados no son correctos',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            }).then((result) => {
                location.reload();
            });
        }
    });
}