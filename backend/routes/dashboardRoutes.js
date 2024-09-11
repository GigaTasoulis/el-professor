const express = require('express');
const router = express.Router();
const Class = require('../models/Class'); // Χρήση του μοντέλου Class
const Student = require('../models/Student');

// Route για να λαμβάνουμε τα στατιστικά για μαθήματα (classes) και μαθητές
router.get('/dashboard/stats', async (req, res) => {
  const { year, month, week } = req.query;

  console.log('Query parameters:', { year, month, week });

  let classesQuery = {}; // Query για τα μαθήματα (classes)
  let studentsQuery = {}; // Query για τους μαθητές

  // Φιλτράρισμα για το έτος
  if (year) {
    console.log('Filtering by year:', year);
    classesQuery.start = { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) };
    studentsQuery.enrollmentDate = { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) };
  }

  // Φιλτράρισμα για τον μήνα
  if (year && month) {
    console.log('Filtering by month:', month);
    classesQuery.start = { $gte: new Date(`${year}-${month}-01`), $lte: new Date(`${year}-${month}-31`) };
    studentsQuery.enrollmentDate = { $gte: new Date(`${year}-${month}-01`), $lte: new Date(`${year}-${month}-31`) };
  }

  // Φιλτράρισμα για την εβδομάδα
  if (year && month && week) {
    const [startDate, endDate] = week.split(',');
    console.log('Filtering by week:', { startDate, endDate });
    classesQuery.start = { $gte: new Date(startDate), $lte: new Date(endDate) };
    studentsQuery.enrollmentDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  try {
    // Εκτέλεση των queries για μαθήματα και μαθητές
    const classes = await Class.find(classesQuery);
    const students = await Student.find(studentsQuery);

    console.log('Classes found:', classes.length);
    console.log('Students found:', students.length);

    // Επιστροφή των στατιστικών για μαθήματα και μαθητές
    res.json({
      classes: {
        total: classes.length,
        data: classes
      },
      students: {
        total: students.length,
        data: students
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats', error });
  }
});

module.exports = router;
