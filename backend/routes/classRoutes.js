const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

// Create a new class
router.post('/', async (req, res) => {
  const { title, start, end, className, lesson, teacher, students } = req.body;

  console.log('Received data:', req.body);

  if (!title || !start || !end || !className || !lesson || !teacher) {
    console.log('Missing fields');
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newClass = new Class({ title, start, end, class: className, lesson, teacher, students });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ message: 'Error creating class', error });
  }
});

module.exports = router;
