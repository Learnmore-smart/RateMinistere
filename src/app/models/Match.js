// models/Match.js
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  player1: { type: mongoose.Schema.Types.ObjectId, ref: 'PlayerSession' },
  player2: { type: mongoose.Schema.Types.ObjectId, ref: 'PlayerSession' },
  status: { type: String, enum: ['waiting', 'in-progress', 'completed'], default: 'waiting' },
  startedAt: Date,
  endedAt: Date
});

module.exports = mongoose.model('Match', matchSchema);