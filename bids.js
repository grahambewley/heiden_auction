window.onload = function() {
    displayUserBids();  
}

function displayUserBids() {
    const userID = localStorage.getItem("user_id");

    console.log("User ID we got was: " + userID + " -- TIME TO GET SOME BIDS!");
}