const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const Student = require('../models/Student');

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

  // Validate that all required fields are present
  if (!start || !end || !className || !lesson || !teacher || !costPerClass) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Create the new class
    const newClass = new Class({
      start,
      end,
      class: className,
      lesson,
      teacher,
      students,
      costPerClass,
    });

    // Save the new class in the database
    const savedClass = await newClass.save();

    // Update each student's class history with the new class
    for (let student of students) {
      const existingStudent = await Student.findOne({ name: student.name });

      if (existingStudent) {
        // Add the class ObjectId to the student's classes array
        existingStudent.classes.push(savedClass._id);
        await existingStudent.save();
      } else {
        console.warn(`Student ${student.name} not found`);
      }
    }

    // Send the newly created class back as a response
    res.status(201).json(savedClass);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ message: 'Error creating class', error });
  }
});



// Update a class and update students' class history
router.put('/:id', async (req, res) => {
  try {
    // Log the incoming request body and params
    console.log('Updating class:', req.params.id);
    console.log('Request body:', req.body);

    const { start, end, class: className, lesson, teacher, students, costPerClass } = req.body;

    if (!start || !end || !className || !lesson || !teacher || !costPerClass) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find and update the class
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, {
      start,
      end,
      class: className,
      lesson,
      teacher,
      students,
      costPerClass
    }, { new: true });

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Clear the classes from students who are no longer attending
    const existingClass = await Class.findById(req.params.id);
    const oldStudents = existingClass.students.map(student => student.name);
    const newStudents = students.map(student => student.name);

    // Remove the class from students who are no longer attending
    const studentsToRemove = oldStudents.filter(student => !newStudents.includes(student));
    for (let studentName of studentsToRemove) {
      const student = await Student.findOne({ name: studentName });
      if (student) {
        student.classes = student.classes.filter(classId => classId.toString() !== req.params.id);
        await student.save();
        console.log(`Removed class from student ${student.name}`);
      }
    }

    // Add the updated class to the new list of students
    for (let student of students) {
      const existingStudent = await Student.findOne({ name: student.name });
      if (existingStudent && !existingStudent.classes.includes(req.params.id)) {
        existingStudent.classes.push(req.params.id);
        await existingStudent.save();
        console.log(`Added class to student ${student.name}`);
      }
    }

    res.json(updatedClass);  // Send the updated class back as response
  } catch (error) {
    console.error('Error updating class:', error);  // Log the exact error
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
