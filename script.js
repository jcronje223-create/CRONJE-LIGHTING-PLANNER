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

calculateBtn.addEventListener("click", function () {
  const roomType = document.getElementById("roomType").value;
  const roomLength = parseFloat(document.getElementById("roomLength").value);
  const roomWidth = parseFloat(document.getElementById("roomWidth").value);
  const brightness = document.getElementById("brightness").value;

  if (!roomLength || !roomWidth || roomLength <= 0 || roomWidth <= 0) {
    resultBox.innerHTML = `
      <h3>Please enter valid room dimensions</h3>
      <p>Make sure both length and width are filled in with numbers bigger than 0.</p>
    `;
    return;
  }

  const area = roomLength * roomWidth;

  let luxLevel = 150;

  if (brightness === "soft") {
    luxLevel = 120;
  } else if (brightness === "medium") {
    luxLevel = 180;
  } else if (brightness === "bright") {
    luxLevel = 250;
  }

  if (roomType === "kitchen" || roomType === "bathroom") {
    luxLevel += 50;
  }

  if (roomType === "office" || roomType === "garage") {
    luxLevel += 80;
  }

  const recommendedLumens = Math.round(area * luxLevel);
  const downlightLumens = 800;
  const numberOfLights = Math.ceil(recommendedLumens / downlightLumens);

  let fittingSuggestion = "";

  if (numberOfLights <= 2) {
    fittingSuggestion = "1 to 2 downlights or a small main light";
  } else if (numberOfLights <= 4) {
    fittingSuggestion = "3 to 4 downlights evenly spaced";
  } else if (numberOfLights <= 6) {
    fittingSuggestion = "4 to 6 downlights in a grid layout";
  } else {
    fittingSuggestion = "Multiple downlights with layered lighting, such as downlights, LED strip lighting, and feature lights";
  }

  const formattedRoomType = roomType
    .replace("-", " ")
    .replace(/\b\w/g, function (letter) {
      return letter.toUpperCase();
    });

  latestQuoteData = {
    roomType: formattedRoomType,
    area: area.toFixed(2),
    lumens: recommendedLumens,
    lights: numberOfLights,
    suggestion: fittingSuggestion
  };

  resultBox.innerHTML = `
    <h3>Your Lighting Recommendation</h3>
    <p><strong>Room type:</strong> ${latestQuoteData.roomType}</p>
    <p><strong>Room area:</strong> ${latestQuoteData.area} m²</p>
    <p><strong>Total light needed:</strong> ${latestQuoteData.lumens} lumens</p>
    <p><strong>Estimated downlights:</strong> ${latestQuoteData.lights} lights</p>
    <p><strong>Suggested setup:</strong> ${latestQuoteData.suggestion}</p>
    <a href="#" id="openQuoteFromResult" class="result-quote-btn">GET A QUOTE</a>
  `;

  updateQuoteSummary();

  const openQuoteFromResult = document.getElementById("openQuoteFromResult");
  openQuoteFromResult.addEventListener("click", function (event) {
    event.preventDefault();
    openQuoteModal();
  });
});

navQuoteBtn.addEventListener("click", function (event) {
  event.preventDefault();
  updateQuoteSummary();
  openQuoteModal();
});

closeModalBtn.addEventListener("click", function () {
  closeQuoteModal();
});

quoteModal.addEventListener("click", function (event) {
  if (event.target === quoteModal) {
    closeQuoteModal();
  }
});

submitQuoteBtn.addEventListener("click", async function () {
  const clientName = document.getElementById("clientName").value.trim();
  const clientEmail = document.getElementById("clientEmail").value.trim();
  const clientPhone = document.getElementById("clientPhone").value.trim();
  const additionalRequirements = document.getElementById("additionalRequirements").value.trim();

  if (!latestQuoteData) {
    quoteOutput.innerHTML = `
      <h3>Please use the calculator first</h3>
      <p>Calculate the lighting recommendation before submitting a quote request.</p>
    `;
    return;
  }

  if (!clientName || !clientEmail || !clientPhone) {
    quoteOutput.innerHTML = `
      <h3>Missing client information</h3>
      <p>Please fill in your full name, email address, and telephone number.</p>
    `;
    return;
  }

  if (WEB_APP_URL === "PASTE_YOUR_WEB_APP_URL_HERE") {
    quoteOutput.innerHTML = `
      <h3>Web app URL missing</h3>
      <p>You still need to paste your Google Apps Script Web App URL into script.js.</p>
    `;
    return;
  }

  const payload = {
    clientName: clientName,
    clientEmail: clientEmail,
    clientPhone: clientPhone,
    roomType: latestQuoteData.roomType,
    roomArea: latestQuoteData.area,
    lumens: latestQuoteData.lumens,
    estimatedLights: latestQuoteData.lights,
    suggestedSetup: latestQuoteData.suggestion,
    additionalRequirements: additionalRequirements
  };

  quoteOutput.innerHTML = `
    <h3>Sending quote request...</h3>
    <p>Please wait while we submit your details.</p>
  `;

  try {
    await fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

  quoteOutput.innerHTML = `
  <h3>Thank you for your quote request</h3>
  <p>We have received your details successfully.</p>
  <p>Our team will review your lighting requirements and get back to you shortly.</p>
`;

    document.getElementById("clientName").value = "";
    document.getElementById("clientEmail").value = "";
    document.getElementById("clientPhone").value = "";
    document.getElementById("additionalRequirements").value = "";

  } catch (error) {
    quoteOutput.innerHTML = `
      <h3>Submission problem</h3>
      <p>We could not send the quote request from the website.</p>
      <p><strong>Error:</strong> ${error.message}</p>
    `;
  }
});
