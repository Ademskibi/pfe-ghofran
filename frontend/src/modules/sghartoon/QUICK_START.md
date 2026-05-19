# Quick Start Guide - Sghartoon Test Interface

## What Was Created

You now have a complete React-based testing interface for Sghartoon that:
- ✅ Displays student selection
- ✅ Runs adaptive tests (Dyslexia or Dyscalculia)
- ✅ Shows real-time timer and feedback
- ✅ Scores tests automatically with DRI algorithm
- ✅ Displays gravity levels and curriculum alignment
- ✅ Saves results to backend API

---

## How to Use

### 1. Access the Test Interface
```
http://localhost:5173/sghartoon
```
(as a teacher user)

### 2. Select a Student
- Click any student card (currently mock data)
- Choose test type: "📖 Dyslexie" or "🔢 Dyscalculie"

### 3. Administer Test
- Student sees welcome screen with instructions
- Questions appear with timer (auto-advances after time)
- For choice questions: click answer
- For text questions: type answer + click OK
- Feedback appears immediately
- Next/Terminer button enables after answering

### 4. View Results
- Score displayed as percentage (0-100%)
- Gravity level shown with color & description:
  - 🟢 G0 (< 20%) = Normal
  - 🟢 G1 (20-40%) = Light concern
  - 🟡 G2 (40-65%) = Moderate concern  
  - 🔴 G3 (> 65%) = Severe - refer to specialist
- Domain breakdown by curriculum level

### 5. Options
- 🔄 "Refaire le test" - Run test again with same student
- 🖨️ "Générer rapport" - Export results (future feature)
- ← "Retour" - Return to student selection

---

## Integration with Your App

### Step 1: Connect to Real Students
Edit `frontend/src/modules/sghartoon/pages/SghartoonPage.tsx`:

**Find this:**
```typescript
const mockStudents: Student[] = [
  {
    id: '1',
    firstName: 'Mariem',
    // ...
  },
];
```

**Replace with:**
```typescript
const [students, setStudents] = useState<Student[]>([]);

useEffect(() => {
  fetch('/api/students')
    .then(r => r.json())
    .then(data => setStudents(
      data.map(s => ({
        id: s._id,
        firstName: s.fullName.split(' ')[0],
        lastName: s.fullName.split(' ')[1] || '',
        age: calculateAge(s.dateOfBirth),
        classLevel: s.classGroup,
      }))
    ));
}, []);
```

### Step 2: Save Test Results to Backend
The `useSaveTestResult` hook is ready to use. In `SghartoonPage.tsx`:

```typescript
import { useSaveTestResult } from '../hooks/useApi';

// Inside component:
const { saveResult } = useSaveTestResult();

const handleTestComplete = async (score: TestScore) => {
  try {
    await saveResult({
      studentId: selectedStudent.id,
      testType: 'dyslexia',  // or 'dyscalculia'
      score: score.dyS,
      duration: calculateTestDuration(),
      answers: testScore.answers,
      differentialFactors: {},
    });
  } catch (err) {
    console.error('Failed to save result:', err);
  }
  setTestScore(score);
  setStage('results');
};
```

### Step 3: Add Navigation Link
In your teacher dashboard, add a link:
```typescript
<Link to="/sghartoon">
  🦁 Sghartoon Assessment
</Link>
```

---

## File Structure

```
frontend/src/modules/sghartoon/
├── components/
│   └── TestPlayer.tsx                   # Test execution (read-only, don't modify)
├── data/
│   ├── questionBank.ts                  # 50 questions (read-only)
│   └── taxonomy.ts                      # Gravity/curriculum config (customizable)
├── hooks/
│   ├── useTestEngine.ts                 # Scoring logic (read-only)
│   └── useApi.ts                        # API calls (ready to use)
├── pages/
│   └── SghartoonPage.tsx                # Main page (modify for API integration)
├── styles/
│   ├── testPlayer.module.css            # Test UI styling
│   └── sghartoonPage.module.css         # Selection/results styling
└── README.md                            # Full technical documentation
```

---

## Customization

### Change Test Instructions
Edit `SghartoonPage.tsx` → `welcomeScreen`:
```typescript
<p>
  Tu vas répondre à <strong>{questions.length} questions</strong>.
  <br />
  {/* Change this text */}
  Fais de ton mieux et prends ton temps.
```

