$( document ).ready(function() {
    onInit();
});

let moodle_url= 'http://localhost:9090/moodle/webservice/rest/server.php';
let api_url= 'http://localhost:9095/';
let token = '';
let matriculacion_panel;
let certificados_panel;
let categories = [];
let courses = [];
let student_id_selected = 0;
let student_email_selected = '';
let student_fullname_selected = '';
let appName = 'NYL Capacitaciones';

function onInit() {
    token = sessionStorage.getItem('token');
    matriculacion_panel = document.getElementById('matriculacion_panel');
    certificados_panel = document.getElementById('certificados_panel');
    build_countries();
    build_categories();
}

function sendMail(tipoMail, email, subject, information) {
    const info = {
        tipoMail: tipoMail,
        email: email,
        subject: subject,
        information: information
    };
    $.post(api_url + '/enviar', JSON.stringify(info), function(data, status) {
        console.log(data);
    });
}

function enviar_credenciales(email, email_alias, userName, password) {
    const information = {
        para: email_alias,
        appName: appName,
        username: userName,
        password: password
    };
    sendMail('mail', email, appName + ' - Creación de cuenta', information);
}

function enviar_matricula(email, email_alias, curso) {
    const information = {
        para: email_alias,
        appName: appName,
        curso: curso
    };
    sendMail('matricula', email, appName + ' - Matrícula - ' + curso, information);
}

function enviar_certificado(email, email_alias, pdfBase64, puntaje, curso) {
    const information = {
        para: email_alias,
        appName: appName,
        puntaje: puntaje,
        curso: curso,
        tipo_certificado: tipo_certificado,
        pdfBase64: pdfBase64
    };
    sendMail('adjunto', email, appName + ' - Certificado - ' + curso, information);
}

function build_categories() {
    let wsfunction = 'core_course_get_categories';
    $.get(moodle_url + '?wstoken=' + token + '&moodlewsrestformat=json&wsfunction='+wsfunction, function(data, status){
        categories = data;
        build_cursos();
    });
}

function build_cursos() {
    let wsfunction = 'core_course_get_courses';
    $.get(moodle_url + '?wstoken=' + token + '&moodlewsrestformat=json&wsfunction='+wsfunction, function(data, status){
        courses = data;
        cursos_list = document.getElementById('cursos_list');
        let content = '<label>Curso</label>';
        content += '<select data-role="select" onchange="course_selected()" id="course_selected">';
        content += '        <option value="-1" selected disabled>Seleccione</option>';
        categories.forEach(category => {
            content += '    <optgroup label="'+ category.name +'">';
            courses.forEach(course => {
                if (course.categoryid == category.id) {
                    content += '        <option value="'+ course.id +'">'+ course.shortname + ' | ' + course.displayname +'</option>';
                }
            });
            content += '    </optgroup>';
        });
        content += '  </select>';
        content += '  <button class="button info" id="enrolled_users" style="display:none;" onclick="get_enrolled_users()"><span class="mif-users"></span> Estudiantes Matriculados</button>';
        content += '  <small id="course_description"></small>';
        cursos_list.innerHTML = content;
    });
}

function course_selected() {
    selected_id = document.getElementById('course_selected').value;
    if (selected_id == -1) {
        return;
    }
    let encontrado = false;
    courses.forEach(course => {
        if (course.id == selected_id) {
            document.getElementById('course_description').innerHTML = course.summary;
            encontrado = true;
        }
    });
    if (encontrado) {
        document.getElementById('nuevo_estudiante_panel').style.display = "block";
        document.getElementById('enrolled_users').style.display = "block";
        document.getElementById('students_tabs').style.display = "block";
        document.getElementById('new_student_tab').classList.remove('primary');
        document.getElementById('old_student_tab').classList.remove('primary');
        document.getElementById('new_student_tab').classList.remove('secondary');
        document.getElementById('old_student_tab').classList.remove('secondary');
        document.getElementById('new_student_tab').classList.add('primary');
        document.getElementById('old_student_tab').classList.add('secondary');
    } else {
        document.getElementById('nuevo_estudiante_panel').style.display = "none";
        document.getElementById('enrolled_users').style.display = "none";
        document.getElementById('students_tabs').style.display = "none";
    }
}

