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

// Gets user's name from localStorage and displays it on screen
getUserName = function() {
    const name = localStorage.getItem('token');
    console.log("Name found in localStorage is " + name);

    document.getElementById('auction-info__welcome').innerHTML = "Welcome, " + name;
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
        
        resultArray.forEach(function(element) {
            console.log("Here's one result: " + element.name);
        });
        
    });
}