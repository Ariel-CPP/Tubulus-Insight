// storage.js

import { Model } from "./model.js";

export function exportModel() {
  return JSON.stringify({
    version: 1,
    models: Model
  });
}

export function importModel(json) {
  const obj = JSON.parse(json);
  if (!obj.models) return;

  ["post_larva", "juvenile", "shrimp"].forEach(k => {
    Model[k] = obj.models[k] || [];
  });
}
