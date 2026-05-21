# 🚀 Sahartoon Dashboard Redesign — Quick Start Guide

Welcome to the redesigned Sahartoon Enseignant TN dashboard! This guide will help you understand the new layout, features, and how to work with the updated codebase.

## 📋 What Changed?

### ✨ Visual Redesign
- **Old:** Bootstrap-style admin dashboard with orange/blue colors
- **New:** Premium educational SaaS platform with burgundy branding and soft pastel aesthetic

### 🎨 New Design System
- **Primary Color:** Burgundy (#8B1E3F) instead of orange/blue
- **Background:** Soft beige (#F8F7F4) instead of gray
- **Severity Levels:** Color-coded G0-G3 with clear visual hierarchy
- **Cards:** Larger radius (16-24px), softer shadows, better spacing

### 📐 New Layout Structure
```
┌──────────────────────────────────────────────┐
│     Sahartoon Enseignant Header (Burgundy)  │
├──────────────────────────────────────────────┤
│     Severity Legend Bar (G0/G1/G2/G3)       │
├──────────────────────────────────────────────┤
│         Dashboard Stats Cards Grid           │
├──────────────┬──────────────────────────────┤
│              │                              │
│ Student List │    Results & Severity       │
│   (35%)      │        (65%)                 │
│              │                              │
│ • Search     │ • Latest score              │
│ • Students   │ • DRI trends                │
│ • Severity   │ • Indicators                │
│              │ • History                   │
│              │                              │
└──────────────┴──────────────────────────────┘
```

### 🔄 Component Structure
**New Components Created:**
1. `DashboardHeader` - Burgundy header with controls
2. `SeverityLegendBar` - Severity level legend
3. `DashboardStats` - 5-stat card grid
4. `StudentListPanel` - Left panel with student list
5. `ResultsPanel` - Right panel with results
6. `AddStudentModal` - Student creation form

**Updated Components:**
- `Layout` - New sidebar design with Sahartoon branding
- `Dashboard` - Complete redesign with new layout
- `index.css` - New color system and global styles

---

## 🎯 Key Features

### 1. **Severity Management**
Students are categorized into 4 severity levels:
- **G0 (Gray):** Within normal range (<20%)
- **G1 (Green):** Mild difficulties (20-40%)
- **G2 (Orange):** Moderate difficulties (40-65%)
- **G3 (Red):** Severe difficulties (>65%)

Each level has a distinct color for quick visual scanning.

### 2. **Student List Search**
- Real-time search by student name or class
- Sorted alphabetically
- Click to select and view results
- Shows current severity badge
- Displays age and grade level

### 3. **Results Dashboard**
When a student is selected:
- Latest DRI score prominently displayed
- Severity tier indicator
- Test date information
- DYS indicators (Dyslexie, Dysorthographie, Dyscalculie)
- Historical trend chart
- Session history timeline

### 4. **Data Export**
- CSV export functionality
- Includes: Name, Age, Class, Test Date, Severity, DRI
- Timestamped filename
- One-click download

### 5. **Responsive Design**
- Mobile-first approach
- Hamburger menu on small screens
- Optimized for tablets and desktops
- Touch-friendly controls (48px minimum)

### 6. **Dark Mode**
- Theme toggle in header
- System preference detection
- All components support dark mode

### 7. **Internationalization**
- French, Arabic, English
- RTL support for Arabic
- Language switcher in header

---

## 🛠 Development Guide

### Setting Up Locally

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:5173
   ```

### File Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── DashboardHeader.tsx         ← New
│   │   ├── SeverityLegendBar.tsx       ← New
│   │   ├── DashboardStats.tsx          ← New
│   │   ├── StudentListPanel.tsx        ← New
│   │   ├── ResultsPanel.tsx            ← New
│   │   ├── AddStudentModal.tsx         ← New
│   │   ├── Layout.tsx                  ← Updated
│   │   └── ...
│   ├── pages/
│   │   ├── Dashboard.tsx               ← Updated
│   │   └── ...
│   ├── index.css                       ← Updated
│   └── ...
├── tailwind.config.cjs                 ← Updated
├── DESIGN_SYSTEM.md                    ← New
├── COMPONENTS.md                       ← New
└── ...
```

### Using the Design System

#### Colors
```jsx
// Primary branding
className="bg-sahartoon-burgundy text-white"

// Severity levels
className="bg-green-50 text-sahartoon-success"  // G1
className="bg-amber-50 text-sahartoon-warning"  // G2
className="bg-red-50 text-sahartoon-danger"    // G3
```

#### Spacing
```jsx
// Use 8px grid
className="p-4 gap-4 mb-6"  // 16px, 16px, 24px
```

#### Cards
```jsx
className="bg-white rounded-xl p-6 shadow-soft border border-sahartoon-neutral/20"
```

#### Animations
```jsx
className="animate-fadeIn"   // Fade in
className="animate-slideUp"  // Slide up
className="hover:shadow-soft-md transition-all duration-300"  // Hover
```

---

## 📋 Common Tasks

### Adding a New Stat Card
```jsx
import { YourIcon } from 'lucide-react';

<StatCard
  icon={<YourIcon className="w-5 h-5 text-your-color" />}
  label="Your Label"
  value={123}
  borderColor="border-l-your-color"
  textColor="text-your-color"
  iconColor="bg-your-color/10"
/>
```

### Creating a New Modal
```jsx
{showModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
    <div className="bg-white rounded-2xl shadow-soft-lg w-full max-w-lg overflow-hidden animate-slideUp">
      {/* Modal content */}
    </div>
  </div>
)}
```

### Adding Responsive Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Items will stack on mobile, 2 cols on tablet, 3 on desktop */}
</div>
```

### Adding i18n Support
```jsx
import { useTranslation } from '../i18n';

const { t, language } = useTranslation();
<p>{t('dashboard.title')}</p>
```

---

## 🐛 Troubleshooting

### Issue: Colors not showing
**Check:** Ensure Tailwind is properly configured
```bash
npm run build:css
```

### Issue: Components not rendering
**Check:** Verify imports are correct
```jsx
import Component from '../components/Component';  // ✅
import Component from './components/Component';   // ❌
```

### Issue: Layout broken on mobile
**Check:** Mobile responsive classes are applied
```jsx
// ❌ Wrong - won't be responsive
<div className="w-1/2">

// ✅ Correct - mobile first
<div className="w-full md:w-1/2 lg:w-1/3">
```

### Issue: Animations not smooth
**Check:** Ensure z-index and stacking contexts are correct
```jsx
// ✅ Correct
<div className="fixed z-50 animate-slideUp">
```

---

## 🚀 Deployment Checklist

- [ ] All components render correctly
- [ ] No console errors
- [ ] Mobile layout tested at 320px, 768px, 1024px
- [ ] Dark mode works on all pages
- [ ] Language switcher functional (FR/AR/EN)
- [ ] CSV export tested
- [ ] Navigation works on mobile (hamburger menu)
- [ ] Focus states visible for keyboard users
- [ ] Images optimized
- [ ] Performance: Lighthouse score >90

---

## 📚 Documentation

- **DESIGN_SYSTEM.md** — Complete design system guide
- **COMPONENTS.md** — Component showcase and usage examples
- **Tailwind Docs** — https://tailwindcss.com/docs
- **Recharts Docs** — https://recharts.org/en-US/

---

## 🎨 Color Reference

| Name | Hex | Usage |
|------|-----|-------|
| Burgundy (Primary) | #8B1E3F | Headers, CTAs, branding |
| Soft Beige | #F8F7F4 | Main background |
| Success (G1) | #22C55E | Green, mild risk |
| Warning (G2) | #F59E0B | Orange, moderate risk |
| Danger (G3) | #DC2626 | Red, severe risk |
| Dark Text | #1F2937 | Primary text |
| Neutral Border | #E5E7EB | Dividers, borders |

---

## ⚡ Performance Tips

1. **Use Recharts wisely** - Avoid re-renders
   ```jsx
   const chartData = useMemo(() => [...], [dependency]);
   ```

2. **Lazy load components** - For heavy modals
   ```jsx
   const HeavyModal = lazy(() => import('./HeavyModal'));
   ```

3. **Optimize images** - Use modern formats
   ```jsx
   <img src="file.webp" alt="description" />
   ```

4. **Minimize re-renders** - Use useCallback and memo
   ```jsx
   const handleClick = useCallback(() => {...}, []);
   ```

---

## 🤝 Contributing

When adding new features:

1. Follow the design system colors and spacing
2. Use Tailwind utility classes exclusively
3. Add dark mode support
4. Test on mobile devices
5. Update DESIGN_SYSTEM.md or COMPONENTS.md if needed
6. Ensure accessibility (WCAG AA)

---

## 📞 Support

For questions about the new design:
1. Check DESIGN_SYSTEM.md for color/spacing guidelines
2. Check COMPONENTS.md for component examples
3. Review existing component code for patterns
4. Check Tailwind documentation

---

**Version:** 1.0.0  
**Last Updated:** May 2026  
**Status:** ✅ Production Ready
