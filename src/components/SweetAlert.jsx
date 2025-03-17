import Swal from 'sweetalert2';

const SweetAlert = {
  fire: (options) => {
    return Swal.fire(options);
  },

  confirm: async (title, text) => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
    });

    return result.isConfirmed;
  },

  success: (title, text) => {
    return Swal.fire({
      icon: 'success',
      title,
      text,
    });
  },

  error: (title, text) => {
    return Swal.fire({
      icon: 'error',
      title,
      text,
    });
  },

  info: (title, text) => {
    return Swal.fire({
      icon: 'info',
      title,
      text,
    });
  },

  warning: (title, text) => {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
    });
  },

  custom: async (options) => {
    const result = await Swal.fire(options);
    return result;
  },
};

export default SweetAlert;
