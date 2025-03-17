import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TinyMCEEditor from "../../editor/editor.jsx";
import FormDropdown from '../../components/FormDropdown.jsx';
import { can_access, country_type, messagePop, timeA, timeH, timeS, timezones } from '../../utils/Common.js';
import DatePicker from '../../components/DatePicker.jsx';
import { useFormik } from 'formik';
import { AddLocationsValidations, check_location_validation, pushNotificationSchema, validationSchema } from '../../utils/validationSchemas.jsx';
import { ADDLOCATIONS, ADDNOTIFY } from '../../utils/Endpoints.js';
import SweetAlert from '../../components/SweetAlert';
import { useRequest } from '../../utils/Requests.js';
import GetLocations from '../../hooks/Locations.js';

export default function AddLocations() {
    const apiRequest = useRequest();
    const [ExLocationError, setExLocationError] = useState(false);
    const [ExLocationErrorMsg, setExLocationErrorMsg] = useState("");

    const checkLocation = async (e) => {
        const location = e.target.value;
        setFieldValue('location', location)
        // try {
        //     const response = await PostAuthRequest('', "POST", { location: location });
        //     if(response?.data?.found){
        //         setExLocationError(true);
        //         setExLocationErrorMsg(response?.message);
        //     }else{
        //         const res = check_location_validation(location);

        //         if(res[0]){
        //             setExLocationError(false);
        //             setExLocationErrorMsg("");
        //         }else{
        //             setExLocationError(true);
        //             setExLocationErrorMsg(res[1]);
        //         }
                
        //     }
        // } catch (error) {
        //     console.error('Error checking username availability', error);
        // }
    }
      

    const onSubmit = async (values) => {
        const formData = {
            client_name: values.client_name,
            location: values.location,
            latitude: values.latitude,
            longitude: values.longitude,
            address: values.address,
            Client_Code: values.client_code,
            client_email: values.client_email,
            order_email: values.order_email,
            reply_to: values.reply_to,
            humanity_key: values.humanity_key,
            humanity_username: values.humanity_username,
            humanity_password: values.humanity_password,
            stripe_account_id: values.stripe_account_id,
            version:values.version,
            waiver_text:values.waiver_text,
            phone_number:values.phone_number,
            topic_name:values.topic_name,
            client_timezone: values.customerTimezone,
            can_access:values.can_access,
            country_type:values.country_type,
            website:values.website,
            weiver_url:values.weiver_url
        };
        const response = await apiRequest( {url: ADDLOCATIONS, method: "POST", data: formData});
        if (response) {
             messagePop(response);
            resetForm();
        }
    }
        

    const {values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit, resetForm,setFieldTouched} = useFormik({
          initialValues:{
            client_name:"",
            location:"",
            latitude:"",
            longitude:"",
            address:"",
            client_code:"",
            client_email:"",
            order_email:"",
            reply_to:"",
            humanity_key:"",
            humanity_username:"",
            humanity_password:"",
            stripe_account_id:"",
            version:"",
            website:"",
            waiver_text:"",
            phone_number:"",
            topic_name:"",
            customerTimezone: timezones[0].value,
            can_access:can_access[0].value,
            country_type:country_type[0].value,
            weiver_url:""
        },
        validationSchema:validationSchema,
        onSubmit
    });
    
    const dropDownChange = (e) => {
        const { name, value } = e.target;
        setFieldValue(name, value);
    };
    
    
  return (
    <>
        <div className="text-end mb-3">              
            <Link to="/location-setup" type="button" className="ss_btn"><i className="bi bi-arrow-left"></i> Back</Link>
        </div>

        <div className='row'>
            <div className='col-md-12'>
                <div className='card border-0'>
                    <div className='card-body'>
                        <div className="row">
                            <div className="col-sm-12">
                                <form  onSubmit={handleSubmit}>
                                    <div className="form-group row">
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold">Client Name<span className="mandatory">*</span></label>
                                            <input type="text" name="client_name" id="client_name" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="client name" value={values.client_name} onChange={handleChange} onBlur={handleBlur}/>
                                            {(errors.client_name && touched.client_name) && <p className='fs-12 text-danger'>{errors.client_name}</p>}
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold">Location<span className="mandatory">*</span></label>
                                            <input type="text" name="location" id="location" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Location" value={values.location} onChange={checkLocation}
                                            />
                                            {ExLocationError && touched.location && <p className='text-danger fs_11'>{ExLocationErrorMsg}</p>}
                                            
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold">Latitude<span className="mandatory">*</span></label>
                                            <input type="text" name="latitude" id="latitude" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="latitude" value={values.latitude} onChange={handleChange} onBlur={handleBlur}/>
                                            {(errors.latitude && touched.latitude) && <p className='fs-12 text-danger'>{errors.latitude}</p>}
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold">Longitude<span className="mandatory">*</span></label>
                                            <input type="text" name="longitude" id="longitude" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="longitude" value={values.longitude} onChange={handleChange} onBlur={handleBlur}/>
                                            {(errors.longitude && touched.longitude) && <p className='fs-12 text-danger'>{errors.longitude}</p>}
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold">Client Code<span className="mandatory">*</span></label>
                                            <input type="number" name="client_code" id="client_code" step="any" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="code" value={values.client_code} onChange={handleChange} onBlur={handleBlur}/>
                                            {(errors.client_code && touched.client_code) && <p className='fs-12 text-danger'>{errors.client_code}</p>}
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold">Client Email<span className="mandatory">*</span></label>
                                            <input type="email" name="client_email" id="client_email" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="email" value={values.client_email} onChange={handleChange} onBlur={handleBlur}/>
                                            {(errors.client_email && touched.client_email) && <p className='fs-12 text-danger'>{errors.client_email}</p>}
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold">Order Email<span className="mandatory">*</span></label>
                                            <input type="email" name="order_email" id="order_email" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="order email" value={values.order_email} onChange={handleChange} onBlur={handleBlur}/>
                                            {(errors.order_email && touched.order_email) && <p className='fs-12 text-danger'>{errors.order_email}</p>}
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold">Reply to<span className="mandatory">*</span></label>
                                            <input type="email" name="reply_to" id="reply_to" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="reply email" value={values.reply_to} onChange={handleChange} onBlur={handleBlur}/>
                                            {(errors.reply_to && touched.reply_to) && <p className='fs-12 text-danger'>{errors.reply_to}</p>}
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold">Humanity Key<span className="mandatory">*</span></label>
                                            <input type="text" name="humanity_key" id="humanity_key" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Humanity key" value={values.humanity_key} onChange={handleChange} onBlur={handleBlur}/>
                                            {(errors.humanity_key && touched.humanity_key) && <p className='fs-12 text-danger'>{errors.humanity_key}</p>}
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold">Humanity Username<span className="mandatory">*</span></label>
                                            <input type="text" name="humanity_username" id="humanity_username" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Username" value={values.humanity_username} onChange={handleChange} onBlur={handleBlur}/>
                                            {(errors.humanity_username && touched.humanity_username) && <p className='fs-12 text-danger'>{errors.humanity_username}</p>}
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold">Humanity Password<span className="mandatory">*</span></label>
                                            <input type="password" name="humanity_password" id="humanity_password" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="***********" value={values.humanity_password} onChange={handleChange} onBlur={handleBlur}/>
                                            {(errors.humanity_password && touched.humanity_password) && <p className='fs-12 text-danger'>{errors.humanity_password}</p>}
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold">Stripe Account Id<span className="mandatory">*</span></label>
                                            <input type="text" name="stripe_account_id" id="stripe_account_id" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Stripe Account Id" value={values.stripe_account_id} onChange={handleChange} onBlur={handleBlur}/>
                                            {(errors.stripe_account_id && touched.stripe_account_id) && <p className='fs-12 text-danger'>{errors.stripe_account_id}</p>}
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold">Country<span className="mandatory">*</span></label>
                                            <FormDropdown classnm="fs-13 mb-3 form-control length_count " onChange={dropDownChange} name="country_type" options={country_type} onBlur={handleBlur} />
                                            {(errors.country_type && touched.country_type) && <p className='fs-12 text-danger'>{errors.country_type}</p>}
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold">Version<span className="mandatory">*</span></label>
                                            <input type="text" name="version" id="version" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Version" value={values.version} onChange={handleChange} onBlur={handleBlur}/>
                                            {(errors.version && touched.version) && <p className='fs-12 text-danger'>{errors.version}</p>}
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold">Can Access<span className="mandatory">*</span></label>
                                            <FormDropdown classnm="fs-13 mb-3 form-control length_count " onChange={dropDownChange} name="can_access" options={can_access} onBlur={handleBlur}/>
                                            {(errors.can_access && touched.can_access) && <p className='fs-12 text-danger'>{errors.can_access}</p>}
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold">Contact Number<span className="mandatory">*</span></label>
                                            <input type="tel" name="phone_number" id="phone_number" className="mt-0 mb-3 fs-13 form-control" placeholder="xxx-xxx-xxxx" value={values.phone_number} onChange={handleChange} onBlur={handleBlur}/>
                                            {(errors.phone_number && touched.phone_number) && <p className='fs-12 text-danger'>{errors.phone_number}</p>}
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold">TimeZone<span className="mandatory">*</span></label>
                                            <FormDropdown classnm="fs-13 mb-3 form-control length_count " onChange={dropDownChange} name="customerTimezone" options={timezones} onBlur={handleBlur}/>
                                            {(errors.customerTimezone && touched.customerTimezone) && <p className='fs-12 text-danger'>{errors.customerTimezone}</p>}
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold">Topic Name<span className="mandatory">*</span></label>
                                            <input type="text" name="topic_name" id="topic_name" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Topic Name" value={values.topic_name} onChange={handleChange} onBlur={handleBlur}/>
                                            {(errors.topic_name && touched.topic_name) && <p className='fs-12 text-danger'>{errors.topic_name}</p>}
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold" >Address <span className="mandatory">*</span></label>
                                            <textarea className="fs-13 mb-3 form-control length_count f-ht-70" id="address" name="address" rows="4" cols="50" placeholder="Enter your address" onChange={(e) => setFieldValue("address", e.target.value)}  value={values.address} onBlur={handleBlur}/>
                                            {(errors.address && touched.address) && <p className='fs-12 text-danger'>{errors.address}</p>}
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold" >Website <span className="mandatory">*</span></label>
                                            <input type="text" name="website" id="website" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Website" value={values.website} onChange={handleChange} onBlur={handleBlur}/>
                                            {(errors.website && touched.website) && <p className='fs-12 text-danger'>{errors.website}</p>}
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="fs-12 fw-semibold" >Waiver Url <span className="mandatory">*</span></label>
                                            <input type="text" name="weiver_url" id="weiver_url" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Website" value={values.weiver_url} onChange={handleChange} onBlur={handleBlur}/>
                                            {(errors.weiver_url && touched.weiver_url) && <p className='fs-12 text-danger'>{errors.weiver_url}</p>}
                                        </div>
                                        <div className="col-sm-12">
                                            <label className="fs-12 fw-semibold">Waiver Text <span className="mandatory">*</span></label>
                                                <TinyMCEEditor
                                                    name="waiver_text"
                                                    height={200}
                                                    value={values.waiver_text}
                                                    onBlur={handleBlur}
                                                    onEditorChange={(content) => setFieldValue("waiver_text", content)}
                                                />
                                                {(errors.waiver_text && touched.waiver_text) && <p className='fs-12 text-danger'>{errors.waiver_text}</p>}
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="ss_btn" onClick={handleSubmit}  value="Submit"  >Add Locations</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>   
    </>
  )
}