import axios from 'axios';

export const getStudents = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/students');
    return response.data;
  } catch (error) {
    console.error("Error fetching students: ", error);
    return [];
  }
};

export const createStudent = async (student) => {
  try {
    const response = await axios.post('http://localhost:5000/api/students', student);
    return response.data;
  } catch (error) {
    console.error("Error creating student: ", error);
    return null;
  }
};

export const updateStudent = async (id, student) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/students/${id}`, student);
    return response.data;
  } catch (error) {
    console.error("Error updating student: ", error);
    return null;
  }
};

export const addStudentPayment = async (id, amount) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/students/${id}/payment`, { amount });
    return response.data;
  } catch (error) {
    console.error("Error adding payment: ", error);
    return null;
  }
};
