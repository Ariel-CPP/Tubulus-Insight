// js/model.js

// ================= CONFIG =================

const K = 5;

// ================= MODEL STORAGE =================

export const Model = {
  post_larva: [],
  juvenile: [],
  shrimp: []
};

// ================= ADD TRAINING =================

export function addSample(category, feature, label, hash) {
  if (!Model[category]) return;

  Model[category].push({
    feature,
    label: Number(label),
    hash
  });
}

// ================= PREDICTION =================

export function predict(category, feature) {
  const samples = Model[category];

  if (!samples || samples.length === 0) return null;

  // hitung jarak
  const distances = samples.map(sample => ({
    d: euclidean(feature, sample.feature),
    label: sample.label
  }));

  // sort berdasarkan jarak terdekat
  distances.sort((a, b) => a.d - b.d);

  const kUsed = Math.min(K, distances.length);
  const neighbors = distances.slice(0, kUsed);

  const values = neighbors.map(n => n.label);

  const mean = average(values);
  const std = standardDeviation(values, mean);

  // confidence calculation
  const confidence = 1 - (std / (mean + 1e-6));

  return {
    percentage: Math.round(mean),
    confidence: clamp(confidence, 0, 1)
  };
}

// ================= GRADE =================

export function getGrade(p) {
  if (p >= 80) return 3;
  if (p >= 60) return 2;
  return 1;
}

// ================= MATH FUNCTIONS =================

function euclidean(a, b) {
  let sum = 0;

  for (let i = 0; i < a.length; i++) {
    sum += Math.pow(a[i] - b[i], 2);
  }

  return Math.sqrt(sum);
}

function average(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function standardDeviation(arr, mean) {
  const variance =
    arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;

  return Math.sqrt(variance);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
