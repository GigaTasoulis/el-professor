const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error });
  }
});

// Create a new student
router.post('/', async (req, res) => {
  const { name, surname, tel, department, email, debt } = req.body;

  if (!name || !surname || !tel || !department || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newStudent = new Student({ name, surname, tel, department, email, debt });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating student', error });
  }
});

// Update a student
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, surname, tel, department, email, debt, paid, paymentHistory } = req.body;

  if (!name || !surname || !tel || !department || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const newPaidAmount = paid - student.paid; // Calculate the new payment amount
    student.debt -= newPaidAmount; // Subtract the new payment from the debt
    student.paid = paid; // Update the paid amount
    student.paymentHistory = paymentHistory; // Update the payment history

    student.name = name;
    student.surname = surname;
    student.tel = tel;
    student.department = department;
    student.email = email;

    await student.save();
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error });
  }
});


module.exports = router;
