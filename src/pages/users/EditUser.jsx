import React, { useEffect, useRef } from 'react'
import Popup from '../../components/Popup'
import { encrypt, timezones, user_roles } from '../../utils/Common';
import FormDropdown from '../../components/FormDropdown';
import GetLocations from '../../hooks/Locations';
import { useFormik } from 'formik';
import { userEditValidationSchema } from '../../utils/validationSchemas';
import { useRequest } from '../../utils/Requests';
import { UPDATE_USER } from '../../utils/Endpoints';
import SweetAlert from '../../components/SweetAlert';

export default function EditUser({id, close, data, refreshData, alertMessage}) {
    
    // OPEN CLOSE MODAL 
    const openModal = useRef(false);
    const closeModal = useRef(null);
    const apiRequest = useRequest();

    // COMPONENT ON MOUNT //
    useEffect(()=>{
        openModal.current.click();
    }, []);

    // FORM SUBMIT //
    const onSubmit = async (values, {resetForm}) => {
        const npassword = (values.password !== '') ? {password : values.password} : false;
        const uUser = {
            id: id,
            email: encrypt(values.email),
            name: values.name,
            ...(npassword && npassword),
            contact: encrypt(values.contact),
            timezone: values.timezone,
            location: values.location,
            role: values.role,
        }

        const response = await apiRequest({url:UPDATE_USER, method:"POST", data: uUser});

        if(response){
            SweetAlert.success('Success!', 'User updated successfully.')
            closeModal.current.click();
            
            refreshData(true);
            resetForm();
        }
    }

    // FETCH LOCATION
    const {data:locationdt, loading:locationloading} = GetLocations();

    // FORM VALIDATION
    const {values, errors, touched, handleSubmit, setFieldValue, handleBlur, handleChange} = useFormik({
        initialValues:{
            username:data.username,
            password:"",
            name:data.name,
            email:data.email,
            contact:data.contact,
            role:data.role,
            timezone:data.timezone,
            location:data.location,
        },
        validationSchema: userEditValidationSchema,
        onSubmit          
    })

    // DROPDOWNS CHANGE //
    const dropDownChange = (e) => {
        const {name, value} = e.target;
        setFieldValue(name, value);
      }

  return (
    <Popup popup_id={`edit-${id}`} closeRef={closeModal} openRef={openModal} closeEdit={close} title="Edit User" handleSubmit={handleSubmit}>
         <div className="col-sm-12" id="dis_list"> 
                <div className="form-group row">
                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">Username*</label>
                        <span className='mt-0 mb-3 fs-13 form-control length_count'>{values.username}</span>
                        
                    </div>
                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">Password*</label>
                        <input type="password" name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} id="password" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="***********"/>
                        {errors.password && touched.password && <p className='text-danger fs_11'>{errors.password}</p>}
                    </div>

                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">Name*</label>
                        <input type="text" name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} className="mt-0 fs-13 mb-3 form-control length_count" placeholder="Name"  />
                        {errors.name && touched.name && <p className='text-danger fs_11'>{errors.name}</p>}
                    </div>

                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">Email*</label>                        
                        <input type="email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} id="email" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Email"  />
                        {errors.email && touched.email && <p className='text-danger fs_11'>{errors.email}</p>}
                    </div>

                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">Contact*</label>
                        <input type="tel" name="contact" value={values.contact} onChange={handleChange} onBlur={handleBlur} id="contact" className="mt-0 mb-3 fs-13 form-control" placeholder="xxx-xxx-xxxx" />
                        {errors.contact && touched.contact && <p className='text-danger fs_11'>{errors.contact}</p>}
                    </div> 

                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">TimeZone</label>
                        <FormDropdown onChange={dropDownChange} name="timezone" default_value={values.timezone} options={timezones} classnm="fs-13 mb-3 form-control length_count" />
                    </div>

                    <div className="col-sm-6">
                      <label className="fs-12 fw-semibold">Location*</label>
                      {locationloading ? 'Loading...' : locationdt && <FormDropdown onChange={dropDownChange} name="location" default_value={values.location} options={locationdt.data} classnm="fs-13 mb-3 form-control length_count" />}
                    </div>

                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">Role*</label>
                        <FormDropdown onChange={dropDownChange} name="role" default_value={values.role} options={user_roles} classnm="fs-13 mb-3 form-control length_count" />
                        {errors.role && touched.role && <p className='text-danger fs_11'>{errors.role}</p>}
                    </div>  
                </div>
            </div>
    </Popup>
  )
}
