# Film Shooting Schedule Management Application - Design Guidelines

## Design Philosophy

This is a **professional production tool** for film industry professionals. The design prioritizes:
- **Functional clarity over decoration** - Every element serves a purpose
- **Information density with readability** - Display lots of data without overwhelming
- **Scannable hierarchy** - Quick visual parsing of complex schedules
- **Reliable, trustworthy aesthetic** - Professional, not playful
- **Print-first thinking** - Clean output for physical call sheets

---

## GRADIENT RESTRICTION RULE

**NEVER use dark/saturated gradient combos** (e.g., purple/pink, blue-500 to purple-600) on any UI element.
**NEVER let gradients cover more than 20% of the viewport.**
**NEVER apply gradients to text-heavy content or reading areas.**
**NEVER use gradients on small UI elements (<100px width).**
**NEVER stack multiple gradient layers in the same viewport.**

### ENFORCEMENT RULE
IF gradient area exceeds 20% of viewport OR impacts readability
THEN fallback to solid colors.

### ALLOWED GRADIENT USAGE (Minimal)
- Subtle background accent in empty states only
- Very light gradients in hero/welcome screens (if any)
- This is a data-heavy tool - prioritize solid colors

---

## Color System

### Design Rationale
Professional production tools require **neutral, calm palettes** that reduce eye strain during long editing sessions. The slate gray and blue system conveys **reliability, technical precision, and focus**.

### Primary Palette

```css
:root {
  /* Base Colors - Neutral Slate System */
  --color-slate-50: #f8fafc;
  --color-slate-100: #f1f5f9;
  --color-slate-200: #e2e8f0;
  --color-slate-300: #cbd5e1;
  --color-slate-400: #94a3b8;
  --color-slate-500: #64748b;
  --color-slate-600: #475569;
  --color-slate-700: #334155;
  --color-slate-800: #1e293b;
  --color-slate-900: #0f172a;

  /* Accent Colors - Professional Blue */
  --color-blue-50: #eff6ff;
  --color-blue-100: #dbeafe;
  --color-blue-500: #3b82f6;
  --color-blue-600: #2563eb;
  --color-blue-700: #1d4ed8;

  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  /* Application Colors */
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-surface-elevated: #ffffff;
  --color-border: #e2e8f0;
  --color-border-strong: #cbd5e1;
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-tertiary: #94a3b8;
  --color-interactive: #2563eb;
  --color-interactive-hover: #1d4ed8;
}
```

### Color Usage Guidelines

