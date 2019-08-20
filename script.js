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
}

// Gets user's name from localStorage and displays it on screen
getUserName = function() {
    const name = localStorage.getItem('token');
    console.log("Name found in localStorage is " + name);

    document.getElementById('auction-info__welcome').innerHTML = "Welcome, " + name;
}

loadAuctionData = function() {

}