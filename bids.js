window.onload = function() {
    displayUserBids();  
}

function displayUserBids() {

    const userID = localStorage.getItem("user_id");

    const bidsTable = document.getElementById('bids-table');

    // Get list of bids from the logged in user (select from BIDS)
    $.ajax({
        url: "/auction/resources/getUserDataById.php",
        type: "POST",
        data: {
            "user_id": userID
        }
    }).done(function (result) {

        let resultArray = JSON.parse(result);

        // For each bid from this user...
        resultArray.forEach(function (element) {
        
            var bidRow = document.createElement('tr');

            // Get info from item -- name and auction ID (select from ITEMS)
            $.ajax({
                url: "/auction/resources/getItemBidData.php",
                type: "POST",
                data: {
                    "id": element.item_id
                }
            }).done(function (result) {
                // Get item's name
                let resultItem = JSON.parse(result);
                let bidItem = document.createElement('td');
                bidItem.innerHTML = resultItem.name;

                $.ajax({
                    url: "/auction/resources/getAuctionData.php",
                    type: "POST",
                    data: {
                        "id": resultItem.auction_id
                    }
                }).done(function (result) {
                    // Get auction's name
                    let resultAuction = JSON.parse(result);
                    let bidAuction = document.createElement('td');
                    bidAuction.innerHTML = resultAuction.name;

                    // Add bid amount
                    let bidAmount = document.createElement('td');
                    bidAmount.innerHTML = "$" + element.amount;

                    //If this item's high_bid_id matches this bid's ID, apply special 'winning bid' style
                    if(resultItem.high_bid_id == element.id) {
                        bidRow.classList.add('winning-bid');
                    }

                    bidRow.appendChild(bidAuction);
                    bidRow.appendChild(bidItem);
                    bidRow.appendChild(bidAmount);

                    bidsTable.appendChild(bidRow);
                });
            });
        });

    });
}