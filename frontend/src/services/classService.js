import axios from 'axios';
import { getCurrentUser } from './authService';

const API_URL = 'http://localhost:5000/api/classes/';

const getAuthHeaders = () => {
  const user = getCurrentUser();
  if (user && user.token) {
    return { headers: { Authorization: `Bearer ${user.token}` } };
  } else {
    return {};
  }
};

export const getClasses = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

export const createClass = async (classData) => {
  const response = await axios.post(API_URL, classData, getAuthHeaders());
  return response.data;
};

export const updateClass = async (id, classData) => {
  const response = await axios.put(`${API_URL}${id}`, classData, getAuthHeaders());
  return response.data;
};

export const deleteClass = async (id) => {
  const response = await axios.delete(`${API_URL}${id}`, getAuthHeaders());
  return response.data;
};
