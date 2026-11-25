<?php
// Forwards every request to the Node app on port 3000 (for servers where Apache has no mod_proxy_http).
$url = 'http://127.0.0.1:3000' . $_SERVER['REQUEST_URI'];
$ch = curl_init($url);
curl_setopt_array($ch, [
  CURLOPT_CUSTOMREQUEST => $_SERVER['REQUEST_METHOD'],
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HEADER => true,
  CURLOPT_TIMEOUT => 120,
  CURLOPT_HTTPHEADER => ['Content-Type: ' . ($_SERVER['CONTENT_TYPE'] ?? 'text/plain')],
]);
if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'HEAD'])) curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
$res = curl_exec($ch);
if ($res === false) { http_response_code(502); echo 'The app is not running.'; exit; }
$hs = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
http_response_code(curl_getinfo($ch, CURLINFO_RESPONSE_CODE));
$ct = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
if ($ct) header('Content-Type: ' . $ct);
echo substr($res, $hs);
