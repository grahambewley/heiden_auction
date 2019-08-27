window.onload = function () {

    displayUserName();
    displaySelectedAuctionInfo();
}

let selectedAuctionStartUtcSeconds = '';
let selectedAuctionEndUtcSeconds = '';

function logOffUser() {
    localStorage.clear();
    window.location.href = "/auction/login.html";
};


// Gets user's name from localStorage and displays it on screen OR display Login button
displayUserName = function () {
    // Grab user's name, set during login
    const name = localStorage.getItem('name');

    const auctionInfo = document.getElementById('auction-info');

    //If name in localStorage is not set then create Login button and append it
    if (name === null) {
        let loginButton = document.createElement('a');
        loginButton.setAttribute('href', '/auction/login.html');
        loginButton.setAttribute('class', 'btn');
        loginButton.innerHTML = "Login";

        auctionInfo.appendChild(loginButton);
    }
    // Or if name is set (user is logged in), display a "Welcome" message instead
    else {
        let userInfo = document.createElement('div');
        userInfo.setAttribute('class', 'user');

        let welcomeText = document.createElement('h3');
        welcomeText.setAttribute('class', 'user__welcome');
        welcomeText.innerHTML = "Welcome, " + name;

        let viewBids = document.createElement('a');
        viewBids.setAttribute('href', '/auction/bids.html');
        viewBids.setAttribute('class', 'btn btn--small');
        viewBids.innerHTML = "View Bids";

        let logOff = document.createElement('button');
        logOff.setAttribute('class', 'btn btn--small');
        logOff.setAttribute('onclick', 'logOffUser()');
        logOff.innerHTML = "Log Off";

//        function logOffUser() {
//            localStorage.clear();
//            window.location.href = "/auction/login.html";
//        };


        userInfo.appendChild(welcomeText);
        userInfo.appendChild(viewBids);
        userInfo.appendChild(logOff);

        auctionInfo.appendChild(userInfo);
    }
}

displaySelectedAuctionInfo = function () {
    $.ajax({
        url: "/auction/resources/getCurrentAuctionMetadata.php",
        type: "POST",
    }).done(function(result) {

        // Convert the result returned from PHP, from JSON to JavaScript object
        let resultObject = JSON.parse(result);

        const selectedAuctionName = resultObject.name;
        const selectedAuctionId = resultObject.id;

        selectedAuctionStartUtcSeconds = resultObject.start_date_time;
        // Use moment.js to convert Epoch times to readable date
        const formattedStartDateTime = moment.unix(selectedAuctionStartUtcSeconds).format('M/D/YY h:mm A');

        selectedAuctionEndUtcSeconds = resultObject.end_date_time;
        // Use moment.js to convert Epoch times to readable date
        const formattedEndDateTime = moment.unix(selectedAuctionEndUtcSeconds).format('M/D/YY h:mm A');

        document.getElementById('auction-info__name').innerHTML = selectedAuctionName;
        document.getElementById('auction-info__date-span').innerHTML = formattedStartDateTime + " &mdash; " + formattedEndDateTime;

        //Put up appropriate banner if auction has not started or has ended
        var aucStatus = getSelectedAuctionStatus();
        if (aucStatus == 0) {
            document.getElementById('auction-not-started-banner').style.display = "block";
        } else if (aucStatus == 2) {
            document.getElementById('auction-ended-banner').style.display = "block";
        }

        //Once we've got the correct auction selected we can fill in the auction items
        displaySelectedAuctionItems(selectedAuctionId);
    });
}

