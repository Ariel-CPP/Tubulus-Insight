// model.js

const K = 5;

export const Model = {
  post_larva: [],
  juvenile: [],
  shrimp: []
};

export function addSample(category, feature, label, hash) {
  Model[category].push({
    feature,
    label: Number(label),
    hash
  });
}

export function predict(category, feature) {
  const samples = Model[category];
  if (!samples.length) return null;

  const distances = samples.map(s => ({
    d: euclidean(feature, s.feature),
    label: s.label
  }));

  distances.sort((a, b) => a.d - b.d);

  const kUsed = Math.min(K, distances.length);
  const neighbors = distances.slice(0, kUsed);

  const values = neighbors.map(n => n.label);
  const mean = avg(values);
  const std = stddev(values, mean);

  const confidence = 1 - (std / (mean + 1e-6));

  return {
    percentage: Math.round(mean),
    confidence: Math.max(0, Math.min(1, confidence))
  };
}

function euclidean(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += Math.pow(a[i] - b[i], 2);
  }
  return Math.sqrt(sum);
}

function avg(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stddev(arr, m) {
  return Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / arr.length);
}

export function getGrade(p) {
  if (p >= 80) return 3;
  if (p >= 60) return 2;
  return 1;
}
