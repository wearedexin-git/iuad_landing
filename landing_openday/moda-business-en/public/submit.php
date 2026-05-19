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

function loadJsonConfig(string $path): array
{
    if (!file_exists($path)) {
        return [];
    }

    $content = file_get_contents($path);
    if ($content === false) {
        return [];
    }

    $decoded = json_decode($content, true);
    return is_array($decoded) ? $decoded : [];
}

function formatOpenDayDateLabel(string $openDayDate): string
{
    $date = DateTime::createFromFormat('Y-m-d H:i', $openDayDate);
    if ($date === false) {
        return $openDayDate;
    }

    $months = [
        1 => 'gennaio', 2 => 'febbraio', 3 => 'marzo', 4 => 'aprile',
        5 => 'maggio', 6 => 'giugno', 7 => 'luglio', 8 => 'agosto',
        9 => 'settembre', 10 => 'ottobre', 11 => 'novembre', 12 => 'dicembre',
    ];
    $month = $months[(int) $date->format('n')] ?? '';

    return sprintf(
        '%d %s %s, ore %s',
        (int) $date->format('j'),
        $month,
        $date->format('Y'),
        $date->format('H:i')
    );
}

// ── Config landing condivisa frontend/backend ──────────────────────────────
// In produzione `submit.php` sta nella radice della build (dist/) accanto a
// `config/openday-config.json` copiato dal plugin Vite `copy-openday-config`.
// In dev `submit.php` sta in `public/`, quindi il config va cercato un livello
// sopra, in `src/app/config/`.
$landingConfigPathProd = __DIR__ . '/config/openday-config.json';
$landingConfigPathDev  = __DIR__ . '/../src/app/config/openday-config.json';
$landingConfigPath = file_exists($landingConfigPathProd)
    ? $landingConfigPathProd
    : $landingConfigPathDev;
$landingConfig = loadJsonConfig($landingConfigPath);
$courseMailLabel = trim((string) ($landingConfig['courseMailLabel'] ?? ''));
if ($courseMailLabel === '') {
    $courseMailLabel = 'Design della Moda indirizzo Business & Management';
}
$courseMailLabelEscaped = htmlspecialchars($courseMailLabel, ENT_QUOTES, 'UTF-8');
$campuses = $landingConfig['campuses'] ?? [];

$campusesByApiValue = [];
$sessionsByCampusApiValue = [];
foreach ($campuses as $campus) {
    $apiValue = trim((string) ($campus['apiValue'] ?? ''));
    if ($apiValue === '') {
        continue;
    }

    $campusesByApiValue[$apiValue] = $campus;
    $sessionsByCampusApiValue[$apiValue] = [];
    foreach (($campus['sessions'] ?? []) as $session) {
        $apiDateTime = trim((string) ($session['apiDateTime'] ?? ''));
        if ($apiDateTime !== '') {
            $sessionsByCampusApiValue[$apiValue][] = $apiDateTime;
        }
    }
}

// ── Validazione campi obbligatori ──────────────────────────────────────────
$required = ['first_name', 'last_name', 'email', 'phone_number', 'how_you_knows', 'location', 'open_day_date'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        ob_end_clean();
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => "Campo obbligatorio mancante: $field"]);
        exit();
    }
}

$selectedLocation = trim((string) $input['location']);
$selectedOpenDayDate = trim((string) $input['open_day_date']);

if (!isset($campusesByApiValue[$selectedLocation])) {
    ob_end_clean();
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Sede non valida.']);
    exit();
}

if (!in_array($selectedOpenDayDate, $sessionsByCampusApiValue[$selectedLocation], true)) {
    ob_end_clean();
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Data Open Day non valida per la sede selezionata.']);
    exit();
}

$selectedCampusConfig = $campusesByApiValue[$selectedLocation];
$selectedCampusLabel = (string) ($selectedCampusConfig['label'] ?? $selectedLocation);
$selectedCampusAddress = (string) ($selectedCampusConfig['address'] ?? '');
$selectedOpenDayDateLabel = formatOpenDayDateLabel($selectedOpenDayDate);
$selectedCampusLabelEscaped = htmlspecialchars($selectedCampusLabel);
$selectedCampusAddressEscaped = htmlspecialchars($selectedCampusAddress);
$selectedOpenDayDateLabelEscaped = htmlspecialchars($selectedOpenDayDateLabel);

