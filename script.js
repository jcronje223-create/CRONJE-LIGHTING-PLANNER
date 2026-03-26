const btn = document.getElementById("calculateBtn");
const result = document.getElementById("result");

btn.onclick = function () {
  const type = document.getElementById("roomType").value;
  const length = parseFloat(document.getElementById("roomLength").value);
  const width = parseFloat(document.getElementById("roomWidth").value);
  const brightness = document.getElementById("brightness").value;

  if (!length || !width) {
    result.innerHTML = "Enter valid numbers";
    return;
  }

  const area = length * width;

  let lux = 150;
  if (brightness === "soft") lux = 120;
  if (brightness === "medium") lux = 180;
  if (brightness === "bright") lux = 250;

  const lumens = Math.round(area * lux);
  const lights = Math.ceil(lumens / 800);

  result.innerHTML = `
    <h3>Result</h3>
    <p>Area: ${area} m²</p>
    <p>Lumens: ${lumens}</p>
    <p>Lights: ${lights}</p>
    <a href="#contact">GET A QUOTE</a>
  `;
};
