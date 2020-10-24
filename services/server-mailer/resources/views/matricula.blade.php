<table width="556" cellspacing="0" cellpadding="0" border="0" bgcolor="#fafafa" align="center">
    <tbody>
        <tr>
            <blockquote>
                <h3 style="font-family:'Arial',Helvetica,sans-serif;color:#5f6062;"><strong> {{ $information['appName'] }}</strong></h3>
            </blockquote>
        </tr>
        <tr>
            <td>&nbsp;
            </td>
        </tr>
        <tr>
            <td style="font-family:'Arial',Helvetica,sans-serif;font-size:12px;color:#5f6062;">
                <blockquote><span style="font-family:'arial',Helvetica,sans-serif;font-size:13px;color:#5f6062;">
                <strong>Saludos, {{ $information['para'] }} </strong></span>
                <br><br><br>
                <p>Recibe un cordial saludo de {{ $information['appName'] }}.</p>
                <p>A través de este email notificamos que se encuentra matriculado en el curso <strong>{{ $information['curso'] }}</strong>.</p>
                <p>Para ingresar, haz click en el siguiente enlace:<br><br>
                <a href="http://localhost:9090/moodle/">
                    <img src="https://moodle.org/theme/image.php/moodleorg/theme/1600426962/moodle_logo_grayhat_small" alt="Moodle">
                </a></p><br>
                <p>Atentamente,</p>
                <p><strong> {{ $information['appName'] }} </strong></p>
                </blockquote>
            </td>
        </tr>
        <tr>
            <td>&nbsp;
            </td>
        </tr>
    </tbody>
</table>
