import axios from 'axios';

const API_URL = 'http://localhost:5000/api/students/';

export const getStudents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createStudent = async (studentData) => {
  const response = await axios.post(API_URL, studentData);
  return response.data;
};

export const updateStudent = async (id, studentData) => {
  const response = await axios.put(`${API_URL}${id}`, studentData);
  return response.data;
};
