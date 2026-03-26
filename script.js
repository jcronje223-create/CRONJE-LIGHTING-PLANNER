document.addEventListener("DOMContentLoaded", function () {
  function getByAnyId(ids) {
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) return el;
    }
    return null;
  }

  function getValue(ids) {
    const el = getByAnyId(ids);
    return el ? el.value.trim() : "";
  }

  function setValue(ids, value) {
    const el = getByAnyId(ids);
    if (el) el.value = value;
  }

  function setText(ids, value) {
    const el = getByAnyId(ids);
    if (el) el.textContent = value;
  }

  const calculateBtn = getByAnyId(["calculateBtn", "calculateButton"]);
  const getQuoteBtn = getByAnyId(["getQuoteBtn", "quoteBtn"]);
  const quotePopup = getByAnyId(["quotePopup", "quoteModal", "popupForm"]);
  const closePopupBtn = getByAnyId(["closePopup", "closeQuotePopup", "popupClose"]);
  const quoteForm = getByAnyId(["quoteForm"]);
  const formStatus = getByAnyId(["formStatus"]);

  const roomTypeInput = getByAnyId(["roomType"]);
  const roomAreaInput = getByAnyId(["roomArea"]);
  const luxInput = getByAnyId(["luxLevel", "lux", "targetLux"]);
  const lumensInput = getByAnyId(["lumens"]);
  const lightsInput = getByAnyId(["lights", "estimatedLights"]);
  const setupInput = getByAnyId(["setup", "suggestedSetup"]);

  function getRecommendedLux(roomType) {
    const type = (roomType || "").toLowerCase();

    if (type.includes("lounge")) return 150;
    if (type.includes("living")) return 150;
    if (type.includes("bedroom")) return 120;
    if (type.includes("kitchen")) return 300;
    if (type.includes("bathroom")) return 250;
    if (type.includes("dining")) return 200;
    if (type.includes("office")) return 350;
    if (type.includes("study")) return 350;
    if (type.includes("garage")) return 150;
    if (type.includes("passage")) return 100;
    if (type.includes("hall")) return 100;
    if (type.includes("shop")) return 300;

    return 200;
  }

  function calculateLighting() {
    const roomType = roomTypeInput ? roomTypeInput.value : "";
    const roomArea = parseFloat(roomAreaInput ? roomAreaInput.value : "0") || 0;

    if (!roomArea || roomArea <= 0) {
      if (formStatus) {
        formStatus.innerText = "Please enter a valid room area before calculating.";
        formStatus.style.color = "red";
      }
      return null;
    }

    let targetLux = parseFloat(luxInput ? luxInput.value : "0") || 0;
    if (!targetLux || targetLux <= 0) {
      targetLux = getRecommendedLux(roomType);
      if (luxInput) luxInput.value = targetLux;
    }

    const totalLumens = Math.round(roomArea * targetLux);

    const assumedLumensPerLight = 800;
    const estimatedLights = Math.max(1, Math.ceil(totalLumens / assumedLumensPerLight));

    let suggestedSetup = "";
    if (estimatedLights <= 2) {
      suggestedSetup = `${estimatedLights} x downlights`;
    } else if (estimatedLights <= 6) {
      suggestedSetup = `${estimatedLights} x downlights evenly spaced`;
    } else {
      suggestedSetup = `${estimatedLights} x downlights in multiple rows for even coverage`;
    }

    if (lumensInput) lumensInput.value = totalLumens;
    if (lightsInput) lightsInput.value = estimatedLights;
    if (setupInput) setupInput.value = suggestedSetup;

    setText(["lumensResult"], totalLumens);
    setText(["lightsResult"], estimatedLights);
    setText(["setupResult"], suggestedSetup);

    if (formStatus) {
      formStatus.innerText = "Calculation complete. You can now request your quote.";
      formStatus.style.color = "#00ff88";
    }

    return {
      roomType,
      roomArea,
      targetLux,
      totalLumens,
      estimatedLights,
      suggestedSetup
    };
  }

  if (calculateBtn) {
    calculateBtn.addEventListener("click", function (e) {
      e.preventDefault();
      calculateLighting();
    });
  }

  if (getQuoteBtn) {
    getQuoteBtn.addEventListener("click", function (e) {
      e.preventDefault();

      const result = calculateLighting();
      if (!result) return;

      if (quotePopup) {
        quotePopup.style.display = "flex";
      }
    });
  }

  if (closePopupBtn && quotePopup) {
    closePopupBtn.addEventListener("click", function () {
      quotePopup.style.display = "none";
    });
  }

  if (quotePopup) {
    window.addEventListener("click", function (e) {
      if (e.target === quotePopup) {
        quotePopup.style.display = "none";
      }
    });
  }

  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const clientName = getValue(["name"]);
      const clientEmail = getValue(["email"]);
      const clientPhone = getValue(["phone"]);
      const roomType = getValue(["roomType"]);
      const roomArea = getValue(["roomArea"]);
      const lumens = getValue(["lumens"]);
      const estimatedLights = getValue(["lights", "estimatedLights"]);
      const suggestedSetup = getValue(["setup", "suggestedSetup"]);
      const additionalRequirements = getValue(["requirements", "additionalRequirements"]);

      const data = {
        clientName,
        clientEmail,
        clientPhone,
        roomType,
        roomArea,
        lumens,
        estimatedLights,
        suggestedSetup,
        additionalRequirements
      };

      if (formStatus) {
        formStatus.innerText = "Sending your quote request...";
        formStatus.style.color = "#ffffff";
      }

      fetch("https://script.google.com/macros/s/AKfycbyegtwRehBMXoCRnqnYqpm-wbEacVpmD5vlbDWc0JS3HRzQO2XSkeeju9RFHU9TW8-evA/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            if (formStatus) {
              formStatus.innerText = `Thank you ${clientName}, we will look at your requirements and get back to you shortly.`;
              formStatus.style.color = "#00ff88";
            }
            quoteForm.reset();
          } else {
            if (formStatus) {
              formStatus.innerText = result.message || "Something went wrong. Please try again.";
              formStatus.style.color = "red";
            }
          }
        })
        .catch(error => {
          console.error("Error:", error);
          if (formStatus) {
            formStatus.innerText = "Error sending request.";
            formStatus.style.color = "red";
          }
        });
    });
  }
});
