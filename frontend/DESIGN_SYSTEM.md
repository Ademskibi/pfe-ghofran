# Sahartoon Enseignant TN — Design System & UI Guide

## 🎨 Overview

Sahartoon Enseignant TN is a modern, clean, educational assessment platform for Tunisian teachers and school specialists to screen and monitor DYS learning disorders. The redesigned dashboard features a premium, emotionally calm interface with a soft pastel aesthetic and burgundy branding.

**Design Philosophy:**
- Minimalist & calming
- Data-oriented & clear
- Accessibility-first
- Responsive & mobile-friendly
- Soft, rounded, glassmorphic elements

---

## 🎯 Color System

### Primary Colors
| Color | Hex | Usage |
|-------|-----|-------|
| **Burgundy (Primary)** | `#8B1E3F` | Headers, CTA buttons, active states, branding |
| **Soft Beige (Background)** | `#F8F7F4` | Main background, light surfaces |
| **Cream (Light BG)** | `#FDFCFB` | Card backgrounds, light overlays |
| **Dark Text** | `#1F2937` | Primary text, labels |

### Semantic Colors (Severity Tiers)
| Tier | Color | Hex | Meaning |
|------|-------|-----|---------|
| **G0** | Slate Gray | `#64748b` | Within normal range |
| **G1 — Léger** | Green | `#22C55E` | Mild/Low risk (20-40%) |
| **G2 — Modéré** | Orange | `#F59E0B` | Moderate risk (40-65%) |
| **G3 — Sévère** | Red | `#DC2626` | Severe risk (>65%) |

### Neutral Colors
| Color | Hex | Usage |
|-------|-----|-------|
| **Neutral Border** | `#E5E7EB` | Borders, dividers |
| **Light Gray** | `#F3F4F6` | Hover states, backgrounds |
| **White** | `#FFFFFF` | Cards, overlays |

### Tailwind CSS Classes
```css
/* Available in tailwind.config.cjs */
bg-sahartoon-burgundy      /* Primary burgundy */
bg-sahartoon-beige         /* Soft beige background */
bg-sahartoon-success       /* Green (G1) */
bg-sahartoon-warning       /* Orange (G2) */
bg-sahartoon-danger        /* Red (G3) */
text-sahartoon-dark        /* Dark text */
border-sahartoon-neutral   /* Neutral borders */
```

---

## 📐 Spacing & Layout

### Grid System
- **Base unit:** 8px (Tailwind default)
- **Spacing scale:** 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px

### Rounded Corners
- **Small cards:** 12px (`rounded-lg`)
- **Large cards:** 16px (`rounded-xl`)
- **Extra large:** 24px (`rounded-2xl`)
- **Circles:** 9999px (`rounded-full`)

### Shadows
```css
shadow-soft      /* Minimal, soft shadow (light interactions) */
shadow-soft-md   /* Medium shadow (hover states) */
shadow-soft-lg   /* Large shadow (modals, overlays) */
shadow-glass     /* Glassmorphic effect */
```

### Responsive Breakpoints (Tailwind Standard)
- Mobile: < 640px
- Tablet: 640px - 1024px (sm: prefix)
- Desktop: 1024px+ (lg: prefix)

---

## 🎭 Typography

### Font Stack
```css
font-sans: 'Inter', 'Figtree', system-ui, sans-serif
```

### Hierarchy
| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| **H1** | 24px / 1.5rem | 700 Bold | Main page titles |
| **H2** | 20px / 1.25rem | 700 Bold | Section headers |
| **H3** | 18px / 1.125rem | 600 Semibold | Card titles |
| **Body** | 14-16px | 400 Regular | Main text |
| **Small** | 12px | 500 Medium | Labels, captions |
| **Tiny** | 11px | 400 Regular | Help text |

### Example Usage (Tailwind)
```jsx
<h1 className="text-2xl font-bold">Main Title</h1>
<h2 className="text-xl font-bold">Section Header</h2>
<p className="text-sm font-medium text-slate-600">Label</p>
```

---

## 🎨 Component Library

### Buttons

#### Primary Button
```jsx
<button className="px-4 py-2.5 rounded-lg font-medium text-sm text-white bg-sahartoon-burgundy hover:bg-sahartoon-burgundy/90 shadow-soft hover:shadow-soft-md transition-all duration-200 hover:-translate-y-0.5">
  Button Text
</button>
```

