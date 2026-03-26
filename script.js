document.addEventListener("DOMContentLoaded", function () {
  const quoteForm = document.getElementById("quoteForm");
  const status = document.getElementById("formStatus");

  if (!quoteForm) return;

  quoteForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const clientName = document.getElementById("name").value;
    const clientEmail = document.getElementById("email").value;
    const clientPhone = document.getElementById("phone").value;
    const roomType = document.getElementById("roomType").value;
    const roomArea = document.getElementById("roomArea").value;
    const lumens = document.getElementById("lumens").value;
    const estimatedLights = document.getElementById("lights").value;
    const suggestedSetup = document.getElementById("setup").value;
    const additionalRequirements = document.getElementById("requirements").value;

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
            status.innerText = `Thank you ${clientName}, we will look at your requirements and get back to you shortly.`;
            status.style.color = "#00ff88";
          }
          quoteForm.reset();
        } else {
          if (status) {
            status.innerText = "Something went wrong. Please try again.";
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
