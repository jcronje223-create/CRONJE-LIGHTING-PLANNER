const calculatorForm = document.getElementById("calculatorForm");
const quoteResult = document.getElementById("quoteResult");
const quoteAmount = document.getElementById("quoteAmount");
const quoteBreakdown = document.getElementById("quoteBreakdown");

const quotePopup = document.getElementById("quotePopup");
const openQuotePopupBtn = document.getElementById("openQuotePopupBtn");
const closePopupBtn = document.getElementById("closePopupBtn");

const quoteForm = document.getElementById("quoteForm");
const formStatus = document.getElementById("formStatus");

let latestQuoteData = null;

/* -----------------------------
   QUOTE CALCULATION
----------------------------- */
calculatorForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const roomType = document.getElementById("roomType").value;
  const length = parseFloat(document.getElementById("length").value);
  const width = parseFloat(document.getElementById("width").value);
  const lightCount = parseInt(document.getElementById("lightCount").value, 10);
  const fittingType = document.getElementById("fittingType").value;
  const installationType = document.getElementById("installationType").value;

  const area = length * width;

  let basePerLight = 450;
  let areaRate = 120;
  let installFee = 0;

  if (fittingType === "Premium Downlights") basePerLight = 650;
  if (fittingType === "LED Strip") basePerLight = 700;
  if (fittingType === "Pendant Lights") basePerLight = 950;
  if (fittingType === "Outdoor Lights") basePerLight = 800;

  if (installationType === "Replacement") installFee = 500;
  if (installationType === "Upgrade") installFee = 1200;
  if (installationType === "New Installation") installFee = 1800;

  const lightCost = lightCount * basePerLight;
  const areaCost = area * areaRate;
  const total = Math.round(lightCost + areaCost + installFee);

  latestQuoteData = {
    roomType,
    length,
    width,
    area: area.toFixed(2),
    lightCount,
    fittingType,
    installationType,
    estimatedQuote: total
  };

  quoteAmount.textContent = `R${total.toLocaleString("en-ZA")}`;
  quoteBreakdown.textContent =
    `${roomType} | ${length}m × ${width}m (${area.toFixed(2)}m²) | ` +
    `${lightCount} lights | ${fittingType} | ${installationType}`;

  quoteResult.classList.remove("hidden");
});

/* -----------------------------
   POPUP OPEN / CLOSE
----------------------------- */
openQuotePopupBtn.addEventListener("click", function () {
  quotePopup.classList.remove("hidden");
});

closePopupBtn.addEventListener("click", function () {
  quotePopup.classList.add("hidden");
});

window.addEventListener("click", function (e) {
  if (e.target === quotePopup) {
    quotePopup.classList.add("hidden");
  }
});

/* -----------------------------
   FORM SUBMIT
   IMPORTANT:
   Replace WEB_APP_URL below with your Google Apps Script web app URL
----------------------------- */
const WEB_APP_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

quoteForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (!latestQuoteData) {
    formStatus.textContent = "Please calculate your quote first.";
    formStatus.className = "status-text status-error";
    return;
  }

  const clientName = document.getElementById("name").value.trim();
  const clientEmail = document.getElementById("email").value.trim();
  const clientPhone = document.getElementById("phone").value.trim();
  const requirements = document.getElementById("requirements").value.trim();

  const payload = {
    clientName,
    clientEmail,
    clientPhone,
    requirements,
    ...latestQuoteData
  };

  formStatus.textContent = "Submitting your quote request...";
  formStatus.className = "status-text";

  try {
    const response = await fetch(WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      }
    });

    const result = await response.json();

    if (result.success) {
      formStatus.textContent = `Thank you ${clientName}, we will look at your requirements and get back to you shortly.`;
      formStatus.className = "status-text status-success";

      quoteForm.reset();

      setTimeout(() => {
        quotePopup.classList.add("hidden");
      }, 2000);
    } else {
      formStatus.textContent = "There was a problem submitting your request. Please try again.";
      formStatus.className = "status-text status-error";
    }
  } catch (error) {
    formStatus.textContent = "There was a problem submitting your request. Please try again.";
    formStatus.className = "status-text status-error";
    console.error("Submission error:", error);
  }
});
