const calculateBtn = document.getElementById("calculateBtn");
const resultBox = document.getElementById("result");

const quoteModal = document.getElementById("quoteModal");
const quoteSummary = document.getElementById("quoteSummary");
const submitQuoteBtn = document.getElementById("submitQuoteBtn");
const quoteOutput = document.getElementById("quoteOutput");
const closeModalBtn = document.getElementById("closeModalBtn");
const navQuoteBtn = document.getElementById("navQuoteBtn");

const resultQuoteBtn = document.getElementById("resultQuoteBtn");
const quoteActionWrap = document.getElementById("quoteActionWrap");

const roomTypeField = document.getElementById("roomType");
const lightTypeField = document.getElementById("lightType");
const roomLengthField = document.getElementById("roomLength");
const roomWidthField = document.getElementById("roomWidth");
const brightnessField = document.getElementById("brightness");

const clientNameField = document.getElementById("clientName");
const clientEmailField = document.getElementById("clientEmail");
const clientPhoneField = document.getElementById("clientPhone");
const additionalRequirementsField = document.getElementById("additionalRequirements");

const directClientNameField = document.getElementById("directClientName");
const directClientEmailField = document.getElementById("directClientEmail");
const directClientPhoneField = document.getElementById("directClientPhone");
const directQuoteDetailsField = document.getElementById("directQuoteDetails");
const submitDirectQuoteBtn = document.getElementById("submitDirectQuoteBtn");
const directQuoteOutput = document.getElementById("directQuoteOutput");

let latestQuoteData = null;

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxQG1MrU_U_HWjybp-c2AeIuaBmpN_iu8_t_JnKMR-E6dhvL6P4y5Eu36T88yPRFL6NZg/exec";

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

