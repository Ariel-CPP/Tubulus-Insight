// js/storage.js

import { Model } from "./model.js";

// ================= EXPORT MODEL =================

export function exportModel() {
  const data = {
    version: 1,
    created_at: new Date().toISOString(),
    feature_config: "v1_multi_feature",

    models: {
      post_larva: Model.post_larva,
      juvenile: Model.juvenile,
      shrimp: Model.shrimp
    }
  };

  return JSON.stringify(data, null, 2);
}

// ================= IMPORT MODEL =================

export function importModel(jsonString) {
  try {
    const obj = JSON.parse(jsonString);

    if (!obj.models) {
      alert("Invalid model file");
      return;
    }

    // load data
    Model.post_larva = obj.models.post_larva || [];
    Model.juvenile = obj.models.juvenile || [];
    Model.shrimp = obj.models.shrimp || [];

  } catch (err) {
    alert("Error loading model");
  }
}
