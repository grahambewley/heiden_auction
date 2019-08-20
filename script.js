//on-load stuff:
//Check for stored token 
//  -- if not present, redirect to login.html
//  -- if present, load index.html like normal and trigger auction query

checkLoginCreds = function() {
    // Get username and password from input fields
    const inputUsername = document.getElementById('loginUsername').value;
    const inputPassword = document.getElementById('loginPassword').value;

    // AJAX request -- check if the entered credentials are valid
    $.ajax({      
        "crossDomain": true,
        "url": "/auction/resources/checkLoginCreds.php?user="+inputUsername+"&pw="+inputPassword,
        "method": "POST",
        "success": function(result){
            
            //Here you can do whatever with the result
            //TRUE means the login was successful and the credentials are legit
            //FALSE means the login was unsuccessful

            console.log(result);

            if(result == 'TRUE') {
                
                alert("Nice, credentials are VALID!");
            }
            else if (result == 'FALSE') {
                alert("Whoops, credentials are INVALID!");
            }
        }
    });
      
}