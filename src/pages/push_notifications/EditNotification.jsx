import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import TinyMCEEditor from "../../editor/editor.jsx";
import FormDropdown from '../../components/FormDropdown.jsx';
import { timeA, timeH, timeS, timezones } from '../../utils/Common.js';
import DatePicker from '../../components/DatePicker.jsx';
import { useFormik } from 'formik';
import { editPushNotificationSchema } from '../../utils/validationSchemas.jsx';
import { UPDATENOTIFICATION } from '../../utils/Endpoints.js';
import SweetAlert from '../../components/SweetAlert';
import { useRequest } from '../../utils/Requests.js';
import GetLocations from '../../hooks/Locations.js';

const LocationComp = ({id, location, handleLocationChange, setError, checked_val}) => {

    const [checked, setChecked] = useState(checked_val)
    const {values} = useFormik({
        initialValues:{
            id:id,
            location:location 
        }
    });

    useEffect(() => {
        setChecked(checked_val)
    }, [checked_val])

    const changeCheck = (e) => {
        setChecked(e.target.checked);
        if(e.target.checked){
            setError(false)
            handleLocationChange((prev) => {
                const filtered = prev.filter(item => item === parseInt(e.target.value));

                if(filtered.length < 1)
                    prev.push(parseInt(e.target.value));

                return prev;
            })
        }else{
            handleLocationChange((prev) => {
                const filtered = prev.filter(item => item !== parseInt(e.target.value));
                return filtered;
            })
        }
    }

    return (
        <>
            <label htmlFor={`check-${values.id}`} className="col-md-1 fs-12 fw-semibold lnk" style={{ textAlign: "right" }}>{values.location}</label>
            <div className="col-md-2">
                <input type='checkbox' value={values.id} id={`check-${values.id}`} name={`location_${values.id}`} checked={checked} onChange={changeCheck} />
                <label className="col-md-4 fs-12 fw-semibold"></label>
            </div>
        </>
    )
}

