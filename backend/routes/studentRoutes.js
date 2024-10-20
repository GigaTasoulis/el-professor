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

// Get a student's class history
router.get('/:id/classes', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the student by ID and populate the classes they attended
    const student = await Student.findById(id).populate('classes');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Send the populated class history as the response
    res.json(student.classes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class history', error });
  }
});

// Add class to a student's history
router.put('/:id/add-class', async (req, res) => {
  const { id } = req.params;
  const { classId } = req.body;

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Add the class ID to the student's classes array
    student.classes.push(classId);
    await student.save();

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error });
  }
});



module.exports = router;



