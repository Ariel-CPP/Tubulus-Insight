// analysis.js

import { extractFeatures } from "./js/feature.js";
import { predict, getGrade } from "./js/model.js";
import { loadModel } from "./js/autosave.js";

// ================= INIT =================

// load model dari localStorage saat halaman dibuka
loadModel();

// ================= UI ELEMENTS =================

const input = document.getElementById("imageInput");
const label = document.getElementById("fileLabel");
const button = document.getElementById("analyzeBtn");
const loading = document.getElementById("loading");
const results = document.getElementById("results");
const previewContainer = document.getElementById("previewContainer");
const categorySelect = document.getElementById("categorySelect");

// ================= DATA STORAGE (UNTUK EXPORT) =================

let analysisResults = [];

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
  analysisResults = [];
  loading.style.display = "block";

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    try {
      const feature = await extractFeatures(file);
      const pred = predict(category, feature);

      // jika model kosong
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
      const confidence = Number(pred.confidence.toFixed(2));

      // simpan ke array untuk export
      analysisResults.push({
        file: file.name,
        prediction: pred.percentage,
        grade: grade,
        confidence: confidence
      });

      // tampilkan hasil
      results.innerHTML += `
        <div class="cp-card">
          <div class="cp-card-title">${file.name}</div>
          <div class="cp-card-text">
            Prediction: <strong>${pred.percentage}%</strong><br>
            Grade: <strong>${grade}</strong><br>
            Confidence: <strong>${confidence}</strong>
          </div>
        </div>
      `;

    } catch (err) {
      console.error(err);

      results.innerHTML += `
        <div class="cp-card">
          <div class="cp-card-title">${file.name}</div>
          <div class="cp-card-text">❌ Error processing image</div>
        </div>
      `;
    }
  }

  loading.style.display = "none";

  // tampilkan tombol export jika ada hasil
  if (analysisResults.length > 0) {
    renderExportButton();
  }
});

// ================= EXPORT BUTTON =================

function renderExportButton() {
  const existingBtn = document.getElementById("exportBtn");
  if (existingBtn) existingBtn.remove();

  const btn = document.createElement("button");
  btn.id = "exportBtn";
  btn.innerText = "Download Excel";
  btn.className = "cp-btn cp-btn-primary";
  btn.style.marginTop = "15px";

  btn.onclick = exportToExcel;

  results.appendChild(btn);
}

// ================= EXPORT TO EXCEL =================

function exportToExcel() {

  if (analysisResults.length === 0) {
    alert("No data to export");
    return;
  }

  const formattedData = analysisResults.map(row => ({
    "Nama file": row.file,
    "Prediction Nutrition partikel (%)": row.prediction,
    "Grade": row.grade,
    "confidence rate": row.confidence
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

  XLSX.writeFile(workbook, "tubulus_analysis.xlsx");
}
