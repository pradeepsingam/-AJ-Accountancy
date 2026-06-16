<?php
/**
 * Newsletter Form Handler
 * ThemeForest Standard
 */

header('Content-Type: application/json');

// POST only
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit;
}

// Honeypot
if (!empty($_POST['website'])) {
    echo json_encode(["status" => "error", "message" => "Spam detected."]);
    exit;
}

// Sanitize
function clean_input($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

$email = isset($_POST['newsletter']) ? clean_input($_POST['newsletter']) : '';

// Validate
if (empty($email)) {
    echo json_encode([
        "status" => "error",
        "message" => "Email address is required."
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid email address."
    ]);
    exit;
}

// OPTION 1: Send Email Notification
$to = "info@ajaccountancy.co.uk";
$subject = "New Newsletter Subscription";

$body = "New subscriber email:\n\n$email";

$headers  = "From: Newsletter <$email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$mail_sent = mail($to, $subject, $body, $headers);

// You can also save to a .txt file or database instead of sending email.

if ($mail_sent) {
    echo json_encode([
        "status" => "success",
        "message" => "Successfully subscribed to newsletter."
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Subscription failed. Try again later."
    ]);
}

exit;
?>