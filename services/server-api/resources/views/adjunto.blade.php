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
                <strong>Saludos, {{ $information['estudiante'] }} </strong></span>
                <br><br><br>
                <p>Por haber alcanzado una calificación de <strong>{{ $information['puntos_obetnidos'] }}</strong> sobre <strong>{{ $information['puntos_totales'] }}</strong> , en el curso:</p>
                <p><strong>{{ $information['curso'] }}</strong></p>
                <p>Realizado del <strong>{{ $information['fecha_inicio'] }}</strong> al <strong>{{ $information['fecha_fin'] }}</strong> con una duración de <strong>{{ $information['horas'] }}</strong> horas.</p>
                <p>Adjuntamos al presente su certificado de <strong>{{ $information['tipo_certificado'] }}</strong>.</p>
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
