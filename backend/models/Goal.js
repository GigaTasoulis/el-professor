const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  studentGoal: { type: Number, default: 100 },
  revenueGoal: { type: Number, default: 10000 },
  hoursGoal: { type: Number, default: 1000 }
});

module.exports = mongoose.model('Goal', goalSchema);
