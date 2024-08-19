import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactModal from 'react-modal';
import '../styles/Professors.css';
import { getProfessors, createProfessor, updateProfessor } from '../services/professorService';
import editIcon from '../images/edit.png';

const Professors = () => {
  const [professors, setProfessors] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newProfessor, setNewProfessor] = useState({ name: '', surname: '', tel: '', email: '', afm: '' });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    loadProfessors();
  }, []);

  const loadProfessors = async () => {
    const professors = await getProfessors();
    setProfessors(professors);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setNewProfessor({ name: '', surname: '', tel: '', email: '', afm: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProfessor({ ...newProfessor, [name]: value });
  };

  const handleAddProfessor = async () => {
    await createProfessor(newProfessor);
    loadProfessors();
    closeModal();
  };

  const handleEditChange = (e, index) => {
    const { name, value } = e.target;
    const updatedProfessors = [...professors];
    updatedProfessors[index] = { ...updatedProfessors[index], [name]: value };
    setProfessors(updatedProfessors);
  };

  const handleSaveChanges = async (id, index) => {
    await updateProfessor(id, professors[index]);
    setEditingIndex(null);
    loadProfessors();
  };

  return (
    <div className="professor-container container-fluid">
      <div className="row">
        <main role="main" className="col-12 px-4">
        <div className="d-flex justify-content-center align-items-center pt-3 pb-2 mb-3 border-bottom w-100">
          <h1 className="h2 w-100 text-center">Καθηγητές</h1>
        </div>


          <div className="table-responsive">
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th>Όνομα</th>
                  <th>Επίθετο</th>
                  <th>Τηλέφωνο</th>
                  <th>Email</th>
                  <th>ΑΦΜ</th>
                  <th>Αλλαγές</th>
                </tr>
              </thead>
              <tbody>
                {professors.map((professor, index) => (
                  <tr key={index}>
                    <td>
                      {editingIndex === index ? (
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={professor.name}
                          onChange={(e) => handleEditChange(e, index)}
                        />
                      ) : (
                        professor.name
                      )}
                    </td>
                    <td>
                      {editingIndex === index ? (
                        <input
                          type="text"
                          className="form-control"
                          name="surname"
                          value={professor.surname}
                          onChange={(e) => handleEditChange(e, index)}
                        />
                      ) : (
                        professor.surname
                      )}
                    </td>
                    <td>
                      {editingIndex === index ? (
                        <input
                          type="text"
                          className="form-control"
                          name="tel"
                          value={professor.tel}
                          onChange={(e) => handleEditChange(e, index)}
                        />
                      ) : (
                        professor.tel
                      )}
                    </td>
                    <td>
                      {editingIndex === index ? (
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={professor.email}
                          onChange={(e) => handleEditChange(e, index)}
                        />
                      ) : (
                        professor.email
                      )}
                    </td>
                    <td>
                      {editingIndex === index ? (
                        <input
                          type="text"
                          className="form-control"
                          name="afm"
                          value={professor.afm}
                          onChange={(e) => handleEditChange(e, index)}
                        />
                      ) : (
                        professor.afm
                      )}
                    </td>
                    <td>
                      {editingIndex === index ? (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleSaveChanges(professor._id, index)}
                        >
                          Αποθήκευση
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-link"
                          onClick={() => setEditingIndex(index)}
                        >
                          <img src={editIcon} alt="Αλλαγή" className="icon" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="add-professor">
            <button type="button" id="open-professor-modal-btn" className="btn btn-primary hidden-button" onClick={openModal}>
              +Προσθήκη Καθηγητή
            </button>
          </div>

          <ReactModal 
            isOpen={modalIsOpen} 
            onRequestClose={closeModal} 
            className="custom-modal"
            overlayClassName="custom-modal-overlay"
            ariaHideApp={false}
          >
            <h2>Προσθήκη Νέου Καθηγητή</h2>
            <form>
              <div className="form-group">
                <label>Όνομα</label>
                <input type="text" className="form-control" name="name" value={newProfessor.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Επίθετο</label>
                <input type="text" className="form-control" name="surname" value={newProfessor.surname} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Τηλέφωνο</label>
                <input type="text" className="form-control" name="tel" value={newProfessor.tel} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" name="email" value={newProfessor.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>ΑΦΜ</label>
                <input type="text" className="form-control" name="afm" value={newProfessor.afm} onChange={handleChange} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-add-professor" onClick={handleAddProfessor}>Προσθήκη Καθηγητή</button>
                <button type="button" className="btn-cancel" onClick={closeModal}>Ακύρωση</button>
              </div>
            </form>
          </ReactModal>

        </main>
      </div>
    </div>
  );
};

export default Professors;
