const express = require('express');
const { getStudents, createStudent, updateStudent } = require('../controllers/studentController');
const router = express.Router();

router.route('/')
  .get(getStudents)
  .post(createStudent);

router.route('/:id')
  .put(updateStudent);

module.exports = router;
