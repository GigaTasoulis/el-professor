import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactModal from 'react-modal';
import '../styles/Students.css';
import { getStudents, createStudent, updateStudent } from '../services/studentService';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', surname: '', tel: '', department: '', email: '', debt: 0 });
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const students = await getStudents();
    setStudents(students);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setNewStudent({ name: '', surname: '', tel: '', department: '', email: '', debt: 0 });
  };

  const openEditModal = (student) => {
    setCurrentStudent(student);
    setIsEditable(false); // Initially set to read-only
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setCurrentStudent(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent({ ...currentStudent, [name]: value });
  };

  const handleAddStudent = async () => {
    await createStudent(newStudent);
    loadStudents();
    closeModal();
  };

  const handleEditStudent = async () => {
    await updateStudent(currentStudent._id, currentStudent);
    loadStudents();
    closeEditModal();
  };

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Students</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <button type="button" className="btn btn-sm btn-outline-secondary">
                <i className="fa fa-filter"></i> Filters
              </button>
            </div>
          </div>

          <div className="students-list">
            {students.map((student, index) => (
              <div key={index} className="student-item" onClick={() => openEditModal(student)}>
                <i className="fa fa-user-graduate"></i> {student.name} {student.surname} - Debt: ${student.debt}
              </div>
            ))}
          </div>
          
          <div className="add-student">
            <button type="button" id="open-student-modal-btn" className="btn btn-primary" onClick={openModal}>
              +Add Student
            </button>
            <p>Please, organize your students through the button below!</p>
          </div>

          <ReactModal isOpen={modalIsOpen} onRequestClose={closeModal} ariaHideApp={false}>
            <h2>Add New Student</h2>
            <form>
              <div className="form-group">
                <label>Name</label>
                <input type="text" className="form-control" name="name" value={newStudent.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Surname</label>
                <input type="text" className="form-control" name="surname" value={newStudent.surname} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Tel</label>
                <input type="text" className="form-control" name="tel" value={newStudent.tel} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input type="text" className="form-control" name="department" value={newStudent.department} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" name="email" value={newStudent.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Debt</label>
                <input type="number" className="form-control" name="debt" value={newStudent.debt} onChange={handleChange} />
              </div>
              <button type="button" className="btn btn-primary" onClick={handleAddStudent}>Add Student</button>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
            </form>
          </ReactModal>

          <ReactModal isOpen={editModalIsOpen} onRequestClose={closeEditModal} ariaHideApp={false}>
            <div className="modal-header">
              <h2>Edit Student</h2>
              <button className="btn btn-link" onClick={toggleEdit}>
                <svg width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                  <path d="M12.146.854a.5.5 0 011.708.708l-10 10a.5.5 0 01-.168.11l-4 1a.5.5 0 01-.637-.637l1-4a.5.5 0 01.11-.168l10-10zm.854 1.708L12.354 1.5 3.5 10.354V11h.646L14 1.5l.854-.854-1-1zM11.5 3.5L10 2l-.5.5 1.5 1.5.5-.5zM1 13.5V15h1.5l4-4H5l-4 4z"/>
                </svg>
              </button>
            </div>
            {currentStudent && (
              <form>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" className="form-control" name="name" value={currentStudent.name} onChange={handleEditChange} readOnly={!isEditable} />
                </div>
                <div className="form-group">
                  <label>Surname</label>
                  <input type="text" className="form-control" name="surname" value={currentStudent.surname} onChange={handleEditChange} readOnly={!isEditable} />
                </div>
                <div className="form-group">
                  <label>Tel</label>
                  <input type="text" className="form-control" name="tel" value={currentStudent.tel} onChange={handleEditChange} readOnly={!isEditable} />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input type="text" className="form-control" name="department" value={currentStudent.department} onChange={handleEditChange} readOnly={!isEditable} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" name="email" value={currentStudent.email} onChange={handleEditChange} readOnly={!isEditable} />
                </div>
                <div className="form-group">
                  <label>Debt</label>
                  <input type="number" className="form-control" name="debt" value={currentStudent.debt} onChange={handleEditChange} readOnly={!isEditable} />
                </div>
                {isEditable && (
                  <button type="button" className="btn btn-primary" onClick={handleEditStudent}>Save Changes</button>
                )}
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
              </form>
            )}
          </ReactModal>
        </main>
      </div>
    </div>
  );
};

export default Students;
