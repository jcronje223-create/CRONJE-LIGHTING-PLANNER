const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });
}

const projectCategory = document.getElementById("projectCategory");
const exactSpace = document.getElementById("exactSpace");
const lightingGoal = document.getElementById("lightingGoal");
const lightingCalculator = document.getElementById("lightingCalculator");
const resultBox = document.getElementById("resultBox");
const resultContent = document.getElementById("resultContent");

const quoteModal = document.getElementById("quoteModal");
const navQuoteBtn = document.getElementById("navQuoteBtn");
const ctaQuoteBtn = document.getElementById("ctaQuoteBtn");
const openQuoteFromResult = document.getElementById("openQuoteFromResult");
const closeModalBtn = document.getElementById("closeModalBtn");

const quoteForm = document.getElementById("quoteForm");
const formStatus = document.getElementById("formStatus");
const submitQuoteBtn = document.getElementById("submitQuoteBtn");

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

function populateSpaces(category) {
  exactSpace.innerHTML = '<option value="">Select a space</option>';
  lightingGoal.innerHTML = '<option value="">Select a goal</option>';

  if (!categoryData[category]) return;

  categoryData[category].spaces.forEach(space => {
    const option = document.createElement("option");
    option.value = space;
    option.textContent = space;
    exactSpace.appendChild(option);
  });
}

function populateGoals(category, space) {
  lightingGoal.innerHTML = '<option value="">Select a goal</option>';

  if (!categoryData[category] || !categoryData[category].goals[space]) return;

  categoryData[category].goals[space].forEach(goal => {
    const option = document.createElement("option");
    option.value = goal;
    option.textContent = goal;
    lightingGoal.appendChild(option);
  });
}

if (projectCategory) {
  projectCategory.addEventListener("change", function () {
    populateSpaces(this.value);
  });
}

if (exactSpace) {
  exactSpace.addEventListener("change", function () {
    populateGoals(projectCategory.value, this.value);
  });
}

function buildRecommendation(data) {
  const area = (data.length * data.width).toFixed(2);

  let recommendedSetup = "";
  let fittingAdvice = "";
  let estimatedRange = "";
  let specialAdvice = "";

  if (data.fittingType === "LED Strip") {
    const estimatedMetres = Math.max(5, Math.ceil((data.length + data.width) * 1.5));
    recommendedSetup = `${estimatedMetres} metres of quality LED strip lighting`;
    fittingAdvice = "Best suited for ambient lines, under-counter details, ceiling recesses, headboards, shelves and modern feature applications.";
  } else if (data.fittingType === "Downlight") {
    const downlights = Math.max(4, Math.ceil(area / 1.8));
    recommendedSetup = `${downlights} downlights`;
    fittingAdvice = "Best suited for full-room lighting, practical lighting and clean modern ceiling layouts.";
  } else if (data.fittingType === "Spotlight") {
    const spotlights = Math.max(3, Math.ceil(area / 3));
    recommendedSetup = `${spotlights} spotlights`;
    fittingAdvice = "Best suited for directional lighting, feature walls, art displays, product focus and accent points.";
  } else if (data.fittingType === "Pendant / Feature") {
    recommendedSetup = `1 to 2 feature fittings with supporting ambient lighting`;
    fittingAdvice = "Best suited for dining spaces, reception areas, luxury rooms and statement focal zones.";
  } else {
    const mixedCount = Math.max(4, Math.ceil(area / 2.2));
    recommendedSetup = `${mixedCount} primary fittings plus supporting ambient or accent lighting`;
    fittingAdvice = "Best suited for layered lighting where both function and visual mood are important.";
  }

  if (data.brightness === "Soft") {
    specialAdvice += "A softer output is recommended to keep the space relaxed and comfortable. ";
  } else if (data.brightness === "Balanced") {
    specialAdvice += "A balanced output will give a practical result without making the space feel harsh. ";
  } else {
    specialAdvice += "A brighter output is recommended for strong visibility and a cleaner high-performance feel. ";
  }

  if (data.styleMood === "Luxury") {
    specialAdvice += "Use premium finishes, hidden light sources and layered feature lighting for a more upscale effect. ";
  } else if (data.styleMood === "Bold RGB") {
    specialAdvice += "RGB controls, scene presets and accent placement will be important for this look. ";
  } else if (data.styleMood === "Minimal") {
    specialAdvice += "Keep fittings clean, discreet and evenly spaced for a more refined finish. ";
  }

  if (data.budgetRange === "Entry Level") {
    estimatedRange = "Best approached with a simpler practical setup and selective feature lighting.";
  } else if (data.budgetRange === "Mid Range") {
    estimatedRange = "Allows a stronger balance between performance, appearance and upgrade options.";
  } else {
    estimatedRange = "Suitable for layered premium lighting with stronger design impact and finish quality.";
  }

  return {
    area,
    recommendedSetup,
    fittingAdvice,
    estimatedRange,
    specialAdvice
  };
}