displaySelectedAuctionItems = function(selectedAuctionId) {
    const aucStatus = getSelectedAuctionStatus();
    $.ajax({
        url: "/auction/resources/getSelectedAuctionItems.php",
        type: "POST",
        data: {
            "id": selectedAuctionId
        }
    }).done(function (result) {
        let resultArray = JSON.parse(result);
        const items = document.getElementById('items');

        resultArray.forEach(function (element) {

            // CREATE ITEM CONTAINER      

            let item = document.createElement('div');
            item.setAttribute('class', 'item');

            // CREATE ITEM IMAGE ELEMENT

            let itemImg = document.createElement('img');
            itemImg.setAttribute('src', 'img/' + element.image_filename);
            itemImg.setAttribute('alt', 'Auction item image');
            itemImg.setAttribute('class', 'item__img');

            // CREATE ITEM DATA SECTION (ITEM NAME AND DESCRIPTION)

            let itemData = document.createElement('div');
            itemData.setAttribute('class', 'item__data');

            let itemName = document.createElement('p');
            itemName.setAttribute('class', 'item__name');
            itemName.innerHTML = element.name;

            let itemDescription = document.createElement('p');
            itemDescription.setAttribute('class', 'item__description');
            itemDescription.innerHTML = element.description;

            itemData.appendChild(itemName);
            itemData.appendChild(itemDescription);

            let itemPrice = document.createElement('div');
            let itemWon = document.createElement('div');

            // If auction has not started or is in progress...
            if(aucStatus == 0 || aucStatus == 1) { 
                console.log("Creating item Pricing section");
                // CREATE ITEM PRICING SECTION 
                itemPrice.setAttribute('class', 'item__price');

                // Create and append Starting Price
                let itemStartingPrice = document.createElement('div');
                itemStartingPrice.setAttribute('class', 'item__starting-price');
                
                let itemStartingPriceLabel = document.createElement('span')
                itemStartingPriceLabel.innerHTML = "Starting Price:" ;
                let itemStartingPriceAmount = document.createElement('span');
                itemStartingPriceAmount.innerHTML = "$" + element.starting_price;

                itemStartingPrice.appendChild(itemStartingPriceLabel);
                itemStartingPrice.appendChild(itemStartingPriceAmount);

                itemPrice.appendChild(itemStartingPrice);

                // If this item has a high_bid_id filled, it means someone has bid on it, display the current bid on the card
                if(element.high_bid_id !== null ) {
                    console.log("Querying bids for bid id: " + element.high_bid_id);
                    // Query bids for this bid, return its amount
                    $.ajax({
                        url: "/auction/resources/getItemCurrentPrice.php",
                        type: "POST",
                        data: {
                            "id": element.high_bid_id
                        }
                    }).done(function (result) {                    
                        let resultObject = JSON.parse(result);
                        
                        //Create and append Current Price
                        let itemCurrentPrice = document.createElement('p');
                        itemCurrentPrice.setAttribute('class', 'item__current-price');

                        let itemCurrentPriceLabel = document.createElement('span')
                        itemCurrentPriceLabel.innerHTML = "Current Bid:" ;
                        let itemCurrentPriceAmount = document.createElement('span');
                        itemCurrentPriceAmount.innerHTML = "$" + resultObject.amount;
                        
                        itemCurrentPrice.appendChild(itemCurrentPriceLabel);
                        itemCurrentPrice.appendChild(itemCurrentPriceAmount);

                        itemPrice.appendChild(itemCurrentPrice);
                    });
                }
            }
            // If auction is over...
            else {
                console.log("Creating item WINNER section");

                // CREATE ITEM WINNER SECTION
                itemWon.setAttribute('class', 'item__won');

                // If this item has a high_bid_id filled, it means someone has bid on it, display winner on the card
                if(element.high_bid_id !== null ) {
                    console.log("Querying bids for bid id: " + element.high_bid_id);
                    // Query bids for this winning bid
                    $.ajax({
                        url: "/auction/resources/getItemCurrentPrice.php",
                        type: "POST",
                        data: {
                            "id": element.high_bid_id
                        }
                    }).done(function (result) {                    
                        let resultBid = JSON.parse(result);
    
                        // Query users for the winner's user_id
                        $.ajax({
                            url: "/auction/resources/getUserDataById.php",
                            type: "POST",
                            data: {
                                "id": resultBid.user_id
                            }
                        }).done(function (userQueryResult) {
                            let resultUser = JSON.parse(userQueryResult);
                            
                            console.log("Resulting winning user that was returned is: " + userQueryResult);

                            //Create and append Item Winner name and bid amount
                            let itemWinner = document.createElement('p');
                            itemWinner.setAttribute('class', 'item__winner');
                            itemWinner.innerHTML = "Item won by " + resultUser.name + " for $" + resultBid.amount;

                            itemWon.appendChild(itemWinner);
                        });
                    });
                }
                // ...Else, the item was not bid on during the auction
                else {
                    //Create and append Item Winner name and bid amount
                    let itemWinner = document.createElement('p');
                    itemWinner.setAttribute('class', 'item__winner');
                    itemWinner.innerHTML = "No bids on this item";

                    itemWon.appendChild(itemWinner);
                }
            }
            
            // Create bid container form, plus the input and button that go within
            let bid = document.createElement('form');
            bid.setAttribute('class', 'bid');
            // Set custom attribute that holds this auction item's unique id
            bid.setAttribute('item_id', element.id);
            // The 'return false' acts like an event.preventDefuault(), which keeps the page from reloading
            bid.setAttribute('onsubmit', 'checkBid(this);return false');

            let bidAmount = document.createElement('input');
            bidAmount.setAttribute('type', 'number');
            bidAmount.setAttribute('class', 'bid__amount');
            bidAmount.setAttribute('id', 'bidAmount');
            bidAmount.setAttribute('placeholder', 'Your bid');
            bidAmount.setAttribute('required', 'true');

            let bidButton = document.createElement('input');
            bidButton.setAttribute('type', 'submit');
            bidButton.setAttribute('class', 'bid__button');
            bidButton.setAttribute('value', 'Bid');

            // If user is not logged in, bid button and input should be disabled
            // Grab user's name, set during login
            const name = localStorage.getItem('name');
            if(name === null) {
                bidAmount.setAttribute('disabled', 'true');
                bidButton.setAttribute('disabled', 'true');
                bidButton.classList.add('btn--disabled');
            }

            bid.appendChild(bidAmount);
            bid.appendChild(bidButton);

            // Append all the stuff we made to the item card
            item.appendChild(itemImg);
            item.appendChild(itemData);
            if(aucStatus == 0 || aucStatus == 1) { 
                item.appendChild(itemPrice); 
            }
            else { 
                item.appendChild(itemWon);
            }
            
            item.appendChild(bid);

            // Append item card to items
            items.appendChild(item);
        });

    });
}