// ── Payload API ────────────────────────────────────────────────────────────
$data = [
    'location'            => $selectedLocation,
    'request_description' => (string) ($landingConfig['requestDescription'] ?? 'Richiesta da Landing'),
    'first_name'          => trim($input['first_name']),
    'last_name'           => trim($input['last_name']),
    'email'               => trim($input['email']),
    'phone_number'        => trim($input['phone_number']),
    'lang'                => 'it',
    'course'              => $landingConfig['course'] ?? ['fashion business eng'],
    'origin'              => $landingConfig['origin'] ?? ['website', 'landing', 'openday'],
    'how_you_knows'       => (int) $input['how_you_knows'],
    'open_day_date'       => $selectedOpenDayDate,
];

// ── Caricamento configurazione da .env ─────────────────────────────────────
function loadEnv(string $path): array
{
    if (!file_exists($path)) {
        return [];
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $env = [];
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $env[trim($key)] = trim($value);
        }
    }
    return $env;
}

$envFile = __DIR__ . '/../.env';
$env = loadEnv($envFile);

// Fallback per compatibilità con versioni senza .env
$apiEnvironment = $env['API_ENVIRONMENT'] ?? 'production';
$isStaging = ($apiEnvironment === 'staging');

$stagingToken = $env['API_TOKEN_STAGING'] ?? '';
$prodToken = $env['API_TOKEN_PRODUCTION'] ?? '';

// ── Configurazione ambiente ────────────────────────────────────────────────
$apiUrl = $isStaging
    ? 'https://staging-eduarth.accademiamoda.it/api/leads/steps/create'
    : 'https://eduarth.accademiamoda.it/api/leads/steps/create';
$bearerToken = $isStaging ? $stagingToken : $prodToken;

// Verifica che il token sia configurato
if (empty($bearerToken)) {
    ob_end_clean();
    http_response_code(500);
    error_log('[IUAD] Token API non configurato. Verifica il file .env');
    echo json_encode(['success' => false, 'message' => 'Configurazione server non valida.']);
    exit();
}

// ── Email config ───────────────────────────────────────────────────────────
$emailFrom = $env['EMAIL_FROM'] ?? 'contact@accademiamoda.it';
$emailFromName = $env['EMAIL_FROM_NAME'] ?? 'Accademia IUAD';
$emailToAcademy = $env['EMAIL_TO_ACADEMY'] ?? 'ufficioculturale@accademiamoda.it';

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
    error_log('[IUAD] cURL error verso Eduarth: ' . $curlError);
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
    $headers .= "Return-Path: $from\r\n";
    $headers .= 'X-Mailer: PHP/' . phpversion();
    // Envelope sender esplicito: migliora compatibilita' con MTA/relay.
    return mail($to, $subject, $body, $headers, "-f$from");
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

$logoPath = __DIR__ . '/assets/logo_iuad_black.png';
$logoBase64 = file_exists($logoPath)
    ? 'data:image/png;base64,' . base64_encode((string) file_get_contents($logoPath))
    : '';

// ── Email 1: Conferma all'utente ───────────────────────────────────────────
$userSubject = 'Iscrizione confermata – Open Day ' . $courseMailLabel . ' | IUAD';
$userBody = "
<!DOCTYPE html>
<html lang='it'>
<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body style='margin:0;padding:0;background:#D6E2F0;font-family:Arial,sans-serif;'>
  <table width='100%' cellpadding='0' cellspacing='0' style='background:#D6E2F0;padding:40px 20px;'>
    <tr><td align='center'>
      <table width='580' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:24px;overflow:hidden;max-width:580px;width:100%;'>

        <!-- Header: logo + titolo -->
        <tr>
          <td align='center' style='padding:36px 40px 24px;background:#ffffff;'>
            <img
              src='$logoBase64'
              alt='IUAD Accademia di Moda e Design' width='80'
              style='display:block;margin:0 auto 20px;max-width:80px;'>
            <h1 style='margin:0;font-size:22px;font-weight:bold;color:#8D9EBD;font-family:Georgia,serif;'>
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
                  <p style='margin:0 0 12px;font-size:15px;font-weight:bold;color:#8D9EBD;font-family:Arial,sans-serif;text-align:center;'>
                    Riepilogo Richiesta
                  </p>
                  <table width='100%' cellpadding='0' cellspacing='0'>
                    <tr><td style='padding-bottom:12px;border-bottom:1px solid #e0e0e0;'></td></tr>
                  </table>
                  <!-- Voci riepilogo: etichetta arancione + valore scuro, stessa riga -->
                  <table width='100%' cellpadding='0' cellspacing='0' style='margin-top:16px;'>
                    <tr>
                      <td style='padding-bottom:10px;font-family:Arial,sans-serif;font-size:14px;'>
                        <strong style='color:#8D9EBD;'>Tipo Richiesta:</strong>
                        <span style='color:#201f1f;'> Open Day</span>
                      </td>
                    </tr>
                    <tr>
                      <td style='padding-bottom:10px;font-family:Arial,sans-serif;font-size:14px;'>
                        <strong style='color:#8D9EBD;'>Sede:</strong>
                        <span style='color:#201f1f;'> $selectedCampusLabelEscaped</span>
                      </td>
                    </tr>
                    <tr>
                      <td style='padding-bottom:10px;font-family:Arial,sans-serif;font-size:14px;'>
                        <strong style='color:#8D9EBD;'>Data Open Day:</strong>
                        <span style='color:#201f1f;'> $selectedOpenDayDateLabelEscaped</span>
                      </td>
                    </tr>
                    <tr>
                      <td style='padding-bottom:10px;font-family:Arial,sans-serif;font-size:14px;'>
                        <strong style='color:#8D9EBD;'>Indirizzo sede:</strong>
                        <span style='color:#201f1f;'> $selectedCampusAddressEscaped</span>
                      </td>
                    </tr>
                    <tr>
                      <td style='font-family:Arial,sans-serif;font-size:14px;'>
                        <strong style='color:#8D9EBD;'>Corso:</strong>
                        <span style='color:#201f1f;'> " . $courseMailLabelEscaped . "</span>
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

