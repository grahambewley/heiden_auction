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

            let auctionIdCell = document.createElement('td');
            auctionIdCell.innerHTML = auctionId;
            auctionRow.appendChild(auctionIdCell);

            let auctionNameCell = document.createElement('td');
            auctionNameCell.innerHTML = auctionName;
            auctionRow.appendChild(auctionNameCell);

            let auctionStartCell = document.createElement('td');
            auctionStartCell.innerHTML = auctionStart;
            auctionRow.appendChild(auctionStartCell);

            let auctionEndCell = document.createElement('td');
            auctionEndCell.innerHTML = auctionEnd;
            auctionRow.appendChild(auctionEndCell);
            
        });

    });

}