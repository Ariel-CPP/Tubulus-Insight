import { extractFeatures } from "./js/feature.js";
import { predict, getGrade } from "./js/model.js";
import { loadModel } from "./js/autosave.js";

loadModel();

const input = document.getElementById("imageInput");
const label = document.getElementById("fileLabel");
const button = document.getElementById("analyzeBtn");
const loading = document.getElementById("loading");
const results = document.getElementById("results");
const previewContainer = document.getElementById("previewContainer");
const categorySelect = document.getElementById("categorySelect");

let analysisResults = [];

// PREVIEW
input.addEventListener("change", () => {
  label.innerText = `${input.files.length} files selected`;

  previewContainer.innerHTML = "";

  Array.from(input.files).forEach(file => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    previewContainer.appendChild(img);
  });
});

// ANALYSIS
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
        results.innerHTML += `<div class="cp-card">Model not trained</div>`;
        continue;
      }

      const grade = getGrade(pred.percentage);

      analysisResults.push({
        "Nama file": file.name,
        "Prediction Nutrition partikel (%)": pred.percentage,
        "Grade": grade,
        "confidence rate": Number(pred.confidence.toFixed(2))
      });

      results.innerHTML += `
        <div class="cp-card">
          <b>${file.name}</b><br>
          ${pred.percentage}% | Grade ${grade}<br>
          Confidence: ${pred.confidence.toFixed(2)}
        </div>
      `;

    } catch {
      results.innerHTML += `<div class="cp-card">Error</div>`;
    }
  }

  loading.style.display = "none";

  if (analysisResults.length > 0) addExportButton();
});

// EXPORT
function addExportButton() {
  const btn = document.createElement("button");
  btn.innerText = "Download Excel";
  btn.className = "cp-btn cp-btn-primary";
  btn.style.marginTop = "20px";

  btn.onclick = exportExcel;

  results.appendChild(btn);
}

function exportExcel() {
  const ws = XLSX.utils.json_to_sheet(analysisResults);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Results");

  XLSX.writeFile(wb, "tubulus_analysis.xlsx");
}
