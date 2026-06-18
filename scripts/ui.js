// scripts/ui.js
// Renders records into the table, handles sorting, empty state, highlights.

import { highlight } from "./search.js";

const tbody = document.getElementById("records-body");
const emptyMsg = document.getElementById("records-empty");

// Sort records based on the dropdown value (e.g. "date-desc").
export function sortRecords(records, sortKey) {
  const sorted = [...records];
  const [field, dir] = sortKey.split("-");
  sorted.sort((a, b) => {
    let cmp = 0;
    if (field === "date") {
      cmp = a.date.localeCompare(b.date);
    } else if (field === "desc") {
      cmp = a.description.localeCompare(b.description);
    } else if (field === "amount") {
      cmp = a.amount - b.amount;
    }
    return dir === "asc" ? cmp : -cmp;
  });
  return sorted;
}

// Build one table row for a record. `re` (optional) highlights matches.
function buildRow(record, re) {
  const tr = document.createElement("tr");
  tr.dataset.id = record.id;

  // Each cell gets data-label so the mobile card CSS can label it.
  tr.innerHTML = `
    <td data-label="Date">${record.date}</td>
    <td data-label="Description">${highlight(record.description, re)}</td>
    <td data-label="Category">${highlight(record.category, re)}</td>
    <td data-label="Amount">${record.amount.toFixed(2)}</td>
    <td data-label="Actions">
      <button type="button" class="edit-btn" data-id="${record.id}">Edit</button>
      <button type="button" class="delete-btn" data-id="${record.id}">Delete</button>
    </td>
  `;
  return tr;
}

// Render the full list into the table body.
export function renderRecords(records, re) {
  tbody.innerHTML = "";

  if (records.length === 0) {
    emptyMsg.hidden = false;
    return;
  }
  emptyMsg.hidden = true;

  const fragment = document.createDocumentFragment();
  for (const record of records) {
    fragment.appendChild(buildRow(record, re));
  }
  tbody.appendChild(fragment);
}