// app.js

import { extractFeatures } from "./js/feature.js";
import { computeHash } from "./js/hash.js";
import { addSample, Model } from "./js/model.js";
import { exportModel, importModel } from "./js/storage.js";

// ================= UI ELEMENTS =================

const input = document.getElementById("trainImagesInput");
const label = document.getElementById("trainImagesLabel");
const button = document.getElementById("trainButton");
const log = document.getElementById("trainingLog");
const loading = document.getElementById("loading");
const previewContainer = document.getElementById("previewContainer");

const categorySelect = document.getElementById("categorySelect");

const totalEl = document.getElementById("totalTrainedImages");
const statusEl = document.getElementById("modelStatus");

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

// ================= TRAIN =================

button.addEventListener("click", async () => {
  const files = input.files;
  const category = categorySelect.value;

  if (!files.length) {
    alert("Please select images first");
    return;
  }

  loading.style.display = "block";
  log.innerHTML = "";

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    let percent = prompt(
      `Image ${i + 1}/${files.length}\nEnter nutrition percentage (0–100)`
    );

    if (percent === null) continue;

    percent = parseInt(percent);

    if (isNaN(percent) || percent < 0 || percent > 100) {
      log.innerHTML += `<div>❌ Invalid input: ${file.name}</div>`;
      continue;
    }

    try {
      const feature = await extractFeatures(file);
      const hash = await computeHash(file);

      addSample(category, feature, percent, hash);

      log.innerHTML += `<div>✅ ${file.name} → ${percent}%</div>`;
    } catch (err) {
      log.innerHTML += `<div>❌ Error processing ${file.name}</div>`;
    }
  }

  loading.style.display = "none";

  updateStats();
});

// ================= STATS =================

function updateStats() {
  const total =
    Model.post_larva.length +
    Model.juvenile.length +
    Model.shrimp.length;

  totalEl.innerText = total;
  statusEl.innerText = total > 0 ? "Trained" : "Not trained";
}

// ================= DOWNLOAD =================

document.getElementById("downloadDbButton").onclick = () => {
  const data = exportModel();

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "tubulus_model.json";
  a.click();
};

// ================= UPLOAD =================

document.getElementById("uploadDbInput").onchange = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const text = await file.text();

  importModel(text);

  updateStats();

  alert("Model successfully loaded");
};
