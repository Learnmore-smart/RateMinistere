// models/PlayerSession.js
const mongoose = require('mongoose');

const playerSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure userId is provided
  socketId: { type: String, required: true },
  tankStats: {
    damage: Number,
    chargeTime: Number,
    health: Number,
    speed: Number,
    shield: Number,
    special: String,
    level: String
  },
  isSearching: { type: Boolean, default: false },
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PlayerSession', playerSessionSchema);