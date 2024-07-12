const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

// Get all classes
router.get('/', async (req, res) => {
  const classes = await Class.find();
  res.json(classes);
});

// Create a new class
router.post('/', async (req, res) => {
  const newClass = new Class(req.body);
  await newClass.save();
  res.json(newClass);
});

module.exports = router;
