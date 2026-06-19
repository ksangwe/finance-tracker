// scripts/storage.js
// Thin wrapper around localStorage for persisting records.

const KEY = "finance:data";

// Load the array of records. Returns [] if nothing saved or data is broken.
export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    // Guard: we only ever store an array of records.
    return Array.isArray(data) ? data : [];
  } catch {
    // Corrupt JSON in storage shouldn't crash the app.
    return [];
  }
}

// Save the array of records.
export function save(records) {
  try {
    localStorage.setItem(KEY, JSON.stringify(records));
    return true;
  } catch {
    return false;
  }
}

// ===== Settings persistence (M6) =====

const SETTINGS_KEY = "finance:settings";

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}