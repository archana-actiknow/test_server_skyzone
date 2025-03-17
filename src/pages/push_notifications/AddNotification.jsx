import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TinyMCEEditor from "../../editor/editor.jsx";
import FormDropdown from '../../components/FormDropdown.jsx';
import { timeA, timeH, timeS, timezones } from '../../utils/Common.js';
import DatePicker from '../../components/DatePicker.jsx';
import { useFormik } from 'formik';
import { pushNotificationSchema } from '../../utils/validationSchemas.jsx';
import { ADDNOTIFY } from '../../utils/Endpoints.js';
import SweetAlert from '../../components/SweetAlert';
import { useRequest } from '../../utils/Requests.js';
import GetLocations from '../../hooks/Locations.js';

const LocationComp = ({id, location, handleLocationChange, setError}) => {
    const [checked, setChecked] = useState(true)
    const {values} = useFormik({
        initialValues:{
            id:id,
            location:location 
        }
    });

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

export default function AddNotification() {
    const apiRequest = useRequest();
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [locaitonError, setLocationError] = useState(false);
    const { data: locationdt, loading: locationloading } = GetLocations();
    const [notifyTimeH, setNotifyTimeH] = useState(timeH[0].value);
    const [notifyTimeS, setNotifyTimeS] = useState(timeS[0].value);
    const [notifyTimeAP, setNotifyTimeAP] = useState(timeA[0].value);
    const [customerTimezone, setCustomerTimezone] = useState(timezones[0].value);

    const onSubmit = async (values) => {
        if(selectedLocations.length < 1){
            setLocationError(true);
        }else{
            setLocationError(false);
            const addNewPushNotfication = {
                date_to_notify: values.notifyDate,
                time_to_notify: `${values.notifyTimeH}:${values.notifyTimeS} ${values.notifyTimeAP}`,
                cust_timezone: values.customerTimezone,
                title: values.title,
                message: values.message,
                client_ids: selectedLocations.join(",")
            };

            const addRes = await apiRequest({url:ADDNOTIFY, method:"post", data: addNewPushNotfication});
            if(addRes){
            resetForm();
            setNotifyTimeH(timeH[0].value);
            setNotifyTimeS(timeS[0].value);
            setNotifyTimeAP(timeA[0].value);
            setCustomerTimezone(timezones[0].value);
            SweetAlert.success('Success!', 'Notification created successfully.')
            }else{
                SweetAlert.error("Error", "There is some issue while adding record.")
            }
        }
        
    }

    const {values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit, resetForm} = useFormik({
        initialValues:{
            title:"",
            message: "",
            notifyDate: new Date(),
            notifyTimeH: timeH[0].value,
            notifyTimeS: timeS[0].value,
            notifyTimeAP: timeA[0].value,
            customerTimezone: timezones[0].value,
        },
        validationSchema: pushNotificationSchema,
        onSubmit
    });
    
    const dropDownChange = (e) => {
        const {name, value} = e.target;
        setFieldValue(name, value);
        if (name === "notifyTimeH") setNotifyTimeH(value);
        if (name === "notifyTimeS") setNotifyTimeS(value);
        if (name === "notifyTimeAP") setNotifyTimeAP(value);
        if(name==="customerTimezone") setCustomerTimezone(value);
    }
    const notifyDateChange = (date) => setFieldValue("notifyDate", date);

    useEffect(() => {
        if(!locationloading && locationdt){
            const allLocations = locationdt.data.map((location) => location.id); // .join(",");
            setSelectedLocations(allLocations);
        }
    }, [locationloading, locationdt])

    

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
                                    onEditorChange={(content) => setFieldValue("message", content)}
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
                                <FormDropdown classnm="form-control fs-13" onChange={dropDownChange} name="notifyTimeH"  value={notifyTimeH} options={timeH} />
                            </div>
                            :
                            <div className="col-md-2">
                                <FormDropdown classnm="form-control fs-13" onChange={dropDownChange}  name="notifyTimeS" value={notifyTimeS} options={timeS}/>
                            </div>
                            :
                            <div className="col-md-2">
                                <FormDropdown classnm="form-control fs-13"  onChange={dropDownChange} name="notifyTimeAP" value={notifyTimeAP} options={timeA} />
                            </div>
                            {errors.notifyDate && touched.notifyDate && <p className='fs-12 text-danger'>{errors.notifyDate}</p>}
                            {errors.notifyTimeH && touched.notifyTimeH && <p className='fs-12 text-danger'>{errors.notifyTimeH}</p>}
                            {errors.notifyTimeS && touched.notifyTimeS && <p className='fs-12 text-danger'>{errors.notifyTimeS}</p>}
                            {errors.notifyTimeAP && touched.notifyTimeAP && <p className='fs-12 text-danger'>{errors.notifyTimeAP}</p>}
                        </div>

                        <div className="form-group row mt-2">
                            <label className="col-md-2 fs-12 fw-semibold">Timezone <span className="mandatory">*</span></label>
                            <div className="col-md-4">
                                <FormDropdown classnm="form-control fs-13" onChange={dropDownChange} name="customerTimezone"value ={customerTimezone} options={timezones} />
                            </div>
                        </div>

                        <div className="form-group row mt-2">
                            <label className="col-md-2 fs-12 fw-semibold">Locations <span className="mandatory">*</span></label>
                            <div className="col-md-10">
                                <div className="form-group row mt-2">

                                    {locationdt.data.map(location => {
                                        return (
                                            <LocationComp key={location.id} id={location.id} location={location.label} handleLocationChange={setSelectedLocations} setError={setLocationError}/>
                                        );
                                    })}
                                    {locaitonError && <p className='fs-12 text-danger'>Please select at least one location.</p>}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="submit" className="ss_btn" onClick={handleSubmit} >Add Notification</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        }
        
    </>
  )
}