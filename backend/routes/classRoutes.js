const express = require('express');
const { getClasses, createClass, updateClass, deleteClass } = require('../controllers/classController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getClasses)
  .post(protect, admin, createClass);

router.route('/:id')
  .put(protect, admin, updateClass)
  .delete(protect, admin, deleteClass);

module.exports = router;
