document.addEventListener("DOMContentLoaded", () => {
  const calculateBtn = document.getElementById("calculateBtn");
  const resultBox = document.getElementById("result");

  const navQuoteBtn = document.getElementById("navQuoteBtn");
  const quoteModal = document.getElementById("quoteModal");
  const closeModalBtn = document.getElementById("closeModalBtn");

  const quoteSummary = document.getElementById("quoteSummary");
  const submitQuoteBtn = document.getElementById("submitQuoteBtn");
  const quoteOutput = document.getElementById("quoteOutput");

  const roomType = document.getElementById("roomType");
  const roomLength = document.getElementById("roomLength");
  const roomWidth = document.getElementById("roomWidth");
  const brightness = document.getElementById("brightness");

  const clientName = document.getElementById("clientName");
  const clientEmail = document.getElementById("clientEmail");
  const clientPhone = document.getElementById("clientPhone");
  const additionalRequirements = document.getElementById("additionalRequirements");

  const WEB_APP_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

  let latestQuoteData = null;

  function formatRoomType(value) {
    const map = {
      bedroom: "Bedroom",
      "living-room": "Living Room",
      kitchen: "Kitchen",
      bathroom: "Bathroom",
      office: "Office",
      garage: "Garage"
    };
    return map[value] || value;
  }

  function formatBrightness(value) {
    const map = {
      soft: "Soft / Relaxed",
      medium: "Medium / Balanced",
      bright: "Bright / Task Lighting"
    };
    return map[value] || value;
  }

  function calculateQuote() {
    const selectedRoomType = roomType.value;
    const length = parseFloat(roomLength.value);
    const width = parseFloat(roomWidth.value);
    const selectedBrightness = brightness.value;

    if (!selectedRoomType || isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
      resultBox.innerHTML = `
        <h3>Please complete the calculator properly</h3>
        <p>Enter a valid room type, length, and width.</p>
      `;
      latestQuoteData = null;
      return;
    }

    const area = length * width;

    let recommendedLights = Math.max(1, Math.ceil(area / 1.5));
    let estimatedQuote = 0;
    let fittingRecommendation = "Standard LED Downlights";

    if (selectedBrightness === "soft") {
      estimatedQuote = recommendedLights * 350;
      fittingRecommendation = "Warm white ambient lighting";
    } else if (selectedBrightness === "medium") {
      estimatedQuote = recommendedLights * 450;
      fittingRecommendation = "Balanced general lighting";
    } else if (selectedBrightness === "bright") {
      estimatedQuote = recommendedLights * 550;
      fittingRecommendation = "Bright task-focused lighting";
    }

    latestQuoteData = {
      roomType: formatRoomType(selectedRoomType),
      roomTypeRaw: selectedRoomType,
      length: length,
      width: width,
      area: area.toFixed(2),
      brightness: formatBrightness(selectedBrightness),
      brightnessRaw: selectedBrightness,
      recommendedLights: recommendedLights,
      fittingRecommendation: fittingRecommendation,
      estimatedQuote: estimatedQuote
    };

    resultBox.innerHTML = `
      <h3>Lighting Recommendation</h3>
      <p><strong>Room Type:</strong> ${latestQuoteData.roomType}</p>
      <p><strong>Room Size:</strong> ${length}m × ${width}m (${latestQuoteData.area}m²)</p>
      <p><strong>Brightness Preference:</strong> ${latestQuoteData.brightness}</p>
      <p><strong>Recommended Lights:</strong> ${recommendedLights}</p>
      <p><strong>Recommended Setup:</strong> ${fittingRecommendation}</p>
      <p><strong>Estimated Quote:</strong> R${estimatedQuote.toLocaleString("en-ZA")}</p>
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
      <p><strong>Room Type:</strong> ${latestQuoteData.roomType}</p>
      <p><strong>Room Size:</strong> ${latestQuoteData.length}m × ${latestQuoteData.width}m (${latestQuoteData.area}m²)</p>
      <p><strong>Brightness:</strong> ${latestQuoteData.brightness}</p>
      <p><strong>Recommended Lights:</strong> ${latestQuoteData.recommendedLights}</p>
      <p><strong>Recommended Setup:</strong> ${latestQuoteData.fittingRecommendation}</p>
      <p><strong>Estimated Quote:</strong> R${latestQuoteData.estimatedQuote.toLocaleString("en-ZA")}</p>
    `;
  }

  function openModal() {
    updateQuoteSummary();
    quoteModal.style.display = "flex";
  }

  function closeModal() {
    quoteModal.style.display = "none";
  }

  calculateBtn.addEventListener("click", calculateQuote);

  navQuoteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openModal();
  });

  closeModalBtn.addEventListener("click", closeModal);

  window.addEventListener("click", (e) => {
    if (e.target === quoteModal) {
      closeModal();
    }
  });

  submitQuoteBtn.addEventListener("click", async () => {
    if (!latestQuoteData) {
      quoteOutput.innerHTML = `
        <h3>Please calculate first</h3>
        <p>Use the calculator before submitting a quote request.</p>
      `;
      return;
    }

    const name = clientName.value.trim();
    const email = clientEmail.value.trim();
    const phone = clientPhone.value.trim();
    const requirements = additionalRequirements.value.trim();

    if (!name || !email || !phone) {
      quoteOutput.innerHTML = `
        <h3>Missing information</h3>
        <p>Please enter your full name, email address, and telephone number.</p>
      `;
      return;
    }

    const payload = {
      clientName: name,
      clientEmail: email,
      clientPhone: phone,
      additionalRequirements: requirements,
      roomType: latestQuoteData.roomType,
      roomLength: latestQuoteData.length,
      roomWidth: latestQuoteData.width,
      area: latestQuoteData.area,
      brightness: latestQuoteData.brightness,
      recommendedLights: latestQuoteData.recommendedLights,
      fittingRecommendation: latestQuoteData.fittingRecommendation,
      estimatedQuote: latestQuoteData.estimatedQuote
    };

    quoteOutput.innerHTML = `
      <h3>Submitting...</h3>
      <p>Please wait while we send your quote request.</p>
    `;

    try {
      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        quoteOutput.innerHTML = `
          <h3>Thank you ${name}</h3>
          <p>We will look at your requirements and get back to you shortly.</p>
        `;

        clientName.value = "";
        clientEmail.value = "";
        clientPhone.value = "";
        additionalRequirements.value = "";
      } else {
        quoteOutput.innerHTML = `
          <h3>Something went wrong</h3>
          <p>Your request could not be submitted. Please try again.</p>
        `;
        console.error(result);
      }
    } catch (error) {
      quoteOutput.innerHTML = `
        <h3>Something went wrong</h3>
        <p>Your request could not be submitted. Please try again.</p>
      `;
      console.error(error);
    }
  });
});
