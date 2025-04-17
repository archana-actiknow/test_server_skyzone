import React, { useState } from 'react'
import { a_user_roles, encrypt, IsAdmin, IsRoleUser, messagePop, sa_user_roles, timezones } from '../../utils/Common';
import FormDropdown from '../../components/FormDropdown';
import {useFormik} from 'formik';
import { check_user_validation, userValidationSchema } from '../../utils/validationSchemas';
import { ADDUSER, CHECKUSER } from '../../utils/Endpoints';
import { PostAuthRequest, useRequest } from '../../utils/Requests';
import GetLocations from '../../hooks/Locations';
import SweetAlert from '../../components/SweetAlert';
import PopupModal from '../../components/PopupModal';

export default function AddUserProfile({refreshData, close}) {
    const apiRequest = useRequest();
    const [open, setOpen] = useState(true);
    const [ExUserError, setExUserError] = useState(false);
    const [ExUserErrorMsg, setExUserErrorMsg] = useState("");
    const [multiSelect, setMultiSelect] = useState(true);
    const user_roles = IsAdmin ? a_user_roles : sa_user_roles;

    const handleClose = () => {
        setOpen(false)
        close(false)
    }

    // FORM SUBMIT //
    const onSubmit = async (values, { resetForm }) => {
        // const userTimezone = timezones.find(timezone => timezone.value === values.timezone);

        const usrT = values.timezone;
        const userTimezone = (usrT !== '' && usrT !== 0 && usrT !== '0') ? timezones.find(timezone => timezone.id === usrT) : timezones[0];

        const nUser = {
            username: values.username,
            email: encrypt(values.email),
            name: values.name,
            password: values.password,
            contact: encrypt(values.contact),
            timezone: userTimezone.id,
            location: multiSelect ? values.location : [values.location],
            role: values.role,
        }

      const response = await apiRequest({url:ADDUSER, method:"POST", data: nUser});
      if(response){
            // SweetAlert.success('Success!', 'User created successfully.')
            messagePop(response);
            refreshData(true);
            resetForm();
            close();
      }else{
            SweetAlert.error("Error", "There is some issue while adding user.")
      }
    }

    // FETCH LOCATIONS
    const {data:locationdt, loading:locationloading} = GetLocations();

    // FORMIK VALIDATION //
    const {values, errors, touched, setFieldValue, handleBlur, handleChange, handleSubmit} = useFormik({
        initialValues: {
            username: "",
            password: "",
            name: "",
            email: "",
            contact: "",
            role: user_roles[0].value,
            timezone: timezones[0].id,
            location: (!locationloading && locationdt) ? locationdt.data[0].value : 1
        },
        enableReinitialize: true,
        validationSchema: userValidationSchema,
        onSubmit
    });

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

    // CHECK USER EXISTANCE //
    const checkUser = async (e) => {
        const username = e.target.value;
        setFieldValue('username', username)
        try {
            const response = await PostAuthRequest(CHECKUSER, "POST", { username: username });
            if(response?.data?.found){
                setExUserError(true);
                setExUserErrorMsg(response?.message);
            }else{
                const res = check_user_validation(username);

                if(res[0]){
                    setExUserError(false);
                    setExUserErrorMsg("");
                }else{
                    setExUserError(true);
                    setExUserErrorMsg(res[1]);
                }
                
            }
        } catch (error) {
            console.error('Error checking username availability', error);
        }
    }

    return (
        <PopupModal title="Add New User" open={open} setOpen={handleClose} handleSubmit={handleSubmit}>
            <div className="col-sm-12" id="dis_list"> 
                <div className="form-group row">
                    
                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">Username<span className='mandatory'>*</span></label>
                        <input type="text" value={values.username} onBlur={handleBlur} onChange={checkUser} name="username" id="username" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Username" />
                        {ExUserError && touched.username && <p className='text-danger fs_11'>{ExUserErrorMsg}</p>}
                        <div className="show_error_message message" style={{display:"none"}}><p id="user-error-status" className="invalid"></p></div>
                    </div>

                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">Password<span className='mandatory'>*</span></label>
                        <input type="password" value={values.password} onBlur={handleBlur} onChange={handleChange} name="password" id="password" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="***********" />
                        {errors.password && touched.password && <p className='text-danger fs_11'>{errors.password}</p>}
                    </div>

                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">Name<span className='mandatory'>*</span></label>
                        <input type="text" value={values.name} onBlur={handleBlur} onChange={handleChange} name="name" className="mt-0 fs-13 mb-3 form-control length_count" placeholder="Name"  />
                        {errors.name && touched.name && <p className='text-danger fs_11'>{errors.name}</p>}
                    </div>

                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">Email<span className='mandatory'>*</span></label>                        
                        <input type="email" value={values.email} onBlur={handleBlur} onChange={handleChange} name="email" id="email" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Email"  />
                        {errors.email && touched.email && <p className='text-danger fs_11'>{errors.email}</p>}
                    </div>

                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">Contact<span className='mandatory'>*</span></label>
                        <input type="tel" value={values.contact} onBlur={handleBlur} onChange={handleChange} name="contact" id="contact" className="mt-0 mb-3 fs-13 form-control" placeholder="xxx-xxx-xxxx" />
                        {errors.contact && touched.contact && <p className='text-danger fs_11'>{errors.contact}</p>}
                    </div> 

                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">TimeZone<span className='mandatory'>*</span></label>
                        <FormDropdown onChange={dropDownChange} name="timezone" options={timezones} classnm="fs-13 mb-3 form-control length_count" />
                    </div>

                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">Role<span className='mandatory'>*</span></label>
                        <FormDropdown onChange={dropDownChange} name="role" options={user_roles} classnm="fs-13 mb-3 form-control length_count" />
                        {errors.role && touched.role && <p className='text-danger fs_11'>{errors.role}</p>}
                    </div>  

                    <div className="col-sm-6">
                        <label className="fs-12 fw-semibold">Locations<span className='mandatory'>*</span></label>
                        {locationloading ? 'Loading...' : locationdt && <FormDropdown multiselect={multiSelect} onChange={locationDownChange} name="location" options={locationdt.data} classnm="fs-13 mb-3 form-control length_count" />}
                    </div>
                </div>
            </div>
        </PopupModal>
    )
}