#### Secondary Button
```jsx
<button className="px-4 py-2.5 rounded-lg font-medium text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all duration-200">
  Button Text
</button>
```

#### Icon Button
```jsx
<button className="p-2 text-slate-600 hover:bg-sahartoon-beige rounded-lg transition-all duration-200">
  <Icon className="w-5 h-5" />
</button>
```

### Cards

#### Stat Card
```jsx
<div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-soft-md transition-all duration-300 border-l-4 border-l-sahartoon-burgundy">
  <p className="text-slate-600 text-sm font-medium mb-2">Label</p>
  <p className="text-3xl font-bold text-sahartoon-dark">123</p>
</div>
```

#### Regular Card
```jsx
<div className="bg-white rounded-xl p-6 shadow-soft border border-sahartoon-neutral/20">
  {/* Content */}
</div>
```

### Badges

#### Severity Badge (G1-G3)
```jsx
<span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-sahartoon-success">
  G1 — Léger
</span>
```

### Input Fields

#### Standard Input
```jsx
<input
  type="text"
  className="w-full px-4 py-2.5 bg-sahartoon-beige border border-sahartoon-neutral/30 rounded-lg text-sahartoon-dark placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sahartoon-burgundy/20 focus:border-sahartoon-burgundy transition-all duration-200"
  placeholder="Placeholder text"
/>
```

### Modals

#### Modal Overlay
```jsx
<div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
  <div className="bg-white rounded-2xl shadow-soft-lg w-full max-w-lg overflow-hidden animate-slideUp">
    {/* Modal content */}
  </div>
</div>
```

---

## 🎬 Animations

### Available Animations
```css
animate-fadeIn   /* Fade in animation (300ms) */
animate-slideUp  /* Slide up animation (300ms) */
```

### Transition Defaults
```css
transition-all duration-200  /* General interactions */
transition-all duration-300  /* Hover effects */
transition-colors duration-200  /* Color changes */
transition-transform duration-200  /* Transform changes */
```

### Hover States
```jsx
/* Elevation on hover */
hover:shadow-soft-md hover:-translate-y-0.5

/* Color changes */
hover:bg-sahartoon-beige hover:text-sahartoon-burgundy

/* Scale effects */
group-hover:scale-110
```

---

## 📐 Layout Patterns

### Dashboard Header
- Fixed height: 88px
- Full-width with sticky positioning
- Burgundy background
- Contains: Logo, title, buttons (Add Student, Export, Theme Toggle, Language Switcher)

### Severity Legend Bar
- Below header, sticky (z-30)
- Horizontal scrollable layout
- 4 severity levels as rounded pill badges with icons
- Height: 80-100px

### Stats Cards Grid
- 5 columns on desktop, responsive on mobile
- Equal height cards with left border accent
- Hover elevation effect
- Gap: 16px

### Main Content Layout (Split View)
```
┌─────────────────────────────────────────┐
│        Dashboard Header (88px)          │
├─────────────────────────────────────────┤
│      Severity Legend Bar (sticky)       │
├─────────────────────────────────────────┤
│          Stats Cards Grid               │
├───────────────┬───────────────────────┤
│               │                       │
│ Student List  │   Results & Gravity   │
│ (35% width)   │   (65% width)         │
│               │                       │
│ • Search      │ • Severity card       │
│ • List        │ • Indicators          │
│ • Badges      │ • Trends              │
│               │ • History             │
└───────────────┴───────────────────────┘
```

---

## ♿ Accessibility

### WCAG AA Compliance

1. **Color Contrast**
   - Main text: 7:1 contrast ratio (AAA)
   - Secondary text: 4.5:1 contrast ratio (AA)
   - Icons: Paired with text labels

2. **Focus States**
   ```css
   focus:ring-2 focus:ring-sahartoon-burgundy/20
   focus:border-sahartoon-burgundy
   focus-visible:outline-2 outline-offset-2 outline-sahartoon-burgundy
   ```

3. **Interactive Elements**
   - Minimum 44x44px touch target size
   - Clear focus indicators
   - Keyboard navigation support
   - ARIA labels where appropriate

