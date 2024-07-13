const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  tel: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true },
  debt: { type: Number, default: 0 }
});

module.exports = mongoose.model('Student', studentSchema);
