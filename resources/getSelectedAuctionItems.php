<?php

// Include a file hidden from Github that contains database connection settings and connects to the database
include('dbConnect.php');

// SQL query for all auction items that match the auction_id we sent over from the browser 
$result = mysqli_query($conn, "SELECT * from items WHERE auction_id = ".$_REQUEST['id']." ORDER BY id DESC");

if ($result->num_rows > 0) {

    $resultArray = array();

    while($row = $result->fetch_assoc()) {
        $resultArray[] = $row;
    }

    echo json_encode($resultArray);

} else {
    echo "0 results";
}