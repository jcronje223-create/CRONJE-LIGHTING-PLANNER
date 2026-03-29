const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

const projectCategory = document.getElementById("projectCategory");
const exactSpace = document.getElementById("exactSpace");
const lightingGoal = document.getElementById("lightingGoal");
const lightingCalculator = document.getElementById("lightingCalculator");
const resultBox = document.getElementById("resultBox");
const resultContent = document.getElementById("resultContent");

const lengthInput = document.getElementById("length");
const widthInput = document.getElementById("width");
const lengthGroup = document.getElementById("lengthGroup");
const widthGroup = document.getElementById("widthGroup");

const quoteModal = document.getElementById("quoteModal");
const navQuoteBtn = document.getElementById("navQuoteBtn");
const ctaQuoteBtn = document.getElementById("ctaQuoteBtn");
const openQuoteFromResult = document.getElementById("openQuoteFromResult");
const closeModalBtn = document.getElementById("closeModalBtn");

const quoteForm = document.getElementById("quoteForm");
const formStatus = document.getElementById("formStatus");
const submitQuoteBtn = document.getElementById("submitQuoteBtn");

/*
  LIVE GOOGLE APPS SCRIPT WEB APP URL
*/
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxtW1bM_O02zX2Qa8F65C59f_dv8JvSqteIufI_Buys6Vyq6-8oqwif5OWyqbr2Yaxp3g/exec";

const categoryData = {
  home: {
    spaces: [
      "Bedroom",
      "Living Room",
      "Kitchen",
      "Bathroom",
      "Garage",
      "Passage",
      "Dining Room",
      "Patio"
    ],
    goals: {
      Bedroom: [
        "Full room lighting",
        "Ambient lighting",
        "Gaming setup lighting",
        "Headboard / feature lighting",
        "Art / valuables lighting",
        "Wardrobe lighting"
      ],
      "Living Room": [
        "Full room lighting",
        "Ambient lighting",
        "TV feature lighting",
        "Display / décor lighting"
      ],
      Kitchen: [
        "Task lighting",
        "Full room lighting",
        "Under-cabinet lighting",
        "Island feature lighting"
      ],
      Bathroom: [
        "Bright practical lighting",
        "Mirror lighting",
        "Ambient luxury lighting"
      ],
      Garage: [
        "Bright work lighting",
        "Display lighting",
        "Mixed task and feature lighting"
      ],
      Passage: [
        "General pathway lighting",
        "Ambient low-level lighting",
        "Accent wall lighting"
      ],
      "Dining Room": [
        "Feature dining lighting",
        "Ambient mood lighting",
        "Full room lighting"
      ],
      Patio: [
        "Ambient entertaining lighting",
        "Decorative lighting",
        "Mixed functional lighting"
      ]
    }
  },
  vehicle: {
    spaces: [
      "Footwell",
      "Dashboard",
      "Doors",
      "Boot / Trunk",
      "Full interior"
    ],
    goals: {
      Footwell: [
        "Ambient glow",
        "Bold RGB effect",
        "Luxury subtle lighting"
      ],
      Dashboard: [
        "Ambient accent line",
        "Modern premium effect",
        "Bold RGB effect"
      ],
      Doors: [
        "Ambient line lighting",
        "Luxury highlight lighting",
        "Bold RGB effect"
      ],
      "Boot / Trunk": [
        "Practical visibility lighting",
        "Ambient feature lighting"
      ],
      "Full interior": [
        "Full ambient lighting setup",
        "Luxury interior transformation",
        "Bold RGB showcase"
      ]
    }
  },
  shopfront: {
    spaces: [
      "Storefront Window",
      "Shelving",
      "Entrance",
      "Counter Area",
      "Signage"
    ],
    goals: {
      "Storefront Window": [
        "Display lighting",
        "Attention-grabbing feature lighting",
        "Luxury product highlighting"
      ],
      Shelving: [
        "Shelf product lighting",
        "Accent lighting",
        "Balanced product visibility"
      ],
      Entrance: [
        "Welcoming entrance lighting",
        "Security and visibility lighting",
        "Brand-led accent lighting"
      ],
      "Counter Area": [
        "Functional customer lighting",
        "Feature counter lighting",
        "Luxury ambience"
      ],
      Signage: [
        "Brand sign lighting",
        "Visibility enhancement",
        "Night-time storefront impact"
      ]
    }
  },
  commercial: {
    spaces: [
      "Office",
      "Reception",
      "Boardroom",
      "Retail Floor",
      "Client Area"
    ],
    goals: {
      Office: [
        "Efficient work lighting",
        "Modern office ambience",
        "Balanced functional lighting"
      ],
      Reception: [
        "Welcoming reception lighting",
        "Premium brand feel",
        "Feature lighting"
      ],
      Boardroom: [
        "Professional meeting lighting",
        "Premium statement lighting",
        "Balanced practical setup"
      ],
      "Retail Floor": [
        "General customer lighting",
        "Product-focused lighting",
        "Premium branded feel"
      ],
      "Client Area": [
        "Comfortable client ambience",
        "Professional visual presentation",
        "Luxury feature lighting"
      ]
    }
  },
  outdoor: {
    spaces: [
      "Garden",
      "Patio",
      "Driveway",
      "Pathway",
      "Gate / Entrance"
    ],
    goals: {
      Garden: [
        "Landscape highlight lighting",
        "Ambient decorative lighting",
        "Security enhancement"
      ],
      Patio: [
        "Ambient entertaining lighting",
        "Functional seating lighting",
        "Feature ceiling or strip lighting"
      ],
      Driveway: [
        "Safety and visibility lighting",
        "Security lighting",
        "Premium entrance effect"
      ],
      Pathway: [
        "Guide lighting",
        "Decorative pathway lighting",
        "Low-level ambience"
      ],
      "Gate / Entrance": [
        "Security and visibility lighting",
        "Elegant entrance feature lighting",
        "Brand / property statement lighting"
      ]
    }
  }
};

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("show");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        navMenu.classList.remove("show");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

