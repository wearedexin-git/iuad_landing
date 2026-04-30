<?php
ob_start(); // buffer output: evita che warnings/notices di PHP contaminino il JSON
header('Content-Type: application/json; charset=UTF-8');

// CORS – necessario solo in sviluppo locale; su hosting stesso dominio non serve
$allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_end_clean();
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Metodo non consentito.']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

// ── Validazione campi obbligatori ──────────────────────────────────────────
$required = ['first_name', 'last_name', 'email', 'phone_number', 'how_you_knows'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        ob_end_clean();
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => "Campo obbligatorio mancante: $field"]);
        exit();
    }
}

// ── Payload API ────────────────────────────────────────────────────────────
$data = [
    'location'            => 'Milano',
    'request_description' => 'Richiesta da Landing',
    'first_name'          => trim($input['first_name']),
    'last_name'           => trim($input['last_name']),
    'email'               => trim($input['email']),
    'phone_number'        => trim($input['phone_number']),
    'lang'                => 'it',
    'course'              => ['corso triennale di I livello in design della moda - indirizzo business & management'],
    'origin'              => ['website', 'landing', 'openday'],
    'how_you_knows'       => (int) $input['how_you_knows'],
];

// ── Configurazione ambiente ────────────────────────────────────────────────
// ⚠️  Passare a $prodToken e $prodApiUrl prima del go-live
$stagingToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJlZTQ3NjEzOTg3Mzc3YzZhZjYzY2EyYjBlMGUxMDJkOWU5M2U5ZmQyYWQwZDU1MWM2OTZjNjc5MGVhZTNjNzU5OGM5NmIwOWY4MjE0YTc1In0.eyJhdWQiOiIxIiwianRpIjoiYmVlNDc2MTM5ODczNzdjNmFmNjNjYTJiMGUwZTEwMmQ5ZTkzZTlmZDJhZDBkNTUxYzY5NmM2NzkwZWFlM2M3NTk4Yzk2YjA5ZjgyMTRhNzUiLCJpYXQiOjE3NzE1NzQ5MjcsIm5iZiI6MTc3MTU3NDkyNywiZXhwIjo0OTI3MjQ4NTI0LCJzdWIiOiI5MjAyNiIsInNjb3BlcyI6W119.ECRkbGiwQQia7i4lqKPh64vfVeakY8Jy19Ar3ZEwqDL7xvmMXVCpBNqe6D9AkhD-V9CGWMxxzKtpGqLGQAbcxUbI1ad4873MnWivWIUUQQcfwiGEelm4RfWKvezw_WKBDK5jShkZfCzBYOSD3V-X_GXpwtb2uBr9cu4JCulhhd_qJRZehKs_soW9A1dZJ8WOqnr_wBpoMyUPd7TVjQxcwbV7ZXAGIn7Qn0RwnrHLloXtoNcVhjcx38SqIgUFB7tZQsQ7vgdGNuW5Wxaz02jV_9HgFgJfum_qcev2yK-cOYjZ48oUVx6_g66jtnniKB7uLN8qTAlLup5ZbWVrmU3p0P9WCW9LtarGpkI2nfqdOeNi9PXAtHRlA9yj5ODBGRM0m9zs5x1R2mOY9OAHGRoG8voulsDpivmu0bws4QgddceAD_3bydlp92STMEZ5SNYkc17wvKTqjX_5jecO4vABjsQzH_fHenZBEDDz8NQY9tAHYxYRWWjsNJOd8j-hXVpUPYdG3fOEbVeMq2FxNj_BzuU6-DbCsibKzmm32HBTC7xtzVCrCFhWBowHmEt1soio8DBnOGL461xD4k5ArSEs_a0IzHpgwlE7SwaIrUm9C1eQLQxwIq8t4fiExToKcAHi5cUJHl7TfjmTRv1devKOCiswCJ-zjb7wBgGa_UnHBCI';
$prodToken    = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjFjMzRhYTE0NGMyN2U2OGRjNmIwYTNhNTU4NjY2YmY2OWExNGUxMTcxZDdhZGZiYWM3ZDI4NjdkYjY3MjJmZmU2NzNiNjU3MWIxYzVkNTBlIn0.eyJhdWQiOiIxIiwianRpIjoiMWMzNGFhMTQ0YzI3ZTY4ZGM2YjBhM2E1NTg2NjZiZjY5YTE0ZTExNzFkN2FkZmJhYzdkMjg2N2RiNjcyMmZmZTY3M2I2NTcxYjFjNWQ1MGUiLCJpYXQiOjE3MTgxODA1MDUsIm5iZiI6MTcxODE4MDUwNSwiZXhwIjo0ODczODU3NjcxLCJzdWIiOiI5MjAyNiIsInNjb3BlcyI6W119.mWLwa-R4Dn4tX-9EIazne_czQfhr-a_r51bmkLvDBGkEKdI7uWYSISSiLwUqqIxx92E-yj9Pjfq6qBnVZ4_KUuy4h9_exDIHRmwdwXwH4X9XZHp3nFV8vHRs35F0mQTyxq92Hh7YRW2dKUvr7-pV5e62d8SpFekAvs-PdI1I128L0nj_oNVzHbgf_geg8DMhFdyRi7_jhx0JhmnzOtWhuwAQCiB7NknHKlbT5DdVbeai_iqCVG-fzhF0cxlfySIyvlQijHrCyI2kRHzqWPrnY_Dt66A5y1jT-1JwWxEx60QP1ZwZ6-EmHThRMPBx5J5aAj1br8C8PVAf5mEUjTqJI1SIKU5nKMMXArj4GH6xprZIVEvG7InLPUnP1HSUXbOY5JLFuZ0pXelbQsLgNmzXmGZVfxiDAXJy8g1awp8hQE0srH6Yw722HJ7Sy6dR6qsxkTvCQcQ8c-KIw5p_07ymTrt3SKiCfvfTbMCOqNNbgX4tiyVOU9BbMjll5p_PwBZUvOALyqCgoprMoFL2HJJ388V7z3x37LZHOq9m2-aSX0YsNfb28kyxDGM7bp8fXg7ZNi1BajfIRZoFBcRY5oe3YM48LTXQX1YM4aZcdnFABjd1mdBlflkfrmfT1efjmjrF6dxALi63nd_JMOysQtoQ4OH9ID82VdOgWWSPymmKJNI';

