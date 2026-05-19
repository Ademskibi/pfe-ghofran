const express = require('express');
const router = express.Router();
const ResultatTest = require('../models/ResultatTest');
const Student = require('../models/Student');
const Test = require('../models/Test');

// GET all test results for a student
router.get('/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const results = await ResultatTest.find({ studentId }).sort({ testDate: -1 });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching results' });
  }
});

// GET a specific test result
router.get('/detail/:resultId', async (req, res) => {
  try {
    const result = await ResultatTest.findById(req.params.resultId);
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching result' });
  }
});

// POST a new test result (student completes test)
router.post('/', async (req, res) => {
  try {
    const { studentId, testId, testType, score, duration, time, condition, answers, differentialFactors } = req.body;
    const actualTime = time !== undefined ? time : duration;

    // Validate student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const result = new ResultatTest({
      studentId,
      testId,
      testType,
      score,
      duration: actualTime,
      condition,
      answers,
      differentialFactors
    });

    // computeDRI and computeTier are called via pre-save hook
    await result.save();

    // Update student's lastAssessmentDate
    student.lastAssessmentDate = new Date();
    await student.save();

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating result' });
  }
});

// PUT update a test result
router.put('/:resultId', async (req, res) => {
  try {
    const { score, condition, answers, differentialFactors } = req.body;
    
    const result = await ResultatTest.findByIdAndUpdate(
      req.params.resultId,
      { score, condition, answers, differentialFactors },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating result' });
  }
});

// DELETE a test result
router.delete('/:resultId', async (req, res) => {
  try {
    const result = await ResultatTest.findByIdAndDelete(req.params.resultId);
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.json({ message: 'Result deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting result' });
  }
});

module.exports = router;
