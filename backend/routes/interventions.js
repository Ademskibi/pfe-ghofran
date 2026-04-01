const express = require('express');
const InterventionStrategy = require('../models/InterventionStrategy');
const requireRole = require('../middleware/requireRole');
const router = express.Router();

// GET /api/interventions
router.get('/', async (req, res) => {
  try {
    const { domain } = req.query;
    let query = {};
    if (domain) {
      query.domain = { $regex: domain, $options: 'i' };
    }
    const interventions = await InterventionStrategy.find(query);
    res.json(interventions);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching interventions' });
  }
});

// GET /api/interventions/:id
router.get('/:id', async (req, res) => {
  try {
    const intervention = await InterventionStrategy.findById(req.params.id);
    if (!intervention) {
      return res.status(404).json({ error: 'Intervention not found' });
    }
    res.json(intervention);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching intervention' });
  }
});

// POST /api/interventions
router.post('/', requireRole('teacher'), async (req, res) => {
  try {
    const newIntervention = new InterventionStrategy(req.body);
    const saved = await newIntervention.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Server error creating intervention' });
  }
});

module.exports = router;