function nuevoEstudiante() {
    document.getElementById('nuevo_estudiante_panel').style.display = "block";
    document.getElementById('existente_estudiante_panel').style.display = "none";
    document.getElementById('new_student_tab').classList.remove('secondary');
    document.getElementById('new_student_tab').classList.add('primary');
    document.getElementById('old_student_tab').classList.remove('primary');
    document.getElementById('old_student_tab').classList.add('secondary');
}

function existenteEstudiante() {
    document.getElementById('nuevo_estudiante_panel').style.display = "none";
    document.getElementById('existente_estudiante_panel').style.display = "block";
    document.getElementById('old_student_tab').classList.remove('secondary');
    document.getElementById('old_student_tab').classList.add('primary');
    document.getElementById('new_student_tab').classList.remove('primary');
    document.getElementById('new_student_tab').classList.add('secondary');
}

function get_student() {
    let wsfunction = 'core_user_get_users';
    let criteria = document.getElementById('criteria').value;
    let users_email = [];
    let users_username = [];
    let student_data = document.getElementById('student_data');
    student_id_selected = 0;
    student_data.innerHTML = '';
    comilla = "'";
    $.get(moodle_url + '?wstoken=' + token + '&moodlewsrestformat=json&wsfunction='+wsfunction+'&criteria[0][key]=email&criteria[0][value]=' + criteria, function(data, status){
        users_email = data.users;
        users_email.forEach(user_email => {
            student_data.innerHTML += '<tr onclick="select_student(' + user_email.id + ', ' + comilla + user_email.email + comilla  + ', ' + comilla + user_email.fullname + comilla + ')"><td style="text-align: right;"><span class="mif-play mif fg-blue" style="display:none;" id="st_' + user_email.id + '"></span></td><td>' + user_email.city + '</td><td>' + user_email.fullname + '</td><td>' + user_email.email + '</td></tr>';
        });
    });
    $.get(moodle_url + '?wstoken=' + token + '&moodlewsrestformat=json&wsfunction='+wsfunction+'&criteria[0][key]=username&criteria[0][value]=' + criteria, function(data, status){
        users_username = data.users;
        users_username.forEach(user_username => {
            student_data.innerHTML += '<tr onclick="select_student(' + user_username.id + ', ' + comilla + user_username.email + comilla + ', ' + comilla + user_username.fullname + comilla + ')"><td style="text-align: right;"><span class="mif-play mif fg-blue" style="display:none;" id="st_' + user_username.id + '"></span></td><td>' + user_username.city + '</td><td>' + user_username.fullname + '</td><td>' + user_username.email + '</td></tr>'; 
        });
    });
}

function select_student(id, email, fullname) {
    if (student_id_selected != 0) {
        document.getElementById('st_' + student_id_selected).style.display = "none";
    }
    document.getElementById('st_' + id).style.display = "block";
    student_id_selected = id;
    student_email_selected = email;
    student_fullname_selected = fullname;
}

