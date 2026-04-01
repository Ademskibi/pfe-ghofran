const express = require('express');
const Student = require('../models/Student');
const TestSession = require('../models/TestSession');
const InterventionStrategy = require('../models/InterventionStrategy');
const router = express.Router();

// GET /api/reports/full
router.get('/full', async (req, res) => {
  try {
    const { studentId } = req.query;

    if (studentId) {
      // Return single student report
      const student = await Student.findById(studentId).lean();
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const sessions = await TestSession.find({ studentId }).sort({ testDate: -1 }).lean();
      
      let weakDomains = [];
      if (sessions.length > 0 && sessions[0].domains) {
        weakDomains = sessions[0].domains
          .filter(d => d.score < 50)
          .map(d => d.name);
      }

      let interventions = [];
      if (weakDomains.length > 0) {
        interventions = await InterventionStrategy.find({
          domain: { $in: weakDomains.map(d => new RegExp(d, 'i')) }
        }).lean();
      } else {
        interventions = await InterventionStrategy.find().lean();
      }

      return res.json({
        student,
        sessions,
        interventions
      });
    } else {
      // Return all students with their latest session
      const students = await Student.find().lean();
      const response = await Promise.all(students.map(async (student) => {
        const latestSession = await TestSession.findOne({ studentId: student._id })
          .sort({ testDate: -1 })
          .lean();
        return { ...student, latestSession };
      }));
      return res.json(response);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error generating report' });
  }
});

module.exports = router;
