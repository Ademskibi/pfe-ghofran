const express = require('express');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const TestSession = require('../models/TestSession');
const User = require('../models/User');
const requireRole = require('../middleware/requireRole');
const router = express.Router();

// GET /api/students
router.get('/', async (req, res) => {
  try {
    const { search, grade, status } = req.query;
    let query = {};

    if (search) {
      query.fullName = { $regex: search, $options: 'i' };
    }
    if (grade) {
      query.grade = parseInt(grade);
    }
    if (status) {
      query.status = status;
    }

    const students = await Student.find(query).lean();

    // Attach latest test session
    const response = await Promise.all(students.map(async (student) => {
      const latestSession = await TestSession.findOne({ studentId: student._id })
        .sort({ testDate: -1 })
        .lean();
      return { ...student, latestSession };
    }));

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching students' });
  }
});

// GET /api/students/:id
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching student' });
  }
});

// POST /api/students
router.post('/', requireRole('teacher'), async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(500).json({ error: 'Server error creating student' });
  }
});

// POST /api/students/with-account
// Creates a student profile and the linked student login account in one request.
router.post('/with-account', requireRole('teacher'), async (req, res) => {
  let createdStudent = null;

  try {
    const { email, password, ...studentPayload } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    createdStudent = new Student(studentPayload);
    const savedStudent = await createdStudent.save();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const studentUser = new User({
      email: normalizedEmail,
      passwordHash,
      role: 'student',
      studentId: savedStudent._id,
    });

    const savedUser = await studentUser.save();

    return res.status(201).json({
      message: 'student-and-account-created',
      student: savedStudent,
      user: {
        _id: savedUser._id,
        email: savedUser.email,
        role: savedUser.role,
        studentId: savedUser.studentId,
      },
    });
  } catch (err) {
    // Best-effort rollback if account creation fails after student creation.
    if (createdStudent && createdStudent._id) {
      await Student.findByIdAndDelete(createdStudent._id).catch(() => null);
    }
    console.error(err);
    return res.status(500).json({ error: 'Server error creating student and account' });
  }
});

// PUT /api/students/:id
router.put('/:id', requireRole('teacher'), async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: 'Server error updating student' });
  }
});

// DELETE /api/students/:id
router.delete('/:id', requireRole('teacher'), async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    await TestSession.deleteMany({ studentId: req.params.id });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting student' });
  }
});

module.exports = router;
