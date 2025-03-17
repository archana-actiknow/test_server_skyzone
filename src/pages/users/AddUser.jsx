import React, { useRef } from 'react'
import Popup from "../../components/Popup"
import { encrypt, timezones, user_roles } from '../../utils/Common';
import FormDropdown from '../../components/FormDropdown';
import {useFormik} from 'formik';
import { userValidationSchema } from '../../utils/validationSchemas';
import { ADDUSER } from '../../utils/Endpoints';
import { useRequest } from '../../utils/Requests';
import GetLocations from '../../hooks/Locations';
import SweetAlert from '../../components/SweetAlert';

export default function AddUser({refreshData}) {

    const apiRequest = useRequest();

    // CLOSE MODAL REF //
    const closeModal = useRef(null);

    // FORM SUBMIT //
    const onSubmit = async (values, { resetForm }) => {

      const nUser = {
        username: values.username,
        email: encrypt(values.email),
        name: values.name,
        password: values.password,
        contact: encrypt(values.contact),
        timezone: values.timezone,
        location: values.location,
        role: values.role,
      }

      const response = await apiRequest({url:ADDUSER, method:"POST", data: nUser});

      if(response){
        closeModal.current.click();
        SweetAlert.success('Success!', 'User created successfully.')
        refreshData(true);
        resetForm();
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
        timezone: timezones[0].value,
        location: (!locationloading && locationdt) ? locationdt.data[0].value : 1
      },
      validationSchema: userValidationSchema,
      onSubmit
    });

    // DROPDOWNS CHANGE //
    const dropDownChange = (e) => {
      const {name, value} = e.target;
      setFieldValue(name, value);
    }

  return (
    <>
        <Popup closeRef={closeModal} title="Add User" size="lg" trigger="Add User"  handleSubmit={handleSubmit}>

          <div className="col-sm-12" id="dis_list"> 
            <div className="form-group row">
              <div className="col-sm-6">
                  <label className="fs-12 fw-semibold">Username*</label>
                  <input type="text" value={values.username} onBlur={handleBlur} onChange={handleChange} name="username" id="username" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Username" />
                  {errors.username && touched.username && <p className='text-danger fs_11'>{errors.username}</p>}
                  <div className="show_error_message message" style={{display:"none"}}><p id="user-error-status" className="invalid"></p></div>
              </div>
              <div className="col-sm-6">
                  <label className="fs-12 fw-semibold">Password*</label>
                  <input type="password" value={values.password} onBlur={handleBlur} onChange={handleChange} name="password" id="password" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="***********" />
                  {errors.password && touched.password && <p className='text-danger fs_11'>{errors.password}</p>}
              </div>

              <div className="col-sm-6">
                  <label className="fs-12 fw-semibold">Name*</label>
                  <input type="text" value={values.name} onBlur={handleBlur} onChange={handleChange} name="name" className="mt-0 fs-13 mb-3 form-control length_count" placeholder="Name"  />
                  {errors.name && touched.name && <p className='text-danger fs_11'>{errors.name}</p>}
              </div>

              <div className="col-sm-6">
                  <label className="fs-12 fw-semibold">Email*</label>                        
                  <input type="email" value={values.email} onBlur={handleBlur} onChange={handleChange} name="email" id="email" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Email"  />
                  {errors.email && touched.email && <p className='text-danger fs_11'>{errors.email}</p>}
              </div>

              <div className="col-sm-6">
                  <label className="fs-12 fw-semibold">Contact*</label>
                  <input type="tel" value={values.contact} onBlur={handleBlur} onChange={handleChange} name="contact" id="contact" className="mt-0 mb-3 fs-13 form-control" placeholder="xxx-xxx-xxxx" />
                  {errors.contact && touched.contact && <p className='text-danger fs_11'>{errors.contact}</p>}
              </div> 

              <div className="col-sm-6">
                  <label className="fs-12 fw-semibold">TimeZone*</label>
                  <FormDropdown onChange={dropDownChange} name="timezone" options={timezones} classnm="fs-13 mb-3 form-control length_count" />
              </div>

              <div className="col-sm-6">
                <label className="fs-12 fw-semibold">Location*</label>
                {locationloading ? 'Loading...' : locationdt && <FormDropdown onChange={dropDownChange} name="location" options={locationdt.data} classnm="fs-13 mb-3 form-control length_count" />}
              </div>

              <div className="col-sm-6">
                  <label className="fs-12 fw-semibold">Role*</label>
                  <FormDropdown onChange={dropDownChange} name="role" options={user_roles} classnm="fs-13 mb-3 form-control length_count" />
                  {errors.role && touched.role && <p className='text-danger fs_11'>{errors.role}</p>}
              </div>  
            </div>
          </div>
            
        </Popup>
    </>
  )
}
