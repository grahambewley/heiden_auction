<?php

// Include a file hidden from Github that contains database connection settings and connects to the database
include('dbConnect.php');

// SQL query for Inserting bid into bids table 
mysqli_query($conn, "INSERT INTO bids (item_id, user_id, amount) VALUES(".$_REQUEST['biddingItemId'].", ".$_REQUEST['biddingUserId'].", ".$_REQUEST['biddingValue']."); ");

// mysqui_insert_id gets the id created in the last query
$bid_id = mysqli_insert_id($conn);

// SQL query for updating item to reflect new high_bid_id
mysqli_query($conn, "UPDATE items SET high_bid_id = '".$bid_id."' WHERE id = ".$_REQUEST['biddingItemId']);

echo $bid_id;