// ConfirmationModal.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
const ConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  return (
    <div className={`modal confirm-modal ${isOpen ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onCancel}></div>
      <div className="modal-content ">
        <div className="row">
            <div className='col-md-12'>
          <p>Are you sure you want to proceed?</p>
          <button className="btn btn-danger" onClick={onConfirm}>
            Confirm
          </button>
          <button className="btn btn-default" onClick={onCancel}>
            Cancel
          </button>
          </div>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onCancel}
      ></button>
    </div>
  );
};

export default ConfirmationModal;