// ── TODO: Cambia a false e usa $prodToken / $prodApiUrl prima del go-live ──
$isStaging  = false;
$apiUrl     = $isStaging
    ? 'https://staging-eduarth.accademiamoda.it/api/leads/steps/create'
    : 'https://eduarth.accademiamoda.it/api/leads/steps/create';
$bearerToken = $isStaging ? $stagingToken : $prodToken;

// ── Email config ───────────────────────────────────────────────────────────
// ⚠️  In prod: cambia FROM a contact@accademiamoda.it e TO a ufficioculturale@accademiamoda.it
$emailFrom        = 'contact@accademiamoda.it';
$emailFromName    = 'Accademia IUAD';
$emailToAcademy   = 'ufficioculturale@accademiamoda.it'; // → prod: ufficioculturale@accademiamoda.it

// ── Chiamata API Eduarth ───────────────────────────────────────────────────
$ch = curl_init($apiUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($data),
    CURLOPT_HTTPHEADER     => [
        "Authorization: Bearer $bearerToken",
        'Accept: application/json',
        'Content-Type: application/json',
    ],
    CURLOPT_TIMEOUT        => 15,
]);

$response  = curl_exec($ch);
$curlError = curl_error($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
// curl_close() rimosso: no-op da PHP 8.0, deprecato in PHP 8.5

if ($curlError) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Errore di connessione all\'API.']);
    exit();
}

$responseData = json_decode($response, true);

if ($httpCode !== 200 || empty($responseData['steps_created'])) {
    $apiMessage = $responseData['message'] ?? 'Errore sconosciuto dall\'API.';
    error_log('[IUAD] HTTP Code: ' . $httpCode);
    error_log('[IUAD] API Response: ' . $response);
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $apiMessage, 'api_response' => $responseData, 'http_code' => $httpCode]);
    exit();
}

