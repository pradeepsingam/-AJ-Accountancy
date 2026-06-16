<?php
/**
 * Contact Form Handler
 * ThemeForest Standard
 */

header('Content-Type: application/json');

// Allow POST only
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit;
}

// Honeypot spam check
if (!empty($_POST['website'])) {
    echo json_encode(["status" => "error", "message" => "Spam detected."]);
    exit;
}

// Sanitize function
function clean_input($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// Get inputs
$name    = isset($_POST['name']) ? clean_input($_POST['name']) : '';
$email   = isset($_POST['email']) ? clean_input($_POST['email']) : '';
$subject = isset($_POST['subject']) ? clean_input($_POST['subject']) : '';
$message = isset($_POST['message']) ? clean_input($_POST['message']) : '';

// Validate required fields
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo json_encode([
        "status" => "error",
        "message" => "All fields are required."
    ]);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid email address."
    ]);
    exit;
}

// Email config
$to      = "info@ajaccountancy.co.uk";
$email_subject = "Contact Form: " . $subject;

$email_body = "
New Contact Message

Name: $name
Email: $email
Subject: $subject

Message:
$message
";

$headers  = "From: $name <$email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$mail_sent = mail($to, $email_subject, $email_body, $headers);

if ($mail_sent) {
    echo json_encode([
        "status" => "success",
        "message" => "Your message has been sent successfully."
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Something went wrong. Please try again later."
    ]);
}

exit;
?>