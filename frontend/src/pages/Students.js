import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from '../components/Modal';
import '../styles/Students.css';
import { getStudents, createStudent, updateStudent } from '../services/studentService';
import editIcon from '../images/edit.png';
import paymentIcon from '../images/credit-card.png';
import historyIcon from '../images/scroll.png';

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
    const updatedStudent = {
      ...currentStudent,
      debt: parseFloat(currentStudent.debt)
    };
  
    console.log('Updated student before sending:', updatedStudent);  // Debugging log
  
    const response = await updateStudent(currentStudent._id, updatedStudent);
    console.log('Backend response:', response);  // Debugging log
  
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
              <button
                type="button"
                id="open-student-modal-btn"
                className="btn btn-sm btn-outline-secondary hidden-button"
                onClick={openModal}
              >
                +Add Student
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
                        <img src={editIcon} alt="Edit" className="icon" />
                      </button>
                      <button className="btn btn-link" onClick={() => openPaymentModal(student)}>
                        <img src={paymentIcon} alt="Payment" className="icon" />
                      </button>
                      <button className="btn btn-link" onClick={() => openPaymentHistoryModal(student)}>
                        <img src={historyIcon} alt="History" className="icon" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Modal isOpen={modalIsOpen} onClose={closeModal}>
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
          </Modal>


          <Modal isOpen={editModalIsOpen} onClose={closeEditModal}>
            <div className="modal-header">
              <h2>Edit Student</h2>
              <button className="btn btn-link" onClick={toggleEdit}>
                <img src={editIcon} alt="Edit" className="icon" />
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
          </Modal>


          <Modal isOpen={paymentModalIsOpen} onClose={closePaymentModal}>
            <h2>Add Payment</h2>
            <div className="form-group">
              <label>Payment Amount</label>
              <input type="number" className="form-control" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
            </div>
            <button type="button" className="btn btn-primary" onClick={handleAddPayment}>Submit Payment</button>
            <button type="button" className="btn btn-secondary" onClick={closePaymentModal}>Cancel</button>
          </Modal>


          <Modal isOpen={paymentHistoryModalIsOpen} onClose={closePaymentHistoryModal}>
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
          </Modal>

        </main>
      </div>
    </div>
  );
};

export default Students;
