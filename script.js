/* script.js */

/* =========================================================
   CRONJE LIGHTING - MAIN SCRIPT
   Works with the current index.html IDs and structure
   ========================================================= */

/* =========================
   GOOGLE SCRIPT URL
   Replace this with your real deployed Google Script web app URL
   Leave blank if you only want calculator + quote autofill for now
   ========================= */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxtW1bM_O02zX2Qa8F65C59f_dv8JvSqteIufI_Buys6Vyq6-8oqwif5OWyqbr2Yaxp3g/exec";

/* =========================
   DATA
   ========================= */
const calculatorData = {
  home: {
    spaces: [
      "Bedroom",
      "Living Room",
      "Kitchen",
      "Bathroom",
      "Passage",
      "Dining Room",
      "Ceiling Feature",
      "Gaming Setup",
      "TV Unit / Display Area",
      "Patio"
    ],
    goals: [
      "Full lighting",
      "Ambient mood lighting",
      "Gaming setup lighting",
      "Feature lighting",
      "Art / valuables lighting",
      "Warm relaxing atmosphere",
      "Practical everyday lighting"
    ]
  },
  vehicle: {
    spaces: [
      "Dashboard",
      "Footwells",
      "Doors",
      "Under Seats",
      "Roof Liner",
      "Boot / Trunk",
      "Full Interior",
      "Show Car Setup"
    ],
    goals: [
      "Ambient interior lighting",
      "Luxury look",
      "Show build effect",
      "Night visibility",
      "Subtle accent lighting",
      "Full custom effect"
    ]
  },
  shopfront: {
    spaces: [
      "Store Entrance",
      "Window Display",
      "Shelving",
      "Counter Area",
      "Signage",
      "Product Display Wall",
      "Indoor Retail Space",
      "Full Shopfront"
    ],
    goals: [
      "Attract attention",
      "Highlight products",
      "Premium retail look",
      "Clean professional lighting",
      "Brand visibility",
      "Night-time impact"
    ]
  },
  commercial: {
    spaces: [
      "Office",
      "Reception",
      "Boardroom",
      "Retail Floor",
      "Waiting Area",
      "Corridor",
      "Workshop",
      "Full Commercial Space"
    ],
    goals: [
      "Professional brightness",
      "Client-facing premium look",
      "Functional task lighting",
      "Energy-efficient lighting",
      "Feature lighting",
      "Balanced work environment"
    ]
  },
  outdoor: {
    spaces: [
      "Garden",
      "Pathway",
      "Driveway",
      "Patio",
      "Braai Area",
      "Perimeter",
      "Pool Area",
      "Outdoor Entertainment Area"
    ],
    goals: [
      "Security lighting",
      "Decorative garden lighting",
      "Warm outdoor ambiance",
      "Path visibility",
      "Entertainment lighting",
      "Feature landscape lighting"
    ]
  }
};

/* =========================
   HELPERS
   ========================= */
function getEl(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function setOptions(selectEl, items, placeholder) {
  if (!selectEl) return;

  selectEl.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = placeholder;
  selectEl.appendChild(defaultOption);

  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    selectEl.appendChild(option);
  });

  selectEl.value = "";
}

