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

let selectedAuctionId = '';

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
        console.log("Data returned from getCurrentAuctionMetadata: " + result);

        // Convert the result returned from PHP, from JSON to JavaScript object
        let resultObject = JSON.parse(result);

        const selectedAuctionName = resultObject.name;
        selectedAuctionId = resultObject.id;
        console.log('Just set selectedAuctionId to ' + selectedAuctionId);

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
        getSelectedAuctionItems();
    });
}

getSelectedAuctionItems = function() {
    console.log('selectedAuctionId = ' + selectedAuctionId);

    $.ajax({      
        url: "/auction/resources/getSelectedAuctionItems.php",
        type: "POST",
        data: { "id": selectedAuctionId }
    
    }).done(function(result) {
        let resultArray = JSON.parse(result);

        console.log("Items from the selected Auction: " + result);
        
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
            // THIS IS WHERE THE STARTING / CURRENT BID STUFF WOULD GO
            // letItemStartingBid = ......... AND SO ON

            itemData.appendChild(itemName);
            itemData.appendChild(itemDescription);
            // APPEND STARTING / CURRENT BIDS HERE

            // Create bid container, plus the input and button that go within
            let bid = document.createElement('div');
            bid.setAttribute('class', 'bid');

            let bidAmount = document.createElement('input');
            bidAmount.setAttribute('type', 'text');
            bidAmount.setAttribute('class', 'bid__amount');
            bidAmount.setAttribute('id', 'bidAmount');
            bidAmount.setAttribute('placeholder', 'Your bid');

            let bidButton = document.createElement('button');
            bidButton.setAttribute('class', 'bid__button');
            // Set custom attribute that holds this auction item's unique id
            bidButton.setAttribute('item_id', element.id);
            bidButton.setAttribute('onclick', 'placeBid(this.id)');
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

placeBid = function(itemId) {
    console.log("Bid button clicked! Item ID passed over was " + itemId);
}