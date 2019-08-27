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

        // For each auction...
        resultArray.forEach(function (element) {
        
            let auctionRow = document.createElement('tr');

            let auctionId = element.id;
            let auctionName = element.name;
            let auctionStart = moment.unix(element.start_date_time).format('M/D/YY h:mm A');
            let auctionEnd = moment.unix(element.end_date_time).format('M/D/YY h:mm A');

            auctionRow.appendChild(document.createElement('td').innerHTML = auctionId);
            auctionRow.appendChild(document.createElement('td').innerHTML = auctionName);
            auctionRow.appendChild(document.createElement('td').innerHTML = auctionStart);
            auctionRow.appendChild(document.createElement('td').innerHTML = auctionEnd);
        
            
        });

    });

}