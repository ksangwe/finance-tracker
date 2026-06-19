// scripts/state.js
// Holds the in-memory records and mutates them, persisting on every change.

import { load, save } from "./storage.js";

let records = load(); // start from whatever's in localStorage

// Return a copy so callers can't mutate our array directly.
export function getRecords() {
  return [...records];
}

// Generate the next id like "txn_0007" based on current count.
function nextId() {
  let max = 0;
  for (const r of records) {
    const match = /^txn_(\d+)$/.exec(r.id);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n > max) max = n;
    }
  }
  const padded = String(max + 1).padStart(4, "0");
  return `txn_${padded}`;
}

// Add a new record. `data` has description, amount, category, date.
export function addRecord(data) {
  const now = new Date().toISOString();
  const record = {
    id: nextId(),
    description: data.description.trim(),
    amount: Number(data.amount),
    category: data.category,
    date: data.date,
    createdAt: now,
    updatedAt: now,
  };
  records.push(record);
  save(records);
  return record;
}

// Update an existing record by id. Refreshes updatedAt.
export function updateRecord(id, data) {
  const record = records.find((r) => r.id === id);
  if (!record) return null;
  record.description = data.description.trim();
  record.amount = Number(data.amount);
  record.category = data.category;
  record.date = data.date;
  record.updatedAt = new Date().toISOString();
  save(records);
  return record;
}

// Delete a record by id.
export function deleteRecord(id) {
  records = records.filter((r) => r.id !== id);
  save(records);
}

// Replace the whole list (used by JSON import in M6).
export function setRecords(newRecords) {
  records = newRecords;
  save(records);
}

// ===== JSON import / export (M6) =====

// Export the current records as a formatted JSON string.
export function exportJSON() {
  return JSON.stringify(records, null, 2);
}

// Validate that an object looks like a real record.
function isValidRecord(obj) {
  return (
    obj &&
    typeof obj.id === "string" &&
    typeof obj.description === "string" &&
    typeof obj.amount === "number" &&
    typeof obj.category === "string" &&
    typeof obj.date === "string"
  );
}

// Import records from a JSON string.
// Returns { ok: true, count } on success, or { ok: false, error } on failure.
export function importJSON(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: "File is not valid JSON." };
  }

  if (!Array.isArray(data)) {
    return { ok: false, error: "JSON must be an array of records." };
  }

  // Every item must pass the record shape check.
  for (const item of data) {
    if (!isValidRecord(item)) {
      return { ok: false, error: "One or more records are malformed." };
    }
  }

  // Backfill timestamps if a record is missing them.
  const now = new Date().toISOString();
  const cleaned = data.map((r) => ({
    ...r,
    createdAt: r.createdAt || now,
    updatedAt: r.updatedAt || now,
  }));

  setRecords(cleaned);
  return { ok: true, count: cleaned.length };
}