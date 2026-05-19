# Sghartoon Database Schema & API Documentation

## Overview
The database schema implements the Tunisian dyscalculia/dyslexia screening system "Sghartoon Enseignant" with support for adaptive testing, curriculum alignment, and comprehensive reporting.

---

## Data Models

### 1. **User** (Base Authentication)
```javascript
{
  _id: String (UUID)
  email: String (unique, lowercase)
  passwordHash: String
  role: 'teacher' | 'student'
  studentId: String (ref to Student, optional)
}
```

### 2. **Teacher** (Extends User)
```javascript
{
  _id: String (UUID)
  userId: String (ref User, unique)
  fullName: String
  email: String (unique)
  specialty: String // e.g., "Special Education", "Primary"
  school: String
  classIds: [String] (refs to Classe)
  timestamps: { createdAt, updatedAt }
}
```

### 3. **Student**
```javascript
{
  _id: String (UUID)
  userId: String (ref User, optional)
  fullName: String
  dateOfBirth: Date
  grade: Number (1-8)
  classGroup: String
  classId: String (ref Classe)
  gender: 'M' | 'F' | 'Other'
  status: 'Active' | 'Monitoring' | 'Referred' | 'Archived'
  languageOfInstruction: String
  parentalConsentGiven: Boolean
  clinicalNotes: String
  teacherIds: [String] (refs to User)
  lastAssessmentDate: Date
  timestamps: { createdAt, updatedAt }
}
```

### 4. **Classe** (School Class)
```javascript
{
  _id: String (UUID)
  name: String // e.g., "3ème année de base A"
  school: String
  grade: Number (1-6) // Tunisian basic education years
  teacherId: String (ref User)
  createdAt: Date
  timestamps: { createdAt, updatedAt }
}
```

### 5. **Test** (Test Definition)
```javascript
{
  _id: String (UUID)
  domain: 'dyslexia' | 'dyscalculia'
  title: String
  description: String
  ageRange: String // "6-7", "8-9", "10-11"
  difficulty: String // "A,B,C" (simple, intermediate, advanced)
  duration: Number (seconds)
  version: String
  questions: [
    {
      id: String
      complexity: 1 | 2 | 3 // A | B | C
      questionType: 'choice' | 'text'
      instruction: String
      stimulus: String (optional)
      choices: [String] (for choice type)
      answer: String
      timeLimit: Number (seconds)
      domain_category: String
      curriculum: String // "1ère-2ème", "3ème-4ème", "5ème-6ème"
      dictation: String (optional, for speech-based questions)
    }
  ]
  timestamps: { createdAt, updatedAt }
}
```

### 6. **ResultatTest** (Test Result / Score)
```javascript
{
  _id: String (UUID)
  studentId: String (ref Student, required)
  testId: String (ref Test, optional)
  testType: 'dyslexia' | 'dyscalculia'
  score: Number (0-1, decimal)
  duration: Number (actual time in seconds)
  dri: Number (0-100, percentage) // Dyscalculia/Dyslexia Risk Index
  tier: 0 | 1 | 2 | 3 // G0: 0-20% | G1: 20-40% | G2: 40-65% | G3: > 65%
  testDate: Date
  condition: 'calm' | 'distracted' | 'tired' | 'other'
  aiAnalysis: String (recommendations)
  domainScores: [
    {
      domain: String
      score: Number (0-1)
      correct: Number
      total: Number
    }
  ]
  fluenceSlow: Boolean
  fluenceLabel: String
  fluenceSeconds: Number
  answers: [
    {
      questionId: String
      answered: Boolean
      correct: Boolean
      responseTime: Number
      userAnswer: String
    }
  ]
  differentialFactors: {
    vision: Boolean // Vision problems
    hearing: Boolean // Hearing problems
    attention: Boolean // ADHD-like symptoms
    languageBarrier: Boolean // Non-native speaker
    absenteeism: Boolean // School absences
    familyHistory: Boolean // Genetic predisposition
    socioeconomic: Boolean // Low socioeconomic status
  }
  timestamps: { createdAt, updatedAt }
}
```

---

## Gravity Levels (Tiers)

| Tier | Code | Range   | Label      | Description |
|------|------|---------|------------|-------------|
| 0    | G0   | 0-20%   | Normal     | Within curriculum norms |
| 1    | G1   | 20-40%  | Light      | Light difficulties, compensation possible |
| 2    | G2   | 40-65%  | Moderate   | Significant impact on learning, intervention needed |
| 3    | G3   | 65-100% | Severe     | Major difficulties, urgent specialist referral |

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

