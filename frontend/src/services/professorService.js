import axios from 'axios';

// Use the base URL from the environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getProfessors = async () => {
  const response = await axios.get(`${API_BASE_URL}professors/`);
  return response.data;
};

export const createProfessor = async (professorData) => {
  const response = await axios.post(`${API_BASE_URL}professors/`, professorData);
  return response.data;
};

export const updateProfessor = async (id, professorData) => {
  const response = await axios.put(`${API_BASE_URL}professors/${id}`, professorData);
  return response.data;
};
