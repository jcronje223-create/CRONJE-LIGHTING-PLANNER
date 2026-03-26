const calculateBtn = document.getElementById("calculateBtn");
const resultBox = document.getElementById("result");

const quoteModal = document.getElementById("quoteModal");
const quoteSummary = document.getElementById("quoteSummary");
const submitQuoteBtn = document.getElementById("submitQuoteBtn");
const quoteOutput = document.getElementById("quoteOutput");
const closeModalBtn = document.getElementById("closeModalBtn");
const navQuoteBtn = document.getElementById("navQuoteBtn");

let latestQuoteData = null;

/* IMPORTANT:
   Replace the URL below with YOUR real Google Apps Script Web App URL.
*/
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyegtwRehBMXoCRnqnYqpm-wbEacVpmD5vlbDWc0JS3HRzQO2XSkeeju9RFHU9TW8-evA/exec";

function openQuoteModal() {
  quoteModal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeQuoteModal() {
  quoteModal.classList.remove("show");
  document.body.style.overflow = "";
}

function updateQuoteSummary() {
  if (!latestQuoteData) {
    quoteSummary.innerHTML = `
      <h3>Calculator Summary</h3>
      <p>No calculator data yet. Please use the calculator first.</p>
    `;
    return;
  }

  quoteSummary.innerHTML = `
    <h3>Calculator Summary</h3>
    <p><strong>Room type:</strong> ${latestQuoteData.roomType}</p>
    <p><strong>Room area:</strong> ${latestQuoteData.area} m²</p>
    <p><strong>Total light needed:</strong> ${latestQuoteData.lumens} lumens</p>
    <p><strong>Estimated downlights:</strong> ${latestQuoteData.lights}</p>
    <p><strong>Suggested setup:</strong> ${latestQuoteData.suggestion}</p>
  `;
}

function resetQuoteForm() {
  document.getElementById("clientName").value = "";
  document.getElementById("clientEmail").value = "";
  document.getElementById("clientPhone").value = "";
  document.getElementById("additionalRequirements").value = "";

  quoteOutput.innerHTML = `
    <h3>Your quote request will appear here</h3>
    <p>Complete the calculator and the form, then click submit.</p>
  `;
}

calculateBtn.addEventListener("click", function () {
  const roomType = document.getElementById("roomType").value;
  const roomLength = parseFloat(document.getElementById("roomLength").value);
@@ -185,6 +197,9 @@
    additionalRequirements: additionalRequirements
  };

  submitQuoteBtn.disabled = true;
  submitQuoteBtn.textContent = "SENDING...";

  quoteOutput.innerHTML = `
    <h3>Sending quote request...</h3>
    <p>Please wait while we submit your details.</p>
@@ -200,22 +215,25 @@
      body: JSON.stringify(payload)
    });

  quoteOutput.innerHTML = `
  <h3>Thank you for your quote request</h3>
  <p>We have received your details successfully.</p>
  <p>Our team will review your lighting requirements and get back to you shortly.</p>
`;
    quoteOutput.innerHTML = `
      <h3>Thank you for your quote request</h3>
      <p>We have received your details successfully.</p>
      <p>Our team will review your lighting requirements and get back to you shortly.</p>
    `;

    document.getElementById("clientName").value = "";
    document.getElementById("clientEmail").value = "";
    document.getElementById("clientPhone").value = "";
    document.getElementById("additionalRequirements").value = "";
    setTimeout(function () {
      closeQuoteModal();
      resetQuoteForm();
    }, 2500);

  } catch (error) {
    quoteOutput.innerHTML = `
      <h3>Submission problem</h3>
      <p>We could not send the quote request from the website.</p>
      <p><strong>Error:</strong> ${error.message}</p>
      <p>Please try again in a moment.</p>
    `;
  } finally {
    submitQuoteBtn.disabled = false;
    submitQuoteBtn.textContent = "SUBMIT QUOTE REQUEST";
  }
});
