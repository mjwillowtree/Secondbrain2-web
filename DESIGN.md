# Secondbrain2 Web — Design Specification

## Assumed Context

- **Purpose:** Personal knowledge base explorer + automation dashboard — a daily-use tool
- **Audience:** Solo power user, technical
- **Mood:** Clean, focused, developer-tool aesthetic. Think Linear or Raycast — dark-first, minimal chrome, high information density without clutter
- **Tech Stack:** Next.js + Tailwind CSS + shadcn/ui
- **Constraints:** Desktop-first (local tool), system dark mode preference, accessibility maintained

---

## Visual Language & Mood

Developer tool meets personal dashboard. Dark backgrounds, crisp typography, subtle borders. Information-dense but not cramped — every element earns its space. Minimal color — neutral surfaces with a single accent color for interactive elements. The calm focus of Obsidian with the polish of Linear.

---

## Color Palette

- **Background:** `#09090b` (zinc-950) — deep, near-black base (dark); `#ffffff` (light)
- **Surface:** `#18181b` (zinc-900) — cards, panels, elevated elements (dark); `#fafafa` (light)
- **Surface raised:** `#27272a` (zinc-800) — hover states, active items (dark); `#f4f4f5` (light)
- **Border:** `#3f3f46` (zinc-700) — subtle separation, 1px lines (dark); `#e4e4e7` (light)
- **Text primary:** `#fafafa` (zinc-50) — headings, body (dark); `#09090b` (light)
- **Text muted:** `#a1a1aa` (zinc-400) — secondary info, labels, timestamps (dark); `#71717a` (light)
- **Accent:** `#6366f1` (indigo-500) — selected states, active nav, links; `#818cf8` in dark mode
- **Accent muted:** indigo at 10% opacity — subtle highlights, active row backgrounds
- **Semantic green:** `#22c55e` — `processed: true`, active status
- **Semantic red:** `#ef4444` — `processed: false`, errors
- **Semantic amber:** `#f59e0b` — warnings, inactive status

Light mode inverts backgrounds and text. Same accent and semantic colors.

---

## Typography

- **Headings:** Geist Sans, 20px/600 (page titles), 14px/600 (section labels). Tight tracking (-0.01em)
- **Body:** Geist Sans, 14px/400. Line height 1.5
- **UI labels:** Geist Sans, 12px/500. Uppercase tracking (0.05em) for section headers
- **Code/paths/logs:** Geist Mono, 13px/400. Line height 1.6. Used in file viewer, log output, breadcrumbs, badge values
- **Max line width:** 72ch for markdown content. Full-width for code/logs

---

## Component Patterns

### Nav bar
- Height: 48px. Background: background with backdrop blur, bottom border
- Items: 13px/500, icon + label, 8px gap
- Inactive: muted text. Active: indigo text + indigo/10% background (rounded-md)
- App name: 13px/700, no icon. Left-aligned with 16px padding

### Tree node (directory)
- Height: ~32px (py-[6px]). Full-width clickable area
- Indent: 20px per depth level
- Icons: 16px. Folder = indigo when expanded, muted when collapsed. File = muted/60%
- Hover: accent background. Selected: indigo/10% background + 2px indigo left border
- Chevron: 12px, smooth 150ms rotation on expand

### Tree node (file)
- Same as directory but no chevron. File icon in muted/60%
- Selected state: same indigo background + left border

### Badge (frontmatter)
- Rounded-full pill. 11px Geist Mono, font-medium
- `processed: true` = green/10% bg, green text, green/20% border
- `processed: false` = red/10% bg, red text, red/20% border
- `project:` = indigo/10% bg, indigo text, indigo/20% border
- Topics = muted bg, muted text, standard border
- Spacing: 6px gap between badges

### Automation card
- Background: card color. Border: 1px. Rounded-lg (8px)
- Padding: 20px
- Header: display name (16px/600 tracking-tight) + status pill right-aligned
- Status pill: same style as badges — green for active, muted for inactive
- Collapsible sections: muted text label + chevron. Smooth transition
- Log/prompt area: muted/50% bg, border, Geist Mono 12px. Max-height 200px with scroll

### Breadcrumb
- Height: 40px. Background: transparent. Bottom border
- Font: Geist Mono, 13px. Segments in muted text. Last segment in primary text/500
- Separator: chevron-right icon, 10px, muted/50%

### Empty state
- Centered vertically and horizontally
- Icon: 48px, opacity 30%
- Text: 16px, muted foreground. One line only

### Code blocks (in viewer and cards)
- Background: muted/50%. Border: 1px border color. Rounded-md
- Font: Geist Mono, 13px. Padding: 20px. Leading-relaxed

---

## Layout & Spacing

### Explorer page (`/`)
- Two-panel: tree (260px fixed) | viewer (flex-1)
- Tree panel: card/50% background for subtle elevation. Full height below nav
- Viewer panel: breadcrumb (40px) + content (scroll). Content padding: 32px horizontal, 24px vertical

### Automations page (`/automations`)
- Single column. Max-width: 720px. Centered
- Page header: title (20px/600 tracking-tight) left, hint text right. 24px bottom margin
- Cards: 16px gap between cards

### Spacing scale
4, 8, 12, 16, 20, 24, 32, 48px

### Nav
Full-width. 16px horizontal padding. Background with backdrop blur.

---

## Accessibility

- **Contrast:** All text on dark surfaces meets WCAG AA (zinc-50 on zinc-950 = 19.6:1, zinc-400 on zinc-950 = 7.1:1)
- **Interactive targets:** Min 32px height for tree nodes, 48px for nav items
- **Focus:** Visible focus ring (2px, indigo, 2px offset) on all interactive elements
- **Keyboard:** Tree navigable with arrow keys. Tab through nav items. Enter to select/expand
- **Motion:** All transitions ≤200ms. Respect `prefers-reduced-motion`

---

## Responsive Design

- **Desktop (primary):** Full two-panel layout as described. Min-width: 768px
- **Narrow screens:** Not a priority since this is a local desktop tool. Below 768px, tree collapses to a sidebar toggle

---

## Implementation Notes

- **shadcn/ui theme:** CSS custom properties in `globals.css` define all colors
- **Dark mode:** System preference via inline script in `<head>` that adds `.dark` class before paint
- **Geist fonts:** Already loaded via `next/font/google`
- **Semantic colors:** Use CSS custom properties `--success`, `--warning`, `--destructive`, `--indigo`
- **Badge variants:** Custom colored pills using inline Tailwind classes (not shadcn Badge variants) for semantic frontmatter display
