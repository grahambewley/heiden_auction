<?php

// Include a file hidden from Github that contains database connection settings and connects to the database
include('dbConnect.php');

$result = mysqli_query($conn, "SELECT * from users WHERE id = ".$_REQUEST['id']);

if ($result->num_rows > 0) {

    $resultArray = array();

    while($row = $result->fetch_assoc()) {
        $resultArray[] = $row;
    }

    echo json_encode($resultArray);

} else {
    echo "0 results";
}