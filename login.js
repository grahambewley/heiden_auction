//on-load stuff:
//Check for stored token (cookie/localStorage)
//  -- if not present, redirect to login.html
//  -- if present, load index.html like normal and trigger auction query

// onload function for Login page
window.onload = function() {
    if (localStorage.getItem("token") !== null) {
        // >> If token was generated then we should redirect them (auto auth) to the index.html.  How do we do this? (-- SEE BELOW)
        window.location.href = "http://heiden.tech/auction/index.html";
    } else {
        
        //checkLoginCreds();
        // >> go straight to function call so they can AUTH and gen token.
    }
}

// Function triggered by login button on login.html
checkLoginCreds = function() {
    // Get username and password from input fields on login.html page
    const inputUsername = document.getElementById('loginUsername').value;
    const inputPassword = document.getElementById('loginPassword').value;
    
    // AJAX request -- checks if the entered credentials are valid
    $.ajax({      
    
        url: "/auction/resources/checkLoginCreds.php",
        type: "POST",
        data: { "user": inputUsername, "pw": inputPassword }
    
    }).done(function(result) {
    
        //Here you can really do *whatever* with the result
        //  'result' will either be the string 'TRUE' or 'FALSE'
        //      TRUE means the login attempt was successful 
        //      FALSE means the login attempt was unsuccessful

        if(result == 'TRUE') {
            alert("Nice, credentials are VALID!");
            // LOGIC FOR SUCCESSFUL LOGIN GOES HERE
            // -- Create and store some sort of token, maybet just the username or something

            localStorage.setItem("token", inputUsername);

            // -- Then redirect to index.html
            window.location.href = "http://heiden.tech/auction/index.html";
        }
        else if (result == 'FALSE') {
            alert("Whoops, credentials are INVALID!");
            // LOGIC FOR UNSUCCESSFUL LOGIN GOES HERE
            // -- Blank out the input filds? Display some sort of "Invalid login" message?
            inputUsername.value = "";
            inputPassword.value = "";

            // >> I was looking a way to do input validation - maybe the alert is good enough for now....

        }
    });
      
}
