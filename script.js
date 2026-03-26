const calculateBtn = document.getElementById("calculateBtn");
const resultBox = document.getElementById("result");

const quoteModal = document.getElementById("quoteModal");
const quoteSummary = document.getElementById("quoteSummary");
const submitQuoteBtn = document.getElementById("submitQuoteBtn");
const quoteOutput = document.getElementById("quoteOutput");
const closeModalBtn = document.getElementById("closeModalBtn");
const navQuoteBtn = document.getElementById("navQuoteBtn");
const navQuoteBtnSecondary = document.getElementById("navQuoteBtnSecondary");

const roomTypeField = document.getElementById("roomType");
const roomLengthField = document.getElementById("roomLength");
const roomWidthField = document.getElementById("roomWidth");
const brightnessField = document.getElementById("brightness");

const clientNameField = document.getElementById("clientName");
const clientEmailField = document.getElementById("clientEmail");
const clientPhoneField = document.getElementById("clientPhone");
const additionalRequirementsField = document.getElementById("additionalRequirements");

let latestQuoteData = null;

/*
  Replace this with your real deployed Google Apps Script Web App URL
*/
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyegtwRehBMXoCRnqnYqpm-wbEacVpmD5vlbDWc0JS3HRzQO2XSkeeju9RFHU9TW8-evA/exec";

/* -----------------------------
   MODAL FUNCTIONS
----------------------------- */

