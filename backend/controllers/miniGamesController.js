const MiniGameProgress = require('../models/MiniGameProgress');

const getProgress = async (req, res) => {
  try {
    const requestedStudentId = req.query.studentId;
    const studentId = req.user.role === 'student' ? req.user.studentId : requestedStudentId;

    if (!studentId) {
      return res.status(400).json({ error: 'Missing studentId' });
    }

    if (req.user.role === 'student' && req.user.studentId !== studentId) {
      return res.status(403).json({ error: 'You can only view your own progress' });
    }

    const progress = await MiniGameProgress.find({ studentId }).sort({ lastPlayedAt: -1 });
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching mini game progress' });
  }
};

const saveProgress = async (req, res) => {
  try {
    const { gameType, score, level, completedRounds, studentId: requestedStudentId } = req.body;
    const studentId = req.user.role === 'student' ? req.user.studentId : requestedStudentId;

    if (!studentId) {
      return res.status(400).json({ error: 'Missing studentId' });
    }

    if (!gameType) {
      return res.status(400).json({ error: 'Missing gameType' });
    }

    if (req.user.role === 'student' && req.user.studentId !== studentId) {
      return res.status(403).json({ error: 'You can only save your own progress' });
    }

    const existing = await MiniGameProgress.findOne({ userId: req.user.userId, gameType, studentId });
    const now = new Date();

    let progress;
    if (existing) {
      existing.score = score ?? existing.score;
      existing.level = level || existing.level;
      existing.completedRounds = existing.completedRounds + (completedRounds || 0);
      existing.lastPlayedAt = now;
      progress = await existing.save();
    } else {
      progress = await MiniGameProgress.create({
        userId: req.user.userId,
        studentId,
        gameType,
        score: score ?? 0,
        level: level || 'easy',
        completedRounds: completedRounds || 0,
        lastPlayedAt: now,
      });
    }

    res.status(201).json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error saving mini game progress' });
  }
};

module.exports = {
  getProgress,
  saveProgress,
};
