const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
  ],
  classes: [
    {
      type: Schema.Types.ObjectId, 
      ref: 'Class',
    },
  ],
});

module.exports = mongoose.model('Student', studentSchema);
