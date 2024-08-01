const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

// Get all classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find();
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes', error });
  }
});

// Create a new class
router.post('/', async (req, res) => {
  const { start, end, class: className, lesson, teacher, students } = req.body;

if (!start || !end || !className || !lesson || !teacher) {
  return res.status(400).json({ message: 'All fields are required' });
}

try {
  const newClass = new Class({ start, end, class: className, lesson, teacher, students });
  await newClass.save();
  res.status(201).json(newClass);
} catch (error) {
  res.status(500).json({ message: 'Error creating class', error });
}
});

// Update a class
router.put('/:id', async (req, res) => {
  const { start, end, class: className, lesson, teacher, students } = req.body;

  if (!start || !end || !className || !lesson || !teacher) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, { start, end, class: className, lesson, teacher, students }, { new: true });
    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: 'Error updating class', error });
  }
});

module.exports = router;
