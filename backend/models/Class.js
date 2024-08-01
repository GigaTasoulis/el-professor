const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  class: { type: String, required: true },
  lesson: { type: String, required: true },
  teacher: { type: String, required: true },
  students: [{ name: String }]
});

module.exports = mongoose.model('Class', classSchema);
