import { useState } from "react";
import PopupModal from "../../components/PopupModal"
import { useFormik } from "formik";
import { encrypt, messagePop } from '../../utils/Common';
import { UPDATEMANAGER } from "../../utils/Endpoints";
import SweetAlert from "../../components/SweetAlert";
import { useRequest } from "../../utils/Requests";
import { managerValidation } from "../../utils/validationSchemas";

export default function Edit({id, close, data, refreshData, alertMessage}) {  
    const [open, setOpen] = useState(true);
    const apiRequest = useRequest();

    const handleClose = () => {
        setOpen(false)
        close(false)
    }

    // // FORM SUBMIT //
    const onSubmit = async (values, {resetForm}) => {
        const uUser = {
            id: id,
            fname: values.fname,
            lname: values.lname,
            email: encrypt(values.email),
            contact: encrypt(values.contact),
            designation: values.designation,
        }

        const response = await apiRequest({url:UPDATEMANAGER, method:"POST", data: uUser});

        if(response){
            setOpen(false)
            close(false)
            refreshData(true);
            resetForm();
            messagePop(response);
        }else{
            SweetAlert.error("Error", "There is some issue while adding user.")
        }
    }

    const {values, touched, errors, handleBlur, handleChange, handleSubmit} = useFormik({
        initialValues: {
            fname: data.fname,
            lname: data.lname,
            email: data.email,
            contact: data.contact,
            designation: data.designation
        },
        validationSchema: managerValidation,
        onSubmit
    })


  return (
    <PopupModal open={open} setOpen={handleClose} handleSubmit={handleSubmit} size="md">
        <div className="col-sm-12" id="dis_list"> 
            <div className="form-group row">
                <div className="col-sm-12">
                    <label className="fs-12 fw-semibold">First Name<span className='mandatory'>*</span></label>
                    <input type="text"  value={values.fname} onChange={handleChange} onBlur={handleBlur} name="fname" className="mt-0 fs-13 mb-3 form-control length_count" placeholder="First Name"  />
                    {errors.fname && touched.fname && <p className='text-danger fs_11'>{errors.fname}</p>}
                </div>

                <div className="col-sm-12">
                    <label className="fs-12 fw-semibold">Last Name<span className='mandatory'>*</span></label>
                    <input type="text"name="lname"  value={values.lname} onChange={handleChange} onBlur={handleBlur} className="mt-0 fs-13 mb-3 form-control length_count" placeholder="Last Name"  />
                    {errors.lname && touched.lname && <p className='text-danger fs_11'>{errors.lname}</p>}
                </div>

                <div className="col-sm-12">
                    <label className="fs-12 fw-semibold">Email<span className='mandatory'>*</span></label>                        
                    <input  name="email" id="email" value={values.email} onChange={handleChange} onBlur={handleBlur} className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Email"  />
                    {errors.email && touched.email && <p className='text-danger fs_11'>{errors.email}</p>}
                </div>

                <div className="col-sm-12">
                    <label className="fs-12 fw-semibold">Contact<span className='mandatory'>*</span></label>
                    <input type="tel"name="contact" value={values.contact} onChange={handleChange} onBlur={handleBlur} id="contact" className="mt-0 mb-3 fs-13 form-control" placeholder="xxx-xxx-xxxx" />
                    {errors.contact && touched.contact && <p className='text-danger fs_11'>{errors.contact}</p>}
                </div> 

                <div className="col-sm-12">
                    <label className="fs-12 fw-semibold">Designation<span className='mandatory'>*</span></label>                        
                    <input type="text"  name="designation" id="designation" value={values.designation} onChange={handleChange} onBlur={handleBlur} className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Designation"  />
                    {errors.designation && touched.designation && <p className='text-danger fs_11'>{errors.designation}</p>}
                </div>
            </div>
        </div>
    </PopupModal>
  )
}