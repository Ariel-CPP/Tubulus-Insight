import { extractFeatures } from "./js/feature.js";
import { predict, getGrade } from "./js/model.js";

// UI
const input = document.getElementById("imageInput");
const label = document.getElementById("fileLabel");
const button = document.getElementById("analyzeBtn");
const results = document.getElementById("results");
const loading = document.getElementById("loading");
const categorySelect = document.getElementById("categorySelect");

// update label
input.addEventListener("change", () => {
  label.innerText = `${input.files.length} files selected`;
});

// ANALYZE
button.addEventListener("click", async () => {
  const files = input.files;
  const category = categorySelect.value;

  if (!files.length) {
    alert("No images selected");
    return;
  }

  results.innerHTML = "";
  loading.style.display = "block";

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    try {
      const feature = await extractFeatures(file);
      const pred = predict(category, feature);

      if (!pred) {
        results.innerHTML += `<div>❌ No model data for ${category}</div>`;
        continue;
      }

      const grade = getGrade(pred.percentage);

      results.innerHTML += `
        <div>
          <strong>${file.name}</strong><br>
          Prediction: ${pred.percentage}%<br>
          Grade: ${grade}<br>
          Confidence: ${pred.confidence.toFixed(2)}
        </div>
        <hr>
      `;

    } catch (err) {
      results.innerHTML += `<div>❌ Error processing ${file.name}</div>`;
    }
  }

  loading.style.display = "none";
});
