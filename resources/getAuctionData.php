<?php

// Include a file hidden from Github that contains database connection settings and connects to the database
include('dbConnect.php');

// SQL query for returning an item based on the id passed in 
$result = mysqli_query($conn, "SELECT * from auctions WHERE id = ".$_REQUEST['id']);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $jsonResult = json_encode($row);
        echo $jsonResult;
    }
} else {
    echo "0 results";
}