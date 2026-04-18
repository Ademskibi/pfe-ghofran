const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const miniGameProgressSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  userId: { type: String, ref: 'User', required: true },
  studentId: { type: String, ref: 'Student', required: true },
  gameType: { type: String, enum: ['pizza-slices', 'number-match'], required: true },
  score: { type: Number, default: 0 },
  level: { type: String, default: 'easy' },
  completedRounds: { type: Number, default: 0 },
  lastPlayedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MiniGameProgress', miniGameProgressSchema);
