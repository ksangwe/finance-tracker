# Student Finance Tracker

A responsive, accessible single-page web app for students to track spending,
built with vanilla HTML, CSS, and JavaScript — no frameworks.

**Live site:** https://ksangwe.github.io/finance-tracker/
**Repo:** https://github.com/ksangwe/finance-tracker
**Contact:** k.sangwe@alustudent.com
---

## Chosen theme
**Student Finance Tracker** — track transactions (description, amount, category,
date), view spending stats, set a budget cap, and import/export data.

## Features
- Add, edit, and delete transactions with confirmation on delete.
- Live regex-powered search across description and category, with match
  highlighting and a case-insensitive toggle.
- Sort by date, description, or amount (ascending/descending).
- Stats dashboard: total records, total spent, top category, and a
  last-7-days trend chart (pure CSS/JS, no library).
- Spending cap with an ARIA live message: polite when under budget,
  assertive when over.
- Auto-save to localStorage; data persists across sessions.
- JSON import/export with structure validation and graceful error handling.
- Persisted settings (cap + manual currency rates: USD base, EUR, RWF).
- Fully responsive, mobile-first layout (cards on mobile, table on desktop)
  across three breakpoints (~360px, 768px, 1024px).
- Keyboard-navigable with visible focus, skip link, and semantic landmarks.

## Regex catalog
| Rule | Pattern | Valid | Invalid |
|------|---------|-------|---------|
| Description | `^\S(?:.*\S)?$` | `Lunch at cafe` | `" Lunch"`, `"Lunch "` |
| Amount | `^(0\|[1-9]\d*)(\.\d{1,2})?$` | `0`, `12.50` | `01`, `1.999`, `-5` |
| Date | `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` | `2025-09-29` | `2025-13-01`, `2025-01-32` |
| Category | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` | `Food`, `Dining-Out` | `Food123` |
| Doubled word (advanced, back-reference) | `\b(\w+)\s+\1\b` | flags `coffee coffee` | `coffee tea` |

The advanced rule uses a **back-reference** (`\1`) to detect an accidentally
repeated word in a description.

Search uses a safe regex compiler: user input is compiled inside a `try/catch`,
so an invalid pattern simply shows all records instead of crashing.

## Keyboard map
| Key | Action |
|-----|--------|
| `Tab` / `Shift+Tab` | Move between controls |
| `Enter` | Submit form / activate focused button |
| Focus "Skip to content" then `Enter` | Jump straight to main content |
| `Tab` to Edit/Delete + `Enter` | Edit or delete a record |

## Accessibility notes
- Semantic landmarks: `header`, `nav`, `main`, `section`, `footer`.
- Single `h1`; `h2` per section; no skipped heading levels.
- Skip-to-content link as the first focusable element.
- All inputs have bound labels; errors linked via `aria-describedby` and
  announced with `role="alert"`.
- Visible focus outlines via `:focus-visible`.
- Status updates and the cap message use ARIA live regions.
- Search highlights use `<mark>`; record text is HTML-escaped before render.
- Color contrast targets WCAG AA.

## How to run
Because the app uses ES modules, it must be served over http (not opened as a
local file).

1. Visit the live site above, **or**
2. Run locally: clone the repo, open the folder in VS Code, and use the
   Live Server extension (right-click `index.html` → "Open with Live Server").

## How to run tests
Open `tests.html` (e.g. https://ksangwe.github.io/finance-tracker/tests.html).
It runs assertions against every validator and shows a pass/fail list plus a
summary. All 19 tests should pass.

## Project structure
```
index.html        Main app
tests.html        Validator test page
seed.json         Sample data (≥10 records)
styles/main.css   Mobile-first styles
scripts/
  app.js          Entry point, wires everything together
  state.js        In-memory records + add/update/delete/import/export
  storage.js      localStorage (records + settings)
  validators.js   Regex catalog + field validators
  search.js       Safe regex compiler + highlight
  ui.js           Rendering, sorting, stats, cap
  stats.js        Dashboard calculations
docs/SPEC.md      M1 spec, data model, a11y plan, wireframes
```