function capitaliseCategory(category) {
  if (!category) return "";
  if (category === "shopfront") return "Shopfront";
  if (category === "vehicle") return "Vehicle";
  if (category === "home") return "Home";
  if (category === "commercial") return "Commercial / Office";
  if (category === "outdoor") return "Outdoor / Garden";
  return category;
}

function safeNumber(value) {
  const num = parseFloat(value);
  return Number.isFinite(num) ? num : 0;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function populateSpaces(category) {
  if (!exactSpace || !lightingGoal) return;

  exactSpace.innerHTML = '<option value="">Select a space</option>';
  lightingGoal.innerHTML = '<option value="">Select a goal</option>';

  if (!categoryData[category]) return;

  categoryData[category].spaces.forEach((space) => {
    const option = document.createElement("option");
    option.value = space;
    option.textContent = space;
    exactSpace.appendChild(option);
  });
}

function populateGoals(category, space) {
  if (!lightingGoal) return;

  lightingGoal.innerHTML = '<option value="">Select a goal</option>';

  if (!categoryData[category] || !categoryData[category].goals[space]) return;

  categoryData[category].goals[space].forEach((goal) => {
    const option = document.createElement("option");
    option.value = goal;
    option.textContent = goal;
    lightingGoal.appendChild(option);
  });
}

function updateDimensionFields(category) {
  const isVehicle = category === "vehicle";

  if (lengthGroup) {
    lengthGroup.classList.toggle("hidden-field", isVehicle);
  }

  if (widthGroup) {
    widthGroup.classList.toggle("hidden-field", isVehicle);
  }

  if (lengthInput) {
    lengthInput.required = !isVehicle;
    if (isVehicle) {
      lengthInput.value = "";
    }
  }

  if (widthInput) {
    widthInput.required = !isVehicle;
    if (isVehicle) {
      widthInput.value = "";
    }
  }
}

if (projectCategory) {
  projectCategory.addEventListener("change", function () {
    populateSpaces(this.value);
    updateDimensionFields(this.value);

    if (resultBox) {
      resultBox.classList.remove("active");
      resultBox.classList.remove("highlight");
    }
  });
}

if (exactSpace) {
  exactSpace.addEventListener("change", function () {
    populateGoals(projectCategory?.value || "", this.value);
  });
}

function getBudgetDirection(budgetRange) {
  if (budgetRange === "Entry Level") {
    return "Best approached with a simpler practical setup and selective feature lighting.";
  }
  if (budgetRange === "Mid Range") {
    return "Allows a stronger balance between performance, appearance and upgrade options.";
  }
  if (budgetRange === "Premium") {
    return "Suitable for layered premium lighting with stronger design impact and finish quality.";
  }
  return "Budget direction will be refined during the quote review.";
}

function getVehicleRecommendation(data) {
  let suggestedSetup = "";
  let fittingAdvice = "";
  let designNote = "";

  if (data.space === "Dashboard") {
    if (data.goal === "Ambient accent line") {
      suggestedSetup = "1 concealed dashboard ambient LED line with a subtle controller";
      fittingAdvice = "Use a slim concealed LED strip or fibre-style ambient line along the dashboard only, not a room-style setup.";
    } else if (data.goal === "Modern premium effect") {
      suggestedSetup = "1 premium dashboard ambient line with matching trim integration";
      fittingAdvice = "Use a hidden light source with smooth diffusion for a factory-style luxury finish.";
    } else {
      suggestedSetup = "1 RGB dashboard ambient line with app or remote control";
      fittingAdvice = "Keep the installation neat and controlled so the effect looks premium instead of messy.";
    }
  } else if (data.space === "Footwell") {
    if (data.goal === "Luxury subtle lighting") {
      suggestedSetup = "2 low-level footwell light points, one per front side";
      fittingAdvice = "Keep brightness soft so the cabin feels premium and not overlit.";
    } else if (data.goal === "Bold RGB effect") {
      suggestedSetup = "4 RGB footwell light points for a fuller cabin effect";
      fittingAdvice = "Use RGB modules or controlled strip sections with proper concealment.";
    } else {
      suggestedSetup = "2 to 4 ambient footwell light points";
      fittingAdvice = "Best suited for soft glow and improved cabin ambience.";
    }
  } else if (data.space === "Doors") {
    suggestedSetup =
      data.goal === "Bold RGB effect"
        ? "4 door ambient accent lines or inserts"
        : "2 to 4 subtle door ambient accent lines";

    fittingAdvice = "Use concealed placement so the door lighting complements the interior lines.";
  } else if (data.space === "Boot / Trunk") {
    suggestedSetup =
      data.goal === "Practical visibility lighting"
        ? "1 bright practical boot light upgrade"
        : "1 ambient boot feature light setup";

    fittingAdvice = "Focus on neat edge placement and proper brightness for the actual use of the boot area.";
  } else {
    suggestedSetup =
      data.goal === "Bold RGB showcase"
        ? "A full interior RGB ambient package across dashboard, footwells, and doors"
        : "A full interior ambient package with coordinated dashboard, footwell, and door lighting";

    fittingAdvice = "This works best as a matched multi-zone install so the whole cabin feels intentional.";
  }

  if (data.styleMood === "Luxury") {
    designNote += "Keep the lighting soft, concealed, and evenly diffused for a high-end OEM-style finish. ";
  } else if (data.styleMood === "Bold RGB") {
    designNote += "Use controlled RGB zones and scene presets so the result feels deliberate rather than random. ";
  } else if (data.styleMood === "Minimal") {
    designNote += "Use the fewest visible light lines possible and focus on clean trim-following placement. ";
  } else if (data.styleMood === "Warm") {
    designNote += "A warmer tone helps the vehicle feel more premium and relaxed. ";
  } else if (data.styleMood === "Cool") {
    designNote += "Cooler tones can support a sharper, more modern cabin feel. ";
  } else if (data.styleMood === "Modern") {
    designNote += "Use clean lines and balanced placement for a modern finish. ";
  }

  if (data.brightness === "Soft") {
    designNote += "Soft brightness is usually best for vehicle ambience because it avoids glare inside the cabin.";
  } else if (data.brightness === "Bright") {
    designNote += "Keep brighter vehicle lighting controlled so it does not become distracting while driving.";
  } else {
    designNote += "A balanced brightness level will usually give the cleanest and most usable vehicle result.";
  }

  return {
    areaValue: "",
    areaText: "Not used for vehicle lighting layouts",
    suggestedSetup,
    fittingAdvice,
    budgetDirection: getBudgetDirection(data.budgetRange),
    designNote: designNote.trim()
  };
}

function getArchitecturalRecommendation(data) {
  const area = safeNumber(data.length) * safeNumber(data.width);
  let suggestedSetup = "";
  let fittingAdvice = "";
  let designNote = "";

  if (data.fittingType === "LED Strip") {
    let stripMetres = Math.max(
      3,
      Math.ceil((safeNumber(data.length) + safeNumber(data.width)) * 1.2)
    );

    if ((data.goal || "").toLowerCase().includes("under-cabinet")) {
      stripMetres = Math.max(2, Math.ceil(safeNumber(data.length)));
    }

    if ((data.goal || "").toLowerCase().includes("headboard")) {
      stripMetres = Math.max(3, Math.ceil(safeNumber(data.width) || 3));
    }

    if (data.space === "Signage") {
      stripMetres = Math.max(2, Math.ceil(safeNumber(data.length)));
    }

    suggestedSetup = `${stripMetres} metres of LED strip lighting`;
    fittingAdvice = "Best suited for ambient edges, recesses, under-cabinet details, shelving, headboards, and feature lines.";
  } else if (data.fittingType === "Downlight") {
    const count = Math.max(4, Math.ceil(area / 1.8));
    suggestedSetup = `${count} downlights`;
    fittingAdvice = "Best suited for practical ceiling lighting, balanced room coverage, and clean modern layouts.";
  } else if (data.fittingType === "Spotlight") {
    const count = Math.max(3, Math.ceil(area / 3));
    suggestedSetup = `${count} spotlights`;
    fittingAdvice = "Best suited for directional task lighting, feature walls, displays, art, and product focus.";
  } else if (data.fittingType === "Pendant / Feature") {
    suggestedSetup = "1 main feature fitting with supporting secondary lighting";
    fittingAdvice = "Best suited for dining areas, reception zones, statement spaces, and luxury focal points.";
  } else {
    const count = Math.max(4, Math.ceil(area / 2.2));
    suggestedSetup = `${count} primary fittings with supporting ambient or accent lighting`;
    fittingAdvice = "Best suited where the space needs both function and visual atmosphere.";
  }

  if (data.category === "home") {
    if (data.space === "Bedroom" && data.goal === "Ambient lighting") {
      suggestedSetup =
        data.fittingType === "LED Strip"
          ? "4 to 6 metres of concealed bedroom ambient LED strip lighting"
          : "A soft layered ambient bedroom setup with secondary feature lighting";
      fittingAdvice = "Keep the light indirect and soft so the room feels comfortable instead of harsh.";
    }

    if (data.space === "Bedroom" && data.goal === "Gaming setup lighting") {
      suggestedSetup = "A gaming-focused ambient setup with RGB accent lighting around key zones";
      fittingAdvice = "Use controllable RGB lighting behind the setup, desk zone, or bed features rather than ceiling brightness only.";
    }

    if (data.space === "Kitchen" && data.goal === "Under-cabinet lighting") {
      suggestedSetup = `About ${Math.max(2, Math.ceil(safeNumber(data.length)))} metres of under-cabinet LED strip lighting`;
      fittingAdvice = "Use even task lighting under cabinets for work surfaces, not just decorative ceiling lighting.";
    }

    if (data.space === "Bathroom" && data.goal === "Mirror lighting") {
      suggestedSetup = "1 mirror lighting solution with supporting bathroom lighting";
      fittingAdvice = "Use clean front-facing mirror lighting that supports visibility without harsh shadows.";
    }

    if (data.space === "Wardrobe" || (data.goal || "").toLowerCase().includes("wardrobe")) {
      suggestedSetup = "A concealed wardrobe lighting layout with automatic or switched LED strip sections";
      fittingAdvice = "Use concealed strip placement to light shelves and hanging areas evenly.";
    }
  }

  if (data.category === "shopfront") {
    if ((data.goal || "").toLowerCase().includes("display")) {
      fittingAdvice = "Use directional or concealed lighting that makes products stand out to passing customers.";
    }
    if (data.space === "Signage") {
      suggestedSetup = "A dedicated signage lighting setup sized to the sign face";
      fittingAdvice = "Focus on even sign illumination and visibility from a distance.";
    }
    if (data.space === "Storefront Window") {
      designNote += "Window lighting must grab attention without creating harsh reflections on the glass. ";
    }
  }

  if (data.category === "commercial") {
    if (data.space === "Reception") {
      designNote += "Reception lighting should feel welcoming and polished because it shapes first impressions. ";
    }
    if (data.space === "Boardroom") {
      designNote += "Boardroom lighting should be balanced, clean, and professional rather than overly decorative. ";
    }
    if (data.space === "Office") {
      designNote += "Office lighting should support productivity and reduce eye strain through even light distribution. ";
    }
  }

  if (data.category === "outdoor") {
    if (data.space === "Pathway") {
      suggestedSetup = "A low-level pathway lighting layout with evenly spaced guide points";
      fittingAdvice = "Prioritise safe movement and consistent spacing instead of overly bright flood-style lighting.";
    }
    if (data.space === "Driveway") {
      fittingAdvice = "Use practical visibility lighting with controlled glare and weather-suitable fittings.";
    }
    if (data.space === "Garden") {
      designNote += "Garden lighting works best when key plants or features are highlighted instead of flooding everything evenly. ";
    }
  }

  if (data.styleMood === "Luxury") {
    designNote += "Use concealed sources, premium finishes, and layered feature lighting for a more upscale effect. ";
  } else if (data.styleMood === "Bold RGB") {
    designNote += "Use RGB only where it supports the selected goal, otherwise the result can feel overdone. ";
  } else if (data.styleMood === "Minimal") {
    designNote += "Keep fittings discreet, evenly spaced, and visually clean. ";
  } else if (data.styleMood === "Warm") {
    designNote += "Warmer tones will help the space feel more comfortable and inviting. ";
  } else if (data.styleMood === "Cool") {
    designNote += "Cooler tones can support a sharper, cleaner, and more modern feel. ";
  } else if (data.styleMood === "Modern") {
    designNote += "Use clean lines and controlled placement for a more modern finish. ";
  } else if (data.styleMood === "Neutral") {
    designNote += "Neutral tones are a safe all-round option when you want a clean and versatile look. ";
  }

  if (data.brightness === "Soft") {
    designNote += "A softer output is better where mood and comfort matter most.";
  } else if (data.brightness === "Bright") {
    designNote += "A brighter output is better where visibility and practical performance are more important.";
  } else {
    designNote += "A balanced output usually gives the best mix of usability and appearance.";
  }

  return {
    areaValue: area.toFixed(2),
    areaText: `${area.toFixed(2)} m²`,
    suggestedSetup,
    fittingAdvice,
    budgetDirection: getBudgetDirection(data.budgetRange),
    designNote: designNote.trim()
  };
}

function buildRecommendation(data) {
  if (data.category === "vehicle") {
    return getVehicleRecommendation(data);
  }
  return getArchitecturalRecommendation(data);
}

function getCalculatorData() {
  return {
    projectCategory: document.getElementById("projectCategory")?.value || "",
    exactSpace: document.getElementById("exactSpace")?.value || "",
    lightingGoal: document.getElementById("lightingGoal")?.value || "",
    styleMood: document.getElementById("styleMood")?.value || "",
    length: document.getElementById("length")?.value || "",
    width: document.getElementById("width")?.value || "",
    brightness: document.getElementById("brightness")?.value || "",
    fittingType: document.getElementById("fittingType")?.value || "",
    budgetRange: document.getElementById("budgetRange")?.value || ""
  };
}

function getRecommendationForSubmission() {
  const calculatorData = getCalculatorData();

  return buildRecommendation({
    category: calculatorData.projectCategory,
    space: calculatorData.exactSpace,
    goal: calculatorData.lightingGoal,
    styleMood: calculatorData.styleMood,
    length: calculatorData.length,
    width: calculatorData.width,
    brightness: calculatorData.brightness,
    fittingType: calculatorData.fittingType,
    budgetRange: calculatorData.budgetRange
  });
}

if (lightingCalculator) {
  lightingCalculator.addEventListener("submit", function (e) {
    e.preventDefault();

    const calculatorData = getCalculatorData();

    if (
      !calculatorData.projectCategory ||
      !calculatorData.exactSpace ||
      !calculatorData.lightingGoal ||
      !calculatorData.styleMood ||
      !calculatorData.brightness ||
      !calculatorData.fittingType ||
      !calculatorData.budgetRange
    ) {
      return;
    }

    if (
      calculatorData.projectCategory !== "vehicle" &&
      (!calculatorData.length || !calculatorData.width)
    ) {
      return;
    }

    const recommendation = buildRecommendation({
      category: calculatorData.projectCategory,
      space: calculatorData.exactSpace,
      goal: calculatorData.lightingGoal,
      styleMood: calculatorData.styleMood,
      length: calculatorData.length,
      width: calculatorData.width,
      brightness: calculatorData.brightness,
      fittingType: calculatorData.fittingType,
      budgetRange: calculatorData.budgetRange
    });

    resultContent.innerHTML = `
      <p><strong>Project Category:</strong> ${escapeHtml(capitaliseCategory(calculatorData.projectCategory))}</p>
      <p><strong>Exact Space:</strong> ${escapeHtml(calculatorData.exactSpace)}</p>
      <p><strong>Lighting Goal:</strong> ${escapeHtml(calculatorData.lightingGoal)}</p>
      <p><strong>Style / Mood:</strong> ${escapeHtml(calculatorData.styleMood)}</p>
      <p><strong>Estimated Area:</strong> ${escapeHtml(recommendation.areaText)}</p>
      <p><strong>Suggested Setup:</strong> ${escapeHtml(recommendation.suggestedSetup)}</p>
      <p><strong>Fitting Advice:</strong> ${escapeHtml(recommendation.fittingAdvice)}</p>
      <p><strong>Budget Direction:</strong> ${escapeHtml(recommendation.budgetDirection)}</p>
      <p><strong>Design Note:</strong> ${escapeHtml(recommendation.designNote)}</p>
      <p><strong>Next Step:</strong> Request a quote so Cronje Lighting can refine this into a more accurate recommendation for your project.</p>
    `;

    resultBox.classList.add("active");
    resultBox.classList.add("highlight");

    setTimeout(() => {
      resultBox.classList.remove("highlight");
    }, 1800);

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
}

function showStatus(message, type) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = `status-box show ${type}`;
}

function openQuoteModal() {
  if (!quoteModal) return;

  quoteModal.classList.add("active");
  quoteModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (formStatus) {
    formStatus.textContent = "";
    formStatus.className = "status-box";
  }

  setTimeout(() => {
    document.getElementById("clientName")?.focus();
  }, 50);
}

function closeQuoteModal() {
  if (!quoteModal) return;

  quoteModal.classList.remove("active");
  quoteModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

if (navQuoteBtn) {
  navQuoteBtn.addEventListener("click", function (e) {
    e.preventDefault();
    openQuoteModal();
  });
}

if (ctaQuoteBtn) {
  ctaQuoteBtn.addEventListener("click", function () {
    openQuoteModal();
  });
}

if (openQuoteFromResult) {
  openQuoteFromResult.addEventListener("click", function () {
    openQuoteModal();
  });
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", function () {
    closeQuoteModal();
  });
}

if (quoteModal) {
  quoteModal.addEventListener("click", function (e) {
    if (e.target === quoteModal) {
      closeQuoteModal();
    }
  });
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && quoteModal?.classList.contains("active")) {
    closeQuoteModal();
  }
});

