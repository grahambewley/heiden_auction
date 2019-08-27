window.onload = function() {
    loadAdminTableData();
}

function loadAdminTableData() {

    const auctionsTable = document.getElementById('auctionsTable');

    // Populate Auctions table with data
    $.ajax({
        url: "/auction/resources/getAllAuctions.php",
        type: "POST"
    }).done(function (result) {

        let resultArray = JSON.parse(result);

        

    });

}