<?php

// Include a file hidden from Github that contains database connection settings and connects to the database
include('dbConnect.php');

// Get variables passed over from JavaScript file
$username = $_REQUEST['user'];
$password = $_REQUEST['pw'];

// SQL query for credentials in users table 
//  -- BINARY keyword makes this query compare the exact bytes -- thus making the query case-sensitive
$result = mysqli_query($conn, "SELECT * FROM users WHERE BINARY user='".$username."' AND BINARY pw='".$password."'");

// If the number of rows returned equals 1 (or greater), return TRUE
if (mysqli_num_rows($result)) {
    echo 'TRUE';     
} 
// Otherwise, return FALSE
else {      
    echo 'FALSE';     
}
$conn->close();