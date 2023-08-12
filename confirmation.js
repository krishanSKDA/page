/*
  document.addEventListener("DOMContentLoaded", () => {
    // Get the table body element
    const tableBody = document.querySelector('#detailsTableBody');
    
    // Retrieve data from local storage
    const formData = JSON.parse(localStorage.getItem('formData'));
    const ticketData = JSON.parse(localStorage.getItem('ticketData'));
    const selectedData = JSON.parse(localStorage.getItem('selectedData'));
  
    // Populate the table with data
    if (formData) {
        populateTable(formData);
    }
    if (ticketData) {
        populateTable(ticketData);
        
        // Calculate and display ticket details
        const ticketDetails = {};
        for (const key in ticketData.guestData) {
            if (ticketData.guestData.hasOwnProperty(key)) {
                ticketDetails[`${key} Tickets`] = ticketData.guestData[key];
            }
        }
        populateTable(ticketDetails);
        
        // Calculate and display charges and totals
        const ticketPrices = ticketData.prices;
        let totalCharges = 0;
        for (const key in ticketData.guestData) {
            if (ticketData.guestData.hasOwnProperty(key)) {
                const ticketQuantity = ticketData.guestData[key];
                const ticketPrice = ticketPrices[key]?.normal || 0;
                const ticketCharge = ticketQuantity * ticketPrice;
                totalCharges += ticketCharge;
                populateTable({ [`${key} Charges`]: `$${ticketCharge.toFixed(2)}` });
            }
        }
        populateTable({ "Total Charges": `$${totalCharges.toFixed(2)}` });
        populateTable({ "Total Payable": `$${(totalCharges + ticketData.totalPayable).toFixed(2)}` });
    }
    if (selectedData) {
        populateTable(selectedData);
    }
  });
  
  function populateTable(data) {
    const tableBody = document.querySelector('#detailsTableBody');
    const excludedFields = ['country', 'confirmEmail', 'flag', 'guestData']; // Fields to exclude
  
    // Remove 'guest' from excludedFields
    const index = excludedFields.indexOf('guest');
    if (index !== -1) {
        excludedFields.splice(index, 1);
    }
  
    for (const key in data) {
        if (data.hasOwnProperty(key) && !excludedFields.includes(key)) {
            const row = document.createElement('tr');
            const propertyCell = document.createElement('td');
            const valueCell = document.createElement('td');
  
            propertyCell.textContent = key;
            
            // Format the duration with hours
            if (key === 'Duration') {
                valueCell.textContent = `${data[key]} hours`;
            } else {
                valueCell.textContent = data[key];
            }
  
            row.appendChild(propertyCell);
            row.appendChild(valueCell);
  
            tableBody.appendChild(row);
        }
    }
  }
  
  // ... (rest of your code)
  
*/
document.addEventListener("DOMContentLoaded", () => {
    // Get the table body element
    const tableBody = document.querySelector('#detailsTableBody');
    
    // Retrieve data from local storage
    const formData = JSON.parse(localStorage.getItem('formData'));
    const ticketData = JSON.parse(localStorage.getItem('ticketData'));
    const selectedData = JSON.parse(localStorage.getItem('selectedData'));
  
    // Populate the table with data
    if (formData) {
        populateTable(formData);
    }
    if (ticketData) {
        populateTable(ticketData);
        
        // Calculate and display ticket details
        const ticketDetails = {};
        for (const key in ticketData.guestData) {
            if (ticketData.guestData.hasOwnProperty(key)) {
                ticketDetails[`${key} Tickets`] = ticketData.guestData[key];
            }
        }
        populateTable(ticketDetails);
        
        // Calculate and display charges and totals
        const ticketPrices = ticketData.prices;
        let totalCharges = 0;
        for (const key in ticketData.guestData) {
            if (ticketData.guestData.hasOwnProperty(key)) {
                const ticketQuantity = ticketData.guestData[key];
                const ticketPrice = ticketPrices[key]?.normal || 0;
                const ticketCharge = ticketQuantity * ticketPrice;
                totalCharges += ticketCharge;
                populateTable({ [`${key} Charges`]: `$${ticketCharge.toFixed(2)}` });
            }
        }
        populateTable({ "Total Charges": `$${totalCharges.toFixed(2)}` });
        populateTable({ "Total Payable": `$${(totalCharges + ticketData.totalPayable).toFixed(2)}` });
    }
    if (selectedData) {
        populateTable(selectedData);
    }
});

function populateTable(data) {
    const tableBody = document.querySelector('#detailsTableBody');
    const excludedFields = ['country', 'confirmEmail', 'flag', 'guestData']; // Fields to exclude

    // Remove 'guest' from excludedFields
    const index = excludedFields.indexOf('guest');
    if (index !== -1) {
        excludedFields.splice(index, 1);
    }

    for (const key in data) {
        if (data.hasOwnProperty(key) && !excludedFields.includes(key)) {
            const row = document.createElement('tr');
            const propertyCell = document.createElement('td');
            const valueCell = document.createElement('td');

            propertyCell.textContent = key;

            // Format the duration with hours
            if (key === 'Duration') {
                valueCell.textContent = `${data[key]} hours`;
            } else {
                // Display zero if the value is undefined or null
                valueCell.textContent = data[key] || '0';
            }

            row.appendChild(propertyCell);
            row.appendChild(valueCell);

            tableBody.appendChild(row);
        }
    }
}



  