### Change Gravity Level Colors
Edit `frontend/src/modules/sghartoon/data/taxonomy.ts`:
```typescript
G0: {
  code: 'G0',
  label: 'Dans la norme',
  color: '#94a3b8',        // Change here
  bg: '#f1f5f9',           // Or here
  ic: '✅',
}
```

### Add More Questions
1. Edit `frontend/src/modules/sghartoon/data/questionBank.ts`
2. Add question to `DYSLEXIA_QUESTIONS` or `DYSCALCULIA_QUESTIONS`
3. Use same format:
```typescript
{
  id: 'dy_A11',
  cx: 1,                  // complexity 1-3
  qt: 'choice',           // 'choice' or 'text'
  inst: 'Which letter?',
  stim: 'b or d?',
  sc: 'stimEm',           // optional styling class
  choices: ['b', 'd'],
  ans: 'b',
  tl: 10,                 // 10 seconds
  domain: 'Visual Discrimination',
  curr: 'Phonics Level 1',
  dictee: null,
}
```

---

## Troubleshooting

### Q: Test doesn't launch
**A:** Check browser console for errors. Verify `/sghartoon` route is accessible as logged-in teacher.

### Q: Questions not showing
**A:** Verify `DYSLEXIA_QUESTIONS` and `DYSCALCULIA_QUESTIONS` are imported in SghartoonPage. Check that `testQuestions.length > 0` before rendering TestPlayer.

### Q: Scores always G0
**A:** Check scoring algorithm in `useTestEngine.ts`. Ensure `computeScore()` is receiving correct answer data.

### Q: Mock students showing
**A:** Replace mock students array with API call (see Integration Step 1 above).

### Q: Results not saving
**A:** 
- Verify backend API endpoint: POST `/api/resultat-tests`
- Check network tab in DevTools
- Add error logging: `console.error('Save failed:', error)`
- Ensure student ID format matches backend

---

## Files You Should Modify

✏️ **SghartoonPage.tsx** - Replace mock students, add API integration
✏️ **dashboard.tsx** or similar - Add link to `/sghartoon`
✏️ **useApi.ts** - Adjust API URLs if different

## Files You Shouldn't Modify (Read-Only)

🔒 **TestPlayer.tsx** - Core test logic
🔒 **useTestEngine.ts** - Scoring algorithm
🔒 **questionBank.ts** - Only add questions, don't restructure
🔒 **taxonomy.ts** - Only customize colors/text, not structure

---

## Working Example API Integration

```typescript
// In SghartoonPage.tsx handleTestComplete:

const handleTestComplete = async (score: TestScore) => {
  // Build result object
  const result = {
    studentId: selectedStudent.id,
    testType: getTestTypeFromQuestions(testQuestions),
    score: calculateMainScore(score),
    duration: Date.now() - testStartTime,
    answers: testQuestions.map((q, i) => ({
      questionId: q.id,
      userAnswer: engine.answers[i]?.userAnswer,
      isCorrect: engine.answers[i]?.isCorrect,
      timeSpent: engine.answers[i]?.timeSpent,
    })),
  };

  // Save to backend
  const response = await fetch('/api/resultat-tests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  });

  if (!response.ok) {
    alert('Failed to save results. Please contact support.');
    return;
  }

  // Display results
  setTestScore(score);
  setStage('results');
};
```

---

## Next Steps

1. ✅ Test interface built
2. ⏳ **Connect to real students** - Modify SghartoonPage.tsx
3. ⏳ **Hook up backend saving** - Use useSaveTestResult hook
4. ⏳ **Add teacher dashboard link** - Point to `/sghartoon`
5. ⏳ **Add PDF report generation** - Use react-pdf or html2pdf
6. ⏳ **Add speech synthesis** - For dyslexia word dictation

---

## Support Files

- 📚 Full docs: [README.md](./README.md)
- 📋 Test bank: [questionBank.ts](./data/questionBank.ts)
- 🎨 Config: [taxonomy.ts](./data/taxonomy.ts)
- ⚙️ Logic: [useTestEngine.ts](./hooks/useTestEngine.ts)
- 🌐 API: [useApi.ts](./hooks/useApi.ts)

Good luck! 🚀