function setQuoteFormDisabled(disabled) {
  if (!quoteForm) return;

  const fields = quoteForm.querySelectorAll("input, textarea, button");
  fields.forEach((field) => {
    field.disabled = disabled;
  });

  if (submitQuoteBtn) {
    submitQuoteBtn.textContent = disabled ? "Submitting..." : "Submit Quote Request";
  }
}

async function submitQuotePayload(payload) {
  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  });

  const responseText = await response.text();

  let result = null;
  try {
    result = JSON.parse(responseText);
  } catch (parseError) {
    result = {
      success: false,
      status: "error",
      message: "The server returned an invalid response.",
      raw: responseText
    };
  }

  return result;
}

if (quoteForm) {
  quoteForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const calculatorData = getCalculatorData();
    const currentRecommendation = getRecommendationForSubmission();

    const payload = {
      requestType: "calculatorQuote",
      clientName: document.getElementById("clientName")?.value.trim() || "",
      clientEmail: document.getElementById("clientEmail")?.value.trim() || "",
      clientPhone: document.getElementById("clientPhone")?.value.trim() || "",
      clientLocation: document.getElementById("clientLocation")?.value.trim() || "",
      additionalRequirements: document.getElementById("additionalRequirements")?.value.trim() || "",
      projectCategory: calculatorData.projectCategory,
      exactSpace: calculatorData.exactSpace,
      lightingGoal: calculatorData.lightingGoal,
      styleMood: calculatorData.styleMood,
      length: calculatorData.projectCategory === "vehicle" ? "" : calculatorData.length,
      width: calculatorData.projectCategory === "vehicle" ? "" : calculatorData.width,
      area: currentRecommendation.areaValue,
      brightness: calculatorData.brightness,
      fittingType: calculatorData.fittingType,
      budgetRange: calculatorData.budgetRange,
      suggestedSetup: currentRecommendation.suggestedSetup,
      fittingAdvice: currentRecommendation.fittingAdvice,
      budgetDirection: currentRecommendation.budgetDirection,
      designNote: currentRecommendation.designNote
    };

    if (!payload.clientName || !payload.clientEmail || !payload.clientPhone) {
      showStatus("Please complete your name, email address, and phone number.", "error");
      return;
    }

    if (
      !payload.projectCategory ||
      !payload.exactSpace ||
      !payload.lightingGoal ||
      !payload.styleMood ||
      !payload.brightness ||
      !payload.fittingType ||
      !payload.budgetRange
    ) {
      showStatus("Please complete the calculator first before requesting a quote.", "error");
      return;
    }

    if (
      payload.projectCategory !== "vehicle" &&
      (!payload.length || !payload.width)
    ) {
      showStatus("Please enter the project length and width before requesting a quote.", "error");
      return;
    }

    if (
      !GOOGLE_SCRIPT_URL ||
      GOOGLE_SCRIPT_URL === "PASTE_YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE"
    ) {
      showStatus("Your Google Script web app URL is still missing in script.js.", "error");
      return;
    }

    showStatus("Submitting your quote request...", "info");
    setQuoteFormDisabled(true);

    try {
      const result = await submitQuotePayload(payload);

      if (result && result.success) {
        showStatus(
          `Thank you ${payload.clientName}. Your quote request has been submitted successfully. We will review your requirements and get back to you shortly.`,
          "success"
        );

        setTimeout(() => {
          quoteForm.reset();
          closeQuoteModal();
        }, 1200);
      } else {
        showStatus(
          result?.message || "We could not submit your request right now. Please try again in a moment.",
          "error"
        );
      }
    } catch (error) {
      showStatus(
        "We could not submit your request right now. Please try again in a moment or contact us on WhatsApp.",
        "error"
      );
    } finally {
      setQuoteFormDisabled(false);
    }
  });
}

updateDimensionFields(projectCategory?.value || "");
