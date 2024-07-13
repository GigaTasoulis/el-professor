const Student = require('../models/Student');

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createStudent = async (req, res) => {
  const { name, surname, tel, department, email, debt } = req.body;
  const newStudent = new Student({ name, surname, tel, department, email, debt });

  try {
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, surname, tel, department, email, debt } = req.body;

  try {
    const student = await Student.findByIdAndUpdate(id, { name, surname, tel, department, email, debt }, { new: true });
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
