// scripts/validators.js
// All form validation lives here. Each validator returns either
// an empty string (valid) or an error message (invalid).

// ===== Regex catalog =====

// Rule 1: Description — no leading/trailing spaces, no double spaces inside.
// ^\S          : must start with a non-space
// (?:.*\S)?    : optionally, anything ending in a non-space
export const RE_DESCRIPTION = /^\S(?:.*\S)?$/;

// Rule 2: Amount — whole or decimal, up to 2 places, no leading zeros.
// (0|[1-9]\d*) : either "0" or a number with no leading zero
// (\.\d{1,2})? : optional 1-2 decimal places
export const RE_AMOUNT = /^(0|[1-9]\d*)(\.\d{1,2})?$/;

// Rule 3: Date — strict YYYY-MM-DD with valid month/day ranges.
export const RE_DATE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

// Rule 4: Category — letters, with single spaces or hyphens between words.
export const RE_CATEGORY = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

// Rule 5 (ADVANCED): back-reference catching a doubled word,
// e.g. "lunch lunch" or "the the". \1 refers back to group 1.
export const RE_DOUBLE_WORD = /\b(\w+)\s+\1\b/i;

// ===== Field validators =====
// Each takes the raw input value and returns "" if valid,
// or a human-readable error message if invalid.

export function validateDescription(value) {
  const v = value ?? "";
  if (v.trim() === "") return "Description is required.";
  if (!RE_DESCRIPTION.test(v)) {
    return "No leading, trailing, or double spaces allowed.";
  }
  if (RE_DOUBLE_WORD.test(v)) {
    return "Looks like a word is repeated — please check.";
  }
  if (v.length > 80) return "Keep it under 80 characters.";
  return "";
}

export function validateAmount(value) {
  const v = (value ?? "").trim();
  if (v === "") return "Amount is required.";
  if (!RE_AMOUNT.test(v)) {
    return "Enter a valid amount (e.g. 12 or 12.50).";
  }
  return "";
}

export function validateCategory(value) {
  const v = (value ?? "").trim();
  if (v === "") return "Please choose a category.";
  if (!RE_CATEGORY.test(v)) {
    return "Letters only, single spaces or hyphens between words.";
  }
  return "";
}

export function validateDate(value) {
  const v = (value ?? "").trim();
  if (v === "") return "Date is required.";
  if (!RE_DATE.test(v)) {
    return "Use the format YYYY-MM-DD.";
  }
  return "";
}

// Validate the whole form at once. Returns an object mapping
// field name -> error message (empty string means that field is fine).
export function validateRecord(record) {
  return {
    description: validateDescription(record.description),
    amount: validateAmount(record.amount),
    category: validateCategory(record.category),
    date: validateDate(record.date),
  };
}