import React, { useState } from 'react'
import { encrypt, IsRoleUser, messagePop, timezones, user_roles } from '../../utils/Common';
import FormDropdown from '../../components/FormDropdown';
import GetLocations from '../../hooks/Locations';
import { useFormik } from 'formik';
import { userEditValidationSchema } from '../../utils/validationSchemas';
import { useRequest } from '../../utils/Requests';
import { UPDATE_USER } from '../../utils/Endpoints';
import PopupModal from '../../components/PopupModal';

export default function EditUserProfile({id, close, data, refreshData, alertMessage}) {

   
    // OPEN CLOSE MODAL 
    const [open, setOpen] = useState(true);
    const [multiSelect, setMultiSelect] = useState(IsRoleUser(data?.role.toString()) ? false : true);
    const apiRequest = useRequest();


    const handleClose = () => {
        setOpen(false)
        close(false)
    }


    // FORM SUBMIT //
    const onSubmit = async (values, {resetForm}) => {
        const npassword = (values.password !== '') ? {password : values.password} : false;
        const userTimezone = timezones.find(timezone => timezone.value === values.timezone);
        const uUser = {
            id: id,
            email: encrypt(values.email),
            name: values.name,
            ...(npassword && npassword),
            contact: encrypt(values.contact),
            timezone: userTimezone.id,
            location: multiSelect ? values.location : [values.location],
            role: values.role,
        }

        const response = await apiRequest({url:UPDATE_USER, method:"POST", data: uUser});

        if(response){
            setOpen(false)
            close(false)
            refreshData(true);
            resetForm();
            messagePop(response);
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
            location: multiSelect ? data.location : data.location[0],
        },
        validationSchema: userEditValidationSchema,
        onSubmit          
    })

    // DROPDOWNS CHANGE //
    const dropDownChange = (e) => {
        const {name, value} = e.target;

        // MANAGE LOCATION SELECT TYPE //
        if(name === 'role'){
            const userRole = IsRoleUser(value)

            if(userRole)
                setMultiSelect(false);
            else
                setMultiSelect(true);
        }
        

        setFieldValue(name, value);
    }

    // LOCATION DROPDOWN CHANGE //
    const locationDownChange = (e) => {
        const options = e.target.options;
        const selectedValues = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedValues.push(options[i].value);
            }
        }
        setFieldValue('location', selectedValues);
    }

  return (
        <PopupModal title="Edit User" open={open} setOpen={handleClose} handleSubmit={handleSubmit}>
         <div className="col-sm-12" id="dis_list"> 
                <div className="form-group row">
                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">Username<span className='mandatory'>*</span></label>
                        <span className='mt-0 mb-3 fs-13 form-control length_count'>{values.username}</span>
                        
                    </div>
                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">Password<span className='mandatory'>*</span></label>
                        <input type="password" name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} id="password" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="***********"/>
                        {errors.password && touched.password && <p className='text-danger fs_11'>{errors.password}</p>}
                    </div>

                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">Name<span className='mandatory'>*</span></label>
                        <input type="text" name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} className="mt-0 fs-13 mb-3 form-control length_count" placeholder="Name"  />
                        {errors.name && touched.name && <p className='text-danger fs_11'>{errors.name}</p>}
                    </div>

                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">Email<span className='mandatory'>*</span></label>                        
                        <input type="email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} id="email" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Email"  />
                        {errors.email && touched.email && <p className='text-danger fs_11'>{errors.email}</p>}
                    </div>

                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">Contact<span className='mandatory'>*</span></label>
                        <input type="tel" name="contact" value={values.contact} onChange={handleChange} onBlur={handleBlur} id="contact" className="mt-0 mb-3 fs-13 form-control" placeholder="xxx-xxx-xxxx" />
                        {errors.contact && touched.contact && <p className='text-danger fs_11'>{errors.contact}</p>}
                    </div> 

                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">TimeZone<span className='mandatory'>*</span></label>
                        <FormDropdown onChange={dropDownChange} name="timezone" default_value={values.timezone} options={timezones} classnm="fs-13 mb-3 form-control length_count" />
                    </div>

                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">Role<span className='mandatory'>*</span></label>
                        <FormDropdown onChange={dropDownChange} name="role" default_value={values.role} options={user_roles} classnm="fs-13 mb-3 form-control length_count" />
                        {errors.role && touched.role && <p className='text-danger fs_11'>{errors.role}</p>}
                    </div>

                    <div className="col-sm-6">
                      <label className="fs-12 fw-semibold">Location<span className='mandatory'>*</span></label>
                      {locationloading ? 'Loading...' : locationdt && <FormDropdown multiselect={multiSelect} onChange={locationDownChange} name="location" default_value={values.location} options={locationdt.data} classnm="fs-13 mb-3 form-control length_count" />}
                    </div>
                </div>
            </div>
        </PopupModal>
  )
}
