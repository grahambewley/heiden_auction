<?php

// Include a file hidden from Github that contains database connection settings and connects to the database
include('dbConnect.php');

// SQL query for largest (latest) start_date_time in auctions table 
$result = mysqli_query($conn, "INSERT INTO bids (item_id, user_id, amount) VALUES(".$_REQUEST['biddingItemId'].", ".$_REQUEST['biddingUserId'].", ".$_REQUEST['biddingValue'].");");

$last_id = $conn->insert_id;
echo $last_id;