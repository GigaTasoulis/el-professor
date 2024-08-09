const express = require('express');
const router = express.Router();
const Classroom = require('../models/Classroom.js');

// Get all classrooms
router.get('/classrooms', async (req, res) => {
    try {
        const classrooms = await Classroom.find();
        res.json(classrooms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching classrooms', error });
    }
});

// Create a new classroom
router.post('/classrooms', async (req, res) => {
    const { name, availability } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Classroom name is required' });
    }

    try {
        const newClassroom = new Classroom({ name, availability });
        await newClassroom.save();
        res.status(201).json(newClassroom);
    } catch (error) {
        res.status(500).json({ message: 'Error creating classroom', error });
    }
});

// Delete a classroom by ID
router.delete('/classrooms/:id', async (req, res) => {
    try {
        const classroom = await Classroom.findByIdAndDelete(req.params.id);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        res.status(200).json({ message: 'Classroom deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting classroom', error });
    }
});

module.exports = router;
