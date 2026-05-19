# Sghartoon — Quick Reference Guide

## What is Sghartoon?
**Sghartoon Enseignant** is an adaptive screening tool for dyslexia (dyslexia) and dyscalculia in Tunisian primary school students (ages 6-11). It aligns with the official Tunisian Ministry of Education curriculum.

---

## Database Architecture at a Glance

```
┌─────────────┐
│   User      │
├─────────────┤
│ email       │
│ passwordHash│
│ role        │ ──→ 'teacher' or 'student'
└─────────────┘
      ↑
      │ extends
      ├──────────────────┐
      ↓                  ↓
  ┌────────┐         ┌──────────┐
  │Teacher │         │ Student  │
  ├────────┤         ├──────────┤
  │ userId │         │ userId   │
  │classes │         │classId ──┼──→ Classe
  └────────┘         └──────────┘
                         │
                         │ takes
                         ↓
                     ┌──────────┐
                     │   Test   │
                     ├──────────┤
                     │ domain   │ (dyslexia/dyscalculia)
                     │questions │ (A, B, C complexity)
                     └──────────┘
                         │
                         │ produces
                         ↓
                  ┌──────────────────┐
                  │  ResultatTest    │
                  ├──────────────────┤
                  │ studentId        │
                  │ score: 0-1       │
                  │ dri: 0-100%      │
                  │ tier: 0,1,2,3    │
                  │ answers[]        │
                  │ factors          │
                  └──────────────────┘
```

---

## Key Data Entities

### User
- Base authentication model
- role: `'teacher'` | `'student'`

### Teacher
- Linked to User
- Manages Classe(s)
- Specialty field

### Student
- Linked to User (optional)
- Enrolled in Classe
- Has multiple ResultatTest records

### Classe
- School class (e.g., "3ème année A")
- grade: 1-6 (Tunisian system)
- Contains multiple Students

### Test
- 2 types: `'dyslexia'` | `'dyscalculia'`
- 18-20 adaptive questions each
- Questions in Complexity: A (6-7yo), B (8-9yo), C (10-11yo)

### ResultatTest
- **Score** (0-1): Raw performance
- **DRI** (0-100%): Risk Index percentage
- **Tier** (0-3):
  - **0** (G0): Normal (< 20%)
  - **1** (G1): Light (20-40%)
  - **2** (G2): Moderate (40-65%)
  - **3** (G3): Severe (> 65%)
- Differential factors (7 flags)

---

## Quick Stats

| Item | Count |
|------|-------|
| Dyslexia questions | 18 (A:10, B:5, C:3) |
| Dyscalculia questions | 20 (A:10, B:5, C:5) |
| Test duration | ~20 minutes |
| Curriculum levels | 3 (1ère-2ème, 3ème-4ème, 5ème-6ème) |
| Gravity tiers | 4 (G0, G1, G2, G3) |
| Differential factors | 7 (vision, hearing, attention, language, absenteeism, family history, SES) |

---

## API Quick Reference

### Auth
```
POST /api/auth/register
POST /api/auth/login
```

### Students
```
GET    /api/students
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id
```

### Test Results
```
POST   /api/resultat-tests                    # Save test completion
GET    /api/resultat-tests/:studentId         # Get all results
GET    /api/resultat-tests/detail/:resultId   # Get one result
PUT    /api/resultat-tests/:resultId          # Update
DELETE /api/resultat-tests/:resultId          # Delete
```

### Tests (Admin)
```
GET    /api/tests?domain=dyslexia&ageRange=6-7
POST   /api/tests
PUT    /api/tests/:testId
DELETE /api/tests/:testId
```

### Classes
```
GET    /api/classes/teacher/:teacherId
POST   /api/classes
PUT    /api/classes/:classId
DELETE /api/classes/:classId
```

---

## Example: Student Takes Test

### 1. Frontend loads test
```
GET /api/tests?domain=dyslexia
```
Returns test with 18 questions (A, B, C complexity)

### 2. Student answers adaptively
Frontend adapts difficulty based on responses

### 3. Frontend submits results
```
POST /api/resultat-tests
{
  studentId: "...",
  testType: "dyslexia",
  score: 0.35,           # 35% error rate
  duration: 1200,        # 20 minutes
  condition: "calm",
  answers: [...],
  differentialFactors: {...}
}
```

### 4. Backend computes metrics
```
dri = (error_rate × 0.65) + (speed_deviation × 0.35) × 100
    = (0.35 × 0.65) + (0.1 × 0.35) × 100
    = 28.75% → rounds to 29%

tier = 1 (G1 - Light) because 20% < 29% < 40%
```

### 5. Response with scores
```json
{
  dri: 29,
  tier: 1,
  fluenceSlow: false,
  domainScores: [...],
  differentialFactors: {...}
}
```

---

## Gravity Levels Explained

