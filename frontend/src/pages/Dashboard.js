import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Modal from '../components/Modal'; // Make sure the path is correct
import '../styles/Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = forwardRef((props, ref) => {
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentGoal, setStudentGoal] = useState(100);
  const [revenueGoal, setRevenueGoal] = useState(10000);
  const [hoursGoal, setHoursGoal] = useState(1000);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLessons();
    fetchStudents();
    fetchGoals();
  }, []);

  useImperativeHandle(ref, () => ({
    openGoalsModal: () => setModalIsOpen(true),
  }));

  const fetchLessons = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classes');
      setLessons(response.data);
    } catch (error) {
      console.error('Error fetching lessons: ', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students: ', error);
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/goals');
      const { studentGoal, revenueGoal, hoursGoal } = response.data;
      setStudentGoal(studentGoal);
      setRevenueGoal(revenueGoal);
      setHoursGoal(hoursGoal);
    } catch (error) {
      console.error('Error fetching goals: ', error);
    }
  };

  const saveGoals = async () => {
    try {
      await axios.put('http://localhost:5000/api/goals', {
        studentGoal,
        revenueGoal,
        hoursGoal
      });
    } catch (error) {
      console.error('Error saving goals: ', error);
    }
  };

  const calculateTotalHours = () => {
    return lessons.reduce((acc, lesson) => {
      const start = new Date(lesson.start);
      const end = new Date(lesson.end);
      const duration = (end - start) / (1000 * 60 * 60);
      return acc + duration;
    }, 0);
  };

  const calculateTotalDebt = () => {
    return students.reduce((acc, student) => acc + student.debt, 0);
  };

  const calculateTotalRevenue = () => {
    return students.reduce((acc, student) => acc + student.paid, 0);
  };

  const pieDataStudents = {
    labels: ['Σύνολο Μαθητών', 'Στόχος'],
    datasets: [
      {
        data: [students.length, studentGoal - students.length],
        backgroundColor: ['#FF6384', '#E0E0E0'],
        hoverBackgroundColor: ['#FF6384', '#E0E0E0']
      }
    ]
  };

  const pieDataRevenue = {
    labels: ['Σύνολο Εσόδων', 'Στόχος'],
    datasets: [
      {
        data: [calculateTotalRevenue(), revenueGoal - calculateTotalRevenue()],
        backgroundColor: ['#36A2EB', '#E0E0E0'],
        hoverBackgroundColor: ['#36A2EB', '#E0E0E0']
      }
    ]
  };

  const pieDataHours = {
    labels: ['Συνολικές Ώρες', 'Στόχος'],
    datasets: [
      {
        data: [calculateTotalHours(), hoursGoal - calculateTotalHours()],
        backgroundColor: ['#FFCE56', '#E0E0E0'],
        hoverBackgroundColor: ['#FFCE56', '#E0E0E0']
      }
    ]
  };

  const handleModalSubmit = () => {
    const currentStudents = students.length;
    const currentRevenue = calculateTotalRevenue();
    const currentHours = calculateTotalHours();

    if (studentGoal < currentStudents) {
      setError(`Students goal cannot be less than the current number of students (${currentStudents}).`);
      return;
    }
    if (revenueGoal < currentRevenue) {
      setError(`Revenue goal cannot be less than the current total revenue (${currentRevenue.toFixed(2)}).`);
      return;
    }
    if (hoursGoal < currentHours) {
      setError(`Hours goal cannot be less than the current total hours (${currentHours.toFixed(2)}).`);
      return;
    }

    saveGoals();
    setModalIsOpen(false);
  };

  return (
    <div className="dashboard">
      <h2>Αρχική</h2>
      <p>Γεια σου. Καλώς ήρθες στο ElProfessor!</p>
      <div className="cards">
        <div className="card">
          <h3>Σύνολο Μαθημάτων</h3>
          <p>{lessons.length}</p>
        </div>
        <div className="card">
          <h3>Σύνολο Ωρών</h3>
          <p>{calculateTotalHours().toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Σύνολο Μαθητών</h3>
          <p>{students.length}</p>
        </div>
        <div className="card">
          <h3>Χρέη</h3>
          <p>{calculateTotalDebt().toFixed(2)} €</p>
        </div>
        <div className="card">
          <h3>Έσοδα</h3>
          <p>{calculateTotalRevenue().toFixed(2)} €</p>
        </div>
      </div>
      <div className="charts">
        <div className="pie-charts-container">
          <div className="pie-chart">
            <h3>Στόχος Μαθητών</h3>
            <Doughnut data={pieDataStudents} />
          </div>
          <div className="pie-chart">
            <h3>Στόχος Εσόδων</h3>
            <Doughnut data={pieDataRevenue} />
          </div>
          <div className="pie-chart">
            <h3>Στόχος Ωρών</h3>
            <Doughnut data={pieDataHours} />
          </div>
        </div>
      </div>
      <Modal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        <h2>Όρισε Στόχους</h2>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label>Στόχος Μαθητών</label>
          <input type="number" className="form-control" value={studentGoal} onChange={(e) => setStudentGoal(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Στόχος Εσόδων</label>
          <input type="number" className="form-control" value={revenueGoal} onChange={(e) => setRevenueGoal(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Στόχος Ωρών</label>
          <input type="number" className="form-control" value={hoursGoal} onChange={(e) => setHoursGoal(Number(e.target.value))} />
        </div>
        <button className="btn btn-primary" onClick={handleModalSubmit}>Υποβολή</button>
        <button className="btn btn-secondary" onClick={() => setModalIsOpen(false)}>Ακύρωση</button>
      </Modal>
    </div>
  );
});

export default Dashboard;
