# Sahartoon Components Showcase

This file demonstrates all available components and their usage patterns.

## Components Overview

### 1. DashboardHeader
**Location:** `src/components/DashboardHeader.tsx`

Sticky header with branding, navigation buttons, and controls.

**Features:**
- Lion logo icon
- Title & subtitle
- "Nouvel élève" button
- "Export CSV" button
- Theme toggle (light/dark mode)
- Language switcher (FR/AR/EN)

**Props:**
```typescript
interface DashboardHeaderProps {
  onAddStudent: () => void;        // Callback for add student button
  onExport: () => void;            // Callback for export button
  isDark: boolean;                 // Current theme state
  onThemeToggle: () => void;       // Theme toggle callback
}
```

**Usage:**
```jsx
<DashboardHeader
  onAddStudent={() => setShowAddModal(true)}
  onExport={handleExport}
  isDark={isDarkMode}
  onThemeToggle={() => setIsDarkMode(!isDarkMode)}
/>
```

---

### 2. SeverityLegendBar
**Location:** `src/components/SeverityLegendBar.tsx`

Horizontal legend showing severity levels with color coding and statistics.

**Features:**
- 4 severity levels: G0, G1, G2, G3
- Color-coded pill badges
- Icons for each severity
- Percentage statistics
- Risk range labels

**Props:**
```typescript
interface SeverityLegendProps {
  g0Count?: number;    // Students in G0 (normal)
  g1Count?: number;    // Students in G1 (light)
  g2Count?: number;    // Students in G2 (moderate)
  g3Count?: number;    // Students in G3 (severe)
  total?: number;      // Total for percentage calculation
}
```

**Usage:**
```jsx
<SeverityLegendBar
  g0Count={45}
  g1Count={28}
  g2Count={15}
  g3Count={12}
  total={100}
/>
```

---

### 3. DashboardStats
**Location:** `src/components/DashboardStats.tsx`

5-column grid of stat cards showing key metrics.

**Features:**
- Total Students count
- Tests Completed count
- G1 (Light) count
- G2 (Moderate) count
- G3 (Severe) count
- Color-coded left borders
- Hover elevation effect
- Optional trend indicators

**Props:**
```typescript
interface DashboardStatsProps {
  totalStudents: number;
  testsCompleted: number;
  g1Count: number;
  g2Count: number;
  g3Count: number;
}
```

**Usage:**
```jsx
<DashboardStats
  totalStudents={156}
  testsCompleted={342}
  g1Count={28}
  g2Count={15}
  g3Count={12}
/>
```

---

### 4. StudentListPanel
**Location:** `src/components/StudentListPanel.tsx`

Left panel showing scrollable list of students with search and filters.

**Features:**
- Search by name or class
- Student list with avatars
- Age and grade display
- Status badges
- Severity badges (G0-G3)
- Student count footer
- Selection state highlighting
- Soft hover interactions

**Props:**
```typescript
interface StudentListProps {
  students: Student[];              // List of students
  selectedStudentId: string | null; // Currently selected student
  onSelectStudent: (studentId: string) => void;  // Selection handler
  testSessions: any[];              // Test sessions for severity calculation
}
```

**Usage:**
```jsx
<StudentListPanel
  students={students}
  selectedStudentId={selectedStudentId}
  onSelectStudent={setSelectedStudentId}
  testSessions={testSessions}
/>
```

---

### 5. ResultsPanel
**Location:** `src/components/ResultsPanel.tsx`

Right panel showing detailed results for selected student.

**Features:**
- Empty state when no student selected
- Latest severity card with DRI score
- Dyslexia/Dysorthography/Dyscalculia indicators
- DRI trend line chart (Recharts)
- Session history timeline
- Tabbed interface (Résultats / Vue classe)
- Responsive chart rendering

**Props:**
```typescript
interface ResultsPanelProps {
  selectedStudent: Student | null;      // Selected student data
  testSessions: any[];                  // All test sessions
  onTabChange?: (tab: string) => void;  // Tab change callback
}
```

**Usage:**
```jsx
<ResultsPanel
  selectedStudent={selectedStudent}
  testSessions={testSessions}
  onTabChange={(tab) => console.log('Tab:', tab)}
/>
```

---

### 6. AddStudentModal
**Location:** `src/components/AddStudentModal.tsx`

Modal form for adding new students to the system.

**Features:**
- Full form with all student fields
- Validation for required fields (Name, DOB)
- Grade selection (1-8)
- Gender options
- Language selection (Arabic, French, Tamazight)
- Status options
- Parental consent checkbox
- Clinical notes text area
- Smooth animations
- Form reset on submit

**Props:**
```typescript
interface AddStudentModalProps {
  isOpen: boolean;                           // Modal visibility
  onClose: () => void;                       // Close handler
  onSubmit: (studentData: Partial<Student>) => void;  // Submit handler
}
```

