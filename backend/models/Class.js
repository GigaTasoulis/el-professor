const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  subject: String,
  date: Date,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

module.exports = mongoose.model('Class', classSchema);
