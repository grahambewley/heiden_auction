<?php

// Include a file hidden from Github that contains database connection settings and connects to the database
include('dbConnect.php');

// SQL query for returning an item based on the id passed in 
$result = mysqli_query($conn, "SELECT * from auctions");

if ($result->num_rows > 0) {

    $resultArray = array();

    while($row = $result->fetch_assoc()) {
        $resultArray[] = $row;
    }

    echo json_encode($resultArray);

} else {
    echo "0 results";
}