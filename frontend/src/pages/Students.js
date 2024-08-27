import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from '../components/Modal';
import '../styles/Students.css';
import axios from 'axios';
import { getStudents, createStudent, updateStudent } from '../services/studentService';
import editIcon from '../images/edit.png';
import paymentIcon from '../images/credit-card.png';
import historyIcon from '../images/scroll.png';
import deleteIcon from '../images/deletebutton.png';
import previousIcon from '../images/arrow_double_left_icon.png';
import nextIcon from '../images/arrow_double_right_icon.png';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const totalPages = Math.ceil(students.length / studentsPerPage);
  const [currentPagePaymentHistory, setCurrentPagePaymentHistory] = useState(1);
  const paymentsPerPage = 5;
  const [isRemoveStudentModalOpen, setIsRemoveStudentModalOpen] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);
  

  const openRemoveStudentModal = (student) => {
    setStudentToRemove(student);
    setIsRemoveStudentModalOpen(true);
  };
  
  const closeRemoveStudentModal = () => {
    setIsRemoveStudentModalOpen(false);
    setStudentToRemove(null);
  };

  
  const handleRemoveStudent = async () => {
    if (!studentToRemove) return;
  
    try {
      await axios.delete(`${API_BASE_URL}students/${studentToRemove._id}`);
      setStudents(students.filter(student => student._id !== studentToRemove._id)); // Ενημέρωση της λίστας φοιτητών
      closeRemoveStudentModal();
    } catch (error) {
      console.error('Error deleting student:', error);
      // Μπορείς να προσθέσεις επιπλέον χειρισμό σφαλμάτων εδώ, αν χρειάζεται
    }
  };
  

  const paginatePaymentHistory = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPaymentsPages) {
      setCurrentPagePaymentHistory(pageNumber);
    }
  };

  const indexOfLastPayment = currentPagePaymentHistory * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;

  const currentPayments = currentStudent
    ? currentStudent.paymentHistory.slice(indexOfFirstPayment, indexOfLastPayment)
    : [];

  const totalPaymentsPages = currentStudent
    ? Math.ceil(currentStudent.paymentHistory.length / paymentsPerPage)
    : 0;

    const pageRangePaymentHistory = () => {
      const pages = [];
    
      // Έλεγχος για μία σελίδα
      if (totalPaymentsPages === 1) {
        pages.push(1);
        return pages;
      }
    
      // Έλεγχος για δύο σελίδες
      if (totalPaymentsPages === 2) {
        pages.push(1, 2);
        return pages;
      }
    
      if (currentPagePaymentHistory === 1) {
        pages.push(1, 2);
      } else if (currentPagePaymentHistory === 2) {
        pages.push(1, 2, 3);
      } else if (currentPagePaymentHistory > 2 && currentPagePaymentHistory < totalPaymentsPages) {
        pages.push(currentPagePaymentHistory - 1, currentPagePaymentHistory, currentPagePaymentHistory + 1);
      } else if (currentPagePaymentHistory === totalPaymentsPages) {
        pages.push(totalPaymentsPages - 1, totalPaymentsPages);
      }
    
      return pages;
    };
    

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
    setIsEditable(false);
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
      debt: parseFloat(currentStudent.debt),
    };


    await updateStudent(currentStudent._id, updatedStudent);
    

    loadStudents();
    closeEditModal();
  };

  const handleAddPayment = async () => {
    const updatedStudent = { ...currentStudent };
    const payment = parseFloat(paymentAmount);

    if (isNaN(payment) || payment <= 0) {
      alert('Παρακαλώ εισάγεται ένα έγκυρο ποσό πληρωμής');
      return;
    }

    updatedStudent.debt -= payment;
    updatedStudent.paid += payment;
    updatedStudent.paymentHistory = [
      ...currentStudent.paymentHistory,
      { amount: payment, date: new Date().toISOString() },
    ];

    await updateStudent(currentStudent._id, updatedStudent);
    loadStudents();
    closePaymentModal();
  };

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const pageRange = () => {
    const pages = [];
  
    // Έλεγχος για μία σελίδα
    if (totalPages === 1) {
      pages.push(1);
      return pages;
    }
  
    // Έλεγχος για δύο σελίδες
    if (totalPages === 2) {
      pages.push(1, 2);
      return pages;
    }
  
    pages.push(1);
  
    if (currentPage > 3) {
      pages.push('...');
    }
  
    if (currentPage === 1) {
      pages.push(2);
      pages.push('...');
    } else if (currentPage === totalPages) {
      if (totalPages > 2) {
        pages.push(totalPages - 1);
      }
    } else {
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
  
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
    }
  
    if (totalPages > 1) {
      pages.push(totalPages);
    }
  
    return pages;
  };
  

  return (
    <div className="students-container container-fluid">
      <div className="row">
        <main role="main" className="col-12 px-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="students-title">Φοιτητές</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <button
                type="button"
                id="open-student-modal-btn"
                className="btn btn-sm btn-outline-secondary hidden-button"
                onClick={openModal}
              >
                +Προσθήκη Φοιτητή
              </button>
            </div>
          </div>

          <div className="students-table-container table-responsive">
            <table className="students-table table table-striped table-sm">
              <thead>
                <tr>
                  <th>Όνομα</th>
                  <th>Επίθετο</th>
                  <th>Τηλέφωνο</th>
                  <th>Τμήμα</th>
                  <th>Email</th>
                  <th>Οφειλές</th>
                  <th>Ενέργειες</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((student, index) => (
                  <tr key={index}>
                    <td>{student.name}</td>
                    <td>{student.surname}</td>
                    <td>{student.tel}</td>
                    <td>{student.department}</td>
                    <td>{student.email}</td>
                    <td>{student.debt}</td>
                    <td>
                      <button className="btn btn-link" onClick={() => openEditModal(student)}>
                        <img src={editIcon} alt="Αλλαγή" className="edit-icon" />
                      </button>
                      <button className="btn btn-link" onClick={() => openPaymentModal(student)}>
                        <img src={paymentIcon} alt="Πληρωμή" className="payment-icon" />
                      </button>
                      <button className="btn btn-link" onClick={() => openPaymentHistoryModal(student)}>
                        <img src={historyIcon} alt="Ιστορικό" className="history-icon" />
                      </button>
                      <button className="btn btn-link" onClick={() => openRemoveStudentModal(student)}>
                        <img src={deleteIcon} alt="Διαγραφή" className="delete-icon" />
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          
          <nav>
            <ul className="pagination">
              <li className="page-item">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  className="previous-button"
                  disabled={currentPage === 1}
                >
                  <img src={previousIcon} alt="Previous" />
                </button>
              </li>
              {pageRange().map((page, index) => (
                <li
                  key={index}
                  className={`page-item ${currentPage === page ? 'active' : ''}`}
                >
                  {page === "..." ? (
                    <span className="page-link">...</span>
                  ) : (
                    <button onClick={() => paginate(page)} className="page-link">
                      {page}
                    </button>
                  )}
                </li>
              ))}
              <li className="page-item">
                <button
                  onClick={() => paginate(currentPage + 1)}
                  className="next-button"
                  disabled={currentPage === totalPages}
                >
                  <img src={nextIcon} alt="Next" />
                </button>
              </li>
            </ul>
          </nav>

          <Modal isOpen={modalIsOpen} onClose={closeModal}>
            <h2>Προσθήκη Φοιτητή</h2>
            <form>
              <div className="form-group">
                <label>Όνομα</label>
                <input type="text" className="form-control" name="name" value={newStudent.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Επίθετο</label>
                <input type="text" className="form-control" name="surname" value={newStudent.surname} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Τηλέφωνο</label>
                <input type="text" className="form-control" name="tel" value={newStudent.tel} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Τμήμα</label>
                <input type="text" className="form-control" name="department" value={newStudent.department} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" name="email" value={newStudent.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Οφειλές</label>
                <input type="number" className="form-control" name="debt" value={newStudent.debt} onChange={handleChange} />
              </div>
              <div className="modal-actions">
                <button type="button" className="add-student-button" onClick={handleAddStudent}>Προσθήκη</button>
                <button type="button" className="cancel-button-students" onClick={closeModal}>Ακύρωση</button>
              </div>
            </form>
          </Modal>

          <Modal isOpen={editModalIsOpen} onClose={closeEditModal}>
            <div className="modal-header">
              <h2>Επεξεργασία Φοιτητή</h2>
              <button className="btn btn-link small-edit-button" onClick={toggleEdit}>
                <img src={editIcon} alt="Αλλαγή" className="edit-icon" />
              </button>

            </div>
            {currentStudent && (
              <form>
                <div className="form-group">
                  <label>Όνομα</label>
                  <input type="text" className="form-control" name="name" value={currentStudent.name} onChange={handleEditChange} readOnly={!isEditable} />
                </div>
                <div className="form-group">
                  <label>Επίθετο</label>
                  <input type="text" className="form-control" name="surname" value={currentStudent.surname} onChange={handleEditChange} readOnly={!isEditable} />
                </div>
                <div className="form-group">
                  <label>Τηλέφωνο</label>
                  <input type="text" className="form-control" name="tel" value={currentStudent.tel} onChange={handleEditChange} readOnly={!isEditable} />
                </div>
                <div className="form-group">
                  <label>Τμήμα</label>
                  <input type="text" className="form-control" name="department" value={currentStudent.department} onChange={handleEditChange} readOnly={!isEditable} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" name="email" value={currentStudent.email} onChange={handleEditChange} readOnly={!isEditable} />
                </div>
                <div className="form-group">
                  <label>Οφειλές</label>
                  <input type="number" className="form-control" name="debt" value={currentStudent.debt} onChange={handleEditChange} readOnly={!isEditable} />
                </div>
                {isEditable && (
                  <div className="modal-actions">
                    <button type="button" className="edit-student-button" onClick={handleEditStudent}>Αποθήκευση</button>
                    <button type="button" className="cancel-button-students" onClick={closeEditModal}>Ακύρωση</button>
                  </div>
                )}
              </form>
            )}
          </Modal>


          <Modal isOpen={paymentModalIsOpen} onClose={closePaymentModal}>
            <h2>Προσθήκη Πλήρωμής</h2>
            <div className="form-group">
              <label className="payment-modal-label">Ποσό Πληρωμής</label>
              <input type="number" className="form-control" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button type="button" className="payment-student-button" onClick={handleAddPayment}>Υποβολή</button>
              <button type="button" className="cancel-button-students" onClick={closePaymentModal}>Ακύρωση</button>
            </div>
          </Modal>

        
          <Modal isOpen={paymentHistoryModalIsOpen} onClose={closePaymentHistoryModal}>
            <div>
              <h2>Ιστορικό πληρωμών</h2>
              {currentStudent && currentStudent.paymentHistory.length === 0 ? (
                <p className="no-payment-history">Δεν υπάρχει ιστορικό πληρωμών.</p>
              ) : (
                <>
                  <ul className="payment-history-list">
                    {currentPayments.map((payment, index) => (
                      <li key={index}>
                        Ποσό: {payment.amount}, Ημερομηνία: {new Date(payment.date).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                  {totalPaymentsPages > 1 && (
                    <nav>
                      <ul className="pagination">
                        <li className="page-item">
                          <button
                            onClick={() => paginatePaymentHistory(currentPagePaymentHistory - 1)}
                            className="previous-button"
                            disabled={currentPagePaymentHistory === 1}
                          >
                            <img src={previousIcon} alt="Previous" />
                          </button>
                        </li>
                        {pageRangePaymentHistory().map((page, index) => (
                          <li
                            key={index}
                            className={`page-item ${currentPagePaymentHistory === page ? 'active' : ''}`}
                          >
                            {page === "..." ? (
                              <span className="page-link">...</span>
                            ) : (
                              <button onClick={() => paginatePaymentHistory(page)} className="page-link">
                                {page}
                              </button>
                            )}
                          </li>
                        ))}
                        <li className="page-item">
                          <button
                            onClick={() => paginatePaymentHistory(currentPagePaymentHistory + 1)}
                            className="next-button"
                            disabled={currentPagePaymentHistory === totalPaymentsPages}
                          >
                            <img src={nextIcon} alt="Next" />
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </>
              )}
              <div className="modal-actions">
                <button type="button" className="cancel-button-students" onClick={closePaymentHistoryModal}>Close</button>
              </div>
            </div>
          </Modal>

      {isRemoveStudentModalOpen && (
        <Modal isOpen={isRemoveStudentModalOpen} onClose={closeRemoveStudentModal}>
          <h2>Επιβεβαίωση διαγραφής</h2>
          <p>Είσαι σίγουρος ότι θες να διαγράψεις τον φοιτητή "{studentToRemove?.name}"?</p>
          <div className="button-group">
            <button className="btn btn-primary confirm-delete-button" onClick={handleRemoveStudent}>Διαγραφή</button>
            <button className="btn btn-secondary btn-cancel" onClick={closeRemoveStudentModal}>Ακύρωση</button>
          </div>
        </Modal>
      )}



        </main>
      </div>
    </div>
  );
};

export default Students;
