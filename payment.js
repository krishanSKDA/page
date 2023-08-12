

document.addEventListener("DOMContentLoaded", () => {
  const userMobileElement = document.querySelector("#user-mobile span");
  const userEmailElement = document.querySelector("#user-email span");
  const userNameElement = document.querySelector("#user-name span");
  const ticketDetailsTable = document.querySelector("#ticket-details-table");
  const totalPayableElement = document.querySelector("#total-payable");
  const storedCardData = JSON.parse(localStorage.getItem("cardDetails")) || [];
  const tab = localStorage.getItem("ticketData");
  const ticketData = JSON.parse(tab);

  const cardNumber = document.querySelector("#card-number");
  const cardHolder = document.querySelector("#name-text");
  const cardExpiration = document.querySelector("#valid-thru-text");
  const cardCVV = document.querySelector("#cvv-text");
  const payBtn = document.querySelector("#pay-btn");

  const cardNumberText = document.querySelector(".number-vl");
  const cardHolderText = document.querySelector(".name-vl");
  const cardExpirationText = document.querySelector(".expiration-vl");
  const cardCVVText = document.querySelector(".cvv-vl");

  const form = document.querySelector("#credit-card");
  const summaryTable = document.querySelector("#summary-table");
  const clearDataBtn = document.querySelector("#clear-data");

  const prices = {
    "Foreigner Adult": { normal: 10, peak: 13 },
    "Foreigner Child": { normal: 5, peak: 8 },
    "SL Adult": { normal: 4, peak: 6 },
    "SL Child": { normal: 2, peak: 3 },
    "Infant": { normal: 0, peak: 0 },
  };

  // Event listener for card number input
  cardNumber.addEventListener("input", (e) => {
    const inputCardNumber = e.target.value.replace(/\s/g, ""); 
    if (inputCardNumber.length <= 16) {
      const formattedNumber = formatCardNumber(inputCardNumber);
      cardNumberText.textContent = formattedNumber;
      validateForm();
    } else {
      alert("Card number should be 16 digits or less.");
    }
  });

  // Event listener for card holder input
  cardHolder.addEventListener("input", (e) => {
    const inputCardHolder = e.target.value.trim();
    if (/^[a-zA-Z\s]+$/.test(inputCardHolder)) {
      cardHolderText.textContent = inputCardHolder ? inputCardHolder.toUpperCase() : "Name on Card";
      validateForm();
    } else {
      alert("Please enter a valid card holder name.");
    }
  });

  // Event listener for CVV input
  cardCVV.addEventListener("input", (e) => {
    const inputCardCVV = e.target.value;
    const isValidCVV = /^[0-9]{3,4}$/.test(inputCardCVV);
    if (isValidCVV) {
      cardCVVText.textContent = inputCardCVV;
      updateSummaryTable();
      validateForm();
    } else {
      alert("Please enter a valid CVV/CVC (3 or 4 digits).");
    }
  });

  cardExpiration.addEventListener("input", (e) => {
    const formattedDate = formatExpirationDate(e.target.value);
    cardExpirationText.textContent = formattedDate;
    updateSummaryTable();
    validateForm();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    saveToLocalStorage();
    updateSummaryTable();
    form.reset();
    payBtn.disabled = true;
    showPaymentSuccess();
    setTimeout(() => {
      window.location.href = "confirmation.html";
    }, 3000);
  });

  // Clear data button click handler
  clearDataBtn.addEventListener("click", () => {
    clearLocalStorage();
    updateSummaryTable();
    payBtn.disabled = true;
  });

  // Display user mobile number and email
  const userData = JSON.parse(localStorage.getItem("formData"));
  if (userData) {
    userNameElement.textContent = userData.name;
    userMobileElement.textContent = userData.phone;
    userEmailElement.textContent = userData.email;
  }

  // Display ticket details and payment summary
  if (ticketData) {
    let totalPayable = 0;

    for (const key in ticketData.guestData) {
      if (ticketData.guestData.hasOwnProperty(key)) {
        const quantity = ticketData.guestData[key]  || 0;
        const price = prices[key].normal * quantity;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${key}</td>
          <td>${quantity}</td>
          <td>$${price}</td>
        `;

        ticketDetailsTable.appendChild(row);
        totalPayable += price;
      }
    }

    totalPayableElement.textContent = `$${totalPayable.toFixed(2)}`;
  }

  // Function to format card number
  function formatCardNumber(number) {
    const formattedNumber = number.replace(/(\d{4})/g, '$1 ').trim();
    return formattedNumber;
  }

  // Function to format the expiration date
  function formatExpirationDate(date) {
    const formattedDate = date.replace(/(\d{2})(\d{2})/, '$1/$2');
    return formattedDate;
  }

  // Function to validate the form
  function validateForm() {
    const isValidCardNumber = cardNumber.checkValidity();
    const isValidCardHolder = cardHolder.checkValidity();
    const isValidExpiration = cardExpiration.checkValidity();
    const isValidCVV = cardCVV.checkValidity();

    if (isValidCardNumber && isValidCardHolder && isValidExpiration && isValidCVV) {
      payBtn.disabled = false;
    } else {
      payBtn.disabled = true;
    }
  }

  // Function to save data to local storage
  function saveToLocalStorage() {
    const cardDetails = {
      cardNumber: cardNumber.value,
      cardHolder: cardHolder.value,
      cardExpiration: cardExpiration.value,
      cardCVV: cardCVV.value,
    };

    let storedData = JSON.parse(localStorage.getItem("cardDetails")) || [];
    storedData.push(cardDetails);
    localStorage.setItem("cardDetails", JSON.stringify(storedData));
  }

  // Function to clear data from local storage
  function clearLocalStorage() {
    localStorage.removeItem("cardDetails");
  }

  // Function to update the summary table with data from local storage
  function updateSummaryTable() {
    summaryTable.innerHTML = `
      <thead>
        <tr>
          <th>Card Number</th>
          <th>Name on Card</th>
          <th>Expiry Date</th>
          <th>CVC / CVV</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    `;

    const storedData = JSON.parse(localStorage.getItem("cardDetails")) || [];

    storedData.forEach((data) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.cardNumber}</td>
        <td>${data.cardHolder}</td>
        <td>${data.cardExpiration}</td>
        <td>${data.cardCVV}</td>
      `;
      summaryTable.appendChild(row);
    });
  }

  // Function to show the payment success message
  function showPaymentSuccess() {
    const successMessage = document.createElement("div");
    successMessage.textContent = "Payment Successfully!";
    successMessage.classList.add("payment-success");
    document.body.appendChild(successMessage);
    setTimeout(() => {
      successMessage.remove();
    }, 4000);
  }

  updateSummaryTable();
});
