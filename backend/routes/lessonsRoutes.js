const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson.js');

// Get all lessons
router.get('/lessons', async (req, res) => {
    try {
        const lessons = await Lesson.find();
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lessons', error });
    }
});

// Create a new lesson
router.post('/lessons', async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ message: 'Lesson name and description are required' });
    }

    try {
        const newLesson = new Lesson({ name, description });
        await newLesson.save();
        res.status(201).json(newLesson);
    } catch (error) {
        res.status(500).json({ message: 'Error creating lesson', error });
    }
});

// Delete a lesson by ID
router.delete('/lessons/:id', async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndDelete(req.params.id);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        res.status(200).json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting lesson', error });
    }
});

module.exports = router;
