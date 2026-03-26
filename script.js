const calculateBtn = document.getElementById("calculateBtn");
const resultBox = document.getElementById("result");

const quoteModal = document.getElementById("quoteModal");
const quoteSummary = document.getElementById("quoteSummary");
const submitQuoteBtn = document.getElementById("submitQuoteBtn");
const quoteOutput = document.getElementById("quoteOutput");
const closeModalBtn = document.getElementById("closeModalBtn");
const navQuoteBtn = document.getElementById("navQuoteBtn");

let latestQuoteData = null;

/*
  Replace this with your real deployed Google Apps Script Web App URL
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

function formatRoomType(roomType) {
  switch (roomType) {
    case "bedroom":
      return "Bedroom";
    case "living-room":
      return "Living Room";
    case "kitchen":
      return "Kitchen";
    case "bathroom":
      return "Bathroom";
    case "office":
      return "Office";
    case "garage":
      return "Garage";
    default:
      return roomType;
  }
}

calculateBtn.addEventListener("click", function () {
  const roomType = document.getElementById("roomType").value;
  const roomLength = parseFloat(document.getElementById("roomLength").value);
  const roomWidth = parseFloat(document.getElementById("roomWidth").value);
  const brightness = document.getElementById("brightness").value;

  if (isNaN(roomLength) || isNaN(roomWidth) || roomLength <= 0 || roomWidth <= 0) {
    resultBox.innerHTML = `
      <h3>Invalid room size</h3>
      <p>Please enter a valid room length and width greater than 0.</p>
    `;
    return;
  }

  const area = roomLength * roomWidth;

  let luxLevel = 150;
  if (brightness === "medium") luxLevel = 250;
  if (brightness === "bright") luxLevel = 350;

  if (roomType === "kitchen" || roomType === "bathroom") {
    luxLevel += 50;
  }

  if (roomType === "office" || roomType === "garage") {
    luxLevel += 100;
  }

  const lumens = Math.round(area * luxLevel);

  const lumensPerDownlight = 800;
  const lights = Math.max(1, Math.ceil(lumens / lumensPerDownlight));

  let suggestion = `${lights} downlights of approximately ${lumensPerDownlight} lumens each`;

  if (area > 25) {
    suggestion += " with possible additional feature lighting or perimeter lighting";
  }

  latestQuoteData = {
    roomType: formatRoomType(roomType),
    area: area.toFixed(2),
    lumens: lumens,
    lights: lights,
    suggestion: suggestion
  };

  resultBox.innerHTML = `
    <h3>Recommended Lighting</h3>
    <p><strong>Room type:</strong> ${latestQuoteData.roomType}</p>
    <p><strong>Room area:</strong> ${latestQuoteData.area} m²</p>
    <p><strong>Total light needed:</strong> ${latestQuoteData.lumens} lumens</p>
    <p><strong>Estimated downlights:</strong> ${latestQuoteData.lights}</p>
    <p><strong>Suggested setup:</strong> ${latestQuoteData.suggestion}</p>
  `;
});

navQuoteBtn.addEventListener("click", function (e) {
  e.preventDefault();
  updateQuoteSummary();
  openQuoteModal();
});

closeModalBtn.addEventListener("click", function () {
  closeQuoteModal();
});

window.addEventListener("click", function (e) {
  if (e.target === quoteModal) {
    closeQuoteModal();
  }
});

submitQuoteBtn.addEventListener("click", async function () {
  if (!latestQuoteData) {
    quoteOutput.innerHTML = `
      <h3>Calculator required</h3>
      <p>Please use the calculator first before submitting a quote request.</p>
    `;
    return;
  }

  const clientName = document.getElementById("clientName").value.trim();
  const clientEmail = document.getElementById("clientEmail").value.trim();
  const clientPhone = document.getElementById("clientPhone").value.trim();
  const additionalRequirements = document.getElementById("additionalRequirements").value.trim();

  if (!clientName || !clientEmail || !clientPhone) {
    quoteOutput.innerHTML = `
      <h3>Missing details</h3>
      <p>Please complete your full name, email address, and telephone number.</p>
    `;
    return;
  }

  const payload = {
    clientName: clientName,
    clientEmail: clientEmail,
    clientPhone: clientPhone,
    roomType: latestQuoteData.roomType,
    area: latestQuoteData.area,
    lumens: latestQuoteData.lumens,
    lights: latestQuoteData.lights,
    suggestion: latestQuoteData.suggestion,
    additionalRequirements: additionalRequirements
  };

  submitQuoteBtn.disabled = true;
  submitQuoteBtn.textContent = "SENDING...";

  quoteOutput.innerHTML = `
    <h3>Sending quote request...</h3>
    <p>Please wait while we submit your details.</p>
  `;

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

    let result = {};
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error("The server response was not valid JSON.");
    }

    if (result.status !== "success") {
      throw new Error(result.message || "The submission was not confirmed by the server.");
    }

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
