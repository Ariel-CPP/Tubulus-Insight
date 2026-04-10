// analysis.js

import { extractFeatures } from "./js/feature.js";
import { predict, getGrade } from "./js/model.js";
import { loadModel } from "./js/autosave.js";

// ================= INIT =================

// load model otomatis saat halaman dibuka
loadModel();

// ================= UI =================

const input = document.getElementById("imageInput");
const label = document.getElementById("fileLabel");
const button = document.getElementById("analyzeBtn");
const loading = document.getElementById("loading");
const results = document.getElementById("results");
const previewContainer = document.getElementById("previewContainer");

const categorySelect = document.getElementById("categorySelect");

// ================= PREVIEW =================

input.addEventListener("change", () => {
  const files = input.files;

  label.innerText = `${files.length} files selected`;

  previewContainer.innerHTML = "";

  Array.from(files).forEach(file => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    previewContainer.appendChild(img);
  });
});

// ================= ANALYZE =================

button.addEventListener("click", async () => {
  const files = input.files;
  const category = categorySelect.value;

  if (!files.length) {
    alert("Please select images first");
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
        results.innerHTML += `
          <div class="cp-card">
            <div class="cp-card-title">${file.name}</div>
            <div class="cp-card-text">❌ Model not trained</div>
          </div>
        `;
        continue;
      }

      const grade = getGrade(pred.percentage);

      results.innerHTML += `
        <div class="cp-card">
          <div class="cp-card-title">${file.name}</div>
          <div class="cp-card-text">
            Prediction: <strong>${pred.percentage}%</strong><br>
            Grade: <strong>${grade}</strong><br>
            Confidence: <strong>${pred.confidence.toFixed(2)}</strong>
          </div>
        </div>
      `;

    } catch (err) {
      results.innerHTML += `
        <div class="cp-card">
          <div class="cp-card-title">${file.name}</div>
          <div class="cp-card-text">❌ Error processing image</div>
        </div>
      `;
    }
  }

  loading.style.display = "none";
});