// Gets current epoch time from browser, returns 'status' of auction
// 0 = auction not yet started
// 1 = auction in progress
// 2 = auction has ended
function getSelectedAuctionStatus() {
    const currentEpochTime = new Date().getTime() / 1000;
    console.log("Current time: " + currentEpochTime);
    console.log("Auction Start time: " + selectedAuctionStartUtcSeconds);
    console.log("Auction End time: " + selectedAuctionEndUtcSeconds);

    // If current time is less than auction's start time, auction has not started
    if(currentEpochTime < selectedAuctionStartUtcSeconds) {
        console.log("Auction not yet started, returning 0")
        return 0;
    }
    // If current time is between auction's start time and end time, auction is in progress
    else if(currentEpochTime >= selectedAuctionStartUtcSeconds && currentEpochTime <= selectedAuctionEndUtcSeconds) {
        console.log("Auction in progress, returning 1")
        return 1;
    }
    // If current time is after auction's end time, auction has ended
    else {
        console.log("Auction has ended, returning 2")
        return 2;
    }
}

// Wrapper for ajax call that supports promises
function ajax(options) {
    return new Promise(function(resolve, reject) {
      $.ajax(options).done(resolve).fail(reject);
    });
}

checkBid = function(item) {

    const biddingItemId = item.getAttribute('item_id');
    const biddingUserId = localStorage.getItem('user_id');
    const biddingValue = parseInt(item.firstElementChild.value);

    console.log("Attempting to bid on item ID " + biddingItemId);
    console.log("My User ID is " + biddingUserId);
    console.log("Bid amount entered is " + biddingValue);

    ajax({ url: "/auction/resources/getItemBidData.php", type: "POST", data: {"id": biddingItemId } }).then(function(result) {
        // Get data on this item after clicking the bid button
        let resultObject = JSON.parse(result);

        let startingPrice = parseInt(resultObject.starting_price);
        let highBidId = resultObject.high_bid_id;
        let itemName = resultObject.name;

        console.log("This item's Starting Price: " + startingPrice);
        console.log("This item's current High Bid ID: " + highBidId);

        // If the returned item has no current high_bid_id -- it hasn't been bid on yet
        if(resultObject.high_bid_id === null) {
            // Check that the amount the user submitted is greater than the item's starting price
            if(biddingValue >= startingPrice) {
                //Confirm that user wants to place this bid
                var bidCheck = confirm("Are you sure you want to bid $" + biddingValue + " on " + itemName + "?");
                console.log ("bidCheck = " + bidCheck);
                if(bidCheck == true) {
                    // Place bid into bids table
                    placeBid(biddingItemId, biddingUserId, biddingValue);
                    // Reload page so we can see bid
                    location.reload();
                }
            }
            // If the value entered is not greater than the starting price, let the user know
            else {
                alert("You must enter a bid greater than the starting price of $" + startingPrice);
            }
        }

        else {

            // Query bids for this bid, return its amount
            $.ajax({
                url: "/auction/resources/getItemCurrentPrice.php",
                type: "POST",
                data: {
                    "id": highBidId
                }
            }).done(function (result) {
                let resultObject = JSON.parse(result);
                
                if(biddingValue > resultObject.amount) {
                    console.log("biddingValue > currentHighBid --- This bid is valid!");
                    //Confirm that user wants to place this bid
                    var bidCheck = confirm("Are you sure you want to bid $" + biddingValue + " on " + itemName + "?");
                    console.log ("bidCheck = " + bidCheck);
                    if(bidCheck == true) {
                        // Place bid into bids table
                        placeBid(biddingItemId, biddingUserId, biddingValue);
                        // Reload page so we can see new bid
                        location.reload();
                    }
                } else {
                    alert("You must enter a bid greater than the current bid of $" + resultObject.amount);
                }
            });
        }
        
    });
}

placeBid = function (biddingItemId, biddingUserId, biddingValue) {

    // Get the selected auction's status
    const aucStatus = getSelectedAuctionStatus();

    // If the auction is ongoing, allow a bid
    if(aucStatus == 1) {
        let biddingEpoch = new Date().getTime() / 1000;
        biddingEpoch = parseInt(biddingEpoch);

        $.ajax({
            url: "/auction/resources/addBidToBids.php",
            type: "POST",
            data: {
                "biddingItemId": biddingItemId,
                "biddingUserId": biddingUserId,
                "biddingValue": biddingValue,
                "biddingEpoch": biddingEpoch
            }
        }).done(function (result) {
            console.log("Bid result: " + result);
        });
    } 
    // Otherwise display a message
    else {
        alert("Sorry, this auction is not accepting bids at this time.")
    }
}
