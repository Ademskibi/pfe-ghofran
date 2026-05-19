const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const studentSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  userId: { type: String, ref: 'User' },
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  grade: { type: Number, min: 1, max: 8 },
  classGroup: { type: String },
  classId: { type: String, ref: 'Classe' },
  gender: { type: String, enum: ['M', 'F', 'Other'] },
  clinicalNotes: { type: String },
  status: { type: String, enum: ['Active', 'Monitoring', 'Referred', 'Archived'], default: 'Active' },
  languageOfInstruction: { type: String },
  parentalConsentGiven: { type: Boolean, default: false },
  teacherIds: [{ type: String, ref: 'User' }],
  lastAssessmentDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
