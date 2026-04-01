const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const interventionStrategySchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  domain: { type: String },
  title: { type: String },
  description: { type: String },
  ageRange: { type: String },
  type: { type: String },
  notes: { type: String },
  duration: { type: Number },
  difficulty: { type: String },
  pinnedStudents: [{ type: String }]
});

module.exports = mongoose.model('InterventionStrategy', interventionStrategySchema);
