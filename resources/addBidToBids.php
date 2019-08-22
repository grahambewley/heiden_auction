<?php

// Include a file hidden from Github that contains database connection settings and connects to the database
include('dbConnect.php');

// SQL query for largest (latest) start_date_time in auctions table 
$result = mysqli_query($conn, "INSERT INTO bids (item_id, user_id, amount) OUTPUT Inserted.id VALUES(".$_REQUEST['biddingItemId'].", ".$_REQUEST['biddingUserId'].", ".$_REQUEST['biddingValue'].");");

if ($result->num_rows > 0) {

    while($row = $result->fetch_assoc()) {
        $jsonResult = json_encode($row);
        echo $jsonResult;
    }
} else {
    echo "0 results";
}