function smoothScrollToHash(hash) {
  if (!hash) return;
  const target = document.querySelector(hash);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function formatArea(length, width) {
  const l = Number(length);
  const w = Number(width);

  if (!l || !w || l <= 0 || w <= 0) {
    return null;
  }

  return (l * w).toFixed(1);
}

function getLightingDirection({
  category,
  space,
  goal,
  style,
  brightness,
  fitting,
  budget,
  length,
  width
}) {
  const area = formatArea(length, width);

  let recommendedSetup = "";
  let fittings = "";
  let colorTone = "";
  let installationNote = "";
  let budgetNote = "";
  let summary = "";

  /* ---------- CATEGORY / GOAL LOGIC ---------- */
  if (category === "home") {
    if (
      goal === "Ambient mood lighting" ||
      goal === "Warm relaxing atmosphere" ||
      style === "Warm Relaxed"
    ) {
      recommendedSetup =
        "Use perimeter LED strip lighting, soft indirect glow, and selected accent points instead of relying on one harsh central light.";
      fittings =
        fitting === "Mixed Recommendation"
          ? "LED Strip + selected downlights"
          : fitting;
      colorTone = "Warm white or tunable warm ambient tones";
    } else if (
      goal === "Gaming setup lighting" ||
      space === "Gaming Setup" ||
      style === "Bold Statement"
    ) {
      recommendedSetup =
        "Use RGB or smart LED strip lighting around the desk, display units, ceiling edges, and feature walls for layered visual impact.";
      fittings =
        fitting === "Mixed Recommendation"
          ? "LED Strip + feature spots"
          : fitting;
      colorTone = "RGB / dynamic ambient effects";
    } else if (
      goal === "Full lighting" ||
      goal === "Practical everyday lighting"
    ) {
      recommendedSetup =
        "Use a balanced main lighting layout with downlights for coverage, then add subtle strip or feature lighting where needed.";
      fittings =
        fitting === "Mixed Recommendation"
          ? "Downlights + LED Strip accents"
          : fitting;
      colorTone = "Neutral white for clarity with optional warm accents";
    } else {
      recommendedSetup =
        "Use a layered residential setup with functional base lighting and focused accent lighting for depth and visual style.";
      fittings =
        fitting === "Mixed Recommendation"
          ? "Downlights + Spotlights + LED Strip accents"
          : fitting;
      colorTone = "Neutral to warm white depending on mood";
    }
  }

  if (category === "vehicle") {
    if (
      goal === "Luxury look" ||
      style === "Luxury Premium" ||
      goal === "Subtle accent lighting"
    ) {
      recommendedSetup =
        "Use concealed ambient strips in the dashboard, door trims, and footwells for a refined premium interior finish.";
      fittings =
        fitting === "Mixed Recommendation"
          ? "Vehicle ambient LED strips"
          : fitting;
      colorTone = "Soft ambient tones or premium multicolor control";
    } else if (
      goal === "Show build effect" ||
      goal === "Full custom effect" ||
      style === "Bold Statement"
    ) {
      recommendedSetup =
        "Use dynamic interior LED strips with multiple zones, stronger footwell lighting, and full-cabin effect control for maximum visual impact.";
      fittings =
        fitting === "Mixed Recommendation"
          ? "IC / RGB ambient strips + accent modules"
          : fitting;
      colorTone = "RGB / flowing / custom multicolor";
    } else {
      recommendedSetup =
        "Use practical accent lighting focused on visibility, style, and interior enhancement without over-lighting the cabin.";
      fittings =
        fitting === "Mixed Recommendation"
          ? "Ambient strips + footwell lighting"
          : fitting;
      colorTone = "Balanced ambient tones";
    }
  }

  if (category === "shopfront") {
    if (
      goal === "Highlight products" ||
      space === "Window Display" ||
      space === "Shelving"
    ) {
      recommendedSetup =
        "Use focused display lighting to direct attention to products, shelves, and premium items while keeping the overall look clean.";
      fittings =
        fitting === "Mixed Recommendation"
          ? "Spotlights + LED strip display lighting"
          : fitting;
      colorTone = "Neutral white for product visibility";
    } else if (
      goal === "Attract attention" ||
      goal === "Night-time impact" ||
      goal === "Brand visibility"
    ) {
      recommendedSetup =
        "Use strong entrance and sign-enhancing lighting with contrast and visibility from the street to increase impact after dark.";
      fittings =
        fitting === "Mixed Recommendation"
          ? "LED strips + signage lighting + spotlights"
          : fitting;
      colorTone = "Clean bright white with optional brand-color accents";
    } else {
      recommendedSetup =
        "Use a balanced retail lighting approach that improves visibility, professionalism, and customer focus inside and outside the space.";
      fittings =
        fitting === "Mixed Recommendation"
          ? "Display strip lighting + downlights"
          : fitting;
      colorTone = "Neutral white";
    }
  }

  if (category === "commercial") {
    if (
      goal === "Functional task lighting" ||
      goal === "Professional brightness"
    ) {
      recommendedSetup =
        "Use a functional lighting layout focused on clear coverage, comfort, and productivity with minimal shadowing.";
      fittings =
        fitting === "Mixed Recommendation"
          ? "Downlights + task-focused fittings"
          : fitting;
      colorTone = "Neutral to cool white";
    } else if (
      goal === "Client-facing premium look" ||
      style === "Luxury Premium"
    ) {
      recommendedSetup =
        "Use layered commercial lighting with clean general illumination and feature accents in client-facing areas.";
      fittings =
        fitting === "Mixed Recommendation"
          ? "Downlights + spotlights + LED accents"
          : fitting;
      colorTone = "Neutral white with premium accent highlights";
    } else {
      recommendedSetup =
        "Use a clean, efficient commercial layout that balances appearance, practicality, and energy-conscious operation.";
      fittings =
        fitting === "Mixed Recommendation"
          ? "Downlights + selected feature fittings"
          : fitting;
      colorTone = "Balanced neutral white";
    }
  }

  if (category === "outdoor") {
    if (
      goal === "Security lighting" ||
      space === "Perimeter" ||
      space === "Driveway" ||
      space === "Pathway"
    ) {
      recommendedSetup =
        "Use outdoor lighting focused on visibility, movement safety, and security coverage with durable weather-suited fittings.";
      fittings =
        fitting === "Mixed Recommendation"
          ? "Outdoor spotlights + pathway lighting"
          : fitting;
      colorTone = "Cool or neutral white for visibility";
    } else if (
      goal === "Decorative garden lighting" ||
      goal === "Feature landscape lighting" ||
      goal === "Warm outdoor ambiance"
    ) {
      recommendedSetup =
        "Use layered landscape lighting to highlight plants, pathways, walls, and outdoor seating zones for depth and atmosphere.";
      fittings =
        fitting === "Mixed Recommendation"
          ? "Garden spots + hidden strip lighting + feature lights"
          : fitting;
      colorTone = "Warm white for ambiance";
    } else {
      recommendedSetup =
        "Use a mixed outdoor setup that improves visibility and atmosphere while keeping the space practical and inviting.";
      fittings =
        fitting === "Mixed Recommendation"
          ? "Outdoor feature lighting + functional area lighting"
          : fitting;
      colorTone = "Balanced outdoor white tones";
    }
  }

  /* ---------- BRIGHTNESS ---------- */
  if (brightness === "Soft ambient") {
    installationNote =
      "Keep the light diffused and indirect. Avoid over-lighting the space so the final effect stays comfortable and premium.";
  } else if (brightness === "Balanced") {
    installationNote =
      "Use a layered approach with both practical lighting and softer visual accents for the best all-round result.";
  } else {
    installationNote =
      "Prioritize coverage and visibility first, then add accent lighting only where it improves the space without causing glare.";
  }

  /* ---------- BUDGET ---------- */
  if (budget === "Entry Level") {
    budgetNote =
      "Start with the highest-impact zones first and use a simpler phased installation if needed.";
  } else if (budget === "Mid Range") {
    budgetNote =
      "This budget allows a balanced setup with both practical lighting and stronger finishing details.";
  } else {
    budgetNote =
      "A premium budget allows a more complete layout, cleaner finishing, better control options, and stronger overall impact.";
  }

  /* ---------- SUMMARY ---------- */
  summary = `For your ${space.toLowerCase()} ${category === "vehicle" ? "setup" : "project"}, a ${style.toLowerCase()} approach with ${brightness.toLowerCase()} lighting is the best direction.`;

  return {
    area,
    summary,
    recommendedSetup,
    fittings,
    colorTone,
    installationNote,
    budgetNote
  };
}

function buildResultHtml(data) {
  const areaHtml = data.area
    ? `<div><strong>Estimated Area</strong>${escapeHtml(data.area)} m²</div>`
    : "";

  return `
    <p class="result-summary">${escapeHtml(data.summary)}</p>

    <div class="result-list">
      <div>
        <strong>Recommended Setup</strong>
        ${escapeHtml(data.recommendedSetup)}
      </div>

      <div>
        <strong>Suggested Fittings</strong>
        ${escapeHtml(data.fittings)}
      </div>

      <div>
        <strong>Recommended Light Tone</strong>
        ${escapeHtml(data.colorTone)}
      </div>

      ${areaHtml}

      <div>
        <strong>Installation Direction</strong>
        ${escapeHtml(data.installationNote)}
      </div>

      <div>
        <strong>Budget Direction</strong>
        ${escapeHtml(data.budgetNote)}
      </div>
    </div>

    <p class="result-meta">
      This is a smart direction estimate to help shape your lighting plan before final quoting.
    </p>
  `;
}

/* =========================
   MENU
   ========================= */
function initMobileMenu() {
  const menuToggle = getEl("menuToggle");
  const navMenu = getEl("navMenu");

  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("show");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("show");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = navMenu.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      navMenu.classList.remove("show");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* =========================
   CALCULATOR
   ========================= */
function initCalculator() {
  const form = getEl("lightingCalculator");
  const categoryEl = getEl("projectCategory");
  const spaceEl = getEl("exactSpace");
  const goalEl = getEl("lightingGoal");
  const styleEl = getEl("styleMood");
  const lengthEl = getEl("length");
  const widthEl = getEl("width");
  const brightnessEl = getEl("brightness");
  const fittingEl = getEl("fittingType");
  const budgetEl = getEl("budgetRange");
  const resultBox = getEl("resultBox");
  const resultContent = getEl("resultContent");
  const quoteDetailsEl = getEl("quoteDetails");
  const openQuoteFromResult = getEl("openQuoteFromResult");

  if (!form || !categoryEl || !spaceEl || !goalEl || !resultBox || !resultContent) {
    return;
  }

  function updateCategoryFields() {
    const selectedCategory = categoryEl.value;
    const categoryConfig = calculatorData[selectedCategory];

    if (!categoryConfig) {
      setOptions(spaceEl, [], "Select a space");
      setOptions(goalEl, [], "Select a goal");
      return;
    }

    setOptions(spaceEl, categoryConfig.spaces, "Select a space");
    setOptions(goalEl, categoryConfig.goals, "Select a goal");
  }

  categoryEl.addEventListener("change", updateCategoryFields);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const category = categoryEl.value;
    const space = spaceEl.value;
    const goal = goalEl.value;
    const style = styleEl ? styleEl.value : "";
    const length = lengthEl ? lengthEl.value : "";
    const width = widthEl ? widthEl.value : "";
    const brightness = brightnessEl ? brightnessEl.value : "";
    const fitting = fittingEl ? fittingEl.value : "";
    const budget = budgetEl ? budgetEl.value : "";

    if (!category || !space || !goal || !style || !brightness || !fitting || !budget) {
      resultContent.innerHTML = `
        <p class="result-summary">Please complete all required calculator fields first.</p>
      `;
      resultBox.classList.add("active", "highlight");
      resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const resultData = getLightingDirection({
      category,
      space,
      goal,
      style,
      brightness,
      fitting,
      budget,
      length,
      width
    });

    resultContent.innerHTML = buildResultHtml(resultData);
    resultBox.classList.add("active", "highlight");

    const calculatorSummaryText =
      `Calculator Recommendation:
Project Category: ${category}
Exact Space: ${space}
Lighting Goal: ${goal}
Style / Mood: ${style}
Length: ${length || "Not provided"} m
Width: ${width || "Not provided"} m
Brightness Preference: ${brightness}
Preferred Fitting Type: ${fitting}
Budget Range: ${budget}

Recommended Setup:
${resultData.recommendedSetup}

Suggested Fittings:
${resultData.fittings}

Recommended Light Tone:
${resultData.colorTone}

Installation Direction:
${resultData.installationNote}

Budget Direction:
${resultData.budgetNote}`;

    if (quoteDetailsEl) {
      quoteDetailsEl.value = calculatorSummaryText;
    }

    if (openQuoteFromResult) {
      openQuoteFromResult.onclick = function (e) {
        e.preventDefault();
        smoothScrollToHash("#quote");
      };
    }

    resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  updateCategoryFields();
}

/* =========================
   QUOTE FORM
   ========================= */
function initQuoteForm() {
  const quoteForm = getEl("quoteForm");
  const formStatus = getEl("formStatus");
  const submitQuoteBtn = getEl("submitQuoteBtn");

  if (!quoteForm || !formStatus || !submitQuoteBtn) return;

  function showStatus(message, type) {
    formStatus.textContent = message;
    formStatus.style.color =
      type === "success"
        ? "#7CFC98"
        : type === "error"
        ? "#ff8a8a"
        : "#d8b45a";
  }

  quoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const clientName = getEl("clientName")?.value.trim() || "";
    const clientEmail = getEl("clientEmail")?.value.trim() || "";
    const clientPhone = getEl("clientPhone")?.value.trim() || "";
    const clientLocation = getEl("clientLocation")?.value.trim() || "";
    const quoteDetails = getEl("quoteDetails")?.value.trim() || "";
    const additionalRequirements =
      getEl("additionalRequirements")?.value.trim() || "";

    if (!clientName || !clientEmail || !clientPhone) {
      showStatus("Please complete your name, email, and phone number.", "error");
      return;
    }

    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === "PASTE_YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE") {
      showStatus(
        "Calculator is working, but quote sending is not connected yet. Add your Google Script URL in script.js to enable submissions.",
        "error"
      );
      return;
    }

    submitQuoteBtn.disabled = true;
    submitQuoteBtn.textContent = "Submitting...";
    showStatus("Submitting your quote request...", "info");

    const payload = {
      clientName,
      clientEmail,
      clientPhone,
      clientLocation,
      quoteDetails,
      additionalRequirements,
      source: "Cronje Lighting Website",
      page: "index.html",
      submittedAt: new Date().toISOString()
    };

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      const rawText = await response.text();

      let result = null;
      try {
        result = JSON.parse(rawText);
      } catch (parseError) {
        result = { status: "unknown", raw: rawText };
      }

      if (response.ok && (result.status === "success" || result.result === "success" || result.ok === true)) {
        showStatus("Quote request sent successfully. We will contact you soon.", "success");
        quoteForm.reset();
      } else {
        showStatus(
          "The form reached the server, but it did not confirm success. Check your Google Script deployment and spreadsheet settings.",
          "error"
        );
        console.error("Quote form server response:", result);
      }
    } catch (error) {
      console.error("Quote form error:", error);
      showStatus(
        "Quote request could not be sent. Please check your Google Script URL, deployment access, and internet connection.",
        "error"
      );
    } finally {
      submitQuoteBtn.disabled = false;
      submitQuoteBtn.textContent = "Submit Quote Request";
    }
  });
}

/* =========================
   QUOTE SHORTCUT LINKS
   ========================= */
function initQuoteLinks() {
  const navQuoteBtn = getEl("navQuoteBtn");

  if (navQuoteBtn) {
    navQuoteBtn.addEventListener("click", (event) => {
      event.preventDefault();
      smoothScrollToHash("#quote");
    });
  }
}

/* =========================
   INIT
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initCalculator();
  initQuoteForm();
  initQuoteLinks();
});