function getRecommendationData(lightType, area, lumens) {
  if (lightType === "LED strip lights") {
    let recommendedMetres = Math.max(3, Math.ceil(area * 1.2));

    if (area > 20) {
      recommendedMetres = Math.ceil(area * 1.5);
    }

    let suggestion =
      `${recommendedMetres} metres of LED strip lighting`;

    if (lumens > 4000) {
      suggestion += " with high-output strip and aluminium profiles for better heat dissipation";
    } else {
      suggestion += " with quality LED strip and proper drivers";
    }

    return {
      quantityLabel: "Estimated strip length",
      quantityValue: `${recommendedMetres} metres`,
      suggestion: suggestion,
      backendQuantity: recommendedMetres,
      backendUnit: "metres"
    };
  }

  if (lightType === "Downlights") {
    const lumensPerUnit = 800;
    const fittings = Math.max(1, Math.ceil(lumens / lumensPerUnit));

    let suggestion =
      `${fittings} recessed downlights of approximately ${lumensPerUnit} lumens each`;

    if (area > 25) {
      suggestion += " spaced evenly for balanced room coverage";
    } else {
      suggestion += " spaced evenly for a clean and modern finish";
    }

    return {
      quantityLabel: "Estimated fittings",
      quantityValue: `${fittings}`,
      suggestion: suggestion,
      backendQuantity: fittings,
      backendUnit: "fittings"
    };
  }

  if (lightType === "Bulb lights") {
    const lumensPerUnit = 900;
    const fittings = Math.max(1, Math.ceil(lumens / lumensPerUnit));

    let suggestion =
      `${fittings} bulb fittings using lamps of approximately ${lumensPerUnit} lumens each`;

    if (roomTypeField.value === "bedroom" || roomTypeField.value === "living-room") {
      suggestion += " with warm white lamps for a softer ambient feel";
    } else {
      suggestion += " with practical lamp placement for general room lighting";
    }

    return {
      quantityLabel: "Estimated fittings",
      quantityValue: `${fittings}`,
      suggestion: suggestion,
      backendQuantity: fittings,
      backendUnit: "fittings"
    };
  }

  if (lightType === "Spotlights") {
    const lumensPerUnit = 600;
    const fittings = Math.max(1, Math.ceil(lumens / lumensPerUnit));

    let suggestion =
      `${fittings} spotlights of approximately ${lumensPerUnit} lumens each`;

    if (area > 20) {
      suggestion += " arranged in zones for directional coverage";
    } else {
      suggestion += " aimed at key areas for directional and feature lighting";
    }

    return {
      quantityLabel: "Estimated fittings",
      quantityValue: `${fittings}`,
      suggestion: suggestion,
      backendQuantity: fittings,
      backendUnit: "fittings"
    };
  }

  const fallbackUnits = Math.max(1, Math.ceil(lumens / 800));

  return {
    quantityLabel: "Estimated fittings",
    quantityValue: `${fallbackUnits}`,
    suggestion: `${fallbackUnits} light fittings recommended for this room`,
    backendQuantity: fallbackUnits,
    backendUnit: "fittings"
  };
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

function resetDirectQuoteForm() {
  directClientNameField.value = "";
  directClientEmailField.value = "";
  directClientPhoneField.value = "";
  directQuoteDetailsField.value = "";

  directQuoteOutput.innerHTML = `
    <h3>Your direct quote request will appear here</h3>
    <p>Complete the form and click submit.</p>
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
    <p><strong>Preferred light type:</strong> ${latestQuoteData.lightType}</p>
    <p><strong>Room area:</strong> ${latestQuoteData.area} m²</p>
    <p><strong>Total light needed:</strong> ${latestQuoteData.lumens} lumens</p>
    <p><strong>${latestQuoteData.quantityLabel}:</strong> ${latestQuoteData.quantityValue}</p>
    <p><strong>Suggested setup:</strong> ${latestQuoteData.suggestion}</p>
  `;
}

function showCalculationResult(data) {
  resultBox.innerHTML = `
    <h3>Recommended Lighting</h3>
    <p><strong>Room type:</strong> ${data.roomType}</p>
    <p><strong>Preferred light type:</strong> ${data.lightType}</p>
    <p><strong>Room area:</strong> ${data.area} m²</p>
    <p><strong>Total light needed:</strong> ${data.lumens} lumens</p>
    <p><strong>${data.quantityLabel}:</strong> ${data.quantityValue}</p>
    <p><strong>Suggested setup:</strong> ${data.suggestion}</p>
  `;
}

function showCalculationError(message) {
  resultBox.innerHTML = `
    <h3>Invalid room size</h3>
    <p>${message}</p>
  `;
}

function showQuoteMessage(targetElement, title, message1, message2 = "") {
  targetElement.innerHTML = `
    <h3>${title}</h3>
    <p>${message1}</p>
    ${message2 ? `<p>${message2}</p>` : ""}
  `;
}

function validateCalculatorQuoteFields() {
  const clientName = clientNameField.value.trim();
  const clientEmail = clientEmailField.value.trim();
  const clientPhone = clientPhoneField.value.trim();

  if (!clientName || !clientEmail || !clientPhone) {
    showQuoteMessage(
      quoteOutput,
      "Missing details",
      "Please complete your full name, email address, and telephone number."
    );
    return false;
  }

  return true;
}

function validateDirectQuoteFields() {
  const clientName = directClientNameField.value.trim();
  const clientEmail = directClientEmailField.value.trim();
  const clientPhone = directClientPhoneField.value.trim();
  const quoteDetails = directQuoteDetailsField.value.trim();

  if (!clientName || !clientEmail || !clientPhone || !quoteDetails) {
    showQuoteMessage(
      directQuoteOutput,
      "Missing details",
      "Please complete your full name, email address, telephone number, and description of what you need."
    );
    return false;
  }

  return true;
}

function buildCalculatorPayload() {
  return {
    requestType: "calculatorQuote",
    clientName: clientNameField.value.trim(),
    clientEmail: clientEmailField.value.trim(),
    clientPhone: clientPhoneField.value.trim(),
    roomType: latestQuoteData.roomType,
    lightType: latestQuoteData.lightType,
    area: latestQuoteData.area,
    lumens: latestQuoteData.lumens,
    lights: latestQuoteData.backendQuantity,
    quantityLabel: latestQuoteData.quantityLabel,
    quantityValue: latestQuoteData.quantityValue,
    quantityUnit: latestQuoteData.backendUnit,
    suggestion: latestQuoteData.suggestion,
    additionalRequirements: additionalRequirementsField.value.trim()
  };
}

function buildDirectQuotePayload() {
  return {
    requestType: "directQuote",
    clientName: directClientNameField.value.trim(),
    clientEmail: directClientEmailField.value.trim(),
    clientPhone: directClientPhoneField.value.trim(),
    quoteDetails: directQuoteDetailsField.value.trim()
  };
}

async function postToBackend(payload) {
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

  const messageText = String(result.message || "").toLowerCase();
  const statusText = String(result.status || "").toLowerCase();

  if (statusText === "error") {
    throw new Error(result.message || "The server returned an error.");
  }

  if (
    statusText === "success" ||
    messageText.includes("successfully") ||
    messageText.includes("saved") ||
    messageText.includes("submitted")
  ) {
    return result;
  }

  return result;
}

function calculateLighting() {
  const roomType = roomTypeField.value;
  const lightType = lightTypeField.value;
  const roomLength = parseFloat(roomLengthField.value);
  const roomWidth = parseFloat(roomWidthField.value);
  const brightness = brightnessField.value;

  if (!roomType || !lightType) {
    showCalculationError("Please select both the room type and preferred light type.");
    return;
  }

  if (isNaN(roomLength) || isNaN(roomWidth) || roomLength <= 0 || roomWidth <= 0) {
    showCalculationError("Please enter a valid room length and width greater than 0.");
    return;
  }

  const area = roomLength * roomWidth;
  const luxLevel = getLuxLevel(roomType, brightness);
  const lumens = Math.round(area * luxLevel);

  const recommendationData = getRecommendationData(lightType, area, lumens);

  latestQuoteData = {
    roomType: formatRoomType(roomType),
    lightType: lightType,
    area: area.toFixed(2),
    lumens: lumens,
    quantityLabel: recommendationData.quantityLabel,
    quantityValue: recommendationData.quantityValue,
    suggestion: recommendationData.suggestion,
    backendQuantity: recommendationData.backendQuantity,
    backendUnit: recommendationData.backendUnit
  };

  showCalculationResult(latestQuoteData);

  if (quoteActionWrap) {
    quoteActionWrap.classList.remove("hidden");
  }
}

async function submitCalculatorQuoteRequest() {
  if (!latestQuoteData) {
    showQuoteMessage(
      quoteOutput,
      "Calculator required",
      "Please use the calculator first before submitting a quote request."
    );
    return;
  }

  if (!validateCalculatorQuoteFields()) {
    return;
  }

  const payload = buildCalculatorPayload();

  submitQuoteBtn.disabled = true;
  submitQuoteBtn.textContent = "SENDING...";

  showQuoteMessage(
    quoteOutput,
    "Sending quote request...",
    "Please wait while we submit your details."
  );

  try {
    await postToBackend(payload);

    showQuoteMessage(
      quoteOutput,
      "Thank you for your quote request",
      "We have received your details successfully.",
      "We will review your requirements and get back to you shortly."
    );

    clientNameField.value = "";
    clientEmailField.value = "";
    clientPhoneField.value = "";
    additionalRequirementsField.value = "";

    setTimeout(() => {
      closeQuoteModal();
      resetQuoteForm();
    }, 2200);
  } catch (error) {
    showQuoteMessage(
      quoteOutput,
      "Submission problem",
      "We could not send the quote request from the website.",
      `Error: ${error.message}`
    );
  } finally {
    submitQuoteBtn.disabled = false;
    submitQuoteBtn.textContent = "SUBMIT QUOTE REQUEST";
  }
}

async function submitDirectQuoteRequest() {
  if (!validateDirectQuoteFields()) {
    return;
  }

  const payload = buildDirectQuotePayload();

  submitDirectQuoteBtn.disabled = true;
  submitDirectQuoteBtn.textContent = "SENDING...";

  showQuoteMessage(
    directQuoteOutput,
    "Sending direct quote request...",
    "Please wait while we submit your details."
  );

  try {
    await postToBackend(payload);

    showQuoteMessage(
      directQuoteOutput,
      "Thank you for your quote request",
      "We have received your details successfully.",
      "We will review your requirements and get back to you shortly."
    );

    setTimeout(() => {
      resetDirectQuoteForm();
    }, 2200);
  } catch (error) {
    showQuoteMessage(
      directQuoteOutput,
      "Submission problem",
      "We could not send the direct quote request from the website.",
      `Error: ${error.message}`
    );
  } finally {
    submitDirectQuoteBtn.disabled = false;
    submitDirectQuoteBtn.textContent = "SUBMIT DIRECT QUOTE REQUEST";
  }
}

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

if (resultQuoteBtn) {
  resultQuoteBtn.addEventListener("click", function () {
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
  submitQuoteBtn.addEventListener("click", submitCalculatorQuoteRequest);
}

if (submitDirectQuoteBtn) {
  submitDirectQuoteBtn.addEventListener("click", submitDirectQuoteRequest);
}
