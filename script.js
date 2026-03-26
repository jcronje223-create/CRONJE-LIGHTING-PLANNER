document.addEventListener("DOMContentLoaded", function () {
  const quoteForm = document.getElementById("quoteForm");
  const status = document.getElementById("formStatus");

  if (!quoteForm) {
    console.error('Form with id="quoteForm" was not found.');
    return;
  }

  quoteForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      clientName: document.getElementById("name")?.value || "",
      clientEmail: document.getElementById("email")?.value || "",
      clientPhone: document.getElementById("phone")?.value || "",
      roomType: document.getElementById("roomType")?.value || "",
      roomArea: document.getElementById("roomArea")?.value || "",
      lumens: document.getElementById("lumens")?.value || "",
      estimatedLights: document.getElementById("lights")?.value || "",
      suggestedSetup: document.getElementById("setup")?.value || "",
      additionalRequirements: document.getElementById("requirements")?.value || ""
    };

    if (status) {
      status.innerText = "Sending your quote request...";
      status.style.color = "#ffffff";
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
          if (status) {
            status.innerText = "Your quote request has been sent successfully!";
            status.style.color = "#00ff88";
          }
          quoteForm.reset();
        } else {
          if (status) {
            status.innerText = result.message || "Something went wrong. Please try again.";
            status.style.color = "red";
          }
        }
      })
      .catch(error => {
        console.error("Error:", error);
        if (status) {
          status.innerText = "Error sending request.";
          status.style.color = "red";
        }
      });
  });
});
