const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

// Get all classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes', error });
  }
});

// Create a new class
router.post('/', async (req, res) => {
  const { start, end, class: className, lesson, teacher, students, costPerClass } = req.body;

  if (!start || !end || !className || !lesson || !teacher || !costPerClass) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newClass = new Class({ start, end, class: className, lesson, teacher, students, costPerClass });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: 'Error creating class', error });
  }
});

// Update a class
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { start, end, class: className, lesson, teacher, students, costPerClass } = req.body;

  if (!start || !end || !className || !lesson || !teacher || !costPerClass) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const updatedClass = await Class.findByIdAndUpdate(id, { start, end, class: className, lesson, teacher, students, costPerClass }, { new: true });
    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: 'Error updating class', error });
  }
});

// Delete a class
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Class.findByIdAndDelete(id);
    res.status(204).json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting class', error });
  }
});

module.exports = router;
