const express = require('express');
const { getProfessors, createProfessor, updateProfessor } = require('../controllers/professorController');
const router = express.Router();

router.route('/')
  .get(getProfessors)
  .post(createProfessor);

router.route('/:id')
  .put(updateProfessor);

module.exports = router;
