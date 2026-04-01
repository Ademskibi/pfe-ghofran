const express = require('express');
const TestSession = require('../models/TestSession');
const Student = require('../models/Student');
const router = express.Router();

// GET /api/testSessions
router.get('/', async (req, res) => {
  try {
    const { studentId } = req.query;
    let query = {};
    if (studentId) {
      query.studentId = studentId;
    }
    
    // Authorization check: if student, can only fetch own sessions
    if (req.user.role === 'student' && req.user.studentId !== studentId) {
       return res.status(403).json({ error: 'You can only access your own test sessions' });
    }

    const sessions = await TestSession.find(query).sort({ testDate: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching test sessions' });
  }
});

// GET /api/testSessions/:id
router.get('/:id', async (req, res) => {
  try {
    const session = await TestSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Test session not found' });
    }
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching test session' });
  }
});

// POST /api/testSessions
router.post('/', async (req, res) => {
  try {
    const { studentId, domains, duration, condition, version, testDate } = req.body;
    
    // Authorization check
    if (req.user.role === 'student' && req.user.studentId !== studentId) {
       return res.status(403).json({ error: 'You can only create sessions for yourself' });
    }

    const newSession = new TestSession({
      studentId,
      domains,
      duration,
      condition,
      version,
      testDate: testDate || Date.now()
    });

    const savedSession = await newSession.save();

    // Update Student lastAssessmentDate
    await Student.findByIdAndUpdate(studentId, {
      lastAssessmentDate: savedSession.testDate
    });

    res.status(201).json(savedSession);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating test session' });
  }
});

// PUT /api/testSessions/:id
router.put('/:id', async (req, res) => {
  try {
    const updatedSession = await TestSession.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedSession) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(updatedSession);
  } catch (err) {
    res.status(500).json({ error: 'Server error updating test session' });
  }
});

// DELETE /api/testSessions/:id
router.delete('/:id', async (req, res) => {
  try {
    const session = await TestSession.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting test session' });
  }
});

module.exports = router;
