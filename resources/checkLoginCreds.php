<?php
// File hidden from Github that contains database connection settings
include('dbConnect.php');

// Get variables passed over from JavaScript file
$username = $_POST['username'];
$password = $_POST['password'];

$result = mysqli_query($conn, "SELECT * FROM users WHERE username='".$username."' AND password='".$password."'");

// If the number of rows returned equals 1 (or greater), return TRUE
if (mysqli_num_rows($result)) {
    echo 'TRUE';     
} 
// Otherwise, return FALSE
else {      
    echo 'FALSE';     
}
$conn->close();