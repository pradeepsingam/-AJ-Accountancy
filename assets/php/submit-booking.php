<?php
/**
 * Booking Form Handler
 * ThemeForest Standard Version
 */

header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request method."
    ]);
    exit;
}

// Simple honeypot spam protection
if (!empty($_POST['website'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Spam detected."
    ]);
    exit;
}

// Sanitize Inputs
function clean_input($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

$name               = isset($_POST['name']) ? clean_input($_POST['name']) : '';
$email              = isset($_POST['email']) ? clean_input($_POST['email']) : '';
$phone              = isset($_POST['phone']) ? clean_input($_POST['phone']) : '';
$company            = isset($_POST['company']) ? clean_input($_POST['company']) : '';
$service_type       = isset($_POST['service-type']) ? clean_input($_POST['service-type']) : '';
$consultation_date  = isset($_POST['consultation-date']) ? clean_input($_POST['consultation-date']) : '';
$message            = isset($_POST['message']) ? clean_input($_POST['message']) : '';

// Required field validation
if (empty($name) || empty($email) || empty($service_type)) {
    echo json_encode([
        "status" => "error",
        "message" => "Please fill in all required fields."
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

// Email configuration
$to      = "info@ajaccountancy.co.uk";
$subject = "New Booking Request from " . $name;

// Email body
$email_body = "
New Booking Request

Full Name: $name
Email: $email
Phone: $phone
Company: $company
Service Type: $service_type
Preferred Date: $consultation_date

Message:
$message
";

// Secure headers
$headers  = "From: " . $name . " <" . $email . ">\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
$mail_sent = mail($to, $subject, $email_body, $headers);

if ($mail_sent) {
    echo json_encode([
        "status" => "success",
        "message" => "Your booking request has been sent successfully."
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Something went wrong. Please try again later."
    ]);
}
exit;
?>