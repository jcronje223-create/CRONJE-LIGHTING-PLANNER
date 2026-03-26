const calculateBtn = document.getElementById("calculateBtn");
const resultBox = document.getElementById("result");

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

  resultBox.innerHTML = `
    <h3>Your Lighting Recommendation</h3>
    <p><strong>Room type:</strong> ${formattedRoomType}</p>
    <p><strong>Room area:</strong> ${area.toFixed(2)} m²</p>
    <p><strong>Total light needed:</strong> ${recommendedLumens} lumens</p>
    <p><strong>Estimated downlights:</strong> ${numberOfLights} lights</p>
    <p><strong>Suggested setup:</strong> ${fittingSuggestion}</p>
    <a href="#contact" class="result-quote-btn">GET A QUOTE</a>
  `;
});
