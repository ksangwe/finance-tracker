// scripts/ui.js
// Renders records into the table, handles sorting, empty state, highlights.

import {
  totalCount,
  totalSpent,
  topCategory,
  last7Days,
} from "./stats.js";

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

// ===== Stats dashboard =====

const statTotal = document.getElementById("stat-total");
const statSum = document.getElementById("stat-sum");
const statTop = document.getElementById("stat-top");
const trendChart = document.getElementById("trend-chart");
const capMessage = document.getElementById("cap-message");

// Update the three stat cards and the trend chart.
export function renderStats(records) {
  statTotal.textContent = totalCount(records);
  statSum.textContent = totalSpent(records).toFixed(2);
  statTop.textContent = topCategory(records);
  renderTrend(records);
}

// Draw a simple bar chart of the last 7 days using divs.
function renderTrend(records) {
  const days = last7Days(records);
  const max = Math.max(...days.map((d) => d.total), 1); // avoid divide-by-0

  trendChart.innerHTML = days
    .map((d) => {
      const heightPct = (d.total / max) * 100;
      const label = d.date.slice(5); // MM-DD
      return `
        <div class="bar-col">
          <div class="bar" style="height: ${heightPct}%"></div>
          <span class="bar-label">${label}</span>
        </div>`;
    })
    .join("");
}

// Update the spending-cap live message.
// Polite when under the cap, assertive when over.
export function renderCap(records, cap) {
  if (!cap || cap <= 0) {
    capMessage.textContent = "";
    return;
  }
  const spent = totalSpent(records);
  if (spent > cap) {
    const over = (spent - cap).toFixed(2);
    capMessage.setAttribute("aria-live", "assertive");
    capMessage.textContent = `Over budget by ${over}.`;
    capMessage.classList.add("over-budget");
  } else {
    const left = (cap - spent).toFixed(2);
    capMessage.setAttribute("aria-live", "polite");
    capMessage.textContent = `${left} remaining of your ${cap.toFixed(2)} cap.`;
    capMessage.classList.remove("over-budget");
  }
}