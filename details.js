
document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector("#phone-input");
  const flagContainer = document.querySelector("#flag");
  const countryList = document.querySelector("#country-list");
  const errorMessage = document.createElement("div");
  errorMessage.className = "error-message";
  errorMessage.textContent = "Invalid mobile number";
  const submitButton = document.querySelector("#submit-button");

  // Initialize intl-tel-input
  const iti = window.intlTelInput(input, {
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  });

  // Event listener for country dropdown change
  countryList.addEventListener("change", () => {
    const selectedCountryCode = countryList.value;
    iti.setCountry(selectedCountryCode);

    // Update the flag and country code
    const selectedCountryData = iti.getSelectedCountryData();
    flagContainer.className = `flag-icon flag-icon-${selectedCountryData.iso2.toLowerCase()}`;
    input.value = `+${selectedCountryData.dialCode}`;

    updateButtonState();
  });

  // Set initial flag and country code
  const selectedCountryData = iti.getSelectedCountryData();
  flagContainer.className = `flag-icon flag-icon-${selectedCountryData.iso2.toLowerCase()}`;
  input.value = `+${selectedCountryData.dialCode}`;

  // Event listener for phone number input changes
  input.addEventListener("input", () => {
    const selectedCountry = iti.getSelectedCountryData();
    flagContainer.className = `flag-icon flag-icon-${selectedCountry.iso2.toLowerCase()}`;
    updateButtonState();
  });

  // Event listener for form submission
  const form = document.querySelector("form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Check if any input field is empty
    const nameField = document.querySelector("#name");
    const emailField = document.querySelector("input[name='email']");
    const confirmEmailField = document.querySelector("input[name='c-mail']");
    const genderField = document.querySelector("#country-list");

    const isValidPhoneNumber = iti.isValidNumber();
    const isNameValid = nameField.value.trim() !== "";
    const isEmailValid = isValidEmail(emailField.value);
    const isConfirmEmailValid = isValidEmail(confirmEmailField.value);
    const isGenderSelected = genderField.value !== "none";

    if (!isNameValid || !isEmailValid || !isConfirmEmailValid || !isGenderSelected) {
      // Show error message and prevent form submission
      alert("Please fill in all required fields.");
      return;
    }

    if (!isValidPhoneNumber) {
      if (!errorMessage.parentNode) {
        input.parentNode.appendChild(errorMessage);
      }
      return;
    }

    if (emailField.value !== confirmEmailField.value) {
      alert("Please make sure your email and confirm email match.");
      confirmEmailField.classList.add("error");
      return;
    }

    // If the emails match, remove the error class
    confirmEmailField.classList.remove("error");

    // Form data is valid, store it in local storage (Optional)
    const formData = {
      phone: input.value,
      flag: flagContainer.className,
      country: countryList.value,
      name: nameField.value,
      email: emailField.value,
      confirmEmail: confirmEmailField.value,
      gender: genderField.value,
    };
    localStorage.setItem("formData", JSON.stringify(formData));

    // Redirect to payment page
    window.location.href = "payment.html";
  });

  // Function to remove error message
  function removeErrorMessage() {
    if (errorMessage.parentNode) {
      errorMessage.parentNode.removeChild(errorMessage);
    }
  }

  // Function to update button state
  function updateButtonState() {
    const nameField = document.querySelector("#name");
    const emailField = document.querySelector("input[name='email']");
    const confirmEmailField = document.querySelector("input[name='c-mail']");
    const genderField = document.querySelector("#country-list");

    const isValidPhoneNumber = iti.isValidNumber();
    const isNameValid = nameField.value.trim() !== "";
    const isEmailValid = isValidEmail(emailField.value);
    const isConfirmEmailValid = isValidEmail(confirmEmailField.value);
    const isGenderSelected = genderField.value !== "none";

    const isFormValid =
      isValidPhoneNumber &&
      isNameValid &&
      isEmailValid &&
      isConfirmEmailValid &&
      isGenderSelected;

    submitButton.disabled = !isFormValid;
  }

  // Function to validate email format
  function isValidEmail(email) {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Initial button state update
  updateButtonState();

  // New code snippet starts here

  const detailsTableBody = document.getElementById("details-table-body");
  const detailsTotal = document.getElementById("details-total");

  // Retrieve data from Local Storage
  const tab = localStorage.getItem("ticketData");
  const obj = JSON.parse(tab);
  const prices = {
    "Foreigner Adult": { normal: 10, peak: 13 },
    "Foreigner Child": { normal: 5, peak: 8 },
    "SL Adult": { normal: 4, peak: 6 },
    "SL Child": { normal: 2, peak: 3 },
    "Infant": { normal: 0, peak: 0 },
  };

  if (obj) {
    let total = 0;

    for (const key in obj.guestData) {
      if (obj.guestData.hasOwnProperty(key)) {
        let quantity = obj.guestData[key];

        // Replace null quantity with zero
        if (quantity === null) {
          quantity = 0;
        }

        const price = prices[key].normal * quantity;

        const markup = `<tr><th>${key}</th><td>${quantity}</td><td>$${price}</td></tr>`;
        detailsTableBody.innerHTML += markup;

        total += price;
      }
    }

    detailsTotal.textContent = `$${total}`;
  }
});
