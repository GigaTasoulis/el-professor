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
  const { name, surname, tel, department, email, debt, paid, paymentHistory } = req.body;

  try {
    console.log('Received debt value:', debt);

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.name = name;
    student.surname = surname;
    student.tel = tel;
    student.department = department;
    student.email = email;
    student.debt = debt;
    student.paid = paid;
    student.paymentHistory = paymentHistory;

    await student.save();

    console.log('Saved student debt value:', student.debt);

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error });
  }
};


