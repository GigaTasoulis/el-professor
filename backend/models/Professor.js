const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  tel: { type: String, required: true },
  email: { type: String, required: true },
  afm: { type: String, required: true }
});

module.exports = mongoose.model('Professor', professorSchema);
