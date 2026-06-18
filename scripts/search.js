// scripts/search.js
// Safe regex compilation + match highlighting for live search.

// Compile a user-typed pattern into a RegExp.
// Returns null if the input is empty OR the pattern is invalid —
// the try/catch is what makes a bad pattern safe (no crash).
export function compileRegex(input, caseInsensitive) {
  if (!input) return null;
  const flags = caseInsensitive ? "gi" : "g";
  try {
    return new RegExp(input, flags);
  } catch {
    return null;
  }
}

// Filter records: keep any whose description OR category matches the regex.
// If re is null (empty/invalid pattern), return everything.
export function filterRecords(records, re) {
  if (!re) return records;
  return records.filter((r) => {
    // Reset lastIndex because the regex is global (g flag).
    re.lastIndex = 0;
    const inDesc = re.test(r.description);
    re.lastIndex = 0;
    const inCat = re.test(r.category);
    return inDesc || inCat;
  });
}

// Wrap matches in <mark> for highlighting.
// IMPORTANT: escape the text first so record content can't inject HTML.
export function highlight(text, re) {
  const safe = escapeHtml(text);
  if (!re) return safe;
  re.lastIndex = 0;
  return safe.replace(re, (m) => `<mark>${m}</mark>`);
}

// Escape &, <, > so user data is never treated as HTML.
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}