// ── Helpers email ──────────────────────────────────────────────────────────
function sendHtmlMail(string $to, string $subject, string $body, string $from, string $fromName): bool
{
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: $fromName <$from>\r\n";
    $headers .= "Reply-To: $from\r\n";
    $headers .= 'X-Mailer: PHP/' . phpversion();
    return mail($to, $subject, $body, $headers);
}

$firstName   = htmlspecialchars($data['first_name']);
$lastName    = htmlspecialchars($data['last_name']);
$userEmail   = htmlspecialchars($data['email']);
$phone       = htmlspecialchars($data['phone_number']);

$howYouKnowsMap = [
    1 => 'Passaparola',
    2 => 'Pubblicità',
    3 => 'Ricerca Google',
    4 => 'Fiere / Orientamento',
    5 => 'Scuola / Orientamento',
    6 => 'Social Media',
    7 => 'Altro',
];
$howYouKnowsLabel = $howYouKnowsMap[$data['how_you_knows']] ?? 'Non specificato';

$logoBase64 = 'https://www.accademiamoda.it/wp-content/uploads/2022/05/IUAD-logo-nero-2022.png';

// ── Email 1: Conferma all'utente ───────────────────────────────────────────
$userSubject = 'Iscrizione confermata – Open Day Design della Comunicazione | IUAD';
$userBody = "
<!DOCTYPE html>
<html lang='it'>
<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body style='margin:0;padding:0;background:#f4dbcc;font-family:Arial,sans-serif;'>
  <table width='100%' cellpadding='0' cellspacing='0' style='background:#f4dbcc;padding:40px 20px;'>
    <tr><td align='center'>
      <table width='580' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:24px;overflow:hidden;max-width:580px;width:100%;'>

        <!-- Header: logo + titolo -->
        <tr>
          <td align='center' style='padding:36px 40px 24px;background:#ffffff;'>
            <img
              src='$logoBase64'
              alt='IUAD Accademia di Moda e Design' width='80'
              style='display:block;margin:0 auto 20px;max-width:80px;'>
            <h1 style='margin:0;font-size:22px;font-weight:bold;color:#d06321;font-family:Georgia,serif;'>
              Grazie per la tua richiesta!
            </h1>
          </td>
        </tr>

        <!-- Saluto + testo intro -->
        <tr>
          <td align='center' style='padding:4px 40px 24px;'>
            <p style='margin:0 0 10px;font-size:15px;color:#201f1f;font-family:Arial,sans-serif;'>
              Ciao $firstName,
            </p>
            <p style='margin:0;font-size:15px;color:#201f1f;font-family:Arial,sans-serif;line-height:1.6;'>
              Ti contatteremo presto per confermare i dettagli della tua richiesta.
            </p>
          </td>
        </tr>

        <!-- Riepilogo Richiesta -->
        <tr>
          <td style='padding:0 40px 40px;'>
            <table width='100%' cellpadding='0' cellspacing='0'>
              <tr>
                <td>
                  <!-- Titolo sezione -->
                  <p style='margin:0 0 12px;font-size:15px;font-weight:bold;color:#d06321;font-family:Arial,sans-serif;text-align:center;'>
                    Riepilogo Richiesta
                  </p>
                  <table width='100%' cellpadding='0' cellspacing='0'>
                    <tr><td style='padding-bottom:12px;border-bottom:1px solid #e0e0e0;'></td></tr>
                  </table>
                  <!-- Voci riepilogo: etichetta arancione + valore scuro, stessa riga -->
                  <table width='100%' cellpadding='0' cellspacing='0' style='margin-top:16px;'>
                    <tr>
                      <td style='padding-bottom:10px;font-family:Arial,sans-serif;font-size:14px;'>
                        <strong style='color:#d06321;'>Tipo Richiesta:</strong>
                        <span style='color:#201f1f;'> Open Day</span>
                      </td>
                    </tr>
                    <tr>
                      <td style='padding-bottom:10px;font-family:Arial,sans-serif;font-size:14px;'>
                        <strong style='color:#d06321;'>Sede:</strong>
                        <span style='color:#201f1f;'> Milano</span>
                      </td>
                    </tr>
                    <tr>
                      <td style='font-family:Arial,sans-serif;font-size:14px;'>
                        <strong style='color:#d06321;'>Corso:</strong>
                        <span style='color:#201f1f;'> Design della Comunicazione</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
