<?php

// Include a file hidden from Github that contains database connection settings and connects to the database
include('dbConnect.php');

//if ($_SERVER["REQUEST_METHOD"] == "POST") {
//  	$username = $_POST["usr"];
//	$password = $_POST["pw"];
//
//	$result = mysqli_query($conn, "SELECT * from users WHERE user='".$username."' AND BINARY pw='".$password."'");
//
//	if ($result->num_rows > 0) {
//		while($row = $result->fetch_assoc()) {
//			$jsonResult = json_encode($row);
//			echo $jsonResult;
//		}
//	} else {
//		echo 0;
//}
//
//$conn->close();

// Get variables passed over from JavaScript file
$username = $_REQUEST['user'];
$password = $_REQUEST['pw'];

$result = mysqli_query($conn, "SELECT * from users WHERE user='".$username."' AND BINARY pw='".$password."'");

if ($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$jsonResult = json_encode($row);
		echo $jsonResult;
	}
} else {
	echo 0;
}

$conn->close();
