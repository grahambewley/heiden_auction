//on-load stuff:
//Check for stored token (cookie/localStorage)
//  -- if not present, redirect to login.html
//  -- if present, load index.html like normal and trigger auction query

// onload function for Login page
window.onload = function() {
        // -- This is causing a loop with the window.onload script from the main index page... commenting out for now
    if (localStorage.getItem("user_id") !== null) {
        // >> If token was generated then we should redirect them (auto auth) to the index.html.  How do we do this? (-- SEE BELOW)
        window.location.href = "/auction/index.html";
    } else {
        checkLoginCreds;
    }
}

function logOffUser() {
    localStorage.clear();
    window.location.href = "/auction/login.html";
};


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
        
        // PHP script returns 0 if no result was found
        // If result is not zero, parse the returned user object and store some stuff, redirect to index page
        if(result != 0) {
            console.log("Result from user query is: " + result);
            // Parse JSON into JavaScript object
            let resultObject = JSON.parse(result);
            // Store id and name of this user in localStorage for use later
            localStorage.setItem("user_id", resultObject.id);
            localStorage.setItem("name", resultObject.name);

            // Redirect to index.html
            window.location.href = "/auction/index.html";
        }
        // ...If PHP returns 0 then no matching user was found, invalid login
        else { 
            alert("Sorry, those credentials are invalid. Please try again.");
            
            // Blank out the input fields
            inputUsername.value = "";
            inputPassword.value = "";
        }
    });
      
}