**Usage:**
```jsx
const [showModal, setShowModal] = useState(false);

<AddStudentModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSubmit={(data) => {
    addStudent(data);
    setShowModal(false);
  }}
/>
```

---

## Layout Components

### Layout.tsx
**Location:** `src/components/Layout.tsx`

Main layout wrapper with sidebar and header.

**Features:**
- Collapsible sidebar (auto-expands on hover)
- Sticky top header
- Mobile hamburger menu
- Dark mode support
- Navigation with active states
- Logout button
- Responsive grid layout

---

## Reusable Patterns

### Stat Card
```jsx
<StatCard
  icon={<Users className="w-5 h-5" />}
  label="Élèves inscrits"
  value={156}
  borderColor="border-l-slate-300"
  textColor="text-slate-700"
  iconColor="bg-slate-100"
/>
```

### Severity Badge
```jsx
<span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-sahartoon-success">
  G1 — Léger
</span>
```

### Form Input
```jsx
<input
  type="text"
  className="w-full px-4 py-2.5 bg-sahartoon-beige border border-sahartoon-neutral/30 rounded-lg text-sahartoon-dark placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sahartoon-burgundy/20 focus:border-sahartoon-burgundy transition-all duration-200"
  placeholder="Rechercher..."
/>
```

### Card Container
```jsx
<div className="bg-white rounded-xl p-6 shadow-soft border border-sahartoon-neutral/20 hover:shadow-soft-md transition-all duration-300">
  {/* Content */}
</div>
```

---

## Color Usage Examples

### Primary Actions (Burgundy)
```jsx
<button className="bg-sahartoon-burgundy text-white hover:bg-sahartoon-burgundy/90">
  Primary Action
</button>
```

### Success/Positive (Green - G1)
```jsx
<div className="bg-green-50 text-sahartoon-success border border-green-100">
  Low Risk - G1
</div>
```

### Warning/Moderate (Orange - G2)
```jsx
<div className="bg-amber-50 text-sahartoon-warning border border-amber-100">
  Moderate Risk - G2
</div>
```

### Danger/Severe (Red - G3)
```jsx
<div className="bg-red-50 text-sahartoon-danger border border-red-100">
  Severe Risk - G3
</div>
```

### Background (Beige)
```jsx
<div className="bg-sahartoon-beige">
  Light background section
</div>
```

---

## Animation Classes

### Fade In
```jsx
<div className="animate-fadeIn">
  Fades in over 300ms
</div>
```

### Slide Up
```jsx
<div className="animate-slideUp">
  Slides up over 300ms
</div>
```

### Hover Elevation
```jsx
<div className="hover:shadow-soft-md hover:-translate-y-0.5 transition-all duration-300">
  Elevates on hover
</div>
```

---

## Responsive Patterns

### Grid Responsive
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
  {/* 1 col on mobile, 2 on tablet, 5 on desktop */}
</div>
```

### Split Layout
```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-1">{/* Left panel: 35% */}</div>
  <div className="lg:col-span-2">{/* Right panel: 65% */}</div>
</div>
```

### Mobile Hidden
```jsx
<div className="hidden md:block">
  Only visible on tablet and above
</div>
```

---

## Accessibility Patterns

### Semantic Structure
```jsx
<header>Navigation</header>
<main>
  <section>
    <article>Content</article>
  </section>
</main>
<footer>Footer</footer>
```

### Focus States
```jsx
<button className="focus:ring-2 focus:ring-sahartoon-burgundy/20 focus:border-sahartoon-burgundy focus:outline-none">
  Accessible button
</button>
```

### Aria Labels
```jsx
<button aria-label="Fermer le modal" onClick={onClose}>
  ✕
</button>
```

---

## Common Issues & Solutions

### Issue: Colors not applying
**Solution:** Ensure Tailwind classes are using the correct format:
```jsx
// ✅ Correct
<div className="bg-sahartoon-burgundy text-white">
  
// ❌ Wrong
<div className="bg-[sahartoon-burgundy] text-white">
```

### Issue: Modal not visible
**Solution:** Ensure z-index is set high enough:
```jsx
<div className="fixed inset-0 z-50">
  Modal content
</div>
```

### Issue: Mobile layout broken
**Solution:** Check responsive classes:
```jsx
// ✅ Mobile-first
<div className="w-full md:w-1/2 lg:w-1/3">
```

---

## Testing Checklist

- [ ] All buttons are keyboard accessible (Tab, Enter)
- [ ] Color contrast meets WCAG AA standards
- [ ] Layout is responsive from 320px to 1920px
- [ ] Dark mode works on all components
- [ ] RTL direction works for Arabic text
- [ ] Animations are smooth (60fps)
- [ ] No console errors or warnings
- [ ] Images are optimized
- [ ] Forms have validation

---

**Last Updated:** May 2026  
**Component Version:** 1.0.0
