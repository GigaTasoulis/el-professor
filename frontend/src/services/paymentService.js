import axios from 'axios';

// Use the base URL from the environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const addPayment = async (studentId, amount) => {
  try {
    const response = await axios.post(`${API_BASE_URL}students/${studentId}/payments`, { amount });
    return response.data;
  } catch (error) {
    console.error("Error adding payment: ", error);
    return null;
  }
};
