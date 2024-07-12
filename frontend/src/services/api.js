import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000'
});

export const getClasses = async () => {
  const response = await api.get('/classes');
  return response.data;
};

export const createClass = async (classData) => {
  const response = await api.post('/classes', classData);
  return response.data;
};
