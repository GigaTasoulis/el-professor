import axios from 'axios';

// Use the base URL from the environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getStudents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}students`);
    return response.data;
  } catch (error) {
    console.error("Error fetching students: ", error);
    return [];
  }
};

export const createStudent = async (student) => {
  try {
    const response = await axios.post(`${API_BASE_URL}students`, student);
    return response.data;
  } catch (error) {
    console.error("Error creating student: ", error);
    return null;
  }
};

export const updateStudent = async (id, student) => {
  try {
    const response = await axios.put(`${API_BASE_URL}students/${id}`, student);
    return response.data;
  } catch (error) {
    console.error("Error updating student: ", error);
    return null;
  }
};

export const addStudentPayment = async (id, amount) => {
  try {
    const response = await axios.put(`${API_BASE_URL}students/${id}/payment`, { amount });
    return response.data;
  } catch (error) {
    console.error("Error adding payment: ", error);
    return null;
  }
};
