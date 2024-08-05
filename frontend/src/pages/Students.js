import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactModal from 'react-modal';
import '../styles/Students.css';
import { getStudents, createStudent, updateStudent } from '../services/studentService';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [paymentModalIsOpen, setPaymentModalIsOpen] = useState(false);
  const [paymentHistoryModalIsOpen, setPaymentHistoryModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', surname: '', tel: '', department: '', email: '', debt: 0, paid: 0 });
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');

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
    setNewStudent({ name: '', surname: '', tel: '', department: '', email: '', debt: 0, paid: 0 });
  };

  const openPaymentModal = (student) => {
    setCurrentStudent(student);
    setPaymentModalIsOpen(true);
  };

  const closePaymentModal = () => {
    setPaymentModalIsOpen(false);
    setPaymentAmount('');
  };

  const openPaymentHistoryModal = (student) => {
    setCurrentStudent(student);
    setPaymentHistoryModalIsOpen(true);
  };

  const closePaymentHistoryModal = () => {
    setPaymentHistoryModalIsOpen(false);
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

  const handleAddPayment = async () => {
    const updatedStudent = { ...currentStudent };
    const payment = parseFloat(paymentAmount);

    if (isNaN(payment) || payment <= 0) {
      alert("Please enter a valid payment amount");
      return;
    }

    updatedStudent.debt -= payment;
    updatedStudent.paid += payment;
    updatedStudent.paymentHistory = [
      ...currentStudent.paymentHistory,
      { amount: payment, date: new Date().toISOString() }
    ];

    await updateStudent(currentStudent._id, updatedStudent);
    loadStudents();
    closePaymentModal();
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

          <div className="table-responsive">
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>Tel</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Debt</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index}>
                    <td>{student.name}</td>
                    <td>{student.surname}</td>
                    <td>{student.tel}</td>
                    <td>{student.department}</td>
                    <td>{student.email}</td>
                    <td>{student.debt}</td>
                    <td>
                      <button className="btn btn-link" onClick={() => openEditModal(student)}>
                        <svg width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                          <path d="M12.146.854a.5.5 0 011.708.708l-10 10a.5.5 0 01-.168.11l-4 1a.5.5 0 01-.637-.637l1-4a.5.5 0 01.11-.168l10-10zm.854 1.708L12.354 1.5 3.5 10.354V11h.646L14 1.5l.854-.854-1-1zM11.5 3.5L10 2l-.5.5 1.5 1.5.5-.5zM1 13.5V15h1.5l4-4H5l-4 4z" />
                        </svg>
                      </button>
                      <button className="btn btn-link" onClick={() => openPaymentModal(student)}>
                        <svg width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm3 7a.5.5 0 0 1-.5.5H8.5v2.5a.5.5 0 0 1-1 0V8.5H5a.5.5 0 0 1 0-1h2.5V5a.5.5 0 0 1 1 0v2.5h2.5A.5.5 0 0 1 11 8z" />
                        </svg>
                      </button>
                      <button className="btn btn-link" onClick={() => openPaymentHistoryModal(student)}>
                        <svg width="16" height="16" fill="currentColor" className="bi bi-clock-history" viewBox="0 0 16 16">
                          <path d="M8.515 3h-.03a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 1 0v2a.5.5 0 0 1-.47.5zm2.02.035a.5.5 0 0 1-.485-.637 5.5 5.5 0 0 0-9.87 0 .5.5 0 1 1-.97-.247 6.5 6.5 0 1 1 11.745 0 .5.5 0 0 1-.485.637h-.03zm-1.07 7.217c.262-.262.495-.581.678-.937h.003a.5.5 0 1 1 .886.464 5.474 5.474 0 0 1-.852 1.182 5.5 5.5 0 1 1-7.694 0 .5.5 0 1 1 .886-.464 5.474 5.474 0 0 1 .852-1.182zm.35-5.096a.5.5 0 0 1 .352.145l1.5 1.5a.5.5 0 0 1-.707.707L9.5 6.207V10.5a.5.5 0 0 1-1 0V6.5a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 .5.5v2.5a.5.5 0 0 1-1 0V6.707L7.854 8.854a.5.5 0 0 1-.708-.707l1.5-1.5a.5.5 0 0 1 .352-.145z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  <path d="M12.146.854a.5.5 0 011.708.708l-10 10a.5.5 0 01-.168.11l-4 1a.5.5 0 01-.637-.637l1-4a.5.5 0 01.11-.168l10-10zm.854 1.708L12.354 1.5 3.5 10.354V11h.646L14 1.5l.854-.854-1-1zM11.5 3.5L10 2l-.5.5 1.5 1.5.5-.5zM1 13.5V15h1.5l4-4H5l-4 4z" />
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
                <div className="form-group">
                  <label>Paid</label>
                  <input type="number" className="form-control" name="paid" value={currentStudent.paid} onChange={handleEditChange} readOnly={!isEditable} />
                </div>
                {isEditable && (
                  <button type="button" className="btn btn-primary" onClick={handleEditStudent}>Save Changes</button>
                )}
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
              </form>
            )}
          </ReactModal>

          <ReactModal isOpen={paymentModalIsOpen} onRequestClose={closePaymentModal} ariaHideApp={false}>
            <h2>Add Payment</h2>
            <div className="form-group">
              <label>Payment Amount</label>
              <input type="number" className="form-control" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
            </div>
            <button type="button" className="btn btn-primary" onClick={handleAddPayment}>Submit Payment</button>
            <button type="button" className="btn btn-secondary" onClick={closePaymentModal}>Cancel</button>
          </ReactModal>

          <ReactModal isOpen={paymentHistoryModalIsOpen} onRequestClose={closePaymentHistoryModal} ariaHideApp={false}>
            <h2>Payment History</h2>
            {currentStudent && (
              <ul>
                {currentStudent.paymentHistory.map((payment, index) => (
                  <li key={index}>
                    Amount: {payment.amount}, Date: {new Date(payment.date).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
            <button type="button" className="btn btn-secondary" onClick={closePaymentHistoryModal}>Close</button>
          </ReactModal>
        </main>
      </div>
    </div>
  );
};

export default Students;
