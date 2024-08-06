import axios from 'axios';

export const addPayment = async (studentId, amount) => {
  try {
    const response = await axios.post(`http://localhost:5000/api/students/${studentId}/payments`, { amount });
    return response.data;
  } catch (error) {
    console.error("Error adding payment: ", error);
    return null;
  }
};
