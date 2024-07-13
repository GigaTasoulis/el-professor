const Class = require('../models/Class');

exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('students');
    res.json(classes);
  } catch (error) {
    console.error('Error getting classes:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.createClass = async (req, res) => {
  const { subject, date, students, professor } = req.body;
  console.log('Create Class Request:', req.body);
  try {
    if (!subject || !date || !students || !professor) {
      throw new Error('All fields are required');
    }
    const newClass = new Class({ subject, date, students, professor });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.updateClass = async (req, res) => {
  const { id } = req.params;
  const { subject, date, students, professor } = req.body;
  console.log('Update Class Request:', req.body);
  try {
    if (!subject || !date || !students || !professor) {
      throw new Error('All fields are required');
    }
    const updatedClass = await Class.findByIdAndUpdate(id, { subject, date, students, professor }, { new: true });
    res.json(updatedClass);
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.deleteClass = async (req, res) => {
  const { id } = req.params;
  try {
    await Class.findByIdAndDelete(id);
    res.json({ message: 'Class deleted' });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ message: error.message });
  }
};
