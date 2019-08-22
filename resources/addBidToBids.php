<?php

// Include a file hidden from Github that contains database connection settings and connects to the database
include('dbConnect.php');

// SQL query for largest (latest) start_date_time in auctions table 
$result = mysqli_query($conn, "INSERT INTO bids (item_id, user_id, amount) VALUES(".$_REQUEST['biddingItemId'].", ".$_REQUEST['biddingUserId'].", ".$_REQUEST['biddingValue'].");");

if ($conn->query($sql) === TRUE) {
    $last_id = $conn->insert_id;
    echo "New bid created successfully. Last inserted bid's ID is: " . $last_id;
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}