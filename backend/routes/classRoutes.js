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
const { start, end, className, lesson, teacher, students } = req.body;
if (!start || !end || !className || !lesson || !teacher) {
  console.log('Missing fields');
  return res.status(400).json({ message: 'All fields are required' });
}

try {
  const newClass = new Class({ start, end, class: className, lesson, teacher, students });
  await newClass.save();
  res.status(201).json(newClass);
} catch (error) {
  console.error('Error creating class:', error);
  res.status(500).json({ message: 'Error creating class', error });
}

  

});

module.exports = router;
