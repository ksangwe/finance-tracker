# Student Finance Tracker — Spec (M1)

## 1. Purpose
A responsive, accessible web app for students to track spending. Users add,
edit, search, and delete transactions; view stats; set a spending cap; and
import/export their data. All data persists locally in the browser.

## 2. Data Model
Each transaction record:

| Field       | Type   | Notes                                          |
|-------------|--------|------------------------------------------------|
| `id`        | string | Unique, e.g. `txn_0001`                        |
| `description` | string | 1–80 chars, trimmed, no double spaces        |
| `amount`    | number | ≥ 0, up to 2 decimal places                    |
| `category`  | string | One of the categories below                    |
| `date`      | string | `YYYY-MM-DD`                                    |
| `createdAt` | string | ISO 8601 timestamp, set once on creation       |
| `updatedAt` | string | ISO 8601 timestamp, updated on every edit      |

### Categories
Food, Books, Transport, Entertainment, Fees, Other (editable in Settings).

### Example record
```json
{
  "id": "txn_0001",
  "description": "Lunch at cafeteria",
  "amount": 12.50,
  "category": "Food",
  "date": "2025-09-29",
  "createdAt": "2025-09-29T10:30:00.000Z",
  "updatedAt": "2025-09-29T10:30:00.000Z"
}
```
## 3. Accessibility Plan
- **Landmarks:** `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` used where appropriate, so screen-reader users can jump between regions.
- **Headings:** single `<h1>` for the app title; `<h2>` per section; no skipped levels.
- **Skip link:** a "Skip to content" link is the first focusable element, jumping focus to `<main>`.
- **Forms:** every input has a bound `<label>` (via `for`/`id`); errors are tied to inputs with `aria-describedby`.
- **Focus:** visible focus ring on all interactive elements; logical tab order; the whole app is usable keyboard-only.
- **Live regions:** a `role="status"` (polite) region announces saves, edits, and search result counts; the cap/overage message switches to `aria-live="assertive"` when the cap is exceeded.
- **Search highlight:** matches wrapped in `<mark>`, which keeps highlighted text readable by assistive tech without breaking semantics.
- **Contrast:** all text/background pairs target WCAG AA (≥ 4.5:1 for body text); verified before submission.

## 4. Keyboard Map (planned)
| Key                 | Action                        |
|---------------------|-------------------------------|
| `Tab` / `Shift+Tab` | Move between controls          |
| `Enter`             | Submit form / activate button  |
| `Esc`               | Cancel inline edit             |
| `/`                 | Jump focus to search box       |

## 5. Wireframes (mobile-first)

### Mobile (~360px) — single column
```
+-----------------------------+
| [skip to content]           |
| HEADER: Finance Tracker     |
| NAV: About Dashboard        |
|      Records Add Settings   |
+-----------------------------+
| MAIN                        |
|  [ Stats cards stacked ]    |
|   total | sum | top cat     |
|  [ 7-day mini chart ]       |
|                             |
|  [ Search box .......  ]    |
|  [ Sort v ] [ +Add ]        |
|                             |
|  RECORDS as cards:          |
|  +-----------------------+  |
|  | Lunch    Food  $12.50 |  |
|  | 2025-09-29 [edit][del]|  |
|  +-----------------------+  |
+-----------------------------+
| FOOTER: contact / github    |
+-----------------------------+
```

### Desktop (≥1024px) — sidebar + table
```
+----------------------------------------------------+
| HEADER: Finance Tracker        [skip to content]   |
+----------+-----------------------------------------+
| NAV      | MAIN                                    |
| About    |  [Stats: total | sum | top | chart ]    |
| Dashboard|                                         |
| Records  |  [ Search ........ ] [Sort v] [+Add]    |
| Add      |  +-----------------------------------+  |
| Settings |  | Date | Desc | Cat | Amount | ... |  |
|          |  | ...rows in a table...            |  |
|          |  +-----------------------------------+  |
+----------+-----------------------------------------+
| FOOTER: contact / github                           |
+----------------------------------------------------+
\```

### Notes
- Records render as **cards on mobile**, **table on desktop** (same data).
- Breakpoints: ~360px (base), 768px (tablet), 1024px (desktop).
- Add/Edit form appears as a section/dialog; inline edit on table rows for desktop.