";

sendHtmlMail($data['email'], $userSubject, $userBody, $emailFrom, $emailFromName);

// ── Email 2: Notifica interna all'accademia ────────────────────────────────
$academySubject = 'Nuova iscrizione Open Day – Design della Comunicazione';
$academyBody = "
<!DOCTYPE html>
<html lang='it'>
<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body style='margin:0;padding:0;background:#f4dbcc;font-family:Arial,sans-serif;'>
  <table width='100%' cellpadding='0' cellspacing='0' style='background:#f4dbcc;padding:40px 20px;'>
    <tr><td align='center'>
      <table width='580' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:24px;overflow:hidden;max-width:580px;width:100%;'>

        <!-- Header: logo + titolo -->
        <tr>
          <td align='center' style='padding:36px 40px 28px;background:#ffffff;'>
            <img
              src='$logoBase64'
              alt='IUAD Accademia di Moda e Design' width='80'
              style='display:block;margin:0 auto 20px;max-width:80px;'>
            <h1 style='margin:0;font-size:22px;font-weight:bold;color:#201f1f;font-family:Georgia,serif;'>
              Nuova Iscrizione Open Day
            </h1>
          </td>
        </tr>

        <!-- Sezione: Dati Personali -->
        <tr>
          <td style='padding:0 40px 24px;'>
            <table width='100%' cellpadding='0' cellspacing='0'>
              <tr>
                <td style='padding-bottom:10px;border-bottom:2px solid #d06321;'>
                  <span style='font-size:15px;font-weight:bold;color:#201f1f;font-family:Arial,sans-serif;'>Dati Personali</span>
                </td>
              </tr>
              <tr>
                <td style='padding-top:16px;font-size:14px;color:#201f1f;font-family:Arial,sans-serif;line-height:1.5;'>
                  <p style='margin:0 0 8px;'><strong>Nome:</strong> $firstName</p>
                  <p style='margin:0 0 8px;'><strong>Cognome:</strong> $lastName</p>
                  <p style='margin:0 0 8px;'><strong>Email:</strong> <a href='mailto:$userEmail' style='color:#d06321;text-decoration:none;'>$userEmail</a></p>
                  <p style='margin:0;'><strong>Cellulare:</strong> $phone</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Sezione: Dettagli Richiesta -->
        <tr>
          <td style='padding:0 40px 36px;'>
            <table width='100%' cellpadding='0' cellspacing='0'>
              <tr>
                <td style='padding-bottom:10px;border-bottom:2px solid #d06321;'>
                  <span style='font-size:15px;font-weight:bold;color:#201f1f;font-family:Arial,sans-serif;'>Dettagli Richiesta</span>
                </td>
              </tr>
              <tr>
                <td style='padding-top:16px;font-size:14px;color:#201f1f;font-family:Arial,sans-serif;line-height:1.5;'>
                  <p style='margin:0 0 8px;'><strong>Tipo Richiesta:</strong> Open Day</p>
                  <p style='margin:0 0 8px;'><strong>Sede:</strong> Milano</p>
                  <p style='margin:0 0 8px;'><strong>Corso:</strong> Design della Comunicazione</p>
                  <p style='margin:0;'><strong>Come ci hai conosciuto:</strong> $howYouKnowsLabel</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align='center' style='padding:16px 40px;background:#201f1f;border-radius:0 0 24px 24px;'>
            <p style='margin:0;font-size:11px;color:#ffffff;opacity:0.6;font-family:Arial,sans-serif;'>
              Inviato automaticamente dalla landing page IUAD &nbsp;·&nbsp; " . date('d/m/Y H:i') . "
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
";

sendHtmlMail($emailToAcademy, $academySubject, $academyBody, $emailFrom, $emailFromName);

// ── Risposta al frontend ───────────────────────────────────────────────────
ob_end_clean();
echo json_encode([
    'success'       => true,
    'leads_created' => $responseData['leads_created'] ?? 0,
    'leads_updated' => $responseData['leads_updated'] ?? 0,
    'redirect'      => 'grazie.html',
]);
