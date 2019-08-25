window.onload = function() {
    displayUserBids();  
}

function displayUserBids() {
    const userID = localStorage.getItem("user_id");
    const bidsTable = document.getElementById('bids-table');
    console.log("User ID we got was: " + userID + " -- TIME TO GET SOME BIDS!");

    $.ajax({
        url: "/auction/resources/getUserBids.php",
        type: "POST",
        data: {
            "user_id": userID
        }
    }).done(function (result) {
        let resultArray = JSON.parse(result);

        resultArray.forEach(function (element) {
        
            // Get info from item -- name and auction ID

            // Get auction name from auction ID

            var bidRow = document.createElement('tr');

            // Add auction
            let bidAuction = document.createElement('td');
            bidAuction.innerHTML = "Auction Name";

            // Add item
            let bidItem = document.createElement('td');
            bidItem.innerHTML = "Item";

            // Add bid amount
            let bidAmount = document.createElement('td');
            bidAmount.innerHTML = "$ AMOUNT";

            bidRow.appendChild(bidAuction);
            bidRow.appendChild(bidItem);
            bidRow.appendChild(bidAmount);

            bidsTable.appendChild(bidRow);
        });

    });
}