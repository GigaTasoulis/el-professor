import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/Modal'; 
import '../styles/ClassroomsPage.css';

const ClassroomsPage = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [currentLessonPage, setCurrentLessonPage] = useState(1);
  const [currentClassroomPage, setCurrentClassroomPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [newLesson, setNewLesson] = useState({ name: '', description: '' });
  const [newClassroom, setNewClassroom] = useState({ name: '', availability: true });
  const [error, setError] = useState('');
  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
  const [isRemoveLessonModalOpen, setIsRemoveLessonModalOpen] = useState(false);
  const [isAddClassroomModalOpen, setIsAddClassroomModalOpen] = useState(false);
  const [isRemoveClassroomModalOpen, setIsRemoveClassroomModalOpen] = useState(false);
  const [lessonToRemove, setLessonToRemove] = useState(null);
  const [classroomToRemove, setClassroomToRemove] = useState(null);

  useEffect(() => {
    fetchClassrooms();
    fetchLessons();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classrooms');
      setClassrooms(response.data);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      setError('Failed to fetch classrooms');
    }
  };

  const fetchLessons = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/lessons');
      setLessons(response.data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      setError('Failed to fetch lessons');
    }
  };

  const handleAddLesson = async () => {
    if (newLesson.name.trim() === '' || newLesson.description.trim() === '') {
      setError('Το μάθημα και η περιγραφή του δεν μπορούν να είναι κενά.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/lessons', newLesson);
      setLessons([...lessons, response.data]);
      setNewLesson({ name: '', description: '' }); 
      closeModal();
    } catch (error) {
      console.error('Error adding lesson:', error);
      setError('Failed to add lesson');
    }
  };

  const handleRemoveLesson = async () => {
    if (!lessonToRemove) return;

    try {
      await axios.delete(`http://localhost:5000/api/lessons/${lessonToRemove._id}`);
      setLessons(lessons.filter(lesson => lesson._id !== lessonToRemove._id));
      closeModal();
    } catch (error) {
      console.error('Error removing lesson:', error);
      setError('Failed to remove lesson');
    }
  };

  const handleAddClassroom = async () => {
    if (newClassroom.name.trim() === '') {
      setError('Το όνομα της αίθουσας δεν μπορεί να είναι κενό.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/classrooms', newClassroom);
      setClassrooms([...classrooms, response.data]);
      setNewClassroom({ name: '', availability: true }); 
      closeModal();
    } catch (error) {
      console.error('Error adding classroom:', error);
      setError('Failed to add classroom');
    }
  };

  const handleRemoveClassroom = async () => {
    if (!classroomToRemove) return;

    try {
      await axios.delete(`http://localhost:5000/api/classrooms/${classroomToRemove._id}`);
      setClassrooms(classrooms.filter(classroom => classroom._id !== classroomToRemove._id));
      closeModal();
    } catch (error) {
      console.error('Error removing classroom:', error);
      setError('Failed to remove classroom');
    }
  };

  const openAddLessonModal = () => {
    setError('');
    if (newLesson.name.trim() === '' || newLesson.description.trim() === '') {
      setError('Το μάθημα και η περιγραφή του δεν μπορούν να είναι κενά.');
      return;
    }
    setIsAddLessonModalOpen(true);
  };

  const openRemoveLessonModal = (lesson) => {
    setError('');
    setLessonToRemove(lesson);
    setIsRemoveLessonModalOpen(true);
  };

  const openAddClassroomModal = () => {
    setError(''); 
    if (newClassroom.name.trim() === '') {
      setError('Το όνομα της αίθουσας δεν μπορεί να είναι κενό.');
      return;
    }
    setIsAddClassroomModalOpen(true);
  };

  const openRemoveClassroomModal = (classroom) => {
    setError(''); 
    setClassroomToRemove(classroom);
    setIsRemoveClassroomModalOpen(true);
  };

  const closeModal = () => {
    setIsAddLessonModalOpen(false);
    setIsRemoveLessonModalOpen(false);
    setIsAddClassroomModalOpen(false);
    setIsRemoveClassroomModalOpen(false);
    setLessonToRemove(null);
    setClassroomToRemove(null);
  };

  const indexOfLastLesson = currentLessonPage * itemsPerPage;
  const indexOfFirstLesson = indexOfLastLesson - itemsPerPage;
  const currentLessons = lessons.slice(indexOfFirstLesson, indexOfLastLesson);

  const indexOfLastClassroom = currentClassroomPage * itemsPerPage;
  const indexOfFirstClassroom = indexOfLastClassroom - itemsPerPage;
  const currentClassrooms = classrooms.slice(indexOfFirstClassroom, indexOfLastClassroom);

  const paginateLessons = (pageNumber) => setCurrentLessonPage(pageNumber);

  const paginateClassrooms = (pageNumber) => setCurrentClassroomPage(pageNumber);

  return (
    <div className="classrooms-page">
      <h1>Αίθουσες & Μαθήματα</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="tables-container">
        <div className="table-container">
          <h2>Αίθουσες
          </h2>

          <div className="add-classroom-container">
            <input
              type="text"
              placeholder="Όνομα αίθουσας"
              value={newClassroom.name}
              onChange={(e) => setNewClassroom({ ...newClassroom, name: e.target.value })}
            />
            <button className="btn-add-classroom" onClick={openAddClassroomModal}>Προσθήκη</button>
          </div>

          <table className="classroom-table">
            <thead>
              <tr>
                <th>Όνομα Αίθουσας</th>
                <th>Διαθεσιμότητα</th>
                <th>Αλλαγές</th>
              </tr>
            </thead>
            <tbody>
              {currentClassrooms.map((classroom) => (
                <tr key={classroom._id}>
                  <td>{classroom.name}</td>
                  <td>{classroom.availability ? 'Available' : 'Unavailable'}</td>
                  <td>
                    <button onClick={() => openRemoveClassroomModal(classroom)}>Διαγραφή</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination for Classrooms */}
          <nav>
            <ul className="pagination">
              {Array.from({ length: Math.ceil(classrooms.length / itemsPerPage) }).map((_, i) => (
                <li key={i + 1} className={`page-item ${currentClassroomPage === i + 1 ? 'active' : ''}`}>
                  <button onClick={() => paginateClassrooms(i + 1)} className="page-link">
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="table-container">
          <h2>Μαθήματα</h2>

          <div className="add-lesson-container">
            <input
              type="text"
              placeholder="Όνομα Μαθήματος"
              value={newLesson.name}
              onChange={(e) => setNewLesson({ ...newLesson, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Περιγραφή"
              value={newLesson.description}
              onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
            />
            <button className="btn-add-lesson" onClick={openAddLessonModal}>Προσθήκη</button>
          </div>

          <table className="lesson-table">
            <thead>
              <tr>
                <th>Όνομα μαθήματος</th>
                <th>Περιγραφή</th>
                <th>Αλλαγές</th>
              </tr>
            </thead>
            <tbody>
              {currentLessons.map((lesson) => (
                <tr key={lesson._id}>
                  <td>{lesson.name}</td>
                  <td>{lesson.description}</td>
                  <td>
                    <button onClick={() => openRemoveLessonModal(lesson)}>Διαγραφή</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination for Lessons */}
          <nav>
            <ul className="pagination">
              {Array.from({ length: Math.ceil(lessons.length / itemsPerPage) }).map((_, i) => (
                <li key={i + 1} className={`page-item ${currentLessonPage === i + 1 ? 'active' : ''}`}>
                  <button onClick={() => paginateLessons(i + 1)} className="page-link">
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Modals */}
      {isAddLessonModalOpen && (
        <Modal isOpen={isAddLessonModalOpen} onClose={closeModal}>
          <h2>Επιβεβαίωση προσθήκης</h2>
          <p>Είσαι σίγουρος ότι θες να προσθέσεις το μάθημα "{newLesson.name}"?</p>
          <div className="button-group">
            <button className="btn btn-primary confirm-add-button" onClick={handleAddLesson}>Προσθήκη</button>
            <button className="btn btn-secondary" onClick={closeModal}>Ακύρωση</button>
          </div>
        </Modal>
      )}

      {isRemoveLessonModalOpen && (
        <Modal isOpen={isRemoveLessonModalOpen} onClose={closeModal}>
          <h2>Επιβεβαίωση διαγραφής</h2>
          <p>Είσαι σίγουρος ότι θες να αφαιρέσεις το μάθημα "{lessonToRemove?.name}"?</p>
          <div className="button-group">
            <button className="btn btn-primary confirm-delete-button" onClick={handleRemoveLesson}>Αφαίρεση</button>
            <button className="btn btn-secondary btn-cancel" onClick={closeModal}>Ακύρωση</button>
          </div>
        </Modal>
      )}

        {isAddClassroomModalOpen && (
          <Modal isOpen={isAddClassroomModalOpen} onClose={closeModal}>
            <h2>Επιβεβαίωση προσθήκης</h2>
            <p>Είσαι σίγουρος ότι θες να προσθέσεις την αίθουσα "{newClassroom.name}"?</p>
            <div className="button-group">
              <button className="btn btn-primary confirm-add-button" onClick={handleAddClassroom}>Προσθήκη</button>
              <button className="btn btn-secondary" onClick={closeModal}>Ακύρωση</button>
            </div>
          </Modal>
        )}

      {isRemoveClassroomModalOpen && (
        <Modal isOpen={isRemoveClassroomModalOpen} onClose={closeModal}>
          <h2>Επιβεβαίωση διαγραφής</h2>
          <p>Είσαι σίγουρος ότι θες να αφαιρέσεις την αίθουσα "{classroomToRemove?.name}"?</p>
          <div className="button-group">
            <button className="btn btn-primary confirm-delete-button" onClick={handleRemoveClassroom}>Αφαίρεση</button>
            <button className="btn btn-secondary btn-cancel" onClick={closeModal}>Ακύρωση</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ClassroomsPage;
