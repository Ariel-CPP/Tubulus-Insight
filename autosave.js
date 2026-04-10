// js/autosave.js

import { Model } from "./model.js";

const STORAGE_KEY = "tubulus_model_v1";

// ================= SAVE =================

export function saveModel() {
  try {
    const data = {
      version: 1,
      models: Model
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Save failed", err);
  }
}

// ================= LOAD =================

export function loadModel() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) return;

    const obj = JSON.parse(data);

    if (!obj.models) return;

    Model.post_larva = obj.models.post_larva || [];
    Model.juvenile = obj.models.juvenile || [];
    Model.shrimp = obj.models.shrimp || [];

  } catch (err) {
    console.error("Load failed", err);
  }
}

// ================= CLEAR (OPTIONAL) =================

export function clearModel() {
  localStorage.removeItem(STORAGE_KEY);

  Model.post_larva = [];
  Model.juvenile = [];
  Model.shrimp = [];
}
