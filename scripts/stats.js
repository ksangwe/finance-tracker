// scripts/stats.js
// Computes dashboard metrics from the records array.

// Total number of records.
export function totalCount(records) {
  return records.length;
}

// Sum of all amounts.
export function totalSpent(records) {
  return records.reduce((sum, r) => sum + r.amount, 0);
}

// Category that appears most often. Returns "—" if no records.
export function topCategory(records) {
  if (records.length === 0) return "—";
  const counts = {};
  for (const r of records) {
    counts[r.category] = (counts[r.category] || 0) + 1;
  }
  let best = "—";
  let bestCount = 0;
  for (const cat in counts) {
    if (counts[cat] > bestCount) {
      bestCount = counts[cat];
      best = cat;
    }
  }
  return best;
}

// Spending totals for each of the last 7 days (oldest first).
// Returns [{ date: "2025-09-23", total: 0 }, ...] length 7.
export function last7Days(records) {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
    days.push({ date: key, total: 0 });
  }

  for (const r of records) {
    const day = days.find((d) => d.date === r.date);
    if (day) day.total += r.amount;
  }
  return days;
}