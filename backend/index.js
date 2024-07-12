require('dotenv').config(); // Ensure this is at the very top

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Add this line

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

console.log('MONGO_URI:', process.env.MONGO_URI); // Add this line to debug

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // Add this line

app.get('/', (req, res) => {
  res.send('El Professor Backend');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
