<?php

// Include a file hidden from Github that contains database connection settings and connects to the database
include('dbConnect.php');

/*
// Get variables passed over from JavaScript file
$username = $_REQUEST['user'];
$password = $_REQUEST['pw'];

// SQL query for credentials in users table 
//  -- BINARY keyword makes this query compare the exact bytes -- thus making the query case-sensitive
$result = mysqli_query($conn, "SELECT * FROM users WHERE user='".$username."' AND BINARY pw='".$password."'");

// If the number of rows returned equals 1 (or greater), this means a matching user was found -- return TRUE
if (mysqli_num_rows($result)) {
    echo 'TRUE';     
} 
// Otherwise, return FALSE
else {      
    echo 'FALSE';     
}
$conn->close();
*/


/////////// NEW VERSION THAT RETURNS FULL USER OBJECT

// Get variables passed over from JavaScript file
$username = $_REQUEST['user'];
$password = $_REQUEST['pw'];

$result = mysqli_query($conn, "SELECT * from users WHERE user='".$username."' AND BINARY pw='".$password."'");

if ($result->num_rows > 0) {

    while($row = $result->fetch_assoc()) {
        $jsonResult = json_encode($row);
        echo $jsonResult;
    }
} else {
    echo 0;
}

$conn->close();