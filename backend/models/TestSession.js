const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const domainScoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, min: 0, max: 100, required: true }
}, { _id: false });

const testSessionSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  studentId: { type: String, ref: 'Student', required: true },
  testDate: { type: Date, default: Date.now },
  duration: { type: Number },
  condition: { type: String, enum: ['calm', 'distracted', 'tired'] },
  version: { type: String },
  domains: [domainScoreSchema],
  completedDomains: { type: Number },
  dri: { type: Number },
  tier: { type: Number, enum: [0, 1, 2, 3] },
  aiAnalysis: { type: String }
});

testSessionSchema.pre('save', function(next) {
  if (this.domains && this.domains.length > 0) {
    const totalScore = this.domains.reduce((sum, domain) => sum + domain.score, 0);
    this.dri = totalScore / this.domains.length;

    // DRI < 25 -> tier 3 (high risk)
    // DRI < 50 -> tier 2 (moderate)
    // DRI < 75 -> tier 1 (low risk)
    // DRI >= 75 -> tier 0 (no concern)
    if (this.dri < 25) {
      this.tier = 3;
    } else if (this.dri < 50) {
      this.tier = 2;
    } else if (this.dri < 75) {
      this.tier = 1;
    } else {
      this.tier = 0;
    }
    this.completedDomains = this.domains.length;
  }
  next();
});

module.exports = mongoose.model('TestSession', testSessionSchema);
