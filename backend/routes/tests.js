const express = require('express');
const router = express.Router();
const Test = require('../models/Test');

// GET all tests (paginated)
router.get('/', async (req, res) => {
  try {
    const { domain, difficulty, ageRange } = req.query;
    let query = {};
    
    if (domain) query.domain = domain;
    if (difficulty) query.difficulty = difficulty;
    if (ageRange) query.ageRange = ageRange;

    const tests = await Test.find(query).sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching tests' });
  }
});

// GET a specific test by ID
router.get('/:testId', async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    res.json(test);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching test' });
  }
});

// POST create a new test (admin only)
router.post('/', async (req, res) => {
  try {
    const { domain, title, description, ageRange, difficulty, duration, version, questions } = req.body;

    if (!domain || !title) {
      return res.status(400).json({ error: 'domain and title are required' });
    }

    const test = new Test({
      domain,
      title,
      description,
      ageRange,
      difficulty,
      duration,
      version,
      questions
    });

    await test.save();
    res.status(201).json(test);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating test' });
  }
});

// PUT update a test (admin only)
router.put('/:testId', async (req, res) => {
  try {
    const { title, description, ageRange, difficulty, duration, version, questions } = req.body;

    const test = await Test.findByIdAndUpdate(
      req.params.testId,
      { title, description, ageRange, difficulty, duration, version, questions },
      { new: true }
    );

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    res.json(test);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating test' });
  }
});

// DELETE a test (admin only)
router.delete('/:testId', async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.testId);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    res.json({ message: 'Test deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting test' });
  }
});

module.exports = router;
