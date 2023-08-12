

  document.addEventListener("DOMContentLoaded", function () {
    const visitDateInput = document.getElementById("visitDate");
    const durationSelect = document.getElementById("duration");
    const ticketsTable = document.getElementById("tickets-table");
    const totalPayable = document.getElementById("total-paypal");
    const continueButton = document.getElementById("continue-button");

    const prices = {
      "Foreigner Adult": { normal: 10, peak: 13 },
      "Foreigner Child": { normal: 5, peak: 8 },
      "SL Adult": { normal: 4, peak: 6 },
      "SL Child": { normal: 2, peak: 3 },
      "Infant": { normal: 0, peak: 0 }, // infants are free
    };

    const peakHours = [ 4, 5, 6, 9, 10, 11];

    function calculateTotalDuration(selectedOptions) {
      let totalDuration = 0;
      selectedOptions.forEach((optionValue) => {
        const duration = parseInt(optionValue);
        if (!isNaN(duration)) {
          totalDuration += duration;
        }
      });
      return totalDuration;
    }

    function calculateTotalNormalPrice(category, quantity, totalDuration) {
      return prices[category].normal * quantity;
    }

    function calculateTotalPeakPrice(category, quantity, totalDuration) {
      return prices[category].peak * quantity * calculateTotalPeakHours(totalDuration);
    }

    function calculateTotalPeakHours(totalDuration) {
      let peakDuration = 0;
      for (const hour of peakHours) {
        if (totalDuration >= hour) {
          peakDuration += 1;
        } else {
          break;
        }
      }
      return peakDuration;
    }

    function updateSummary() {
      const date = visitDateInput.value;
      const selectedOptions = Array.from(durationSelect.selectedOptions).map((option) => option.value);
      const totalDuration = calculateTotalDuration(selectedOptions);

      const guestsInputs = [
        document.getElementById("foreigner-adult"),
        document.getElementById("foreigner-child"),
        document.getElementById("sl-adult"),
        document.getElementById("sl-child"),
        document.getElementById("infant"),
      ];

      let total = 0;
      const tableBody = document.getElementById("tickets-table");
      tableBody.innerHTML = "";

      const ticketData = [
        ["Foreigner Adult", parseInt(guestsInputs[0].value)],
        ["Foreigner Child", parseInt(guestsInputs[1].value)],
        ["SL Adult", parseInt(guestsInputs[2].value)],
        ["SL Child", parseInt(guestsInputs[3].value)],
        ["Infant", parseInt(guestsInputs[4].value)],
      ];

      for (const [category, quantity] of ticketData) {
        if (quantity > 0) {
          const row = tableBody.insertRow();
          const cellCategory = row.insertCell();
          const cellDate = row.insertCell();
          const cellTime = row.insertCell();
          const cellDuration = row.insertCell();
          const cellQuantity = row.insertCell();
          const cellPrice = row.insertCell();

          const normalPrice = calculateTotalNormalPrice(category, quantity, totalDuration);
          const peakPrice = calculateTotalPeakPrice(category, quantity, totalDuration);
          const price = normalPrice + peakPrice;

          cellCategory.innerHTML = category;
          cellDate.innerHTML = date;

          const hour = 7; // Starting hour
          const durationHours = Math.floor(totalDuration); // Calculate the integer part of the duration
          const minute = "00"; // Minute value

          const startTime = new Date(date);
          startTime.setHours(hour);
          startTime.setMinutes(minute);

          const endTime = new Date(startTime);
          endTime.setHours(startTime.getHours() + durationHours);

          const startTimeString = startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          const endTimeString = endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          cellTime.innerHTML = `${startTimeString} - ${endTimeString}`;
          cellDuration.innerHTML = `${totalDuration} hour(s)`;
          cellQuantity.innerHTML = quantity;

          if (category === "Infant") {
            cellPrice.innerHTML = "Free";
          } else {
            cellPrice.innerHTML = `$${price}`;
          }

          total += price;
        }
      }

      totalPayable.innerHTML = `$${total}`;
      continueButton.disabled = total === 0;

      const ticketDataForLocalStorage = {
        date: visitDateInput.value,
        duration: totalDuration,
        guestData: {
          "Foreigner Adult": parseInt(guestsInputs[0].value),
          "Foreigner Child": parseInt(guestsInputs[1].value),
          "SL Adult": parseInt(guestsInputs[2].value),
          "SL Child": parseInt(guestsInputs[3].value),
          "Infant": parseInt(guestsInputs[4].value),
        },
        totalPayable: total,
      };
      localStorage.setItem("ticketData", JSON.stringify(ticketDataForLocalStorage));
    }

    // Add event listeners
    flatpickr(visitDateInput, {
      dateFormat: "m-d-Y",
      onChange: function (selectedDates, datestr, instance) {
        localStorage.setItem("selectedDate", datestr);
        updateSummary();
      },
    });

    durationSelect.addEventListener("change", function () {
      updateSummary();
    });

    // Set default values for date, adult ticket, and update table on first load
    const storedDate = localStorage.getItem("selectedDate");
    if (storedDate) {
      visitDateInput.value = storedDate;
    } else {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      visitDateInput.value = formattedDate;
      localStorage.setItem("selectedDate", formattedDate); 
    }

    // Set default value for adult ticket to 1
    document.getElementById("foreigner-adult").value = 1;

    updateSummary();

    // Add click event listener to the "continue with purchase" button
    continueButton.addEventListener("click", function () {
      document.body.classList.add("fade-out");
      setTimeout(function (){
        window.location.href = "details.html";

      },1000);
     
    });
    
});
