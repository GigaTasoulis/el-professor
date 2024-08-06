const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  tel: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true },
  debt: { type: Number, default: 0 },
  paid: { type: Number, default: 0 },
  paymentHistory: [
    {
      amount: Number,
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Student', studentSchema);
