const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');

// Get goals
router.get('/', async (req, res) => {
  try {
    let goals = await Goal.findOne();
    if (!goals) {
      goals = new Goal();
      await goals.save();
    }
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goals', error });
  }
});

// Set goals
router.put('/', async (req, res) => {
  const { studentGoal, revenueGoal, hoursGoal } = req.body;

  try {
    let goals = await Goal.findOne();
    if (!goals) {
      goals = new Goal();
    }
    goals.studentGoal = studentGoal;
    goals.revenueGoal = revenueGoal;
    goals.hoursGoal = hoursGoal;

    await goals.save();
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error updating goals', error });
  }
});

module.exports = router;
