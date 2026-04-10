// feature.js

export async function extractFeatures(file) {
  const img = await loadImage(file);
  const size = 64;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = size;
  canvas.height = size;

  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;

  let gray = [];
  let rArr = [], gArr = [], bArr = [];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    gray.push(lum);
    rArr.push(r);
    gArr.push(g);
    bArr.push(b);
  }

  // Normalize grayscale (min-max)
  const minG = Math.min(...gray);
  const maxG = Math.max(...gray);
  const normGray = gray.map(v => (v - minG) / (maxG - minG + 1e-6));

  function mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  function std(arr, m) {
    return Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / arr.length);
  }

  const meanGray = mean(normGray);
  const stdGray = std(normGray, meanGray);

  const meanR = mean(rArr) / 255;
  const meanG = mean(gArr) / 255;
  const meanB = mean(bArr) / 255;

  const stdR = std(rArr, mean(rArr)) / 255;
  const stdG = std(gArr, mean(gArr)) / 255;
  const stdB = std(bArr, mean(bArr)) / 255;

  // histogram (8 bins)
  const bins = new Array(8).fill(0);
  normGray.forEach(v => {
    const idx = Math.min(7, Math.floor(v * 8));
    bins[idx]++;
  });

  const hist = bins.map(b => b / normGray.length);

  return [
    meanGray, stdGray,
    meanR, meanG, meanB,
    stdR, stdG, stdB,
    ...hist
  ];
}

function loadImage(file) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}
