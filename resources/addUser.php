<?php

include('dbConnect.php');

$sql = "INSERT INTO users (name, secret) VALUES ('awagner', 'heidenRulez')";

if (mysqli_query($conn, $sql)) {
      echo "New user created successfully";
} else {
      echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}
mysqli_close($conn);