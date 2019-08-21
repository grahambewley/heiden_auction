// onload function for index.html page
window.onload = function() {
    /*  -- This is causing a loop with the window.onload script from the login page... commenting out for now
    // If no token is stored, boot to login screen
    if (localStorage.getItem("token") === null) {
        window.location.href = "http://heiden.tech/auction/login.html";
    }
    // Otherwise, begin loading auction data
    else {
        // Gets user's name from localStorage and displays it on screen
        getUserName();

        loadAuctionData();
    }
    */

    getUserName();

    getCurrentAuctionMetadata();

    // NEXT UP
    //getCurrentAuctionItems();
}

const selectedAuctionId = '';

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

        //Convert the start_date_time epoch time from the database into a JavaScript Date object
        var startUtcSeconds = resultObject.start_date_time;
        // Use moment.js to convert Epoch times to readable date
        console.log(moment.unix(startUtcSeconds).format('DD/MM/YYYY HH:mm'));


        //Convert the end_date_time epoch time from the database into a JavaScript Date object
        var endUtcSeconds = resultObject.end_date_time;
        // Use moment.js to convert Epoch times to readable date
        console.log(moment.unix(endUtcSeconds).format('DD/MM/YYYY HH:mm'));

        document.getElementById('auction-info__name').innerHTML = selectedAuctionName;
        document.getElementById('auction-info__date-span').innerHTML = resultObject.start_date_time + " &mdash; " + resultObject.end_date_time;

    });
}