if (lightingCalculator) {
  lightingCalculator.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      category: projectCategory.value,
      space: document.getElementById("exactSpace").value,
      goal: document.getElementById("lightingGoal").value,
      styleMood: document.getElementById("styleMood").value,
      length: parseFloat(document.getElementById("length").value),
      width: parseFloat(document.getElementById("width").value),
      brightness: document.getElementById("brightness").value,
      fittingType: document.getElementById("fittingType").value,
      budgetRange: document.getElementById("budgetRange").value
    };

    const recommendation = buildRecommendation(data);

    resultContent.innerHTML = `
      <p><strong>Project Category:</strong> ${data.category}</p>
      <p><strong>Exact Space:</strong> ${data.space}</p>
      <p><strong>Lighting Goal:</strong> ${data.goal}</p>
      <p><strong>Style / Mood:</strong> ${data.styleMood}</p>
      <p><strong>Estimated Area:</strong> ${recommendation.area} m²</p>
      <p><strong>Suggested Setup:</strong> ${recommendation.recommendedSetup}</p>
      <p><strong>Fitting Advice:</strong> ${recommendation.fittingAdvice}</p>
      <p><strong>Budget Direction:</strong> ${recommendation.estimatedRange}</p>
      <p><strong>Design Note:</strong> ${recommendation.specialAdvice}</p>
      <p><strong>Next Step:</strong> Request a quote so Cronje Lighting can refine this into a more accurate recommendation for your project.</p>
    `;

    resultBox.classList.add("active");
    resultBox.classList.add("highlight");

    setTimeout(() => {
      resultBox.classList.remove("highlight");
    }, 2200);

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
}

function openQuoteModal() {
  if (!quoteModal) return;
  quoteModal.classList.add("active");
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    const firstInput = document.getElementById("clientName");
    if (firstInput) firstInput.focus();
  }, 100);
}

function closeQuoteModal() {
  if (!quoteModal) return;
  quoteModal.classList.remove("active");
  document.body.style.overflow = "auto";
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

function showStatus(message, type) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = "status-box show " + type;
  formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function setQuoteFormDisabled(disabled) {
  if (!quoteForm) return;
  const fields = quoteForm.querySelectorAll("input, textarea, button");
  fields.forEach(field => {
    field.disabled = disabled;
  });
}

if (quoteForm) {
  quoteForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const calculatorData = lightingCalculator ? {
      projectCategory: document.getElementById("projectCategory")?.value || "",
      exactSpace: document.getElementById("exactSpace")?.value || "",
      lightingGoal: document.getElementById("lightingGoal")?.value || "",
      styleMood: document.getElementById("styleMood")?.value || "",
      length: document.getElementById("length")?.value || "",
      width: document.getElementById("width")?.value || "",
      brightness: document.getElementById("brightness")?.value || "",
      fittingType: document.getElementById("fittingType")?.value || "",
      budgetRange: document.getElementById("budgetRange")?.value || ""
    } : {};

    const payload = {
      clientName: document.getElementById("clientName").value.trim(),
      clientEmail: document.getElementById("clientEmail").value.trim(),
      clientPhone: document.getElementById("clientPhone").value.trim(),
      clientLocation: document.getElementById("clientLocation").value.trim(),
      additionalRequirements: document.getElementById("additionalRequirements").value.trim(),
      ...calculatorData
    };

    showStatus("Submitting your quote request...", "info");
    setQuoteFormDisabled(true);

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbwsmsDZ-leXZj_a9U5uTx_GQlxL36JmdQDMKSeIAHRKt65ys9SKtr1X-cXD4ghrUx1h3g/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        showStatus(`Thank you ${payload.clientName}. Your quote request has been submitted successfully. We will review your requirements and get back to you shortly.`, "success");
        quoteForm.reset();

        if (lightingCalculator) {
          setTimeout(() => {
            closeQuoteModal();
          }, 1800);
        }
      } else {
        showStatus("Something went wrong while submitting your request. Please try again or contact us directly on WhatsApp.", "error");
      }
    } catch (error) {
      showStatus("We could not submit your request right now. Please try again in a moment or contact us on WhatsApp.", "error");
    } finally {
      setQuoteFormDisabled(false);
    }
  });
}
