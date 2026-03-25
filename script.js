// Listen for form submission
document.getElementById('lighting-form').addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent page reload

  // ----------------------
  // 1. Get input values
  // ----------------------
  const length = parseFloat(document.getElementById('length').value);
  const width = parseFloat(document.getElementById('width').value);
  const height = parseFloat(document.getElementById('height').value) || 2.7; // default 2.7m if empty
  const brightness = parseInt(document.getElementById('brightness').value);
  const roomType = document.getElementById('room-type').value;

  // ----------------------
  // 2. Calculate area and lumens
  // ----------------------
  const area = length * width; // square meters
  // Rough lumens per m2 based on brightness (scale 1–10)
  const lumensPerM2 = brightness * 100;
  const totalLumens = area * lumensPerM2;

  // ----------------------
  // 3. Calculate lights needed
  // ----------------------
  const ledLumens = 800; // 10W LED downlight approx 800 lumens
  const lightsNeeded = Math.ceil(totalLumens / ledLumens);

  // ----------------------
  // 4. Calculate spacing
  // ----------------------
  const spacing = Math.sqrt((length * width) / lightsNeeded).toFixed(2);

  // ----------------------
  // 5. Display results
  // ----------------------
  const results = document.getElementById('results');
  results.innerHTML = `
    <p>Room Type: <span>${roomType}</span></p>
    <p>You need <span>${lightsNeeded}</span> LED downlights</p>
    <p>Spacing: <span>${spacing}m</span> apart</p>
    <p>Recommended: <span>10W LED downlights</span></p>
  `;
  results.classList.remove('hidden');

  // Scroll results into view smoothly
  results.scrollIntoView({ behavior: 'smooth' });
});
