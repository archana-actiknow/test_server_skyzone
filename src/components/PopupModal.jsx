import { useState } from 'react';
import React from 'react'
import { Modal } from 'react-bootstrap';

export default function PopupModal({open, setOpen, title, handleSubmit, children, size = 'lg', footer = true,loading }) {
    const handleClose = () => setOpen(false);

  return (
    <Modal show={open} onHide={handleClose} size={size} aria-labelledby="modalLabel">
        <Modal.Header closeButton>
            <Modal.Title id="modalLabel">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {children}
        </Modal.Body>

        {footer &&
        <Modal.Footer>
            <button type="button" className="refreshbtn" onClick={handleClose}>Cancel</button>
            {/* <button type="button" className="ss_btn" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                    <div className='td-btn'>
                        <div className="spinner-border" role="status">
                            <span className="sr-only"></span>
                        </div> 
                    </div>
                ) : "Submit"}
            </button> */}
            <button type="button" className="ss_btn" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                    <div className="spinner-container">
                        <div className="spinner-border spinner-border-sm custom-spinner" role="status">
                            <span className="sr-only"></span>
                        </div>
                    </div>
                ) : "Submit"}
            </button>

            {/* <button type="button" className="ss_btn" onClick={handleSubmit}>Submit</button> */}
        </Modal.Footer>
        }
    </Modal>
  )
}
