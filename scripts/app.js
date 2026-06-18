// scripts/app.js
// Entry point: wires the form to the validators.

import { validateRecord } from "./validators.js";

// Map each field name to its input + error span in the DOM.
const fields = ["description", "amount", "category", "date"];

const form = document.getElementById("record-form");
const statusRegion = document.getElementById("cap-message");

// Read current form values into a plain object.
function readForm() {
  return {
    description: document.getElementById("description").value,
    amount: document.getElementById("amount").value,
    category: document.getElementById("category").value,
    date: document.getElementById("date").value,
  };
}

// Show an error message (or clear it) for one field.
function showError(field, message) {
  const span = document.getElementById(`${field}-error`);
  const input = document.getElementById(field);
  span.textContent = message;
  // Tell assistive tech whether the field is currently invalid.
  if (message) {
    input.setAttribute("aria-invalid", "true");
  } else {
    input.removeAttribute("aria-invalid");
  }
}

// Validate everything; return true if the whole form is valid.
function validateForm() {
  const errors = validateRecord(readForm());
  let firstInvalid = null;
  for (const field of fields) {
    showError(field, errors[field]);
    if (errors[field] && !firstInvalid) {
      firstInvalid = document.getElementById(field);
    }
  }
  // Move focus to the first broken field for keyboard users.
  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid;
}

// Handle submit: stop the page reload, validate, and (for now) log.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (validateForm()) {
    statusRegion.textContent = "Looks valid! (Saving comes in M4.)";
    console.log("Valid record:", readForm());
  } else {
    statusRegion.textContent = "Please fix the highlighted fields.";
  }
});

// Live validation: re-check a field when the user leaves it.
for (const field of fields) {
  const input = document.getElementById(field);
  input.addEventListener("blur", () => {
    const errors = validateRecord(readForm());
    showError(field, errors[field]);
  });
}