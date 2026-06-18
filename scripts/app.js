// scripts/app.js
// Entry point: wires form, validation, rendering, sorting, and search.

import { validateRecord } from "./validators.js";
import { getRecords, addRecord } from "./state.js";
import { compileRegex, filterRecords } from "./search.js";
import { renderRecords, sortRecords, renderStats, renderCap } from "./ui.js";

const fields = ["description", "amount", "category", "date"];

const form = document.getElementById("record-form");
const statusRegion = document.getElementById("cap-message");
const searchInput = document.getElementById("search");
const searchFlags = document.getElementById("search-flags");
const sortSelect = document.getElementById("sort");
const capInput = document.getElementById("cap");

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

// Initial render on page load.
refresh();