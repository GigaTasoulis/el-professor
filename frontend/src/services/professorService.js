import axios from 'axios';

const API_URL = 'http://localhost:5000/api/professors/';

export const getProfessors = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createProfessor = async (professorData) => {
  const response = await axios.post(API_URL, professorData);
  return response.data;
};

export const updateProfessor = async (id, professorData) => {
  const response = await axios.put(`${API_URL}${id}`, professorData);
  return response.data;
};
