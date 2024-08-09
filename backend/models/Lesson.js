const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  }
});

module.exports = mongoose.model('Lesson', LessonSchema);
