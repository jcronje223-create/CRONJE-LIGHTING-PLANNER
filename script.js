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

  let fittingSuggestion = "";

  if (recommendedLumens < 2000) {
    fittingSuggestion = "1 to 2 ceiling fittings or a small downlight layout";
  } else if (recommendedLumens < 4000) {
    fittingSuggestion = "2 to 4 downlights or one strong main fitting";
  } else if (recommendedLumens < 7000) {
    fittingSuggestion = "4 to 6 downlights or a combination of downlights and LED strip lighting";
  } else {
    fittingSuggestion = "A larger lighting layout with multiple downlights, feature lights, and layered lighting";
  }

  resultBox.innerHTML = `
    <h3>Your Lighting Recommendation</h3>
    <p><strong>Room type:</strong> ${roomType}</p>
    <p><strong>Room area:</strong> ${area.toFixed(2)} m²</p>
    <p><strong>Recommended total light output:</strong> ${recommendedLumens} lumens</p>
    <p><strong>Suggested setup:</strong> ${fittingSuggestion}</p>
  `;
});
