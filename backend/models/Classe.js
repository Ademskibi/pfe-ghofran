const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const classeSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  school: { type: String, required: true },
  grade: { type: Number, required: true, min: 1, max: 6 },
  teacherId: { type: String, ref: 'Teacher' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Classe', classeSchema);
