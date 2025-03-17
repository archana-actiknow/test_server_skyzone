import { useState } from "react";
import PopupModal from "../../components/PopupModal"
import { useFormik } from "formik";
import { managerValidation } from "../../utils/validationSchemas";
import { encrypt, messagePop } from "../../utils/Common";
import { ADDMANAGER } from "../../utils/Endpoints";
import SweetAlert from "../../components/SweetAlert";
import { useRequest } from "../../utils/Requests";

function Add({refreshData, close,currentLocation}) {    
    const apiRequest = useRequest();

    // FORM SUBMIT //
    const onSubmit = async (values, { resetForm }) => {
        const nUser = {
            fname: values.fname,
            lname: values.lname,
            email: encrypt(values.email),
            contact: encrypt(values.contact),
            designation: values.designation,
            client_id:currentLocation
        }

      const response = await apiRequest({url:ADDMANAGER, method:"POST", data: nUser});
      if(response){
            messagePop(response);
            refreshData(true);
            resetForm();
            close();
            setOpen(false)
      }else{
            SweetAlert.error("Error", "There is some issue while adding user.")
      }
    }

    const {values, touched, errors, handleBlur, handleChange, handleSubmit} = useFormik({
        initialValues: {
            fname: "",
            lname: "",
            email: "",
            contact: "",
            designation: "Manager"
        },
        validationSchema: managerValidation,
        onSubmit
    })

    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false)
        close(false)
    }

  return (
    <PopupModal open={open} setOpen={handleClose} handleSubmit={handleSubmit} size="md">
        <div className="col-sm-12" id="dis_list"> 
            <div className="form-group row">
                <div className="col-sm-12">
                    <label className="fs-12 fw-semibold">First Name<span className='mandatory'>*</span></label>
                    <input type="text" value={values.fname} onBlur={handleBlur} onChange={handleChange} name="fname" className="mt-0 fs-13 mb-3 form-control length_count" placeholder="First Name"  />
                    {errors.fname && touched.fname && <p className='text-danger fs_11'>{errors.fname}</p>}
                </div>

                <div className="col-sm-12">
                    <label className="fs-12 fw-semibold">Last Name<span className='mandatory'>*</span></label>
                    <input type="text" value={values.lname} onBlur={handleBlur} onChange={handleChange} name="lname" className="mt-0 fs-13 mb-3 form-control length_count" placeholder="Last Name"  />
                    {errors.lname && touched.lname && <p className='text-danger fs_11'>{errors.lname}</p>}
                </div>

                <div className="col-sm-12">
                    <label className="fs-12 fw-semibold">Email<span className='mandatory'>*</span></label>                        
                    <input type="email" value={values.email} onBlur={handleBlur} onChange={handleChange} name="email" id="email" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Email"  />
                    {errors.email && touched.email && <p className='text-danger fs_11'>{errors.email}</p>}
                </div>

                <div className="col-sm-12">
                    <label className="fs-12 fw-semibold">Contact<span className='mandatory'>*</span></label>
                    <input type="tel" value={values.contact} onBlur={handleBlur} onChange={handleChange} name="contact" id="contact" className="mt-0 mb-3 fs-13 form-control" placeholder="xxx-xxx-xxxx" />
                    {errors.contact && touched.contact && <p className='text-danger fs_11'>{errors.contact}</p>}
                </div> 

                <div className="col-sm-12">
                    <label className="fs-12 fw-semibold">Designation<span className='mandatory'>*</span></label>                        
                    <input type="text" value={values.designation} onBlur={handleBlur} onChange={handleChange} name="designation" id="designation" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Designation"  />
                    {errors.designation && touched.designation && <p className='text-danger fs_11'>{errors.designation}</p>}
                </div>
            </div>
        </div>
    </PopupModal>
  )
}

export default Add