function openQuoteModal() {
  if (!quoteModal) return;
  quoteModal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeQuoteModal() {
  if (!quoteModal) return;
  quoteModal.classList.remove("show");
  document.body.style.overflow = "";
}

/* -----------------------------
   HELPER FUNCTIONS
----------------------------- */

function formatRoomType(roomType) {
  const roomTypeMap = {
    bedroom: "Bedroom",
    "living-room": "Living Room",
    kitchen: "Kitchen",
    bathroom: "Bathroom",
    office: "Office",
    garage: "Garage"
  };

  return roomTypeMap[roomType] || roomType;
}

function getLuxLevel(roomType, brightness) {
  let luxLevel = 150;

  if (brightness === "medium") luxLevel = 250;
  if (brightness === "bright") luxLevel = 350;

  if (roomType === "kitchen" || roomType === "bathroom") {
    luxLevel += 50;
  }

  if (roomType === "office" || roomType === "garage") {
    luxLevel += 100;
  }

  return luxLevel;
}

function getLightingSuggestion(area, lights, lumensPerDownlight) {
  let suggestion = `${lights} downlights of approximately ${lumensPerDownlight} lumens each`;

  if (area > 25) {
    suggestion += " with possible additional feature lighting or perimeter lighting";
  }

  return suggestion;
}

function resetQuoteForm() {
  clientNameField.value = "";
  clientEmailField.value = "";
  clientPhoneField.value = "";
  additionalRequirementsField.value = "";

  quoteOutput.innerHTML = `
    <h3>Your quote request will appear here</h3>
    <p>Complete the calculator and the form, then click submit.</p>
  `;
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

function showCalculationResult(data) {
  resultBox.innerHTML = `
    <h3>Recommended Lighting</h3>
    <p><strong>Room type:</strong> ${data.roomType}</p>
    <p><strong>Room area:</strong> ${data.area} m²</p>
    <p><strong>Total light needed:</strong> ${data.lumens} lumens</p>
    <p><strong>Estimated downlights:</strong> ${data.lights}</p>
    <p><strong>Suggested setup:</strong> ${data.suggestion}</p>
  `;
}

function showCalculationError(message) {
  resultBox.innerHTML = `
    <h3>Invalid room size</h3>
    <p>${message}</p>
  `;
}

function showQuoteMessage(title, message1, message2 = "") {
  quoteOutput.innerHTML = `
    <h3>${title}</h3>
    <p>${message1}</p>
    ${message2 ? `<p>${message2}</p>` : ""}
  `;
}

function validateQuoteFields() {
  const clientName = clientNameField.value.trim();
  const clientEmail = clientEmailField.value.trim();
  const clientPhone = clientPhoneField.value.trim();

  if (!clientName || !clientEmail || !clientPhone) {
    showQuoteMessage(
      "Missing details",
      "Please complete your full name, email address, and telephone number."
    );
    return false;
  }

  return true;
}

function buildPayload() {
  return {
    clientName: clientNameField.value.trim(),
    clientEmail: clientEmailField.value.trim(),
    clientPhone: clientPhoneField.value.trim(),
    roomType: latestQuoteData.roomType,
    area: latestQuoteData.area,
    lumens: latestQuoteData.lumens,
    lights: latestQuoteData.lights,
    suggestion: latestQuoteData.suggestion,
    additionalRequirements: additionalRequirementsField.value.trim()
  };
}

/* -----------------------------
   CALCULATOR
----------------------------- */

function calculateLighting() {
  const roomType = roomTypeField.value;
  const roomLength = parseFloat(roomLengthField.value);
  const roomWidth = parseFloat(roomWidthField.value);
  const brightness = brightnessField.value;

  if (isNaN(roomLength) || isNaN(roomWidth) || roomLength <= 0 || roomWidth <= 0) {
    showCalculationError("Please enter a valid room length and width greater than 0.");
    return;
  }

  const area = roomLength * roomWidth;
  const luxLevel = getLuxLevel(roomType, brightness);
  const lumens = Math.round(area * luxLevel);

  const lumensPerDownlight = 800;
  const lights = Math.max(1, Math.ceil(lumens / lumensPerDownlight));
  const suggestion = getLightingSuggestion(area, lights, lumensPerDownlight);

  latestQuoteData = {
    roomType: formatRoomType(roomType),
    area: area.toFixed(2),
    lumens: lumens,
    lights: lights,
    suggestion: suggestion
  };

  showCalculationResult(latestQuoteData);
}

/* -----------------------------
   SUBMIT QUOTE
----------------------------- */

async function submitQuoteRequest() {
  if (!latestQuoteData) {
    showQuoteMessage(
      "Calculator required",
      "Please use the calculator first before submitting a quote request."
    );
    return;
  }

  if (!validateQuoteFields()) {
    return;
  }

  const payload = buildPayload();

  submitQuoteBtn.disabled = true;
  submitQuoteBtn.textContent = "SENDING...";

  showQuoteMessage(
    "Sending quote request...",
    "Please wait while we submit your details."
  );

  try {
    const response = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${responseText}`);
    }

    let result;

    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error("The server response was not valid JSON.");
    }

    if (result.status !== "success") {
      throw new Error(result.message || "The submission was not confirmed by the server.");
    }

    showQuoteMessage(
      "Thank you for your quote request",
      "We have received your details successfully.",
      "Our team will review your lighting requirements and get back to you shortly."
    );

    clientNameField.value = "";
    clientEmailField.value = "";
    clientPhoneField.value = "";
    additionalRequirementsField.value = "";

    setTimeout(() => {
      closeQuoteModal();
      resetQuoteForm();
    }, 2500);

  } catch (error) {
    showQuoteMessage(
      "Submission problem",
      "We could not send the quote request from the website.",
      `Error: ${error.message}`
    );
  } finally {
    submitQuoteBtn.disabled = false;
    submitQuoteBtn.textContent = "SUBMIT QUOTE REQUEST";
  }
}

/* -----------------------------
   EVENT LISTENERS
----------------------------- */

if (calculateBtn) {
  calculateBtn.addEventListener("click", calculateLighting);
}

if (navQuoteBtn) {
  navQuoteBtn.addEventListener("click", function (e) {
    e.preventDefault();
    updateQuoteSummary();
    openQuoteModal();
  });
}

if (navQuoteBtnSecondary) {
  navQuoteBtnSecondary.addEventListener("click", function (e) {
    e.preventDefault();
    updateQuoteSummary();
    openQuoteModal();
  });
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeQuoteModal);
}

window.addEventListener("click", function (e) {
  if (e.target === quoteModal) {
    closeQuoteModal();
  }
});

if (submitQuoteBtn) {
  submitQuoteBtn.addEventListener("click", submitQuoteRequest);
}
