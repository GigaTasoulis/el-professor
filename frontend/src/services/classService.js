import axios from 'axios';
import { getCurrentUser } from './authService';

// Use the base URL from the environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeaders = () => {
  const user = getCurrentUser();
  if (user && user.token) {
    return { headers: { Authorization: `Bearer ${user.token}` } };
  } else {
    return {};
  }
};

export const getClasses = async () => {
  const response = await axios.get(`${API_BASE_URL}classes/`, getAuthHeaders());
  return response.data;
};

export const createClass = async (classData) => {
  const response = await axios.post(`${API_BASE_URL}classes/`, classData, getAuthHeaders());
  return response.data;
};

export const updateClass = async (id, classData) => {
  const response = await axios.put(`${API_BASE_URL}classes/${id}`, classData, getAuthHeaders());
  return response.data;
};

export const deleteClass = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}classes/${id}`, getAuthHeaders());
  return response.data;
};
