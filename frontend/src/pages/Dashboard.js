import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../styles/Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchLessons();
    fetchStudents();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classes');
      setLessons(response.data);
    } catch (error) {
      console.error("Error fetching lessons: ", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students: ", error);
    }
  };

  const calculateTotalHours = () => {
    return lessons.reduce((acc, lesson) => {
      const start = new Date(lesson.start);
      const end = new Date(lesson.end);
      const duration = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
      return acc + duration;
    }, 0);
  };

  const studentsGoal = 100;
  const revenueGoal = 10000;
  const hoursGoal = 1000;

  const pieDataStudents = {
    labels: ['Total Students', 'Goal'],
    datasets: [
      {
        data: [students.length, studentsGoal - students.length],
        backgroundColor: ['#FF6384', '#E0E0E0'],
        hoverBackgroundColor: ['#FF6384', '#E0E0E0']
      }
    ]
  };

  const pieDataRevenue = {
    labels: ['Total Revenue', 'Goal'],
    datasets: [
      {
        data: [0, revenueGoal], // No revenue calculation for now
        backgroundColor: ['#36A2EB', '#E0E0E0'],
        hoverBackgroundColor: ['#36A2EB', '#E0E0E0']
      }
    ]
  };

  const pieDataHours = {
    labels: ['Total Hours', 'Goal'],
    datasets: [
      {
        data: [calculateTotalHours(), hoursGoal - calculateTotalHours()],
        backgroundColor: ['#FFCE56', '#E0E0E0'],
        hoverBackgroundColor: ['#FFCE56', '#E0E0E0']
      }
    ]
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>Hi, Admin. Welcome back to ElProfessor!</p>
      <div className="cards">
        <div className="card">
          <h3>Total Lessons</h3>
          <p>{lessons.length}</p>
        </div>
        <div className="card">
          <h3>Total Hours</h3>
          <p>{calculateTotalHours().toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Total Students</h3>
          <p>{students.length}</p>
        </div>
      </div>
      <div className="charts">
        <div className="pie-charts-container">
          <div className="pie-chart">
            <h3>Students Goal</h3>
            <Doughnut data={pieDataStudents} />
          </div>
          <div className="pie-chart">
            <h3>Revenue Goal</h3>
            <Doughnut data={pieDataRevenue} />
          </div>
          <div className="pie-chart">
            <h3>Hours Goal</h3>
            <Doughnut data={pieDataHours} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
