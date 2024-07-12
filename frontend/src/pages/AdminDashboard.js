// src/pages/AdminDashboard.js
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="container">
      <h1 className="my-4">Admin Dashboard</h1>
      <p>Welcome, {user && user.username}</p>
      {/* Add more admin-specific components here */}
    </div>
  );
};

export default AdminDashboard;
