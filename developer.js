// developer.js

import { Model } from "./js/model.js";
import { loadModel } from "./js/autosave.js";

// ================= INIT =================
loadModel();

// ================= ELEMENT =================
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");
const loginMsg = document.getElementById("loginMsg");

const dashboard = document.getElementById("dashboard");
const loginSection = document.getElementById("loginSection");

const statsTable = document.getElementById("statsTable");

// ================= LOGIN =================
loginBtn.addEventListener("click", () => {
  const pass = passwordInput.value.trim();

  if (pass === "AHL-CPP") {
    loginSection.style.display = "none";
    dashboard.style.display = "block";

    renderStats();
  } else {
    loginMsg.innerText = "❌ Wrong password";
  }
});

// ================= RENDER STATS =================
function renderStats() {

  const categories = ["post_larva", "juvenile", "shrimp"];

  let totalAll = 0;

  let html = `
    <table class="cp-table">
      <thead>
        <tr>
          <th>Category</th>
          <th>Count</th>
          <th>Mean (%)</th>
          <th>Std Dev</th>
        </tr>
      </thead>
      <tbody>
  `;

  categories.forEach(cat => {

    const data = Model[cat] || [];
    const values = data.map(d => d.label);

    const count = values.length;
    totalAll += count;

    let mean = 0;
    let std = 0;

    if (count > 0) {
      mean = average(values);
      std = stddev(values, mean);
    }

    html += `
      <tr>
        <td>${formatName(cat)}</td>
        <td>${count}</td>
        <td>${Math.round(mean)}</td>
        <td>${std.toFixed(2)}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>

    <div style="margin-top:15px;">
      <strong>Total dataset:</strong> ${totalAll}
    </div>
  `;

  statsTable.innerHTML = html;
}

// ================= HELPER =================
function average(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stddev(arr, mean) {
  return Math.sqrt(
    arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length
  );
}

function formatName(name) {
  if (name === "post_larva") return "Post Larva";
  if (name === "juvenile") return "Juvenile";
  if (name === "shrimp") return "Shrimp";
  return name;
}
