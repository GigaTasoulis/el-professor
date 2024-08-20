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

    // Update student fields
    student.name = name;
    student.surname = surname;
    student.tel = tel;
    student.department = department;
    student.email = email;
    student.debt = debt;
    student.paid = paid;
    student.paymentHistory = paymentHistory;

    await student.save();
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error });
  }
});

// Update student's debt
router.put('/:id/debt', async (req, res) => {
  const { id } = req.params;
  const { debt } = req.body;

  if (debt === undefined) {
    return res.status(400).json({ message: 'Debt is required' });
  }

  try {
    // Find the student by ID and update only the debt field
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: { debt } },  // Only updating the debt field
      { new: true }        // Return the updated document
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error });
  }
});

// Delete a student
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error });
  }
});


module.exports = router;



