require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const classRoutes = require('./routes/classRoutes');
const studentRoutes = require('./routes/studentRoutes');
const professorRoutes = require('./routes/professorRoutes');
const goalRoutes = require('./routes/goalRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const lessonRoutes = require('./routes/lessonsRoutes');


const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/classes', classRoutes); 
app.use('/api/students', studentRoutes); 
app.use('/api/professors', professorRoutes); 
app.use('/api/goals', goalRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/lessons', lessonRoutes);



app.get('/', (req, res) => {
  res.send('El Professor Backend');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
