const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const domainScoreSchema = new mongoose.Schema({
  domain: { type: String, required: true },
  score: { type: Number, min: 0, max: 1, required: true },
  correct: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, { _id: false });

const resultatTestSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  studentId: { type: String, ref: 'Student', required: true },
  testId: { type: String, ref: 'Test' },
  testType: { type: String, enum: ['dyslexia', 'dyscalculia'], required: true },
  score: { type: Number, min: 0, max: 1 },
  duration: { type: Number }, // actual duration in seconds
  dri: { type: Number, min: 0, max: 100 }, // DRI: Dyscalculia/Dyslexia Risk Index (%)
  tier: { type: Number, enum: [0, 1, 2, 3] }, // G0=0, G1=1, G2=2, G3=3
  testDate: { type: Date, default: Date.now },
  condition: { type: String, enum: ['calm', 'distracted', 'tired', 'other'] },
  aiAnalysis: { type: String },
  domainScores: [domainScoreSchema],
  fluenceSlow: { type: Boolean, default: false },
  fluenceLabel: { type: String },
  fluenceSeconds: { type: Number },
  answers: [{
    questionId: { type: String },
    answered: { type: Boolean },
    correct: { type: Boolean },
    responseTime: { type: Number },
    userAnswer: { type: String }
  }],
  differentialFactors: {
    vision: { type: Boolean, default: false },
    hearing: { type: Boolean, default: false },
    attention: { type: Boolean, default: false },
    languageBarrier: { type: Boolean, default: false },
    absenteeism: { type: Boolean, default: false },
    familyHistory: { type: Boolean, default: false },
    socioeconomic: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Provide `time` as a diagram-friendly alias for the stored duration field
resultatTestSchema.virtual('time')
  .get(function() {
    return this.duration;
  })
  .set(function(value) {
    this.duration = value;
  });

// Compute DRI (Dyscalculia/Dyslexia Risk Index) as percentage
resultatTestSchema.methods.computeDRI = function() {
  if (this.score !== undefined && this.score !== null) {
    this.dri = Math.round(this.score * 100);
  }
  return this.dri;
};

// Compute tier (gravity level) based on DRI
resultatTestSchema.methods.computeTier = function() {
  const dri = this.dri || (this.score ? Math.round(this.score * 100) : 0);
  
  if (dri < 20) {
    this.tier = 0; // G0 - Normal
  } else if (dri < 40) {
    this.tier = 1; // G1 - Light
  } else if (dri < 65) {
    this.tier = 2; // G2 - Moderate
  } else {
    this.tier = 3; // G3 - Severe
  }
  
  return this.tier;
};

// Auto-compute before saving
resultatTestSchema.pre('save', function(next) {
  this.computeDRI();
  this.computeTier();
  next();
});

module.exports = mongoose.model('ResultatTest', resultatTestSchema);
