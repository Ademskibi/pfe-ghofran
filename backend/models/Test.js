const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const testSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  domain: { type: String, enum: ['dyslexia', 'dyscalculia'], required: true },
  title: { type: String, required: true },
  description: { type: String },
  ageRange: { type: String }, // e.g., "6-7", "8-9", "10-11"
  difficulty: { type: String, enum: ['A', 'B', 'C'] }, // A=simple, B=intermediate, C=advanced
  duration: { type: Number }, // in seconds
  version: { type: String, default: '1.0' },
  questions: [{
    id: { type: String, required: true },
    complexity: { type: Number, enum: [1, 2, 3] },
    questionType: { type: String, enum: ['choice', 'text'] },
    instruction: { type: String, required: true },
    stimulus: { type: String },
    choices: [String],
    answer: { type: String, required: true },
    timeLimit: { type: Number }, // in seconds
    domain_category: { type: String },
    curriculum: { type: String },
    dictation: { type: String } // for dictation-based questions
  }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
