# Design Brief

## Purpose & Tone
ZenReserve is a premium restaurant reservation platform combining zen aesthetics with operational precision. Warm, inviting, minimal with human warmth — never cold tech.

## Visual Direction
**Greenfield split design**: Widget (/widget) uses warm cream background (#FAF7F0) for guest approachability; Dashboard (/dashboard) uses dark navy (#0F172A) for operational focus. Guest app (/app) inherits widget's warm cream. All share typography and component language but diverge at surface treatment.

## Color Palette
| Token | Hex | OKLCH | Purpose |
|-------|-----|-------|---------|
| Primary | #22C55E | 0.75 0.22 142 | CTA, success, available, confirmed |
| Secondary | #3B82F6 | 0.7 0.19 258 | Time slots, waitlist, highlights |
| Accent (Gold) | #c8a96e | 0.78 0.18 70 | AI confidence, "Apply All", premium |
| Orange | #F59E0B | 0.72 0.22 58 | Reserved, preparing, in-progress |
| Purple | #8B5CF6 | 0.68 0.18 312 | Special experience, premium seating |
| Danger | #EF4444 | 0.65 0.24 25 | Errors, cancellations, occupied |
| BG Light | #FAF7F0 | 0.98 0.02 70 | Widget/app warm |
| BG Dark | #0F172A | 0.08 0 0 | Dashboard navy |
| Card Dark | #1E2937 | 0.12 0.01 270 | Cards on dark, gradient origin |
| Text Dark | #F1F5F9 | 0.96 0.01 257 | Body on dark |
| Grid Subtle | #334155 | 0.22 0.01 270 | Table grid, 10-20% opacity |

## Typography
- **Display**: DM Sans, semibold/bold, 24–48px, headings (h1 32-36px, h2 24px)
- **Body**: DM Sans, regular, 14–16px, copy/labels
- **Mono**: System, 12-14px for IDs/times
- **Line Height**: 1.6 body, 1.2 headings, generous letter-spacing on h1

## Shape Language & Spacing
- **Radii**: 12-16px on all cards/buttons/inputs; 24px on badges/tags; 0 on utilities
- **Shadows**: Soft (0 4px 12px @ 0.08); Elevated (0 8px 24px @ 0.12); Canvas (0 2px 8px @ 0.06); Drag (0 12px 32px @ 0.15)
- **Gradients**: Card-to-bg (#1E2937 → #0F172A), subtle on buttons
- **Base unit**: 8px. Cards p-6. Sections py-4 px-6. Sidebar py-3. Grid 16px gap. Button 44px height.

## Component Patterns
- **Buttons**: Primary green/secondary blue, 12-16px radius, 44px height, transition-smooth, shadow-soft default → shadow-elevated on hover
- **KPI cards**: Gradient (#1E2937→#0F172A), 40px icons (green/blue/orange/red), trend arrows (#22C55E up/#EF4444 down), py-4 px-6
- **Inputs**: Dark bg, green focus-ring, 12px radius, text-foreground
- **Cards**: gradient-card class, shadow-soft, 12-16px radius
- **Tables (seating)**: 48-64px rounded cells, status-ring (green empty/red occupied/orange preparing/blue waitlist/purple premium), shadow-canvas default → shadow-drag on drag, cursor grab/grabbing
- **Time-grid (calendar)**: Vertical timeline left (18:00, 18:30…), horizontal days, colored blocks (green=confirmed, red=cancelled, blue=waitlist, purple=experience)
- **Mini occupancy (dashboard)**: Service-grouped rows, each showing 4-6 mini-table dots (8-12px), status-colored, all timeslots visible
- **AI suggestion**: Primary/10 bg, shadow-soft, primary border/20, gold confidence meter
- **Status badge**: Animated badge-pop on state change, font-semibold text-xs, ring colors match status

## Structural Zones
| Area | Treatment | Details |
|------|-----------|---------|
| Dashboard header | Navy bg, white text, logo left | Restaurant logo + "ZenReserve" text, language switcher top-right, dark/light toggle |
| Dashboard content | Navy bg, gradient cards | KPI grid (4 cards), mini occupancy widget, main content area |
| Table plan | Navy bg, grid-subtle overlay | 10-20% opacity grid, rounded table cells with status-rings, toolbar (Zones/AI/Print/Legend), drag-drop enabled |
| Reservations time-grid | Navy bg, bordered grid | Vertical timeline (18:00–23:00 + customizable), horizontal days, colored blocks per status |
| Sidebar (desktop) | Card color (#1E2937), py-3 | Icon + label navigation, current section highlighted in green, py-3 spacing |
| Hamburger (mobile) | Drawer overlay, card color | Same nav items, slide-in from left, dismiss on item select |
| AI overlay | Primary/10 bg, shadow-soft | Floating card on table plan or reservation suggestion, accept/decline buttons |
| All surfaces | Gradient-card class | #1E2937 → #0F172A gradient, except headers which stay solid

## Motion & Micro-interactions
- **Default**: transition-smooth (0.3s ease-in-out) on all interactive
- **Fast**: transition-fast (0.15s) on toggles, status changes
- **Hover scale**: hover-scale-sm (1.05 on cards), hover-scale-xs (1.02 on buttons)
- **Badge pop**: badge-pop keyframe (0.4s cubic-bezier) on new status/state
- **Suggestion slide**: suggestion-slide-in (0.4s bounce) on AI overlay
- **Drag**: Shadow lift to shadow-drag, cursor grab/grabbing, smooth release
- **Pulse**: pulse-subtle (0.8s infinite) on seasonal active badges
- **Respect prefers-reduced-motion**: Disable all animations if set

## Accessibility
- **Contrast**: All text ≥4.5:1 (WCAG AA). Grid overlay ≤20% opacity to preserve table readability.
- **Touch targets**: ≥44×44px on buttons, tables, interactive elements
- **Focus**: 2px green ring (primary color), always visible, 2px offset
- **Keyboard**: Tab through all interactive. Arrow keys nudge focused tables on canvas. Enter to select/confirm.
- **Labels**: aria-label or <label> on all inputs. aria-describedby on time-grid blocks.
- **Animations**: Respect prefers-reduced-motion; disable badge-pop, suggestion-slide, pulse on preference set
- **Color alone**: Status always conveyed with color + icon/ring (not color only)

## Constraints
- **Ban**: Cold flat surfaces, generic UI, weak contrast, narrow touch targets, slow/sluggish animations, inconsistent spacing, "plat black" without depth
- **Enforce**: Gradient cards on ALL surfaces (except headers), 12-16px radius everywhere, soft shadows by default, 44px buttons, generous py-3/px-6 padding, green focus-rings, bold headings (h1 32-36px, h2 24px), status always color+icon
- **Theme**: Premium, warm, minimalist, operational-precise. Table plan feels like organized workspace not clinical tool. Dashboard KPIs scannable at a glance. Time-grid familiar like Google Calendar but with restaurant-specific colors. Micro-animations delight without distraction.
