const express = require('express');
const router = express.Router();
const Classe = require('../models/Classe');
const Student = require('../models/Student');

// GET all classes for a teacher
router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const classes = await Classe.find({ teacherId: req.params.teacherId }).populate('teacherId');
    res.json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching classes' });
  }
});

// GET a specific class
router.get('/:classId', async (req, res) => {
  try {
    const classe = await Classe.findById(req.params.classId).populate('teacherId');
    if (!classe) {
      return res.status(404).json({ error: 'Class not found' });
    }
    
    // Get all students in this class
    const students = await Student.find({ classId: req.params.classId });
    
    res.json({
      ...classe.toObject(),
      students
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching class' });
  }
});

// POST create a new class
router.post('/', async (req, res) => {
  try {
    const { name, school, grade, teacherId } = req.body;

    if (!name || !school || grade === undefined) {
      return res.status(400).json({ error: 'name, school, and grade are required' });
    }

    const classe = new Classe({
      name,
      school,
      grade,
      teacherId
    });

    await classe.save();
    res.status(201).json(classe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating class' });
  }
});

// PUT update a class
router.put('/:classId', async (req, res) => {
  try {
    const { name, school, grade, teacherId } = req.body;

    const classe = await Classe.findByIdAndUpdate(
      req.params.classId,
      { name, school, grade, teacherId },
      { new: true }
    );

    if (!classe) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json(classe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating class' });
  }
});

// DELETE a class
router.delete('/:classId', async (req, res) => {
  try {
    const classe = await Classe.findByIdAndDelete(req.params.classId);
    if (!classe) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Remove class reference from students
    await Student.updateMany(
      { classId: req.params.classId },
      { $unset: { classId: 1 } }
    );

    res.json({ message: 'Class deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting class' });
  }
});

module.exports = router;
