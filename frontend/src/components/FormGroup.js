import React from 'react';
import PropTypes from 'prop-types';
import '../styles/FormGroup.css'; // Assuming you have a separate CSS file for form group styles

const FormGroup = ({ label, children }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      {children}
    </div>
  );
};

FormGroup.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default FormGroup;