function enrollExistsStudent() {
    if (student_id_selected != 0) {
        matricular_estudiante(student_id_selected, student_email_selected, student_fullname_selected);
    } else {
        Swal.fire({
            title: 'Matriculación',
            text: 'Debe seleccionar un estudiante existente',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

function build_countries() {
    let list = '<option value="Seleccione..." selected disabled>Seleccione...</option>';
    countries.sort( (a,b ) => {
        if (a.toUpperCase() < b.toUpperCase()) {
            return -1;
        }
        if (a.toUpperCase() > b.toUpperCase()) {
            return 1;
        }
        return 0;
    });
    countries.forEach(country => {
        list += '<option value="' + country + '">' + country + '</option>';
    });
    let content = '<label>País</label>';
    content += '<select data-role="select" id="countries_select">' + list + '</select>';
    document.getElementById('country').innerHTML = content;
}

function matriculacion() {
    certificados_panel.style.display = "none";
    matriculacion_panel.style.display = "block";
}

function certificados() {
    matriculacion_panel.style.display = "none";
    certificados_panel.style.display = "block";
}

function exit() {
    sessionStorage.clear();
    window.location.href = "./../login/login.html";
}

function createStudent(identification, firstname, lastname, email, main_phone, secondary_phone, countries_select, city) {
    let student = {
        username: identification, 
        password: password_generator(),
        firstname: firstname, 
        lastname: lastname,
        email: email, 
        phone1: main_phone, 
        phone2: secondary_phone, 
        country: countries_select, 
        city: city
    };
    let pass = validateStudent(student);
    if (pass == false) {
        return;
    }
    let wsfunction = 'core_user_create_users';
    $.post(moodle_url + '?wstoken=' + token + '&moodlewsrestformat=json&wsfunction='+wsfunction, {users: [student]}, function(data, status){
        try {
            student_id = data[0].id;
            enviar_credenciales(student.email, student.firstname + ' ' + student.lastname, student.username, student.password);
            matricular_estudiante(student_id, student.email, student.firstname + ' ' + student.lastname);
        } catch (error) {
            Swal.fire({
                title: 'Matriculación',
                text: 'Error: ' + data.message,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function matricular_estudiante(student_id, email, fullname) {
    let wsfunction = 'enrol_manual_enrol_users';
    course_id = document.getElementById('course_selected').value;
    let enrolment = [{
        userid: student_id,
        courseid: course_id,
        roleid: 5
    }];
    let curso = '';
    courses.forEach(course => {
        if (course.id == course_id) {
           curso = course.displayname;
        }
    });
    $.post(moodle_url + '?wstoken=' + token + '&moodlewsrestformat=json&wsfunction='+wsfunction, {enrolments: enrolment}, function(data, status) {
        enviar_matricula(email, fullname, curso);
        Swal.fire({
            title: 'Matriculación',
            text: 'Estudiante matriculado satisfactoriamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            location.reload();
        });
    });
}

function validateStudent(student) {
    let pass = true;
    if (student.username == '') {
        pass = false;
    }
    if (student.firstname == '') {
        pass = false;
    }
    if (student.lastname == '') {
        pass = false;
    }
    if (student.email == '') {
        pass = false;
    }
    if (student.phone1 == '') {
        pass = false;
    }
    if (student.phone2 == '') {
        pass = false;
    }
    if (student.country == '') {
        pass = false;
    }
    if (student.city == '') {
        pass = false;
    }
    if (pass == false) {
        Swal.fire({
            title: 'Matriculación',
            text: 'Todos los campos del estudiante son requeridos.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
    return pass;
}

function get_enrolled_users() {
    selected_id = document.getElementById('course_selected').value;
    let wsfunction = 'core_enrol_get_enrolled_users';
    $.post(moodle_url + '?wstoken=' + token + '&moodlewsrestformat=json&wsfunction='+wsfunction, {courseid: selected_id}, function(data, status){
        list_html = '<div style="height: 200px; overflow-x: hidden; overflow-y: auto;"><table style="font-size: 12px; width: 100%;">';
        list_html += '<thead>';
        list_html += '<tr>';
        list_html += '<th>';
        list_html += 'Ciudad';
        list_html += '</th>';
        list_html += '<th>';
        list_html += 'Nombre Completo';
        list_html += '</th>';
        list_html += '<th>';
        list_html += 'Correo Electrónico';
        list_html += '</th>';
        list_html += '</tr>';
        list_html += '</thead>';
        list_html += '<tbody>';
        data.forEach(student => {
            list_html += '<tr>';
            list_html += '<td>';
            list_html += student.city;
            list_html += '</td>';
            list_html += '<td>';
            list_html += student.fullname;
            list_html += '</td>';
            list_html += '<td>';
            list_html += student.email;
            list_html += '</td>';
            list_html += '</tr>';
        });
        list_html += '</tbody>';
        list_html += '</table>';
        Swal.fire({
            title: 'Estudiantes Matriculados',
            icon: 'info',
            html: list_html,
            confirmButtonText: 'Aceptar',
        });
    });
}

function password_generator() {
    let toReturn = '';
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const special = '*!#¡=';
    const numbers = '0123456789';
    let pass_array = [];
    let index = 0;
    for (let i = 0; i<6; i++) {
        index = Math.floor(Math.random() * letters.length);
        if (i%2) {
            pass_array.push(letters.substring(index, index + 1));
        } else {
            pass_array.push(letters.substring(index, index + 1).toUpperCase());
        }
    }
    for (let i = 0; i<4; i++) {
        index = Math.floor(Math.random() * numbers.length);
        pass_array.push(numbers.substring(index, index + 1));
    }
    index = Math.floor(Math.random() * special.length);
    pass_array.push(special.substring(index, index + 1));
    while(pass_array.length > 0) {
        let item = Math.floor(Math.random() * pass_array.length);
        toReturn += pass_array[item];
        pass_array.splice(item, 1);
    }
    return toReturn;
}

function enviar_certificado() {
    let tipo_certificado = 'Aprobación';
    let estudiante = 'Luis David Salazar Loaiza';
    let puntos_obetnidos = '9.56';
    let puntos_totales = '10.00';
    let curso = 'EL MEJOR HIJO DEL AÑO';
    let fecha_inicio = '24/10/2020';
    let fecha_fin = '28/10/2020';
    let horas = '40';
    let firma_1 = 'Luis Alfonso Salazar Vaca';
    let cargo_1 = 'PAPI CASA PUENTE 2';
    let firma_2 = 'María Belén Loaiza Rodríguez';
    let cargo_2 = 'MAMI CASA PUENTE 2';
    const params = [
        {tipo_certificado: tipo_certificado},
        {estudiante: estudiante},
        {puntos_obetnidos: puntos_obetnidos},
        {puntos_totales: puntos_totales},
        {curso: curso},
        {fecha_inicio: fecha_inicio},
        {fecha_fin: fecha_fin},
        {horas: horas},
        {firma_1: firma_1},
        {cargo_1: cargo_1},
        {firma_2: firma_2},
        {cargo_2: cargo_2}
    ];
    data = {
        template_id: 1,
        params: params, 
        qr: true, 
        qr_content: 'LSYSTEMS 2020'
    };
    $.post(api_url + '/download/template', JSON.stringify(data), function(data, status) {
        const info = {
            tipoMail: 'adjunto',
            email: 'luissalazarvaca1986@gmail.com',
            subject: 'certificado',
            information: {
                tipo_certificado: tipo_certificado,
                para: estudiante,
                appName: appName,
                estudiante: estudiante,
                puntos_obetnidos: puntos_obetnidos,
                puntos_totales: puntos_totales,
                curso: curso,
                fecha_inicio: fecha_inicio,
                fecha_fin: fecha_fin,
                horas: horas,
                firma_1: firma_1,
                cargo_1: cargo_1,
                firma_2: firma_2,
                cargo_2: cargo_2,
                pdfBase64: data
            }
        };        
        $.post(api_url + '/enviar', JSON.stringify(info), function(data, status) {
            console.log(data);
        });
    });
}

var countries = [
    'Andorra',
    'United Arab Emirates',
    'Afghanistan',
    'Antigua and Barbuda',
    'Anguilla',
    'Albania',
    'Armenia',
    'Angola',
    'Antarctica',
    'Argentina',
    'American Samoa',
    'Austria',
    'Australia',
    'Aruba',
    'Åland Islands',
    'Azerbaijan',
    'Bosnia and Herzegovina',
    'Barbados',
    'Bangladesh',
    'Belgium',
    'Burkina Faso',
    'Bulgaria',
    'Bahrain',
    'Burundi',
    'Benin',
    'Saint Barthélemy',
    'Bermuda',
    'Brunei Darussalam',
    'Bolivia (Plurinational State of)',
    'Bonaire, Sint Eustatius and Saba',
    'Brazil',
    'Bahamas',
    'Bhutan',
    'Bouvet Island',
    'Botswana',
    'Belarus',
    'Belize',
    'Canada',
    'Cocos (Keeling) Islands',
    'Congo (the Democratic Republic of the)',
    'Central African Republic',
    'Congo',
    'Switzerland',
    'Côte d\'Ivoire',
    'Cook Islands',
    'Chile',
    'Cameroon',
    'China',
    'Colombia',
    'Costa Rica',
    'Cuba',
    'Cabo Verde',
    'Curaçao',
    'Christmas Island',
    'Cyprus',
    'Czechia',
    'Germany',
    'Djibouti',
    'Denmark',
    'Dominica',
    'Dominican Republic',
    'Algeria',
    'Ecuador',
    'Estonia',
    'Egypt',
    'Western Sahara',
    'Eritrea',
    'Spain',
    'Ethiopia',
    'Finland',
    'Fiji',
    'Falkland Islands (Malvinas)',
    'Micronesia (Federated States of)',
    'Faroe Islands',
    'France',
    'Gabon',
    'United Kingdom',
    'Grenada',
    'Georgia',
    'French Guiana',
    'Guernsey',
    'Ghana',
    'Gibraltar',
    'Greenland',
    'Gambia',
    'Guinea',
    'Guadeloupe',
    'Equatorial Guinea',
    'Greece',
    'South Georgia and the South Sandwich Islands',
    'Guatemala',
    'Guam',
    'Guinea-Bissau',
    'Guyana',
    'Hong Kong',
    'Heard Island and McDonald Islands',
    'Honduras',
    'Croatia',
    'Haiti',
    'Hungary',
    'Indonesia',
    'Ireland',
    'Israel',
    'Isle of Man',
    'India',
    'British Indian Ocean Territory',
    'Iraq',
    'Iran (Islamic Republic of)',
    'Iceland',
    'Italy',
    'Jersey',
    'Jamaica',
    'Jordan',
    'Japan',
    'Kenya',
    'Kyrgyzstan',
    'Cambodia',
    'Kiribati',
    'Comoros',
    'Saint Kitts and Nevis',
    'Korea (the Democratic People\'s Republic of)',
    'Korea (the Republic of)',
    'Kuwait',
    'Cayman Islands',
    'Kazakhstan',
    'Lao People\'s Democratic Republic',
    'Lebanon',
    'Saint Lucia',
    'Liechtenstein',
    'Sri Lanka',
    'Liberia',
    'Lesotho',
    'Lithuania',
    'Luxembourg',
    'Latvia',
    'Libya',
    'Morocco',
    'Monaco',
    'Moldova (the Republic of)',
    'Montenegro',
    'Saint Martin (French part)',
    'Madagascar',
    'Marshall Islands',
    'North Macedonia',
    'Mali',
    'Myanmar',
    'Mongolia',
    'Macao',
    'Northern Mariana Islands',
    'Martinique',
    'Mauritania',
    'Montserrat',
    'Malta',
    'Mauritius',
    'Maldives',
    'Malawi',
    'Mexico',
    'Malaysia',
    'Mozambique',
    'Namibia',
    'New Caledonia',
    'Niger',
    'Norfolk Island',
    'Nigeria',
    'Nicaragua',
    'Netherlands',
    'Norway',
    'Nepal',
    'Nauru',
    'Niue',
    'New Zealand',
    'Oman',
    'Panama',
    'Peru',
    'French Polynesia',
    'Papua New Guinea',
    'Philippines',
    'Pakistan',
    'Poland',
    'Saint Pierre and Miquelon',
    'Pitcairn',
    'Puerto Rico',
    'Palestine, State of',
    'Portugal',
    'Palau',
    'Paraguay',
    'Qatar',
    'Réunion',
    'Romania',
    'Serbia',
    'Russian Federation',
    'Rwanda',
    'Saudi Arabia',
    'Solomon Islands',
    'Seychelles',
    'Sudan',
    'Sweden',
    'Singapore',
    'Saint Helena, Ascension and Tristan da Cunha',
    'Slovenia',
    'Svalbard and Jan Mayen',
    'Slovakia',
    'Sierra Leone',
    'San Marino',
    'Senegal',
    'Somalia',
    'Suriname',
    'South Sudan',
    'Sao Tome and Principe',
    'El Salvador',
    'Sint Maarten (Dutch part)',
    'Syrian Arab Republic',
    'Eswatini',
    'Turks and Caicos Islands',
    'Chad',
    'French Southern Territories',
    'Togo',
    'Thailand',
    'Tajikistan',
    'Tokelau',
    'Timor-Leste',
    'Turkmenistan',
    'Tunisia',
    'Tonga',
    'Turkey',
    'Trinidad and Tobago',
    'Tuvalu',
    'Taiwan',
    'Tanzania, the United Republic of',
    'Ukraine',
    'Uganda',
    'United States Minor Outlying Islands',
    'United States',
    'Uruguay',
    'Uzbekistan',
    'Holy See',
    'Saint Vincent and the Grenadines',
    'Venezuela (Bolivarian Republic of)',
    'Virgin Islands (British)',
    'Virgin Islands (U.S.)',
    'Viet Nam',
    'Vanuatu',
    'Wallis and Futuna',
    'Samoa',
    'Yemen',
    'Mayotte',
    'South Africa',
    'Zambia',
    'Zimbabwe'];