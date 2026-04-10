// js/hash.js

export async function computeHash(file) {
  const img = await loadImage(file);

  const size = 8;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = size;
  canvas.height = size;

  // resize gambar jadi kecil (8x8)
  ctx.drawImage(img, 0, 0, size, size);

  const data = ctx.getImageData(0, 0, size, size).data;

  let gray = [];

  // ================= CONVERT TO GRAYSCALE =================

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    gray.push(lum);
  }

  // ================= COMPUTE MEAN =================

  const avg = gray.reduce((a, b) => a + b, 0) / gray.length;

  // ================= GENERATE HASH =================

  const hash = gray
    .map(v => (v > avg ? 1 : 0))
    .join("");

  return hash;
}

// ================= HELPER =================

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = reject;

    img.src = URL.createObjectURL(file);
  });
}
