// import Swal from 'sweetalert2';

// const SweetAlert = {
//   fire: (options) => {
//     return Swal.fire(options);
//   },

//   confirm: async (title, text) => {
//     const result = await Swal.fire({
//       title,
//       text,
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonText: 'OK',
//       cancelButtonText: 'Cancel',
//     });

//     return result.isConfirmed;
//   },

//   success: (title, text) => {
//     return Swal.fire({
//       icon: 'success',
//       title,
//       text,
//     });
//   },

//   error: (title, text) => {
//     return Swal.fire({
//       icon: 'error',
//       title,
//       text,
//     });
//   },

//   info: (title, text) => {
//     return Swal.fire({
//       icon: 'info',
//       title,
//       text,
//     });
//   },

//   warning: (title, text) => {
//     return Swal.fire({
//       icon: 'warning',
//       title,
//       text,
//     });
//   },

//   custom: async (options) => {
//     const result = await Swal.fire(options);
//     return result;
//   },
// };

// export default SweetAlert;

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const SweetAlert = {
  fire: (options) => {
    return new Promise((resolve) => {
      confirmAlert({
        // title: <span><i className="bi bi-check-circle-fill text-success me-2"></i> {options.title}</span>,
        title: options.title || '',
        message: options.text || '',
        buttons: [
          {
            label: options.confirmButtonText || 'OK',
            onClick: () => resolve(true),
            className:'swal2-confirm'
          },
          {
            label: options.cancelButtonText || 'Cancel',
            onClick: () => resolve(false),
            className:'swal2-cancel'
          }
        ]
      });
    });
  },

  confirm: async (title, text) => {
    return new Promise((resolve) => {
      confirmAlert({
        // title: <span><i className="bi bi-check-circle-fill text-success me-2"></i> {title}</span>,
        title,
        message: text,
        buttons: [
          {
            label: 'OK',
            onClick: () => resolve(true),
            className:'swal2-confirm'
          },
          {
            label: 'Cancel',
            onClick: () => resolve(false),
            className:'swal2-cancel'
          }
        ]
      });
    });
  },

  success: (title, text) => {
    confirmAlert({
      // title: <span><i className="bi bi-check-circle-fill text-success me-2"></i> {title}</span>,
      title: title,
      message: text,
      buttons: [
        {
          label: 'OK',
          onClick: () => {},
          className:'swal2-confirm'
        }
      ]
    });
  },

  error: (title, text) => {
    confirmAlert({
      // title: <span><i className="bi bi-check-circle-fill text-success me-2"></i> {title}</span>,
      title: title,
      message: text,
      buttons: [
        {
          label: 'OK',
          onClick: () => {},
          className:'swal2-confirm'
        }
      ]
    });
  },

  info: (title, text) => {
    confirmAlert({
      // title: <span><i className="bi bi-check-circle-fill text-success me-2"></i> {title}</span>,
      title: title,
      message: text,
      buttons: [
        {
          label: 'OK',
          onClick: () => {},
          className:'swal2-confirm'
        }
      ]
    });
  },

  warning: (title, text) => {
    confirmAlert({
      // title: <span><i className="bi bi-check-circle-fill text-success me-2"></i> {title}</span>,
      title: title,
      message: text,
      buttons: [
        {
          label: 'OK',
          onClick: () => {},
          className:'swal2-confirm'
        }
      ]
    });
  },

  custom: async (options) => {
    return new Promise((resolve) => {
      confirmAlert({
        title: options.title || '',
        message: options.text || '',
        buttons: options.buttons || [
          {
            label: 'OK',
            onClick: () => resolve(true),
            className:'swal2-confirm'
          }
        ]
      });
    });
  }
};

export default SweetAlert;