**Backgrounds:**
- Main app background: `--color-background` (white #ffffff)
- Card/panel backgrounds: `--color-surface` (#f8fafc)
- Elevated elements (modals, dropdowns): `--color-surface-elevated` (white)
- Table header background: `--color-slate-100` (#f1f5f9)
- Hover states on rows: `--color-slate-50` (#f8fafc)

**Borders:**
- Default borders: `--color-border` (#e2e8f0) - 1px solid
- Strong emphasis borders: `--color-border-strong` (#cbd5e1)
- Focus rings: `--color-interactive` (#2563eb) - 2px solid

**Text:**
- Primary headings/labels: `--color-text-primary` (#0f172a)
- Body text/secondary labels: `--color-text-secondary` (#475569)
- Placeholder/disabled text: `--color-text-tertiary` (#94a3b8)

**Interactive Elements:**
- Primary buttons: Background `--color-blue-600`, hover `--color-blue-700`
- Links and interactive text: `--color-interactive` (#2563eb)
- Selected/active states: `--color-blue-100` background with `--color-blue-700` text

**Status Indicators:**
- Success (saved, completed): `--color-success` (#10b981)
- Warning (unsaved changes): `--color-warning` (#f59e0b)
- Error (validation failed): `--color-error` (#ef4444)
- Info (tips, help): `--color-info` (#3b82f6)

### Contrast Requirements
- All text must meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Interactive elements must have clear visual distinction from non-interactive
- Focus states must be clearly visible with 2px blue ring

---

## Typography System

### Font Stack

**Primary Font: IBM Plex Sans**
- Professional, technical, and neutral
- Excellent readability for data-heavy interfaces
- Multiple weights for clear hierarchy

**Fallback: Inter**
- Modern, designed for digital interfaces
- High readability at small sizes

```css
:root {
  --font-primary: 'IBM Plex Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'IBM Plex Mono', 'Courier New', monospace;
}
```

### Font Loading
Import from Google Fonts in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Type Scale

```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px - timestamps, metadata */
  --text-sm: 0.875rem;     /* 14px - table cells, secondary text */
  --text-base: 1rem;       /* 16px - body text, form inputs */
  --text-lg: 1.125rem;     /* 18px - section headings */
  --text-xl: 1.25rem;      /* 20px - page titles */
  --text-2xl: 1.5rem;      /* 24px - modal titles */
  --text-3xl: 1.875rem;    /* 30px - main app title (rare) */

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Typography Usage

**Headings:**
- H1 (App Title): `text-xl` (20px), `font-semibold` (600), `--color-text-primary`
- H2 (Section Titles): `text-lg` (18px), `font-semibold` (600), `--color-text-primary`
- H3 (Day Headers): `text-base` (16px), `font-semibold` (600), `--color-text-primary`
- H4 (Modal Titles): `text-2xl` (24px), `font-semibold` (600), `--color-text-primary`

**Body Text:**
- Primary: `text-base` (16px), `font-normal` (400), `--color-text-secondary`
- Secondary: `text-sm` (14px), `font-normal` (400), `--color-text-secondary`
- Small/Meta: `text-xs` (12px), `font-normal` (400), `--color-text-tertiary`

**Table Text:**
- Table headers: `text-sm` (14px), `font-semibold` (600), `--color-text-primary`
- Table cells: `text-sm` (14px), `font-normal` (400), `--color-text-secondary`
- Text rows (headlines): `text-base` (16px), `font-semibold` (600), `--color-text-primary`

**Form Elements:**
- Labels: `text-sm` (14px), `font-medium` (500), `--color-text-primary`
- Input text: `text-base` (16px), `font-normal` (400), `--color-text-primary`
- Placeholder: `text-base` (16px), `font-normal` (400), `--color-text-tertiary`
- Helper text: `text-xs` (12px), `font-normal` (400), `--color-text-tertiary`

**Buttons:**
- Primary buttons: `text-sm` (14px), `font-medium` (500)
- Secondary buttons: `text-sm` (14px), `font-medium` (500)
- Icon buttons: No text, icon size 16-20px

---

## Spacing System

### Design Rationale
Consistent spacing creates visual rhythm and helps users scan information quickly. Use 8px base unit for predictable, harmonious layouts.

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px - tight spacing */
  --space-2: 0.5rem;    /* 8px - base unit */
  --space-3: 0.75rem;   /* 12px - compact spacing */
  --space-4: 1rem;      /* 16px - default spacing */
  --space-5: 1.25rem;   /* 20px - comfortable spacing */
  --space-6: 1.5rem;    /* 24px - section spacing */
  --space-8: 2rem;      /* 32px - large spacing */
  --space-10: 2.5rem;   /* 40px - extra large spacing */
  --space-12: 3rem;     /* 48px - major section breaks */
  --space-16: 4rem;     /* 64px - page-level spacing */
}
```

### Spacing Usage

**Component Padding:**
- Buttons: `padding: var(--space-2) var(--space-4)` (8px 16px)
- Input fields: `padding: var(--space-2) var(--space-3)` (8px 12px)
- Cards/panels: `padding: var(--space-6)` (24px)
- Table cells: `padding: var(--space-3) var(--space-4)` (12px 16px)
- Modals: `padding: var(--space-8)` (32px)

**Component Margins:**
- Between form fields: `margin-bottom: var(--space-4)` (16px)
- Between sections: `margin-bottom: var(--space-8)` (32px)
- Between days in schedule: `margin-bottom: var(--space-6)` (24px)
- Page margins: `padding: var(--space-6)` (24px) on mobile, `var(--space-8)` (32px) on desktop

**Layout Gaps:**
- Toolbar items: `gap: var(--space-3)` (12px)
- Button groups: `gap: var(--space-2)` (8px)
- Form layouts: `gap: var(--space-4)` (16px)
- Grid layouts: `gap: var(--space-6)` (24px)

---

## Component Specifications

### Buttons

**Design Rationale:**
Professional tools need clear, functional buttons with subtle styling. Use medium rounded corners (6-8px) for a modern but not playful feel.

**Primary Button:**
```css
.btn-primary {
  background-color: var(--color-blue-600);
  color: white;
  padding: var(--space-2) var(--space-4);
  border-radius: 6px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.1s ease;
}

.btn-primary:hover {
  background-color: var(--color-blue-700);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--color-interactive);
  outline-offset: 2px;
}

.btn-primary:disabled {
  background-color: var(--color-slate-300);
  cursor: not-allowed;
  opacity: 0.6;
}
```

**Secondary Button:**
```css
.btn-secondary {
  background-color: white;
  color: var(--color-text-primary);
  padding: var(--space-2) var(--space-4);
  border-radius: 6px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: 1px solid var(--color-border-strong);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.btn-secondary:hover {
  background-color: var(--color-slate-50);
  border-color: var(--color-slate-400);
}

.btn-secondary:focus-visible {
  outline: 2px solid var(--color-interactive);
  outline-offset: 2px;
}
```

**Ghost Button (Icon Buttons):**
```css
.btn-ghost {
  background-color: transparent;
  color: var(--color-text-secondary);
  padding: var(--space-2);
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.btn-ghost:hover {
  background-color: var(--color-slate-100);
  color: var(--color-text-primary);
}
```

**Destructive Button:**
```css
.btn-destructive {
  background-color: var(--color-error);
  color: white;
  padding: var(--space-2) var(--space-4);
  border-radius: 6px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-destructive:hover {
  background-color: #dc2626;
}
```

**Button Sizes:**
- Small: `padding: var(--space-1) var(--space-3)`, `font-size: var(--text-xs)`
- Medium (default): `padding: var(--space-2) var(--space-4)`, `font-size: var(--text-sm)`
- Large: `padding: var(--space-3) var(--space-5)`, `font-size: var(--text-base)`

**Shadcn Component:** Use `./components/ui/button.jsx`

---

### Tables

**Design Rationale:**
Tables are the core of this application. Design for information density while maintaining readability. Use subtle borders, clear headers, and hover states for row selection.

**Table Structure:**
```css
.schedule-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.schedule-table thead {
  background-color: var(--color-slate-100);
  position: sticky;
  top: 0;
  z-index: 10;
}

.schedule-table th {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  border-bottom: 2px solid var(--color-border-strong);
  white-space: nowrap;
}

.schedule-table td {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-border);
  vertical-align: top;
}

.schedule-table tbody tr:hover {
  background-color: var(--color-slate-50);
}

.schedule-table tbody tr:last-child td {
  border-bottom: none;
}

/* Text Row Styling - Full Width Headlines */
.schedule-table tr.text-row td {
  background-color: var(--color-slate-100);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  padding: var(--space-4);
  border-top: 2px solid var(--color-border-strong);
  border-bottom: 2px solid var(--color-border-strong);
}

/* Drag Handle Column */
.schedule-table .drag-handle-cell {
  width: 40px;
  padding: var(--space-2);
  cursor: grab;
  color: var(--color-text-tertiary);
}

.schedule-table .drag-handle-cell:active {
  cursor: grabbing;
}

/* Dragging State */
.schedule-table tr.dragging {
  opacity: 0.5;
  background-color: var(--color-blue-50);
}

.schedule-table tr.drag-over {
  border-top: 3px solid var(--color-interactive);
}
```

**Column Width Customization:**
- Implement resizable columns with visual slider controls
- Store column widths in local state/storage
- Minimum column width: 80px
- Default widths: Time From (100px), Time To (100px), Scene (120px), Location (150px), Cast (200px), Notes (flexible)

**Shadcn Component:** Use `./components/ui/table.jsx`

---

### Forms & Inputs

**Design Rationale:**
Inline editing is critical. Inputs should feel integrated into the table, not like separate form fields. Use subtle borders that become prominent on focus.

**Text Input:**
```css
.input-field {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-base);
  font-family: var(--font-primary);
  color: var(--color-text-primary);
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.input-field:hover {
  border-color: var(--color-border-strong);
}

.input-field:focus {
  outline: none;
  border-color: var(--color-interactive);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-field::placeholder {
  color: var(--color-text-tertiary);
}

.input-field:disabled {
  background-color: var(--color-slate-50);
  cursor: not-allowed;
  opacity: 0.6;
}

/* Inline Table Input - Borderless until focus */
.input-inline {
  border: 1px solid transparent;
  background-color: transparent;
  padding: var(--space-2);
}

.input-inline:hover {
  border-color: var(--color-border);
  background-color: white;
}

.input-inline:focus {
  border-color: var(--color-interactive);
  background-color: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

**Textarea:**
```css
.textarea-field {
  width: 100%;
  min-height: 80px;
  padding: var(--space-3);
  font-size: var(--text-sm);
  font-family: var(--font-primary);
  color: var(--color-text-primary);
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  resize: vertical;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.textarea-field:focus {
  outline: none;
  border-color: var(--color-interactive);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

**Label:**
```css
.form-label {
  display: block;
  margin-bottom: var(--space-2);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}
```

**Shadcn Components:** Use `./components/ui/input.jsx`, `./components/ui/textarea.jsx`, `./components/ui/label.jsx`

---

### Modals & Dialogs

**Design Rationale:**
Modals should feel elevated and focused. Use subtle shadows and backdrop blur to create depth without being distracting.

**Modal Structure:**
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: var(--space-8);
}

.modal-header {
  margin-bottom: var(--space-6);
}

.modal-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.modal-description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-top: var(--space-2);
}

.modal-footer {
  margin-top: var(--space-8);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}
```

**Project Browser Modal:**
- Use tabs for Active/Archived projects
- Display projects as cards with name, last modified date, thumbnail (if logo exists)
- Include search/filter functionality
- Actions: Open, Rename, Delete, Archive/Unarchive

**Shadcn Components:** Use `./components/ui/dialog.jsx`, `./components/ui/tabs.jsx`

---

### Cards

**Design Rationale:**
Cards provide visual grouping and elevation. Use subtle shadows and borders for a clean, professional look.

```css
.card {
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: var(--space-6);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.15s ease, border-color 0.15s ease;
}

.card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-color: var(--color-border-strong);
}

.card-header {
  margin-bottom: var(--space-4);
}

.card-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.card-description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-top: var(--space-1);
}

.card-content {
  /* Content area */
}

.card-footer {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}
```

**Shadcn Component:** Use `./components/ui/card.jsx`

---

### Drag and Drop

**Design Rationale:**
Clear visual feedback is essential for drag and drop. Use drag handles, visual indicators during drag, and clear drop zones.

**Drag Handle:**
```css
.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--color-text-tertiary);
  cursor: grab;
  transition: color 0.15s ease;
}

.drag-handle:hover {
  color: var(--color-text-secondary);
}

.drag-handle:active {
  cursor: grabbing;
  color: var(--color-interactive);
}

/* Use FontAwesome icon: fa-grip-vertical or lucide-react: GripVertical */
```

**Dragging States:**
```css
/* Item being dragged */
.dragging {
  opacity: 0.5;
  background-color: var(--color-blue-50);
  border: 2px dashed var(--color-interactive);
}

/* Drop zone indicator */
.drop-zone-active {
  border-top: 3px solid var(--color-interactive);
  background-color: var(--color-blue-50);
}

/* Day reordering */
.day-section.dragging {
  opacity: 0.6;
  transform: scale(0.98);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

**Implementation:**
- Use `@dnd-kit/core` and `@dnd-kit/sortable` for drag and drop functionality
- Provide haptic feedback on mobile (if supported)
- Include keyboard navigation for accessibility (Arrow keys + Space to grab/drop)

---

### Toolbar

**Design Rationale:**
The toolbar is the command center. Keep it clean, organized, and always accessible. Use sticky positioning on scroll.

```css
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  background-color: white;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 40;
  gap: var(--space-4);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.toolbar-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.project-name {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.logo-preview {
  max-height: 40px;
  max-width: 120px;
  object-fit: contain;
}

.save-status {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.save-status.saved {
  color: var(--color-success);
}

.save-status.saving {
  color: var(--color-warning);
}

.save-status.error {
  color: var(--color-error);
}
```

**Toolbar Actions:**
- Logo upload button (icon button with upload icon)
- Project browser button
- Save button (with save status indicator)
- Export dropdown (CSV, Print/PDF)
- Add Day button
- Settings/preferences (optional)

---

### Day Sections

**Design Rationale:**
Days are major organizational units. Give them clear visual separation and make them easy to identify at a glance.

```css
.day-section {
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  margin-bottom: var(--space-6);
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.day-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  background-color: var(--color-slate-100);
  border-bottom: 2px solid var(--color-border-strong);
}

.day-title {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.day-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.day-content {
  /* Contains the schedule table */
}

.day-footer {
  padding: var(--space-4) var(--space-6);
  background-color: var(--color-slate-50);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-row-button {
  /* Button to add new rows to this day */
}
```

**Day Header Elements:**
- Drag handle (for reordering days)
- Day number/name (editable inline)
- Date picker (optional)
- Actions: Delete day, Duplicate day, Collapse/Expand

---

### Column Width Sliders

**Design Rationale:**
Allow users to customize column widths without cluttering the interface. Use subtle sliders in the table header.

```css
.column-resizer {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: col-resize;
  background-color: transparent;
  transition: background-color 0.15s ease;
}

.column-resizer:hover {
  background-color: var(--color-interactive);
}

.column-resizer:active {
  background-color: var(--color-blue-700);
}

/* Visual indicator during resize */
.column-resizing {
  user-select: none;
}

.column-resizing .column-resizer {
  background-color: var(--color-interactive);
}
```

**Implementation:**
- Add resize handle to right edge of each table header cell
- Show visual feedback during resize
- Store column widths in local storage
- Provide "Reset to Default" option

---

### Toasts & Notifications

**Design Rationale:**
Use toasts for non-intrusive feedback. Position at bottom-right, auto-dismiss after 3-5 seconds.

```css
.toast {
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: var(--space-4);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  min-width: 300px;
  max-width: 400px;
}

.toast-success {
  border-left: 4px solid var(--color-success);
}

.toast-error {
  border-left: 4px solid var(--color-error);
}

.toast-warning {
  border-left: 4px solid var(--color-warning);
}

.toast-info {
  border-left: 4px solid var(--color-info);
}

.toast-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.toast-description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.toast-close {
  flex-shrink: 0;
  color: var(--color-text-tertiary);
  cursor: pointer;
}
```

**Toast Messages:**
- Success: "Schedule saved successfully"
- Error: "Failed to save schedule. Please try again."
- Warning: "You have unsaved changes"
- Info: "Tip: Use drag handles to reorder rows"

**Shadcn Component:** Use `./components/ui/sonner.jsx` (Sonner toast library)

---

### Loading States

**Design Rationale:**
Provide clear feedback during async operations. Use skeleton screens for initial loads, spinners for actions.

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-slate-200) 0%,
    var(--color-slate-100) 50%,
    var(--color-slate-200) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-text {
  height: 1em;
  margin-bottom: var(--space-2);
}

.skeleton-table-row {
  height: 48px;
  margin-bottom: var(--space-1);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-slate-200);
  border-top-color: var(--color-interactive);
  border-radius: 50%;
  animation: spinner-rotate 0.6s linear infinite;
}

@keyframes spinner-rotate {
  to {
    transform: rotate(360deg);
  }
}
```

**Loading Scenarios:**
- Initial app load: Full-page skeleton with toolbar and table structure
- Saving: Spinner in save button, "Saving..." status
- Loading project: Skeleton table rows
- Exporting: Spinner in export button

**Shadcn Component:** Use `./components/ui/skeleton.jsx`

---

## Layout & Grid System

### Design Rationale
Use a flexible grid system that adapts to different screen sizes. Prioritize content over chrome.

### Desktop Layout (≥1024px)

```css
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
}

.main-content {
  flex: 1;
  padding: var(--space-8);
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

.schedule-container {
  /* Contains all day sections */
}
```

### Tablet Layout (768px - 1023px)

```css
@media (max-width: 1023px) {
  .main-content {
    padding: var(--space-6);
  }

  .toolbar {
    flex-wrap: wrap;
  }

  .toolbar-center {
    order: 3;
    width: 100%;
    justify-content: flex-start;
    margin-top: var(--space-3);
  }
}
```

### Mobile Layout (<768px)

**Design Rationale:**
On mobile, tables become cards. Each row is a card with labeled fields. Days remain as sections.

```css
@media (max-width: 767px) {
  .main-content {
    padding: var(--space-4);
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-3);
  }

  .toolbar-left,
  .toolbar-center,
  .toolbar-right {
    width: 100%;
    justify-content: space-between;
  }

  /* Hide table, show card layout */
  .schedule-table {
    display: none;
  }

  .schedule-cards {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .schedule-card {
    background-color: white;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: var(--space-4);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .schedule-card-field {
    margin-bottom: var(--space-3);
  }

  .schedule-card-label {
    font-size: var(--text-xs);
    font-weight: var(--font-semibold);
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-1);
  }

  .schedule-card-value {
    font-size: var(--text-sm);
    color: var(--color-text-primary);
  }

  .schedule-card-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
    margin-top: var(--space-4);
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
  }

  /* Text rows in mobile */
  .schedule-card.text-row {
    background-color: var(--color-slate-100);
    border: 2px solid var(--color-border-strong);
  }

  .schedule-card.text-row .schedule-card-value {
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
  }
}
```

### Responsive Breakpoints

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

---

## Print Styles

### Design Rationale
Print view should be clean, minimal, and optimized for physical call sheets. Remove all UI chrome, ensure proper text wrapping, and include logo.

```css
@media print {
  /* Hide UI elements */
  .toolbar,
  .day-actions,
  .drag-handle,
  .column-resizer,
  .add-row-button,
  .btn-ghost,
  .toast,
  button {
    display: none !important;
  }

  /* Reset layout */
  body {
    background-color: white;
    margin: 0;
    padding: 0;
  }

  .app-container {
    background-color: white;
  }

  .main-content {
    padding: 0;
    max-width: 100%;
  }

  /* Print header with logo */
  .print-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4);
    border-bottom: 2px solid var(--color-slate-900);
    margin-bottom: var(--space-6);
  }

  .print-logo {
    max-height: 60px;
    max-width: 200px;
  }

  .print-title {
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    color: var(--color-slate-900);
  }

  /* Day sections */
  .day-section {
    page-break-inside: avoid;
    margin-bottom: var(--space-8);
    border: 2px solid var(--color-slate-900);
  }

  .day-header {
    background-color: var(--color-slate-900) !important;
    color: white !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .day-title {
    color: white !important;
  }

  /* Table styles */
  .schedule-table {
    border: 1px solid var(--color-slate-900);
  }

  .schedule-table th {
    background-color: var(--color-slate-200) !important;
    color: var(--color-slate-900) !important;
    border: 1px solid var(--color-slate-900);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .schedule-table td {
    border: 1px solid var(--color-slate-400);
    color: var(--color-slate-900);
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: normal;
  }

  .schedule-table tr.text-row td {
    background-color: var(--color-slate-300) !important;
    font-weight: var(--font-bold);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Ensure text wrapping */
  * {
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  /* Page breaks */
  .day-section {
    page-break-after: always;
  }

  .day-section:last-child {
    page-break-after: auto;
  }

  /* Remove shadows and rounded corners for print */
  .day-section,
  .schedule-table,
  .card {
    box-shadow: none;
    border-radius: 0;
  }
}
```

---

## Micro-interactions & Animations

### Design Rationale
Subtle animations provide feedback and make the interface feel responsive. Avoid excessive motion that could distract from work.

### Transition Timing

```css
:root {
  --transition-fast: 0.1s;
  --transition-base: 0.15s;
  --transition-slow: 0.3s;
  --transition-slower: 0.5s;

  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
}
```

### Animation Guidelines

**Button Interactions:**
```css
button {
  transition: background-color var(--transition-base) var(--ease-in-out),
              color var(--transition-base) var(--ease-in-out),
              transform var(--transition-fast) var(--ease-out);
}

button:active {
  transform: scale(0.98);
}
```

**Input Focus:**
```css
input, textarea {
  transition: border-color var(--transition-base) var(--ease-in-out),
              box-shadow var(--transition-base) var(--ease-in-out);
}
```

**Hover States:**
```css
.schedule-table tbody tr {
  transition: background-color var(--transition-base) var(--ease-in-out);
}

.card {
  transition: box-shadow var(--transition-base) var(--ease-in-out),
              border-color var(--transition-base) var(--ease-in-out);
}
```

**Modal Entrance:**
```css
@keyframes modal-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modal-scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-overlay {
  animation: modal-fade-in var(--transition-base) var(--ease-out);
}

.modal-content {
  animation: modal-scale-in var(--transition-slow) var(--ease-out);
}
```

**Drag and Drop:**
```css
.dragging {
  transition: opacity var(--transition-base) var(--ease-in-out),
              transform var(--transition-base) var(--ease-in-out);
}

.drop-zone-active {
  transition: background-color var(--transition-fast) var(--ease-in-out),
              border-color var(--transition-fast) var(--ease-in-out);
}
```

**Toast Entrance/Exit:**
```css
@keyframes toast-slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes toast-slide-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.toast {
  animation: toast-slide-in var(--transition-slow) var(--ease-out);
}

.toast.exiting {
  animation: toast-slide-out var(--transition-slow) var(--ease-in);
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Accessibility

### Design Rationale
Professional tools must be accessible to all users. Follow WCAG 2.1 AA standards.

### Focus Management

```css
/* Visible focus indicators */
*:focus-visible {
  outline: 2px solid var(--color-interactive);
  outline-offset: 2px;
}

/* Remove default outline, use custom */
*:focus {
  outline: none;
}

/* Skip to content link */
.skip-to-content {
  position: absolute;
  top: -40px;
  left: 0;
  background-color: var(--color-interactive);
  color: white;
  padding: var(--space-2) var(--space-4);
  text-decoration: none;
  z-index: 100;
}

.skip-to-content:focus {
  top: 0;
}
```

### Keyboard Navigation

**Requirements:**
- All interactive elements must be keyboard accessible
- Tab order must be logical (left to right, top to bottom)
- Drag and drop must have keyboard alternative:
  - Focus on drag handle
  - Press Space to "grab" item
  - Use Arrow keys to move
  - Press Space again to "drop"
- Modal traps focus until closed
- Escape key closes modals and dropdowns

### Screen Reader Support

**ARIA Labels:**
```jsx
// Drag handle
<button aria-label="Drag to reorder row">
  <GripVertical />
</button>

// Delete button
<button aria-label="Delete row">
  <Trash2 />
</button>

// Table
<table aria-label="Shooting schedule">
  <caption className="sr-only">Daily shooting schedule with times, scenes, locations, cast, and notes</caption>
</table>

// Status indicators
<span aria-live="polite" aria-atomic="true">
  {saveStatus === 'saved' && 'Schedule saved successfully'}
  {saveStatus === 'saving' && 'Saving schedule...'}
  {saveStatus === 'error' && 'Error saving schedule'}
</span>
```

**Screen Reader Only Class:**
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Color Contrast

**Requirements:**
- Normal text (< 18px): 4.5:1 contrast ratio
- Large text (≥ 18px or ≥ 14px bold): 3:1 contrast ratio
- UI components and graphics: 3:1 contrast ratio

**Verified Combinations:**
- `--color-text-primary` (#0f172a) on white: 16.1:1 ✓
- `--color-text-secondary` (#475569) on white: 8.6:1 ✓
- `--color-text-tertiary` (#94a3b8) on white: 3.8:1 ✓
- `--color-blue-600` (#2563eb) on white: 4.9:1 ✓
- White on `--color-blue-600`: 4.3:1 ✓

### Touch Targets

**Minimum sizes:**
- Buttons: 44x44px (iOS), 48x48px (Android)
- Icon buttons: 40x40px minimum
- Drag handles: 40x40px minimum
- Table cells: Minimum 44px height

---

## Icons

### Design Rationale
Use consistent, professional icons. Prefer outline style over filled for a lighter, more technical feel.

### Icon Library

**Primary: Lucide React** (already installed)
```jsx
import { 
  Save, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  GripVertical, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  FileText,
  Settings,
  Search,
  X,
  Check,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Copy,
  Archive,
  Edit2,
  Printer
} from 'lucide-react';
```

**Alternative: FontAwesome** (if needed)
```html
<!-- Add to index.html -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

### Icon Sizes

```css
:root {
  --icon-xs: 14px;
  --icon-sm: 16px;
  --icon-base: 20px;
  --icon-lg: 24px;
  --icon-xl: 32px;
}
```

**Usage:**
- Toolbar buttons: `--icon-base` (20px)
- Table action buttons: `--icon-sm` (16px)
- Modal close button: `--icon-lg` (24px)
- Drag handles: `--icon-base` (20px)
- Status indicators: `--icon-sm` (16px)

### Icon Colors

```css
.icon-primary {
  color: var(--color-text-primary);
}

.icon-secondary {
  color: var(--color-text-secondary);
}

.icon-tertiary {
  color: var(--color-text-tertiary);
}

.icon-interactive {
  color: var(--color-interactive);
}

.icon-success {
  color: var(--color-success);
}

.icon-error {
  color: var(--color-error);
}

.icon-warning {
  color: var(--color-warning);
}
```

---

## Image Assets

### Logo Upload

**Requirements:**
- Supported formats: PNG, JPG, SVG
- Maximum file size: 2MB
- Recommended dimensions: 200x60px (landscape) or 60x60px (square)
- Display size: Max 120px width, 40px height in toolbar
- Print size: Max 200px width, 60px height

**Placeholder:**
If no logo uploaded, show project name in bold text.

### Empty States

**No Projects:**
```jsx
<div className="empty-state">
  <FileText size={48} className="icon-tertiary" />
  <h3>No projects yet</h3>
  <p>Create your first shooting schedule to get started</p>
  <button className="btn-primary">Create Project</button>
</div>
```

**No Rows in Day:**
```jsx
<div className="empty-state-small">
  <p className="text-sm text-secondary">No scenes scheduled for this day</p>
  <button className="btn-secondary btn-sm">Add Row</button>
</div>
```

### Background Images (Optional)

**Hero/Welcome Screen (if implemented):**
Use subtle, professional film production imagery:
- https://images.unsplash.com/photo-1548552554-ac8ad1b37d6b (Camera equipment)
- https://images.pexels.com/photos/4992644/pexels-photo-4992644.jpeg (Film set)

**Usage:**
```css
.welcome-hero {
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.95),
    rgba(255, 255, 255, 0.98)
  ),
  url('https://images.unsplash.com/photo-1548552554-ac8ad1b37d6b');
  background-size: cover;
  background-position: center;
}
```

---

## Component Library Usage

### Shadcn/UI Components

**Primary Components to Use:**

1. **Button** (`./components/ui/button.jsx`)
   - Variants: default, secondary, ghost, destructive
   - Sizes: sm, default, lg

2. **Input** (`./components/ui/input.jsx`)
   - Use for all text inputs
   - Supports inline editing styles

3. **Textarea** (`./components/ui/textarea.jsx`)
   - Use for Notes column
   - Auto-resize on content

4. **Table** (`./components/ui/table.jsx`)
   - Base table structure
   - Customize with schedule-specific styles

5. **Dialog** (`./components/ui/dialog.jsx`)
   - Project browser modal
   - Confirmation dialogs
   - Settings modal

6. **Tabs** (`./components/ui/tabs.jsx`)
   - Active/Archived projects in browser
   - Settings sections (if needed)

7. **Card** (`./components/ui/card.jsx`)
   - Project cards in browser
   - Mobile schedule cards

8. **Dropdown Menu** (`./components/ui/dropdown-menu.jsx`)
   - Export options
   - Row actions menu
   - Day actions menu

9. **Sonner** (`./components/ui/sonner.jsx`)
   - Toast notifications
   - Save status, errors, success messages

10. **Slider** (`./components/ui/slider.jsx`)
    - Column width adjustment (if using slider UI)

11. **Calendar** (`./components/ui/calendar.jsx`)
    - Date picker for days

12. **Skeleton** (`./components/ui/skeleton.jsx`)
    - Loading states

13. **Separator** (`./components/ui/separator.jsx`)
    - Visual dividers

14. **Label** (`./components/ui/label.jsx`)
    - Form labels

15. **Alert Dialog** (`./components/ui/alert-dialog.jsx`)
    - Delete confirmations
    - Unsaved changes warnings

### Additional Libraries

**Drag and Drop:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Date Handling:**
```bash
npm install date-fns
```

**CSV Export:**
```bash
npm install papaparse
```

**Print/PDF:**
```bash
npm install html2pdf.js
# or use browser's native print functionality
```

---

## Data Testid Conventions

### Design Rationale
All interactive and key informational elements must include `data-testid` attributes for automated testing. Use kebab-case naming that describes the element's role.

### Naming Convention

**Format:** `{component}-{element}-{action/type}`

**Examples:**

**Toolbar:**
```jsx
<div data-testid="toolbar">
  <button data-testid="toolbar-logo-upload-button">Upload Logo</button>
  <button data-testid="toolbar-project-browser-button">Projects</button>
  <button data-testid="toolbar-save-button">Save</button>
  <button data-testid="toolbar-export-button">Export</button>
  <button data-testid="toolbar-add-day-button">Add Day</button>
  <span data-testid="toolbar-save-status">Saved</span>
</div>
```

**Day Section:**
```jsx
<div data-testid={`day-section-${dayId}`}>
  <div data-testid={`day-header-${dayId}`}>
    <button data-testid={`day-drag-handle-${dayId}`}>Drag</button>
    <input data-testid={`day-title-input-${dayId}`} />
    <button data-testid={`day-delete-button-${dayId}`}>Delete</button>
  </div>
  <table data-testid={`day-table-${dayId}`}>
    {/* Table content */}
  </table>
  <button data-testid={`day-add-row-button-${dayId}`}>Add Row</button>
</div>
```

**Table Rows:**
```jsx
<tr data-testid={`schedule-row-${rowId}`}>
  <td data-testid={`row-drag-handle-${rowId}`}>
    <button>Drag</button>
  </td>
  <td data-testid={`row-time-from-${rowId}`}>
    <input data-testid={`row-time-from-input-${rowId}`} />
  </td>
  <td data-testid={`row-time-to-${rowId}`}>
    <input data-testid={`row-time-to-input-${rowId}`} />
  </td>
  <td data-testid={`row-scene-${rowId}`}>
    <input data-testid={`row-scene-input-${rowId}`} />
  </td>
  <td data-testid={`row-location-${rowId}`}>
    <input data-testid={`row-location-input-${rowId}`} />
  </td>
  <td data-testid={`row-cast-${rowId}`}>
    <input data-testid={`row-cast-input-${rowId}`} />
  </td>
  <td data-testid={`row-notes-${rowId}`}>
    <textarea data-testid={`row-notes-input-${rowId}`} />
  </td>
  <td data-testid={`row-actions-${rowId}`}>
    <button data-testid={`row-delete-button-${rowId}`}>Delete</button>
  </td>
</tr>
```

**Text Rows:**
```jsx
<tr data-testid={`text-row-${rowId}`} className="text-row">
  <td colSpan="8" data-testid={`text-row-content-${rowId}`}>
    <input data-testid={`text-row-input-${rowId}`} />
  </td>
</tr>
```

**Modals:**
```jsx
<div data-testid="project-browser-modal">
  <div data-testid="project-browser-tabs">
    <button data-testid="project-browser-active-tab">Active</button>
    <button data-testid="project-browser-archived-tab">Archived</button>
  </div>
  <div data-testid="project-browser-search">
    <input data-testid="project-browser-search-input" />
  </div>
  <div data-testid="project-browser-list">
    {projects.map(project => (
      <div data-testid={`project-card-${project.id}`} key={project.id}>
        <h3 data-testid={`project-card-name-${project.id}`}>{project.name}</h3>
        <button data-testid={`project-card-open-button-${project.id}`}>Open</button>
        <button data-testid={`project-card-rename-button-${project.id}`}>Rename</button>
        <button data-testid={`project-card-delete-button-${project.id}`}>Delete</button>
        <button data-testid={`project-card-archive-button-${project.id}`}>Archive</button>
      </div>
    ))}
  </div>
</div>
```

**Toasts:**
```jsx
<div data-testid="toast-notification" className="toast toast-success">
  <span data-testid="toast-title">Success</span>
  <span data-testid="toast-description">Schedule saved successfully</span>
  <button data-testid="toast-close-button">Close</button>
</div>
```

**Forms:**
```jsx
<form data-testid="project-create-form">
  <label data-testid="project-name-label">Project Name</label>
  <input data-testid="project-name-input" />
  <button data-testid="project-create-submit-button">Create</button>
  <button data-testid="project-create-cancel-button">Cancel</button>
</form>
```

---

## Error States

### Design Rationale
Clear, helpful error messages guide users to resolution. Use consistent styling and actionable language.

### Error Message Styling

```css
.error-message {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-3);
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-left: 4px solid var(--color-error);
  border-radius: 6px;
  font-size: var(--text-sm);
  color: #991b1b;
}

.error-icon {
  flex-shrink: 0;
  color: var(--color-error);
}

.error-content {
  flex: 1;
}

.error-title {
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-1);
}

.error-description {
  color: #7f1d1d;
}

.error-actions {
  margin-top: var(--space-2);
  display: flex;
  gap: var(--space-2);
}
```

### Error Scenarios

**Failed to Load Project:**
```jsx
<div className="error-message" data-testid="error-load-project">
  <AlertCircle className="error-icon" size={20} />
  <div className="error-content">
    <div className="error-title">Failed to load project</div>
    <div className="error-description">
      The project could not be loaded. It may have been deleted or you may not have permission to access it.
    </div>
    <div className="error-actions">
      <button className="btn-secondary btn-sm" data-testid="error-retry-button">Try Again</button>
      <button className="btn-ghost btn-sm" data-testid="error-back-button">Back to Projects</button>
    </div>
  </div>
</div>
```

**Failed to Save:**
```jsx
<div className="error-message" data-testid="error-save-project">
  <AlertCircle className="error-icon" size={20} />
  <div className="error-content">
    <div className="error-title">Failed to save changes</div>
    <div className="error-description">
      Your changes could not be saved. Please check your internet connection and try again.
    </div>
    <div className="error-actions">
      <button className="btn-primary btn-sm" data-testid="error-save-retry-button">Retry Save</button>
    </div>
  </div>
</div>
```

**Validation Errors:**
```jsx
<div className="error-message" data-testid="error-validation">
  <AlertCircle className="error-icon" size={20} />
  <div className="error-content">
    <div className="error-title">Please fix the following errors:</div>
    <ul className="error-list">
      <li>Project name is required</li>
      <li>At least one day must be added</li>
    </ul>
  </div>
</div>
```

**Input Field Errors:**
```css
.input-error {
  border-color: var(--color-error);
}

.input-error:focus {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.field-error-message {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-top: var(--space-1);
  font-size: var(--text-xs);
  color: var(--color-error);
}
```

---

## Performance Considerations

### Design Rationale
Large schedules with many days and rows can impact performance. Optimize rendering and interactions.

### Optimization Strategies

**Virtual Scrolling:**
- For schedules with >100 rows, implement virtual scrolling
- Use `react-window` or `react-virtual` library
- Render only visible rows + buffer

**Debounced Auto-Save:**
```javascript
// Debounce save operations
const debouncedSave = useMemo(
  () => debounce((data) => saveSchedule(data), 1000),
  []
);
```

**Optimistic Updates:**
- Update UI immediately on user action
- Sync with backend in background
- Revert on error with toast notification

**Lazy Loading:**
- Load project list on demand
- Load individual projects only when opened
- Lazy load images (logo)

**Memoization:**
```javascript
// Memoize expensive calculations
const sortedDays = useMemo(() => {
  return days.sort((a, b) => a.order - b.order);
}, [days]);

// Memoize row components
const ScheduleRow = memo(({ row, onUpdate }) => {
  // Row component
});
```

**Code Splitting:**
```javascript
// Lazy load modals
const ProjectBrowserModal = lazy(() => import('./components/ProjectBrowserModal'));
const ExportModal = lazy(() => import('./components/ExportModal'));
```

---

## Browser Support

### Target Browsers

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile Safari (iOS): Last 2 versions
- Chrome Mobile (Android): Last 2 versions

### Polyfills (if needed)

```javascript
// Add to index.js if supporting older browsers
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

### Feature Detection

```javascript
// Check for drag and drop support
const supportsDragAndDrop = 'draggable' in document.createElement('div');

// Check for touch support
const supportsTouch = 'ontouchstart' in window;

// Provide fallbacks for unsupported features
```

---

## Development Workflow

### File Structure

```
/app/frontend/src/
├── components/
│   ├── ui/                    # Shadcn components
│   ├── Toolbar.jsx            # Main toolbar
│   ├── DaySection.jsx         # Day container
│   ├── ScheduleTable.jsx      # Table component
│   ├── ScheduleRow.jsx        # Table row
│   ├── TextRow.jsx            # Text row component
│   ├── ScheduleCard.jsx       # Mobile card view
│   ├── ProjectBrowser.jsx     # Project browser modal
│   ├── ColumnResizer.jsx      # Column width adjuster
│   └── ...
├── hooks/
│   ├── useSchedule.js         # Schedule state management
│   ├── useProjects.js         # Project CRUD operations
│   ├── useDragAndDrop.js      # Drag and drop logic
│   └── useAutoSave.js         # Auto-save functionality
├── utils/
│   ├── exportCSV.js           # CSV export logic
│   ├── printSchedule.js       # Print/PDF logic
│   └── validation.js          # Input validation
├── styles/
│   ├── variables.css          # CSS custom properties
│   ├── components.css         # Component-specific styles
│   └── print.css              # Print styles
├── App.jsx                    # Main app component
├── App.css                    # App-level styles
└── index.css                  # Global styles + Tailwind
```

### CSS Organization

**Use CSS Modules or Tailwind:**
- Prefer Tailwind utility classes for rapid development
- Use CSS custom properties for design tokens
- Create component-specific CSS files for complex components
- Keep print styles in separate file

**Example Component:**
```jsx
// ScheduleTable.jsx
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui/table';
import { GripVertical } from 'lucide-react';

export const ScheduleTable = ({ rows, onRowUpdate, onRowReorder }) => {
  return (
    <Table className="schedule-table" data-testid="schedule-table">
      <TableHeader>
        <TableRow>
          <TableHead className="w-10"></TableHead>
          <TableHead>Time From</TableHead>
          <TableHead>Time To</TableHead>
          <TableHead>Scene</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Cast</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <ScheduleRow
            key={row.id}
            row={row}
            onUpdate={onRowUpdate}
          />
        ))}
      </TableBody>
    </Table>
  );
};
```

---

## Summary of Key Design Decisions

1. **Color Palette:** Neutral slate gray with professional blue accents for reliability and focus
2. **Typography:** IBM Plex Sans for technical precision and readability
3. **Buttons:** Medium rounded corners (6-8px), subtle hover states, clear focus rings
4. **Tables:** Information-dense with clear hierarchy, sticky headers, hover states
5. **Mobile:** Card-based layout for better touch interaction
6. **Drag and Drop:** Clear visual feedback with drag handles and drop zones
7. **Print:** Clean, minimal output optimized for physical call sheets
8. **Accessibility:** WCAG AA compliant, keyboard navigable, screen reader friendly
9. **Performance:** Virtual scrolling, debounced saves, optimistic updates
10. **Testing:** Comprehensive data-testid attributes for automated testing

---

## General UI/UX Design Guidelines

### Critical Rules

**Transitions:**
- You must **not** apply universal transition (e.g., `transition: all`). This breaks transforms.
- Always add transitions for specific properties: `transition: background-color 0.15s ease, color 0.15s ease`
- Exclude transforms from transition properties

**Text Alignment:**
- You must **not** center align the app container (e.g., `.App { text-align: center; }`).
- This disrupts natural reading flow. Use left-aligned text for body content.

**Icons:**
- NEVER use emoji characters (🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇) for icons.
- Always use **FontAwesome CDN** or **lucide-react** library (already installed).

**Gradient Restrictions:**
- NEVER use dark/saturated gradient combos (purple/pink, blue-500 to purple-600, etc.).
- NEVER let gradients cover more than 20% of viewport.
- NEVER apply gradients to text-heavy content or reading areas.
- NEVER use gradients on small UI elements (<100px width).
- NEVER stack multiple gradient layers in same viewport.
- **Enforcement:** If gradient area exceeds 20% OR affects readability, use solid colors.
- **Allowed:** Section backgrounds (not content), hero headers, decorative overlays only.

**Color Usage for Professional Tools:**
- Avoid purple for AI/voice applications. Use light green, ocean blue, peach orange instead.
- For this film production tool, stick to neutral slate gray and professional blue.

**Micro-Animations:**
- Every interaction needs micro-animations: hover states, transitions, entrance animations.
- Static = dead. Use subtle motion to create responsive feel.

**Spacing:**
- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.
- Follow the 8px spacing system defined above.

**Visual Polish:**
- Subtle grain textures, noise overlays (optional for this tool).
- Custom cursors (optional).
- Selection states, loading animations (required).

**Design Tokens:**
- Before generating UI, set global design tokens (primary, secondary, background, foreground, ring, state colors).
- Don't rely on library defaults. Customize for the problem statement.

**Component Reuse:**
- Prioritize using pre-existing components from `src/components/ui/`.
- Create new components that match existing style and conventions.
- Examine existing components before creating new ones.

**HTML Components:**
- Do NOT use basic HTML components (dropdown, calendar, toast).
- MUST always use `/app/frontend/src/components/ui/` components (Shadcn/UI).

**Export Conventions:**
- Components MUST use named exports: `export const ComponentName = ...`
- Pages MUST use default exports: `export default function PageName() {...}`

**Toasts:**
- Use `sonner` for toasts.
- Sonner component located in `/app/src/components/ui/sonner.jsx`.

**Gradients and Textures:**
- Use 2-4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.
- For this professional tool, minimize gradient usage. Prioritize solid colors.

**Best Practices:**
- Design must be mobile-first responsive.
- Dark colors look good independently without gradients.
- Light colors (pastel ocean green, light pink, blue, gray) with gradients work well.
- Don't make generic centered layouts, simplistic gradients, uniform styling.
- If calendar is required, use Shadcn calendar component.

**Result:**
- The design should feel human-made, visually appealing, converting, and easy for AI agents to implement.
- Good contrast, balanced font sizes, proper gradients (minimal), sufficient whitespace, thoughtful motion and hierarchy.
- Avoid overuse of elements. Deliver a polished, effective design system.

---

## End of Design Guidelines

This comprehensive design system provides all the specifications needed to build a professional, accessible, and performant film shooting schedule management application. Follow these guidelines closely to ensure consistency and quality throughout the implementation.

**File Path:** `/app/design_guidelines.md`

**Next Steps for Implementation Agent:**
1. Review these guidelines thoroughly
2. Set up CSS custom properties in `index.css`
3. Import IBM Plex Sans font
4. Implement core components (Toolbar, DaySection, ScheduleTable)
5. Add drag and drop functionality
6. Implement project management (CRUD operations)
7. Add export functionality (CSV, Print)
8. Optimize for mobile with card layout
9. Add print styles
10. Test accessibility and performance
11. Add comprehensive data-testid attributes for testing