### Students
- `GET /api/students` - List all students (teacher only)
- `GET /api/students/:id` - Get student details
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Classes
- `GET /api/classes/teacher/:teacherId` - Get teacher's classes
- `GET /api/classes/:classId` - Get class details + students
- `POST /api/classes` - Create new class
- `PUT /api/classes/:classId` - Update class
- `DELETE /api/classes/:classId` - Delete class

### Tests
- `GET /api/tests` - List all tests (filters: domain, difficulty, ageRange)
- `GET /api/tests/:testId` - Get test details with questions
- `POST /api/tests` - Create new test (admin only)
- `PUT /api/tests/:testId` - Update test (admin only)
- `DELETE /api/tests/:testId` - Delete test (admin only)

### Test Results
- `GET /api/resultat-tests/:studentId` - Get all results for student
- `GET /api/resultat-tests/detail/:resultId` - Get specific result
- `POST /api/resultat-tests` - Create new result (save test completion)
- `PUT /api/resultat-tests/:resultId` - Update result
- `DELETE /api/resultat-tests/:resultId` - Delete result

---

## Seed Data

Initialize test questions from Sghartoon HTML:

```bash
cd backend
node seeds/sghartoonSeed.js
```

This creates:
- **Dyslexia Test**: 18 adaptive questions (Complexity A, B, C)
- **Dyscalculia Test**: 20 adaptive questions (Complexity A, B, C)

All questions are aligned with:
- Tunisian curriculum (MEN 1ère-6ème année de base)
- Clinical standards (DSM-5, ODÉDYS 2, Butterworth)
- Multi-language support (Arabic, French)

---

## Scoring Algorithm

### DRI Calculation
```
DRI = (error_rate × 0.65) + (speed_deviation × 0.35) × 100
```

### Tier Assignment
```
if DRI < 20:
  tier = 0 (G0 - Normal)
else if DRI < 40:
  tier = 1 (G1 - Light)
else if DRI < 65:
  tier = 2 (G2 - Moderate)
else:
  tier = 3 (G3 - Severe)
```

**Fluence Assessment**:
- Normal: < 45% above expected time
- Slow: > 65% above expected time

---

## Example Request/Response

### Create Test Result
**Request**:
```javascript
POST /api/resultat-tests

{
  "studentId": "uuid-student",
  "testType": "dyslexia",
  "score": 0.35,
  "duration": 1200,
  "condition": "calm",
  "answers": [
    {
      "questionId": "dy_A1",
      "answered": true,
      "correct": true,
      "responseTime": 12
    },
    // ... more answers
  ],
  "differentialFactors": {
    "vision": false,
    "hearing": true,
    "attention": false,
    "languageBarrier": false,
    "absenteeism": false,
    "familyHistory": true,
    "socioeconomic": false
  }
}
```

**Response** (201 Created):
```javascript
{
  "_id": "uuid-result",
  "studentId": "uuid-student",
  "testType": "dyslexia",
  "score": 0.35,
  "dri": 35,
  "tier": 1,
  "fluenceSlow": false,
  "fluenceLabel": "Normale ✓",
  "domainScores": [
    {
      "domain": "Discrimination visuelle",
      "score": 0.4,
      "correct": 2,
      "total": 5
    },
    // ... more domains
  ],
  "differentialFactors": { /* ... */ },
  "testDate": "2026-05-13T10:30:00Z",
  "createdAt": "2026-05-13T10:32:00Z"
}
```

---

## Integration with Frontend

Frontend sends test completion data:
```javascript
// After student finishes adaptive test in Sghartoon
const response = await fetch('/api/resultat-tests', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    studentId: student.id,
    testType: 'dyslexia', // or 'dyscalculia'
    score: 0.35,
    duration: 1200,
    condition: 'calm',
    answers: testAnswers,
    differentialFactors: factors
  })
});

const result = await response.json();
// result.dri = 35
// result.tier = 1 (G1 - Light)
```

---

## Curriculum Alignment

### Tunisian Education (MEN)
- **1ère-2ème année** (6-7 years): Basic phoneme awareness, counting 1-20
- **3ème-4ème année** (8-9 years): Word reading, multiplication tables, 2-digit operations
- **5ème-6ème année** (10-11 years): Complex text, fractions, multi-digit operations

Each test question is tagged with its curriculum level for adaptive presentation.

---

## Sources & References
- **Curriculum**: Programmes officiels — Ministère de l'Éducation Tunisie (2023-2024)
- **Clinical**: DSM-5, ODÉDYS 2, Butterworth (2005), Dehaene Triple Code Model
- **Standards**: ANAPEDYS (France), ICD-11 (WHO)
