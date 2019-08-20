<?php

// Include a file hidden from Github that contains database connection settings and connects to the database
include('dbConnect.php');

// SQL query for largest (latest) start_date_time in auctions table 
$result = mysqli_query($conn, "SELECT * from auctions WHERE ORDER BY start_date_time DESC LIMIT 1");

if ($result->num_rows > 0) {

    while($row = $result->fetch_assoc()) {
        $jsonResult = json_encode($row);
        echo $jsonResult;
    }
} else {
    echo "0 results";
}