$userMailSent = sendHtmlMail($data['email'], $userSubject, $userBody, $emailFrom, $emailFromName);
if (!$userMailSent) {
    error_log('[IUAD] Invio email utente fallito verso: ' . $data['email']);
}

// ── Email 2: Notifica interna all'accademia ────────────────────────────────
$academySubject = 'Nuova iscrizione Open Day – ' . $courseMailLabel;
$academyBody = "
<!DOCTYPE html>
<html lang='it'>
<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body style='margin:0;padding:0;background:#D6E2F0;font-family:Arial,sans-serif;'>
  <table width='100%' cellpadding='0' cellspacing='0' style='background:#D6E2F0;padding:40px 20px;'>
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
                <td style='padding-bottom:10px;border-bottom:2px solid #8D9EBD;'>
                  <span style='font-size:15px;font-weight:bold;color:#201f1f;font-family:Arial,sans-serif;'>Dati Personali</span>
                </td>
              </tr>
              <tr>
                <td style='padding-top:16px;font-size:14px;color:#201f1f;font-family:Arial,sans-serif;line-height:1.5;'>
                  <p style='margin:0 0 8px;'><strong>Nome:</strong> $firstName</p>
                  <p style='margin:0 0 8px;'><strong>Cognome:</strong> $lastName</p>
                  <p style='margin:0 0 8px;'><strong>Email:</strong> <a href='mailto:$userEmail' style='color:#8D9EBD;text-decoration:none;'>$userEmail</a></p>
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
                <td style='padding-bottom:10px;border-bottom:2px solid #8D9EBD;'>
                  <span style='font-size:15px;font-weight:bold;color:#201f1f;font-family:Arial,sans-serif;'>Dettagli Richiesta</span>
                </td>
              </tr>
              <tr>
                <td style='padding-top:16px;font-size:14px;color:#201f1f;font-family:Arial,sans-serif;line-height:1.5;'>
                  <p style='margin:0 0 8px;'><strong>Tipo Richiesta:</strong> Open Day</p>
                  <p style='margin:0 0 8px;'><strong>Sede:</strong> $selectedCampusLabelEscaped</p>
                  <p style='margin:0 0 8px;'><strong>Data Open Day:</strong> $selectedOpenDayDateLabelEscaped</p>
                  <p style='margin:0 0 8px;'><strong>Indirizzo sede:</strong> $selectedCampusAddressEscaped</p>
                  <p style='margin:0 0 8px;'><strong>Corso:</strong> " . $courseMailLabelEscaped . "</p>
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

$academyMailSent = sendHtmlMail($emailToAcademy, $academySubject, $academyBody, $emailFrom, $emailFromName);
if (!$academyMailSent) {
    error_log('[IUAD] Invio email accademia fallito verso: ' . $emailToAcademy);
}

// ── Risposta al frontend ───────────────────────────────────────────────────
ob_end_clean();
$redirectQuery = http_build_query([
    'sede' => $selectedCampusLabel,
    'data' => $selectedOpenDayDateLabel,
]);

echo json_encode([
    'success'       => true,
    'leads_created' => $responseData['leads_created'] ?? 0,
    'leads_updated' => $responseData['leads_updated'] ?? 0,
    'mail'          => [
        'user_sent' => $userMailSent,
        'academy_sent' => $academyMailSent,
    ],
    'redirect'      => 'grazie.html?' . $redirectQuery,
]);
