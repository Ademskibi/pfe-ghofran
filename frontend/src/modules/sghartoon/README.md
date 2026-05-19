# Sghartoon Test Interface Integration Guide

## Overview
Sghartoon is a comprehensive adaptive testing system for dyslexia (dyslexie) and dyscalculia (dyscalculie) screening in Tunisian primary schools (grades 1-6). The React implementation provides a complete testing flow from student selection through results visualization.

---

## Installation & Setup

### File Structure
```
frontend/src/modules/sghartoon/
├── components/
│   └── TestPlayer.tsx           # Main test execution component
├── data/
│   ├── questionBank.ts          # 50 questions (25 dyslexia, 25 dyscalculia)
│   └── taxonomy.ts              # Gravity levels, curriculum, utilities
├── hooks/
│   └── useTestEngine.ts         # Test scoring & state management
├── pages/
│   └── SghartoonPage.tsx         # Main page with student selection & results
├── styles/
│   ├── testPlayer.module.css    # Test interface styling
│   └── sghartoonPage.module.css # Selection & results styling
└── README.md                    # This file
```

### Integration in App Routes

The test is automatically integrated into `frontend/src/App.tsx`:
```typescript
<Route path="/sghartoon" element={
  <ProtectedRoute allowedRoles={['teacher']}><SghartoonPage /></ProtectedRoute>
} />
```

**Access URL**: `http://localhost:5173/sghartoon`
**Role**: Teacher only

---

## Component Architecture

### 1. **SghartoonPage.tsx** (Main Container)
- **Purpose**: Student selection, test mode switching, results display
- **States**: 
  - `select` - Student selection screen
  - `test` - Active test execution
  - `results` - Score display & analysis
- **Props**: None (uses internal state)
- **Features**:
  - Mock student list (replace with API)
  - Test type selector (Dyslexia/Dyscalculia)
  - Results visualization with gravity levels
  - Curriculum alignment display

### 2. **TestPlayer.tsx** (Test Execution)
- **Purpose**: Display questions and collect answers
- **Props**:
  - `studentName: string` - Display name
  - `studentAge: number` - Used for complexity adaptation
  - `questions: Question[]` - Question set to administer
  - `onComplete: (score) => void` - Called when test finishes
  - `onCancel: () => void` - Exit test
- **Features**:
  - Welcome screen with instructions
  - Timer with visual feedback
  - Multiple choice & text input support
  - Progress tracking
  - Completion celebration screen

### 3. **useTestEngine Hook**
- **Purpose**: Test logic, scoring, state management
- **Returns**:
  ```typescript
  {
    currentQuestion: Question,
    currentIndex: number,
    progress: number,              // 0-100%
    timeRemaining: number,         // seconds
    isAnswered: boolean,
    isTestComplete: boolean,
    answers: Answer[],
    submitAnswer: (correct, userAnswer?) => void,
    goToNext: () => void,
    computeScore: () => TestScore
  }
  ```
- **Scoring Algorithm**:
  - Error rate: 65% weight
  - Fluence (time deviation): 35% weight
  - Result: 0-1 score → converted to 0-100% DRI

---

## Question Bank Structure

### Dyslexia Questions (25 total)
- **Complexity A (1ère-2ème, 6-7 yrs)**: 10 questions
  - Letter discrimination, phoneme awareness, basic word reading
- **Complexity B (3ème-4ème, 8-9 yrs)**: 5 questions
  - Orthography, syllable segmentation, word fluency
- **Complexity C (5ème-6ème, 10-11 yrs)**: 10 questions
  - Complex orthography, morphological awareness

### Dyscalculia Questions (25 total)
- **Complexity A**: 10 questions (subitizing, cardinality, basic arithmetic)
- **Complexity B**: 10 questions (2-digit operations, multiplication intro)
- **Complexity C**: 5 questions (multi-digit operations, fractions)

### Question Format
```typescript
interface Question {
  id: string;                    // "dy_A1", "dc_B5"
  cx: number;                    // 1, 2, or 3 (complexity)
  qt: 'choice' | 'text';         // Question type
  inst: string;                  // Instruction
  stim: string | null;           // Stimulus (visual/text)
  sc: string | null;             // Stimulus class for styling
  choices?: string[];            // For multiple choice
  ans: string;                   // Correct answer
  tl: number;                    // Time limit (seconds)
  domain: string;                // Skill being tested
  curr: string;                  // Curriculum level
  dictee: string | null;         // Word for speech synthesis
  type?: 'dyslexia' | 'dyscalculia'; // Added during test
}
```

---

## Gravity Levels (Tiers)

| Code | Label | Range | Action |
|------|-------|-------|--------|
| **G0** | Dans la norme | < 20% | Normal development, no action |
| **G1** | Léger (Light) | 20-40% | Monitor, provide support |
| **G2** | Modéré (Moderate) | 40-65% | Differentiate teaching, specialist referral |
| **G3** | Sévère (Severe) | > 65% | Urgent specialist evaluation, accommodations |

---

## Curriculum Alignment

Each question is tagged with Tunisian MEN curriculum competencies:

### 1ère-2ème année (6-7 years)
- Identify alphabet letters (Arabic & Latin)
- Count & compare (0-20)
- Basic addition/subtraction

### 3ème-4ème année (8-9 years)
- Read fluently, spell simple words
- Master 2-digit operations
- Begin multiplication tables (×2, ×5, ×10)

### 5ème-6ème année (10-11 years)
- Complex text comprehension
- Multi-digit operations & fractions
- Problem-solving with multiple steps

---

## Using the Test

### Step 1: Access the Page
Navigate to `/sghartoon` as a teacher-authenticated user.

### Step 2: Select Student & Test Type
- Click student card
- Choose "📖 Dyslexie" or "🔢 Dyscalculie"
- Test launches with questions adaptive to student age

### Step 3: Administer Test
- Student reads instruction (screen reader compatible)
- Selects answer (choice) or types response (text input)
- Timer counts down per question
- Feedback provided immediately

### Step 4: Review Results
- Scores displayed with gravity level
- Performance graphs per domain
- Curriculum alignment shown
- Retake or generate report options

---

## Integrating with Backend API

### Step 1: Replace Mock Students
In `SghartoonPage.tsx`, replace:
```typescript
const mockStudents: Student[] = [
  { id: '1', firstName: 'Mariem', ... }
];
```

With an API call:
```typescript
const [students, setStudents] = useState<Student[]>([]);

useEffect(() => {
  fetch('/api/students')
    .then(r => r.json())
    .then(data => setStudents(data));
}, []);
```

### Step 2: Save Test Results
After `onComplete(score)`, submit to backend:
```typescript
const handleTestComplete = async (score: TestScore) => {
  const result = {
    studentId: selectedStudent.id,
    testType: 'dyslexia', // or 'dyscalculia'
    score: score.dyS,     // 0-1
    duration: calculateDuration(),
    answers: engine.answers,
    differentialFactors: {
      vision: false,
      hearing: false,
      // ... etc
    }
  };

  await fetch('/api/resultat-tests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result)
  });

  setTestScore(score);
  setStage('results');
};
```

### Step 3: Generate PDF Report
```typescript
const handlePrintReport = () => {
  // Use a library like react-pdf or html2pdf
  // Include score data, recommendations, curriculum alignment
};
```

---

## Customization

### Change Colors
Edit `taxonomy.ts` GRAVITY_LEVELS:
```typescript
G1: {
  code: 'G1',
  label: 'Léger',
  color: '#16a34a',        // Change here
  bg: '#dcfce7',           // Or here
  // ...
}
```

### Add Recommendations
Extend `SghartoonPage.tsx` to include:
```typescript
const getRecommendations = (score: TestScore) => {
  if (score.dyS > 0.4) {
    return [
      "Refer to speech therapist",
      "Implement phonic-based interventions",
      // ...
    ];
  }
};
```

### Modify Question Pool
- Add questions to `questionBank.ts` with `cx: 1|2|3`
- Update DYSLEXIA_QUESTIONS or DYSCALCULIA_QUESTIONS arrays
- Export and import in TestPlayer

---

## Features

✅ **Adaptive Testing**
- Questions auto-selected by student age/complexity level
- Mix of cognitive domains to create balanced assessment

✅ **Multilingual Ready**
- Questions support French (fr), Arabic (ar), Bilingual (bi)
- Easy to add Tamazight (ber) translations

✅ **Accessibility**
- Color-coded gravity levels (not color-only)
- Keyboard navigation throughout
- Screen reader compatible markup

✅ **Real-time Scoring**
- Auto-compute DRI (Dyscalculia/Dyslexia Risk Index)
- Assign gravity tier (G0-G3)
- Calculate fluence metrics

✅ **Curriculum Alignment**
- References official MEN Tunisie programs
- Display age-appropriate competencies
- Link findings to curricular expectations

---

## Deployment Checklist

- [ ] Replace mock students with API call
- [ ] Implement result submission to backend
- [ ] Add PDF report generation
- [ ] Configure speech synthesis language (currently fr-FR)
- [ ] Test with actual students
- [ ] Deploy to production with HTTPS (for Web Speech API)

---

## Troubleshooting

**Q: Timer not updating?**
A: Check that `useTestEngine` hook is properly managing state. Ensure interval is cleared on component unmount.

**Q: Questions repeating?**
A: Verify `testQuestions` filtering by complexity in `handleStartTest()`. Should randomize and slice to 10-20 questions.

**Q: Scores always G0?**
A: Check `computeScore()` algorithm. Error rate and fluence calculations must be within 0-1 range.

**Q: Speech synthesis not working?**
A: Ensure HTTPS in production. Web Speech API requires secure context. Check browser console for errors.

---

## References

- **Curriculum**: Programmes officiels MEN Tunisie (2023-2024)
- **Clinical Standards**: DSM-5, ODÉDYS 2, Butterworth (2005), Dehaene
- **Accessibility**: WCAG 2.1 AA

---

## Support

For issues or questions:
1. Check the conversation summary for context
2. Review question bank structure in `questionBank.ts`
3. Verify backend API integration in `/api/resultat-tests`
4. Test in browser console for errors
