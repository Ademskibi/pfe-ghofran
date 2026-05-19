# Setup Instructions — Sghartoon Database & APIs

## Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- npm or yarn

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Create `.env` in backend folder:

```env
MONGODB_URI=mongodb://localhost:27017/sghartoon
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sghartoon?retryWrites=true&w=majority
```

### 3. Initialize Database

#### Option A: Auto-create with seed data
```bash
node seeds/sghartoonSeed.js
```

This creates:
- Dyslexia test (18 questions)
- Dyscalculia test (20 questions)

#### Option B: Manual collection creation
```bash
mongo sghartoon
```

```javascript
db.createCollection('users');
db.createCollection('students');
db.createCollection('teachers');
db.createCollection('classes');
db.createCollection('tests');
db.createCollection('resultatests');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.teachers.createIndex({ userId: 1 }, { unique: true });
db.students.createIndex({ userId: 1 }, { sparse: true });
db.classes.createIndex({ teacherId: 1 });
db.resultatests.createIndex({ studentId: 1 });
db.resultatests.createIndex({ testDate: -1 });
```

### 4. Start Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

## Database Models Summary

| Model | Purpose | Fields |
|-------|---------|--------|
| **User** | Authentication | email, passwordHash, role |
| **Teacher** | Instructor profile | fullName, specialty, classIds |
| **Student** | Learner profile | fullName, dateOfBirth, classId, status |
| **Classe** | School class | name, school, grade, teacherId |
| **Test** | Test definition | domain (dyslexia/dyscalculia), questions[] |
| **ResultatTest** | Test result/score | studentId, dri, tier, answers[] |

---

## Key API Routes

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
```

### Student Management
```
GET    /api/students
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id
```

### Test Results
```
POST   /api/resultat-tests          (save test completion)
GET    /api/resultat-tests/:studentId (get all results)
GET    /api/resultat-tests/detail/:resultId
PUT    /api/resultat-tests/:resultId
DELETE /api/resultat-tests/:resultId
```

### Tests (Admin)
```
GET    /api/tests
GET    /api/tests/:testId
POST   /api/tests
PUT    /api/tests/:testId
DELETE /api/tests/:testId
```

### Classes
```
GET    /api/classes/teacher/:teacherId
GET    /api/classes/:classId
POST   /api/classes
PUT    /api/classes/:classId
DELETE /api/classes/:classId
```

---

## Test a User Flow

### 1. Register Teacher
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.tn",
    "password": "password123",
    "role": "teacher"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.tn",
    "password": "password123"
  }'
```
Response includes `token`

### 3. Create Student
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "fullName": "Mohamed Ben Ali",
    "dateOfBirth": "2018-05-15",
    "grade": 3,
    "classGroup": "3ème année A",
    "gender": "M",
    "languageOfInstruction": "ar",
    "parentalConsentGiven": true,
    "status": "Active"
  }'
```

### 4. Get Tests
```bash
curl -X GET "http://localhost:5000/api/tests?domain=dyslexia" \
  -H "Authorization: Bearer {TOKEN}"
```

### 5. Submit Test Result
```bash
curl -X POST http://localhost:5000/api/resultat-tests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "studentId": "STUDENT_ID",
    "testType": "dyslexia",
    "score": 0.35,
    "duration": 1200,
    "condition": "calm",
    "answers": [
      {"questionId": "dy_A1", "answered": true, "correct": true, "responseTime": 12}
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
  }'
```

Response includes auto-computed:
- `dri`: 35 (Dyscalculia/Dyslexia Risk Index)
- `tier`: 1 (Gravity level: 0=Normal, 1=Light, 2=Moderate, 3=Severe)

---

## Troubleshooting

### MongoDB Connection Error
- Verify MongoDB is running: `mongod --version`
- Check connection string in `.env`
- For Atlas: whitelist your IP and use correct credentials

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000
# Kill it
kill -9 <PID>
```

### Seed Data Not Loading
```bash
# Debug seed script
DEBUG=* node seeds/sghartoonSeed.js
```

### JWT Authentication Fails
- Ensure token is included: `Authorization: Bearer {TOKEN}`
- Check token expiration (1d default)
- Verify JWT_SECRET matches between auth and routes

---

## Next Steps

1. ✅ Backend API running
2. Frontend integration (React)
3. Build Sghartoon test UI
4. Deploy to production
5. Integrate with school information systems

---

## Support
See `DATABASE_SCHEMA.md` for complete data model documentation.
