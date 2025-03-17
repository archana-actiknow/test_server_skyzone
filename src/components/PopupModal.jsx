import React from 'react'
import { Modal } from 'react-bootstrap';

export default function PopupModal({open, setOpen, title, handleSubmit, children, size = 'lg', footer = true}) {

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
            <button type="button" className="ss_btn" onClick={handleSubmit}>Submit</button>
        </Modal.Footer>
        }
    </Modal>
  )
}
