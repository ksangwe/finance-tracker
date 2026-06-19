// scripts/app.js
// Entry point: wires form, validation, rendering, sorting, and search.

import { validateRecord } from "./validators.js";
import { getRecords, addRecord, exportJSON, importJSON } from "./state.js";
import { loadSettings, saveSettings } from "./storage.js";
import { compileRegex, filterRecords } from "./search.js";
import { renderRecords, sortRecords, renderStats, renderCap } from "./ui.js";

const fields = ["description", "amount", "category", "date"];

const form = document.getElementById("record-form");
const statusRegion = document.getElementById("cap-message");
const searchInput = document.getElementById("search");
const searchFlags = document.getElementById("search-flags");
const sortSelect = document.getElementById("sort");
const capInput = document.getElementById("cap");
const exportBtn = document.getElementById("export-btn");
const importFile = document.getElementById("import-file");
const rateEur = document.getElementById("rate-eur");
const rateRwf = document.getElementById("rate-rwf");

// ===== Form reading & validation (from M3) =====

function readForm() {
  return {
    description: document.getElementById("description").value,
    amount: document.getElementById("amount").value,
    category: document.getElementById("category").value,
    date: document.getElementById("date").value,
  };
}

function showError(field, message) {
  const span = document.getElementById(`${field}-error`);
  const input = document.getElementById(field);
  span.textContent = message;
  if (message) {
    input.setAttribute("aria-invalid", "true");
  } else {
    input.removeAttribute("aria-invalid");
  }
}

function validateForm() {
  const errors = validateRecord(readForm());
  let firstInvalid = null;
  for (const field of fields) {
    showError(field, errors[field]);
    if (errors[field] && !firstInvalid) {
      firstInvalid = document.getElementById(field);
    }
  }
  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid;
}

// ===== Rendering pipeline =====
// Reads state, applies search filter, applies sort, then renders.

function refresh() {
  const all = getRecords();

  // Stats and cap always reflect ALL records, not the filtered view.
  renderStats(all);
  renderCap(all, Number(capInput.value));

  // The table reflects search + sort.
  const re = compileRegex(searchInput.value, searchFlags.checked);
  let records = filterRecords(all, re);
  records = sortRecords(records, sortSelect.value);
  renderRecords(records, re);
}

// ===== Events =====

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateForm()) {
    statusRegion.textContent = "Please fix the highlighted fields.";
    return;
  }
  addRecord(readForm());
  form.reset();
  for (const field of fields) showError(field, "");
  statusRegion.textContent = "Transaction saved.";
  refresh();
});

// Live per-field validation on blur.
for (const field of fields) {
  const input = document.getElementById(field);
  input.addEventListener("blur", () => {
    const errors = validateRecord(readForm());
    showError(field, errors[field]);
  });
}

// Search: re-render as the user types.
searchInput.addEventListener("input", refresh);
searchFlags.addEventListener("change", refresh);
sortSelect.addEventListener("change", refresh);
capInput.addEventListener("input", refresh);

// ===== Export: download records as a JSON file =====
exportBtn.addEventListener("click", () => {
  const json = exportJSON();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "finance-data.json";
  a.click();

  URL.revokeObjectURL(url);
  statusRegion.textContent = "Data exported.";
});

// ===== Import: read a JSON file and load it =====
importFile.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const result = importJSON(reader.result);
    if (result.ok) {
      statusRegion.textContent = `Imported ${result.count} records.`;
      refresh();
    } else {
      statusRegion.textContent = `Import failed: ${result.error}`;
    }
    importFile.value = ""; // reset so the same file can be re-imported
  };
  reader.readAsText(file);
});

// ===== Settings: load saved values, save on change =====

function applySettings() {
  const s = loadSettings();
  if (s.cap != null) capInput.value = s.cap;
  if (s.rateEur != null) rateEur.value = s.rateEur;
  if (s.rateRwf != null) rateRwf.value = s.rateRwf;
}

function persistSettings() {
  saveSettings({
    cap: capInput.value,
    rateEur: rateEur.value,
    rateRwf: rateRwf.value,
  });
}

capInput.addEventListener("input", persistSettings);
rateEur.addEventListener("input", persistSettings);
rateRwf.addEventListener("input", persistSettings);

applySettings(); // restore saved settings on load

// Initial render on page load.
refresh();