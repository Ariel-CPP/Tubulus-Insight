import { extractFeatures } from "./js/feature.js";
import { predict, getGrade } from "./js/model.js";
import { loadModel } from "./js/autosave.js";

loadModel();

// ================= ELEMENT =================
const input = document.getElementById("imageInput");
const label = document.getElementById("fileLabel");
const button = document.getElementById("analyzeBtn");
const loading = document.getElementById("loading");
const results = document.getElementById("results");
const previewContainer = document.getElementById("previewContainer");
const categorySelect = document.getElementById("categorySelect");

// ================= STORAGE =================
let analysisResults = [];

// ================= PREVIEW =================
input.addEventListener("change", () => {
  label.innerText = `${input.files.length} files selected`;

  previewContainer.innerHTML = "";

  Array.from(input.files).forEach(file => {
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

  for (let file of files) {

    try {
      const feature = await extractFeatures(file);
      const pred = predict(category, feature);

      if (!pred) {
        results.innerHTML += `<div class="cp-card">❌ Model not trained</div>`;
        continue;
      }

      const grade = getGrade(pred.percentage);

      const row = {
        "Nama file": file.name,
        "Prediction Nutrition partikel (%)": pred.percentage,
        "Grade": grade,
        "confidence rate": Number(pred.confidence.toFixed(2))
      };

      analysisResults.push(row);

      results.innerHTML += `
        <div class="cp-card">
          <b>${file.name}</b><br>
          ${pred.percentage}% | Grade ${grade}<br>
          Confidence: ${pred.confidence.toFixed(2)}
        </div>
      `;

    } catch (err) {
      console.error(err);
      results.innerHTML += `<div class="cp-card">❌ Error processing ${file.name}</div>`;
    }
  }

  loading.style.display = "none";

  if (analysisResults.length > 0) {
    renderExportButton();
  }
});

// ================= EXPORT BUTTON =================
function renderExportButton() {

  const oldBtn = document.getElementById("exportBtn");
  if (oldBtn) oldBtn.remove();

  const btn = document.createElement("button");
  btn.id = "exportBtn";
  btn.innerText = "Download Excel";
  btn.className = "cp-btn cp-btn-primary";
  btn.style.marginTop = "20px";

  btn.onclick = exportExcel;

  results.appendChild(btn);
}

// ================= EXPORT EXCEL =================
function exportExcel() {

  if (analysisResults.length === 0) {
    alert("No data to export");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(analysisResults);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

  XLSX.writeFile(workbook, "tubulus_analysis.xlsx");
}
