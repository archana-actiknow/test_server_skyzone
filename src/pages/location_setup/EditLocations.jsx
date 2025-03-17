import React,{useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import FormDropdown from "../../components/FormDropdown.jsx";
import TinyMCEEditor from "../../editor/editor.jsx";
import { can_access, country_type, messagePop, timezones } from "../../utils/Common.js";
import { useFormik } from 'formik';
import { PostAuthRequest, useRequest } from '../../utils/Requests.js';
import { check_location_validation } from "../../utils/validationSchemas.jsx";
import { UPDATELOCATION } from "../../utils/Endpoints.js";

export default function EditLocation() {
    const apiRequest = useRequest();
      const location = useLocation();
    const [ExLocationError, setExLocationError] = useState(false);
    const [ExLocationErrorMsg, setExLocationErrorMsg] = useState("");
     const [locationData, setLocationData] = useState("");
      const [locationId, setLocationId] = useState("");
    
      useEffect(() => {
        const { locationData ,id } = location.state || {};
        setLocationData(locationData)
        setLocationId(id)
      }, [location])

    const dropDownChange = (e) => {
        const {name, value} = e.target;
        setFieldValue(name, value);
    }

    const onSubmit = async (values) => {
        const formData = {
            id: locationId,
            client_name: values.client_name,
            location: values.location,
            latitude: values.latitude,
            longitude: values.longitude,
            address: values.address,
            client_code: values.client_code,
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
            cust_timezone: values.customerTimezone,
            can_access:values.can_access,
            country_type:values.country_type,
            website:values.website,
            weiver_url:values.weiver_url,
        };
        const response = await apiRequest( {url: UPDATELOCATION, method: "POST", data: formData});
    
        if (response) {
             messagePop(response);
        }
      };

    const {values, errors, touched, handleChange, setFieldValue,handleSubmit} = useFormik({
        initialValues:{
            client_name:locationData?.client_name,
            location:locationData?.location,
            latitude:locationData?.latitude,
            longitude:locationData?.longitude,
            address:locationData?.address,
            client_code:locationData?.Client_Code,
            client_email:locationData?.client_email,
            order_email:locationData?.order_email,
            reply_to:locationData?.reply_to,
            humanity_key:locationData?.humanity_key,
            humanity_username:locationData?.humanity_username,
            humanity_password:locationData?.humanity_password,
            stripe_account_id:locationData?.stripe_account_id,
            version:locationData?.version,
            website:locationData?.website,
            waiver_text:locationData?.waiver_text,
            phone_number:locationData?.phone_number,
            topic_name:locationData?.topic_name,
            weiver_url:locationData?.weiver_url,
            customerTimezone: locationData?.client_timezone ?? (timezones.length > 0 ? timezones[0].value : ""),
            can_access: locationData?.can_access ?? (can_access.length > 0 ? can_access[0].value : ""),
            country_type: locationData?.country_type ?? (country_type.length > 0 ? country_type[0].value : ""),
        },
        enableReinitialize: true,
        onSubmit
    });
    
    // CHECK USER EXISTANCE //
    const checkLocation = async (e) => {
        const location = e.target.value;
        setFieldValue('location', location)
        try {
            const response = await PostAuthRequest('', "POST", { location: location });
            if(response?.data?.found){
                setExLocationError(true);
                setExLocationErrorMsg(response?.message);
            }else{
                const res = check_location_validation(location);

                if(res[0]){
                    setExLocationError(false);
                    setExLocationErrorMsg("");
                }else{
                    setExLocationError(true);
                    setExLocationErrorMsg(res[1]);
                }
            }
        } catch (error) {
            console.error('Error checking username availability', error);
        }
    }

    return (
        <>
            <div className="text-end mb-3">
                <Link to="/location-setup" type="button" className="ss_btn">
                    <i className="bi bi-arrow-left"></i> Back
                </Link>
            </div>

            <div className="main">
                <div className="row mb-3">
                    <div className="add-offer-form">
                        <div className="card">
                            <div className="card-body">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-group row">
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold">Client Name<span className="mandatory">*</span></label>
                                                    <input type="text" name="client_name" id="client_name" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="client name" value={values.client_name} onChange={handleChange}/>
                                                    {(errors.client_name && touched.client_name) && <p className='fs-12 text-danger'>{errors.client_name}</p>}
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold">Location<span className="mandatory">*</span></label>
                                                    <input type="text" name="location" id="location" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Location" value={values.location} onChange={checkLocation}/>
                                                    {ExLocationError && touched.location && <p className='text-danger fs_11'>{ExLocationErrorMsg}</p>}
                                                    
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold">Latitude<span className="mandatory">*</span></label>
                                                    <input type="text" name="latitude" id="latitude" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="latitude" value={values.latitude} onChange={handleChange}/>
                                                    {(errors.latitude && touched.latitude) && <p className='fs-12 text-danger'>{errors.latitude}</p>}
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold">Longitude<span className="mandatory">*</span></label>
                                                    <input type="text" name="longitude" id="longitude" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="longitude" value={values.longitude} onChange={handleChange}/>
                                                    {(errors.longitude && touched.longitude) && <p className='fs-12 text-danger'>{errors.longitude}</p>}
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold">Client Code<span className="mandatory">*</span></label>
                                                    <input type="number" name="client_code" id="client_code" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="client_code" value={values.client_code} onChange={handleChange}/>
                                                    {(errors.client_code && touched.client_code) && <p className='fs-12 text-danger'>{errors.client_code}</p>}
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold">Client Email<span className="mandatory">*</span></label>
                                                    <input type="email" name="client_email" id="client_email" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="client_email" value={values.client_email} onChange={handleChange}/>
                                                    {(errors.client_email && touched.client_email) && <p className='fs-12 text-danger'>{errors.client_email}</p>}
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold">Order Email<span className="mandatory">*</span></label>
                                                    <input type="email" name="order_email" id="order_email" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="order_email" value={values.order_email} onChange={handleChange}/>
                                                    {(errors.order_email && touched.order_email) && <p className='fs-12 text-danger'>{errors.order_email}</p>}
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold">Reply to<span className="mandatory">*</span></label>
                                                    <input type="email" name="reply_to" id="reply_to" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="reply_to" value={values.reply_to} onChange={handleChange}/>
                                                    {(errors.reply_to && touched.reply_to) && <p className='fs-12 text-danger'>{errors.reply_to}</p>}
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold">Humanity Key<span className="mandatory">*</span></label>
                                                    <input type="text" name="humanity_key" id="humanity_key" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Humanity key" value={values.humanity_key} onChange={handleChange}/>
                                                    {(errors.humanity_key && touched.humanity_key) && <p className='fs-12 text-danger'>{errors.humanity_key}</p>}
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold">Humanity Username<span className="mandatory">*</span></label>
                                                    <input type="text" name="humanity_username" id="humanity_username" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Username" value={values.humanity_username} onChange={handleChange}/>
                                                    {(errors.humanity_username && touched.humanity_username) && <p className='fs-12 text-danger'>{errors.humanity_username}</p>}
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold">Humanity Password<span className="mandatory">*</span></label>
                                                    <input type="password" name="humanity_password" id="humanity_password" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="***********" value={values.humanity_password} onChange={handleChange}/>
                                                    {(errors.humanity_password && touched.humanity_password) && <p className='fs-12 text-danger'>{errors.humanity_password}</p>}
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold">Stripe Account Id<span className="mandatory">*</span></label>
                                                    <input type="text" name="stripe_account_id" id="stripe_account_id" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Stripe Account Id" value={values.stripe_account_id} onChange={handleChange}/>
                                                    {(errors.stripe_account_id && touched.stripe_account_id) && <p className='fs-12 text-danger'>{errors.stripe_account_id}</p>}
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold">Country<span className="mandatory">*</span></label>
                                                    <FormDropdown classnm="fs-13 mb-3 form-control length_count " onChange={dropDownChange} name="country_type" options={country_type}  />
                                                    {(errors.country_type && touched.country_type) && <p className='fs-12 text-danger'>{errors.country_type}</p>}
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold">Version<span className="mandatory">*</span></label>
                                                    <input type="text" name="version" id="version" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Version" value={values.version} onChange={handleChange}/>
                                                    {(errors.version && touched.version) && <p className='fs-12 text-danger'>{errors.version}</p>}
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold">Can Access<span className="mandatory">*</span></label>
                                                    <FormDropdown classnm="fs-13 mb-3 form-control length_count " onChange={dropDownChange} name="can_access" options={can_access} />
                                                    {(errors.can_access && touched.can_access) && <p className='fs-12 text-danger'>{errors.can_access}</p>}
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold">Contact Number<span className="mandatory">*</span></label>
                                                    <input type="tel" name="phone_number" id="phone_number" className="mt-0 mb-3 fs-13 form-control" placeholder="xxx-xxx-xxxx" value={values.phone_number} onChange={handleChange}/>
                                                    {(errors.phone_number && touched.phone_number) && <p className='fs-12 text-danger'>{errors.phone_number}</p>}
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold">TimeZone<span className="mandatory">*</span></label>
                                                    <FormDropdown classnm="fs-13 mb-3 form-control length_count " onChange={dropDownChange} name="customerTimezone" options={timezones} />
                                                    {(errors.customerTimezone && touched.customerTimezone) && <p className='fs-12 text-danger'>{errors.customerTimezone}</p>}
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold">Topic Name<span className="mandatory">*</span></label>
                                                    <input type="text" name="topic_name" id="topic_name" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Topic Name" value={values.topic_name} onChange={handleChange}/>
                                                    {(errors.topic_name && touched.topic_name) && <p className='fs-12 text-danger'>{errors.topic_name}</p>}
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold" >Address <span className="mandatory">*</span></label>
                                                    <textarea className="fs-13 mb-3 form-control length_count f-ht-70" id="address" name="address" rows="4" cols="50" placeholder="Enter your address" onChange={(e) => setFieldValue("address", e.target.value)}  value={values.address}/>
                                                    {(errors.address && touched.address) && <p className='fs-12 text-danger'>{errors.address}</p>}
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold" >Website <span className="mandatory">*</span></label>
                                                    <input type="text" name="website" id="website" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Website" value={values.website} onChange={handleChange}/>
                                                    {(errors.website && touched.website) && <p className='fs-12 text-danger'>{errors.website}</p>}
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="fs-12 fw-semibold" >Waiver Url <span className="mandatory">*</span></label>
                                                    <input type="text" name="weiver_url" id="weiver_url" className="mt-0 mb-3 fs-13 form-control length_count" placeholder="Website" value={values.weiver_url} onChange={handleChange}/>
                                                    {(errors.weiver_url && touched.weiver_url) && <p className='fs-12 text-danger'>{errors.weiver_url}</p>}
                                                </div>
                                                <div className="col-sm-12">
                                                    <label className="fs-12 fw-semibold">Waiver Text <span className="mandatory">*</span></label>
                                                        <TinyMCEEditor
                                                            name="waiver_text"
                                                            height={200}
                                                            value={values.waiver_text}
                                                            onEditorChange={(content) => setFieldValue("waiver_text", content)}
                                                        />
                                                    {(errors.waiver_text && touched.waiver_text) && <p className='fs-12 text-danger'>{errors.waiver_text}</p>}
                                                </div> 
                                            </div>
                                            <div className="modal-footer">
                                                <button type="submit" className="ss_btn mt-2 mb-2" onClick={handleSubmit} >UPDATE Locations</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}