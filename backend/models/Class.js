const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  date: { type: Date, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  professor: { type: String, required: true },
});

module.exports = mongoose.model('Class', classSchema);
