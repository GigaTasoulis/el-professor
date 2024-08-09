const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  availability: {
    type: Boolean,
    required: true,
    default: true
  }
});

module.exports = mongoose.model('Classroom', ClassroomSchema);