| Tier | Code | Score | Description |
|------|------|-------|-------------|
| **0** | G0 | <20% | **Normal** — Within curriculum norms. Continue regular teaching. |
| **1** | G1 | 20-40% | **Light** — Mild difficulties. Extra support in class, monitor. |
| **2** | G2 | 40-65% | **Moderate** — Significant impact. Recommend specialist evaluation & PAP (Individualized Education Plan). |
| **3** | G3 | >65% | **Severe** — Major difficulties. Urgent referral to neuropsychologist/speech therapist. Immediate accommodations. |

---

## Curriculum Alignment

### 1ère-2ème année (6-7 years)
- **Dyslexia**: Letter discrimination, phoneme awareness, simple word reading
- **Dyscalculia**: Counting to 20, basic addition/subtraction

### 3ème-4ème année (8-9 years)
- **Dyslexia**: Word fluency, orthography, syllable segmentation
- **Dyscalculia**: 2-digit operations, multiplication tables (×2, ×5, ×10)

### 5ème-6ème année (10-11 years)
- **Dyslexia**: Complex text comprehension, morphological awareness
- **Dyscalculia**: All multiplication tables, fractions, multi-step problems

---

## Differential Factors (Context)

When a student shows difficulty, check these factors:

| Factor | Impact |
|--------|--------|
| **Vision** | May fake dyslexia if uncorrected |
| **Hearing** | Affects phonological awareness |
| **Attention (ADHD)** | Fluency may be slowed by inattention, not dyslexia |
| **Language barrier** | Non-native speaker may struggle with French items |
| **Absenteeism** | Gaps from missed instruction, not inherent DYS |
| **Family history** | Genetic risk (3-8× likelihood if parent affected) |
| **Socioeconomic** | Lack of stimulation can mimic DYS |

**All factors are recorded and displayed in final report.**

---

## Test Questions Structure

Each question includes:
```javascript
{
  id: "dy_A1",              // Unique ID
  complexity: 1,             // A(1), B(2), C(3)
  questionType: "choice",    // "choice" | "text"
  instruction: "...",        // Question text
  stimulus: "...",           // Visual/audio stimulus
  choices: [...],            // For choice type
  answer: "correct answer",  // Ground truth
  timeLimit: 15,             // Seconds allowed
  domain_category: "...",    // Cognitive skill tested
  curriculum: "1ère-2ème",   // Target grade
  dictation: "mot à dire"    // For speech-to-text
}
```

---

## Database Models Files

```
backend/models/
├── User.js              # Authentication
├── Teacher.js           # Instructor profile
├── Student.js           # Student profile
├── Classe.js            # School class
├── Test.js              # Test definition
├── ResultatTest.js      # Test result/score
└── (old models):
    ├── TestSession.js   # Keep for backward compatibility
    ├── InterventionStrategy.js
    └── MiniGameProgress.js
```

---

## Routes Files

```
backend/routes/
├── auth.js              # Login/Register
├── students.js          # Student CRUD
├── classes.js           # Class management (NEW)
├── tests.js             # Test admin (NEW)
├── resultatTests.js     # Result submission (NEW)
├── testSessions.js      # Keep for backward compatibility
└── reports.js           # Reporting
```

---

## Setup Checklist

- [ ] Create `.env` with MongoDB URI and JWT_SECRET
- [ ] Run `npm install` in backend
- [ ] Run `node seeds/sghartoonSeed.js` to load test data
- [ ] Start server: `npm run dev`
- [ ] Test endpoint: `curl http://localhost:5000/health`
- [ ] Register teacher account
- [ ] Create class and student
- [ ] Load test: `GET /api/tests?domain=dyslexia`
- [ ] Submit fake result: `POST /api/resultat-tests`

---

## Common Questions

**Q: Can students take the test offline?**
A: Not currently. Frontend must connect to API.

**Q: How adaptive is the test?**
A: Frontend chooses question complexity based on curriculum level. No dynamic branching yet.

**Q: Can teachers export results?**
A: Yes, ResultatTest includes all data. Build export endpoint as needed.

**Q: What's the difference between score and dri?**
A: `score` (0-1) is raw performance; `dri` (0-100%) is the risk index.

**Q: Which tier requires referral?**
A: G2 and above. G0 and G1 → monitor in class.

---

## Files Created

✅ **Models** (6):
- Classe.js
- Test.js
- ResultatTest.js
- Teacher.js
- Student.js (updated)

✅ **Routes** (3):
- classes.js
- tests.js
- resultatTests.js

✅ **Seeds** (1):
- sghartoonSeed.js (18+20 questions)

✅ **Documentation** (3):
- DATABASE_SCHEMA.md
- SETUP_INSTRUCTIONS.md
- QUICK_REFERENCE.md (this file)

---

## Next: Frontend Integration

The frontend (React) should:
1. Authenticate user (login/register)
2. Load test: `GET /api/tests?domain=dyslexia`
3. Present questions adaptively
4. Collect answers & timing
5. Submit: `POST /api/resultat-tests`
6. Display results (dri, tier, report)

See `DATABASE_SCHEMA.md` for full details.
