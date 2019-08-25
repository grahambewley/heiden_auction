window.onload = function () {

    getUserName();
    getCurrentAuctionMetadata();

}

// Gets user's name from localStorage and displays it on screen OR display Login button
getUserName = function () {
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
        let welcomeText = document.createElement('h3');
        welcomeText.setAttribute('class', 'auction-info__welcome');
        welcomeText.innerHTML = "Welcome, " + name;

        auctionInfo.appendChild(welcomeText);
    }
}

getCurrentAuctionMetadata = function () {
    const currentEpochTime = new Date().getTime() / 1000;

    $.ajax({

        url: "/auction/resources/getCurrentAuctionMetadata.php",
        type: "POST",

    }).done(function(result) {

        // Convert the result returned from PHP, from JSON to JavaScript object
        let resultObject = JSON.parse(result);

        const selectedAuctionName = resultObject.name;
        const selectedAuctionId = resultObject.id;

        var startUtcSeconds = resultObject.start_date_time;
        // Use moment.js to convert Epoch times to readable date
        let formattedStartDateTime = moment.unix(startUtcSeconds).format('MM/DD/YY h:mm A');

        var endUtcSeconds = resultObject.end_date_time;
        // Use moment.js to convert Epoch times to readable date
        let formattedEndDateTime = moment.unix(endUtcSeconds).format('MM/DD/YY h:mm A');

        document.getElementById('auction-info__name').innerHTML = selectedAuctionName;
        document.getElementById('auction-info__date-span').innerHTML = formattedStartDateTime + " &mdash; " + formattedEndDateTime;

        //Determine if this auction has ended, if so then display a banner, hide bid buttons
        console.log("Current epoch time: " + currentEpochTime + " and this auction's end epoch time: " + endUtcSeconds);
        if(currentEpochTime > endUtcSeconds) {
            document.getElementById('auction-ended-banner').style.display = "block";
        }

        //Once we've got the correct auction selected we can fill in the auction items
        getSelectedAuctionItems(selectedAuctionId);
    });
}

getSelectedAuctionItems = function(selectedAuctionId) {

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

            // CREATE ITEM DATA SECTION (NAME AND DESCRIPTION)

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

            // CREATE ITEM PRICING SECTION 

            let itemPrice = document.createElement('div');
            itemPrice.setAttribute('class', 'item__price');

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
                    
                    let itemCurrentPrice = document.createElement('p');
                    itemCurrentPrice.setAttribute('class', 'item__current-price');

                    let itemCurrentPriceLabel = document.createElement('span')
                    itemCurrentPriceLabel.innerHTML = "Current Price:" ;
                    let itemCurrentPriceAmount = document.createElement('span');
                    itemCurrentPriceAmount.innerHTML = "$" + resultObject.amount;
                    
                    itemCurrentPrice.appendChild(itemCurrentPriceLabel);
                    itemCurrentPrice.appendChild(itemCurrentPriceAmount);

                    itemPrice.appendChild(itemCurrentPrice);
               });
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

            bid.appendChild(bidAmount);
            bid.appendChild(bidButton);

            // Append all the stuff we made to the item card
            item.appendChild(itemImg);
            item.appendChild(itemData);
            item.appendChild(itemPrice);
            item.appendChild(bid);

            // Append item card to items
            items.appendChild(item);
        });

    });
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
            if(biddingValue > startingPrice) {
                //Confirm that user wants to place this bid
                var bidCheck = confirm("Confirm bid of $" + biddingValue + " on " + itemName);
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
                    var bidCheck = confirm("Confirm bid of $" + biddingValue + " on " + itemName);
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
    $.ajax({
        url: "/auction/resources/addBidToBids.php",
        type: "POST",
        data: {
            "biddingItemId": biddingItemId,
            "biddingUserId": biddingUserId,
            "biddingValue": biddingValue
        }
    }).done(function (result) {
        console.log("Bid result: " + result);
    });
}
