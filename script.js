// onload function for index.html page
window.onload = function() {
    /*  -- This is causing a loop with the window.onload script from the login page... commenting out for now
    // If no token is stored, boot to login screen
    if (localStorage.getItem("token") === null) {
        window.location.href = "http://heiden.tech/auction/login.html";
    }
    */

    getUserName();

    getCurrentAuctionMetadata();
    
}

// Gets user's name from localStorage and displays it on screen OR display Login button
getUserName = function() {
    const name = localStorage.getItem('name');

    const auctionInfo = document.getElementById('auction-info');

    //If name in localStorage is set to null then create Login button and append it
    if(name === null) {        
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

getCurrentAuctionMetadata = function() {
    $.ajax({      
    
        url: "/auction/resources/getCurrentAuctionMetadata.php",
        type: "POST",
    
    }).done(function(result) {

        // Convert the result returned from PHP, from JSON to JavaScript object
        let resultObject = JSON.parse(result);

        const selectedAuctionName = resultObject.name;
        const selectedAuctionId = resultObject.id;

        //Convert the start_date_time epoch time from the database into a JavaScript Date object
        var startUtcSeconds = resultObject.start_date_time;
        // Use moment.js to convert Epoch times to readable date
        let formattedStartDateTime = moment.unix(startUtcSeconds).format('MM/DD/YY h:mm A');

        //Convert the end_date_time epoch time from the database into a JavaScript Date object
        var endUtcSeconds = resultObject.end_date_time;
        // Use moment.js to convert Epoch times to readable date
        let formattedEndDateTime = moment.unix(endUtcSeconds).format('MM/DD/YY h:mm A');
        
        document.getElementById('auction-info__name').innerHTML = selectedAuctionName;
        document.getElementById('auction-info__date-span').innerHTML = formattedStartDateTime + " &mdash; " + formattedEndDateTime;

        //Once we've got the correct auction selected we can fill in the auction items
        getSelectedAuctionItems(selectedAuctionId);
    });
}

getSelectedAuctionItems = function(selectedAuctionId ) {

    $.ajax({      
        url: "/auction/resources/getSelectedAuctionItems.php",
        type: "POST",
        data: { "id": selectedAuctionId }
    
    }).done(function(result) {
        let resultArray = JSON.parse(result);
        
        const items = document.getElementById('items');

        resultArray.forEach(function(element) {

            // Create item container div
            let item = document.createElement('div');
            item.setAttribute('class', 'item');
            
            // Create image that goes at the top of the item card
            let itemImg = document.createElement('img');
            itemImg.setAttribute('src', 'img/'+element.image_filename);
            itemImg.setAttribute('alt', 'Auction item image');
            itemImg.setAttribute('class', 'item__img');
            
            // Create item__data container, plus the name and description that go within
            let itemData = document.createElement('div');
            itemData.setAttribute('class', 'item__data');

            let itemName = document.createElement('p');
            itemName.setAttribute('class', 'item__name');
            itemName.innerHTML = element.name;

            let itemDescription = document.createElement('p');
            itemDescription.setAttribute('class', 'item__description');
            itemDescription.innerHTML = element.description;

            // STAN:
            // THIS IS WHERE THE "STARTING BID" STUFF WOULD GO
            // letItemStartingBid = ......... AND SO ON

            // THIS IS WHERE THE "CURRENT BID" STUFF WILL GO??
            // IF high_bid_id !== null then create + append "Current Bid"

            itemData.appendChild(itemName);
            itemData.appendChild(itemDescription);
            // APPEND STARTING / CURRENT BIDS HERE


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
            bidButton.innerHTML = "Bid";

            bid.appendChild(bidAmount);
            bid.appendChild(bidButton);

            // Append all the stuff we made to the item card
            item.appendChild(itemImg);
            item.appendChild(itemData);
            item.appendChild(bid);

            // Append item card to items
            items.appendChild(item);
        });
        
    });
}

checkBid = function(item) {

    const biddingItemId = item.getAttribute('item_id');
    const biddingUserId = localStorage.getItem('user_id');
    const biddingValue = item.firstElementChild.value;

    console.log("Attempting to bid on item ID " + biddingItemId);
    console.log("My User ID is " + biddingUserId);
    console.log("Bid amount entered is " + biddingValue);

    console.log("Getting bid data on this item...");
    // Query item based on item id -- return result
    $.ajax({      
        url: "/auction/resources/getItemBidData.php",
        type: "POST",
        data: { "id": biddingItemId }
    }).done(function(result) {

        // Get data on this item after clicking the bid button
        let resultObject = JSON.parse(result);
        console.log("This item's Starting Price: " + resultObject.starting_price);
        console.log("This item's current High Bid ID: " + resultObject.high_bid_id);
        console.log("TYPEOF resultObject.starting_price = " + typeof resultObject.starting_price);
        console.log("TYPEOF resultObject.high_bid_id = " + typeof resultObject.high_bid_id);
        console.log("and TYPEOF biddingValue = " + typeof biddingValue);


        // If the returned item has no current high_bid_id -- means it hasn't been bid on yet
        if(resultObject.high_bid_id === null) {
            console.log('high_bid_id is set to null on this item, so this is the first bid');
            // If the value entered by the user is greater than the starting price of the item
            if(biddingValue > resultObject.starting_price) {
                console.log("biddingValue > resultObject.startingPrice --- This will work for initial bid");
                // Place bid into bids table
                placeBid(biddingItemId, biddingUserId, biddingValue);
            }
            // If the value entered is not greater than the starting price, let the user know
            else {
                console.log("Bid value not greater than starting price --- Invalid bid");
                alert("You must enter a bid greater than the starting price of $" + resultObject.starting_price);
            }
        }
        
        // Otherwise, this is not the first bid on this item
        else {
            console.log("This is NOT the first bid on this item");
            
            // Get the amount associated with the current high_bid_id 
            // (AJAX HERE)

            // If biddingValue > [highBidAmount] -- MAKE SURE NOT TO USE "resultObject" since that was used earlier
                // placeBid(... ... ...) 
            // Else
                // alert('You must enter a value greater than then current bid of $' + [highBidAmount])
        }
    });
}

placeBid = function(biddingItemId, biddingUserId, biddingValue) {
    $.ajax({      
        url: "/auction/resources/addBidToBids.php",
        type: "POST",
        data: { "biddingItemId": biddingItemId, "biddingUserId": biddingUserId, "biddingValue": biddingValue }
    }).done(function(result) {
        //let resultObject = JSON.parse(result);
        console.log("Bid result: " + result);
    });
}