export default function EditNotification() {
    const location = useLocation();
    const apiRequest = useRequest();
    const { id, notificationData } = location.state || {};
    const { data: locationdt, loading: locationloading } = GetLocations();

    const [selectedLocations, setSelectedLocations] = useState([]);
    const [locaitonError, setLocationError] = useState(false);

    const onSubmit = async (values) => {
        if(selectedLocations.length < 1){
            setLocationError(true);
        }else{

            const updatePushNotfication = {
                id: id,
                date_to_notify: values.notifyDate,
                time_to_notify: `${values.notifyTimeH}:${values.notifyTimeS} ${values.notifyTimeAP}`,
                cust_timezone: values.customerTimezone,
                title: values.title,
                message: values.message,
                client_ids: selectedLocations.join(",") // values.allLocations
            };

            console.log("updatePushNotfication", updatePushNotfication)
    
            const response = await apiRequest({url:UPDATENOTIFICATION, method:"post", data: updatePushNotfication});
    
            if(response){
                if(response.status === 'success'){
                    SweetAlert.success("Success", response.message);
                }else if(response.status === 'Info'){
                    SweetAlert.info(response.status, response.message);
                }else if(response.status === 'Warning'){
                    SweetAlert.warning(response.status, response.message);
                }
            }
        }
        
    }

    const {values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting} = useFormik({
        initialValues:{
            title: notificationData?.title,
            message: notificationData?.message,
            notifyDate: notificationData?.date_to_notify,
            notifyTimeH: notificationData?.time_to_notify.substring(0, 2),
            notifyTimeS: notificationData?.time_to_notify.substring(3, 5),
            notifyTimeAP: notificationData?.time_to_notify.substring(6, 8),
            customerTimezone: notificationData?.cust_timezone,
        },
        validationSchema: editPushNotificationSchema,
        onSubmit
    })
    const dropDownChange = (e) => {
        const {name, value} = e.target;
        setFieldValue(name, value);
    }
    const notifyDateChange = (date) => setFieldValue("notifyDate", date);
    const setDescription = (content) => {
        setFieldValue("message", content);
    }

    useEffect(() => {
        if(!locationloading && locationdt){
            // const allLocations = locationdt.data.map((location) => location.id); // .join(",");

            if(notificationData?.client_ids !== '')
                setSelectedLocations(notificationData?.client_ids.split(",").map(Number));
            else
                setSelectedLocations([]);
        }
    }, [locationloading, locationdt, setFieldValue, notificationData])
    
    console.log("notificationData", notificationData)
    console.log("selectedLocations", selectedLocations)

  return (
    <>
    
        <div className="text-end mb-3">              
            <Link to="/push-notifications" type="button" className="ss_btn">
                <i className="bi bi-arrow-left"></i>
                Back
            </Link>
        </div>

        {!locationloading && locationdt &&

        <div className='row'>
            <div className='col-md-12'>
                <div className='card border-0'>
                    <div className='card-body'>
                        <div className="form-group row mb-2">
                            <label className="col-md-2 fs-12 fw-semibold">Title <span className="mandatory">*</span></label>
                            <div className="col-md-10">
                                <input value={values.title} name="title" type="text" onChange={handleChange} onBlur={handleBlur} className="fs-13 form-control" placeholder="Title" />
                                {(errors.title && touched.title) && <p className='fs-12 text-danger'>{errors.title}</p>}
                            </div>
                        </div>

                        <div className="form-group row mt-2">
                            <label className="col-md-2 fs-12 fw-semibold">Message <span className="mandatory">*</span></label>
                            <div className="col-md-10">
                                <TinyMCEEditor
                                    name="message"
                                    value={values.message}
                                    onEditorChange={(content) => setDescription(content)}
                                />
                                {(errors.message && touched.message) && <p className='fs-12 text-danger'>{errors.message}</p>}
                            </div>
                        </div>

                        <div className="form-group row mt-2">
                            <label className="col-md-2 fs-12 fw-semibold">Date <span className="mandatory">*</span></label>
                            <div className="col-md-2">
                                <DatePicker 
                                    value={values.notifyDate} 
                                    onChange={notifyDateChange} 
                                    error={errors.notifyDate ? true : false}
                                    minDate={true} 
                                    name="notifyDate" 
                                />
                            </div>

                            <label className="col-md-1 fs-12 fw-semibold" style={{ textAlign: "right" }}>Time</label>
                            <div className="col-md-2">
                                <FormDropdown default_value={values.notifyTimeH} classnm="form-control fs-13" onChange={dropDownChange} name="notifyTimeH" options={timeH} />
                            </div>
                            :
                            <div className="col-md-2">
                                <FormDropdown default_value={values.notifyTimeS} classnm="form-control fs-13" onChange={dropDownChange} name="notifyTimeS" options={timeS} />
                            </div>
                            :
                            <div className="col-md-2">
                                <FormDropdown default_value={values.notifyTimeAP} classnm="form-control fs-13" onChange={dropDownChange} name="notifyTimeAP" options={timeA} />
                            </div>
                            {errors.notifyDate && touched.notifyDate && <p className='fs-12 text-danger'>{errors.notifyDate}</p>}
                            {errors.notifyTimeH && touched.notifyTimeH && <p className='fs-12 text-danger'>{errors.notifyTimeH}</p>}
                            {errors.notifyTimeS && touched.notifyTimeS && <p className='fs-12 text-danger'>{errors.notifyTimeS}</p>}
                            {errors.notifyTimeAP && touched.notifyTimeAP && <p className='fs-12 text-danger'>{errors.notifyTimeAP}</p>}
                        </div>

                        <div className="form-group row mt-2">
                            <label className="col-md-2 fs-12 fw-semibold">Timezone</label>
                            <div className="col-md-4">
                                <FormDropdown default_value={values.customerTimezone} classnm="form-control fs-13" onChange={dropDownChange} name="customerTimezone" options={timezones} />
                                
                            </div>
                        </div>

                        <div className="form-group row mt-2">
                            <label className="col-md-2 fs-12 fw-semibold">Locations <span className="mandatory">*</span></label>
                            <div className="col-md-10">
                                <div className="form-group row mt-2">

                                    {locationdt.data.map(location => {
                                        return (
                                            <LocationComp key={location.id} id={location.id} location={location.label} checked_val={selectedLocations.includes(parseInt(location.id))} handleLocationChange={setSelectedLocations} setError={setLocationError}/>
                                        );
                                    })}
                                    {locaitonError && <p className='fs-12 text-danger'>Please select at least one location.</p>}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <input disabled={isSubmitting} type="button" onClick={handleSubmit} className="ss_btn" value="Update" />

                            {isSubmitting && 
                                <div className="position-absolute top-50 start-50 translate-middle">
                                    <div className="spinner-border" role="status">
                                    <span className="sr-only"></span>
                                    </div>
                                </div>
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>

        }
        
    </>
  )
}
