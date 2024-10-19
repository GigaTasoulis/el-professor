const bcrypt = require('bcryptjs');

const hashPassword = async (plaintextPassword) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plaintextPassword, salt);
    console.log('Hashed Password:', hashedPassword);
  } catch (error) {
    console.error('Error hashing password:', error);
  }
};

// Replace 'your_plaintext_password' with the actual password you want to hash
hashPassword('professor123');
