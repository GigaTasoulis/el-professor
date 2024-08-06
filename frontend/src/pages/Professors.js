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
    <div className="container-fluid">
      <div className="row">
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Professors</h1>
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
                  <th>Email</th>
                  <th>AFM</th>
                  <th>Actions</th>
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
                          Save
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-link"
                          onClick={() => setEditingIndex(index)}
                        >
                          <img src={editIcon} alt="Edit" className="icon" />
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
              +Add Professor
            </button>
          </div>

          <ReactModal isOpen={modalIsOpen} onRequestClose={closeModal} ariaHideApp={false}>
            <h2>Add New Professor</h2>
            <form>
              <div className="form-group">
                <label>Name</label>
                <input type="text" className="form-control" name="name" value={newProfessor.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Surname</label>
                <input type="text" className="form-control" name="surname" value={newProfessor.surname} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Tel</label>
                <input type="text" className="form-control" name="tel" value={newProfessor.tel} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" name="email" value={newProfessor.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>AFM</label>
                <input type="text" className="form-control" name="afm" value={newProfessor.afm} onChange={handleChange} />
              </div>
              <button type="button" className="btn btn-primary" onClick={handleAddProfessor}>Add Professor</button>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
            </form>
          </ReactModal>
        </main>
      </div>
    </div>
  );
};

export default Professors;
