const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const teacherSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  userId: { type: String, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  specialty: { type: String }, // e.g., "Special Education", "Primary", "Mathematics"
  school: { type: String },
  classIds: [{ type: String, ref: 'Classe' }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