4. **Semantic HTML**
   ```jsx
   <button>Action buttons</button>
   <nav>Navigation</nav>
   <main>Main content</main>
   <header>Header</header>
   <section>Content sections</section>
   <label htmlFor="input">Input labels</label>
   ```

---

## 📱 Responsive Design

### Mobile-First Approach

**Mobile (< 640px)**
- Single column layout
- Full-width cards
- Hamburger menu for navigation
- Simplified header
- Touch-friendly spacing (minimum 48px)

**Tablet (640px - 1024px)**
- 2-column layouts where appropriate
- Sidebar visible but collapsible
- Optimized card sizes

**Desktop (1024px+)**
- Full multi-column layouts
- Expanded sidebar
- Side-by-side panels
- Maximum content width: 1280px

### Example Responsive Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
  {/* Items */}
</div>
```

---

## 🌙 Dark Mode

### CSS Media Query Support
```css
@media (prefers-color-scheme: dark) {
  /* Dark mode styles */
}
```

### Implementation
- Use `dark:` prefix in Tailwind classes
- Respects system preference (`prefers-color-scheme`)
- Can toggle with theme switcher

### Example
```jsx
<div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
  {/* Content */}
</div>
```

---

## 🌍 Internationalization (i18n)

### Supported Languages
- 🇫🇷 French (fr)
- 🇦🇪 Arabic (ar)
- 🇬🇧 English (en)

### RTL Support for Arabic
- Automatic text direction handling
- Mirror layouts when needed
- Supported via i18n context

### Usage
```jsx
import { useTranslation } from '../i18n';

const Component = () => {
  const { t, language } = useTranslation();
  return <p>{t('dashboard.title')}</p>;
};
```

---

## 🔧 Development Guidelines

### Creating New Components

1. **Use Tailwind exclusively** for styling
2. **Follow the color system** for consistency
3. **Maintain 8px grid alignment**
4. **Add animations** via CSS classes (`animate-fadeIn`, `animate-slideUp`)
5. **Implement focus states** for accessibility
6. **Use semantic HTML** elements
7. **Mobile-first responsive design**

### Component Template
```jsx
import React from 'react';
import { SomeIcon } from 'lucide-react';

interface ComponentProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

const MyComponent: React.FC<ComponentProps> = ({ title, variant = 'primary' }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-soft border border-sahartoon-neutral/20 hover:shadow-soft-md transition-all duration-300">
      <h3 className="text-lg font-bold text-sahartoon-dark mb-4">{title}</h3>
      <div className="space-y-4">
        {/* Content */}
      </div>
    </div>
  );
};

export default MyComponent;
```

### Avoiding Common Mistakes

❌ **Don't:**
- Use arbitrary colors outside the system
- Add custom CSS (`<style>` tags)
- Use hardcoded pixel values
- Skip dark mode considerations
- Ignore accessibility requirements

✅ **Do:**
- Use Tailwind utility classes
- Reference colors from the system
- Use rem/em for spacing
- Test dark mode
- Include ARIA labels and semantic HTML

---

## 📚 Resources

### Related Files
- `tailwind.config.cjs` — Color system configuration
- `index.css` — Global styles
- `components/` — Reusable components
- `pages/Dashboard.tsx` — Main dashboard layout

### External Libraries
- **React** — UI framework
- **Tailwind CSS** — Utility-first styling
- **Recharts** — Data visualization
- **Lucide Icons** — Icon library
- **React Hook Form** — Form handling
- **Zod** — Schema validation (recommended)

### Design Inspiration
- Notion (minimalist, clean)
- Linear (modern SaaS)
- Educational dashboards
- Healthcare UIs (calm, accessible)
- Premium teacher tools

---

## 🎯 Future Enhancements

- [ ] Framer Motion for advanced animations
- [ ] Skeleton loaders for data fetching
- [ ] Toast notifications system
- [ ] Custom chart components
- [ ] Printable reports/PDFs
- [ ] Real-time data updates
- [ ] Advanced filtering & search
- [ ] Teacher collaboration features

---

**Last Updated:** May 2026  
**Version:** 1.0.0  
**Maintained by:** Sahartoon Enseignant TN Team
