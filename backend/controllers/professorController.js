const Professor = require('../models/Professor');

exports.getProfessors = async (req, res) => {
  try {
    const professors = await Professor.find();
    res.json(professors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProfessor = async (req, res) => {
  const { name, surname, tel, email, afm } = req.body;
  const newProfessor = new Professor({ name, surname, tel, email, afm });

  try {
    await newProfessor.save();
    res.status(201).json(newProfessor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProfessor = async (req, res) => {
  const { id } = req.params;
  const { name, surname, tel, email, afm } = req.body;

  try {
    const professor = await Professor.findByIdAndUpdate(id, { name, surname, tel, email, afm }, { new: true });
    res.json(professor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
