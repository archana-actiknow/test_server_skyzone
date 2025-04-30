import React, { useEffect, useRef, useState } from 'react'
import FormDropdown from '../../components/FormDropdown'
import GetLocations from '../../hooks/Locations';
import DatePicker from '../../components/DatePicker';
import { useFormik } from 'formik';
import { useRequest } from '../../utils/Requests';
import { GETHOIDAYCAL, HOLIDAYCALENDAR,DELETEHOLIDAYCALENDAR } from '../../utils/Endpoints';
import { holidayTypes, messagePop } from '../../utils/Common';
import { holidayCalendarValidation } from '../../utils/validationSchemas';
import SweetAlert from '../../components/SweetAlert';
import SkeletonLoader from '../../components/SkeletonLoader';

const TblBody = ({ data = {}, onDelete, index, title, onChange }) => {
    const upRef = useRef(false);
    const { values, setFieldValue ,errors, touched, handleBlur } = useFormik({
        initialValues: {
            id: data.id || 0,
            holiday_desc: data.holiday_desc || '',
            start_date: data.start_date && data.start_date !== "0000-00-00" ? new Date(data.start_date):'',
            end_date: data.end_date && data.end_date !== "0000-00-00"  ? new Date(data.end_date)  : '',
            type: data.type || 1,
            start_time: data.start_time || '',
            end_time:  data.end_time || '',
        },
        enableReinitialize: true,
        validationSchema: holidayCalendarValidation,
    });

    const setTime = (timeString) => {
        const defaultTime = new Date();  
        if (typeof timeString === "string" && timeString.includes(":")) {
            const [hours, minutes] = timeString.split(":").map(Number);
            defaultTime.setHours(hours, minutes, 0);
        } else if (timeString instanceof Date && !isNaN(timeString)) {
            defaultTime.setHours(timeString.getHours(), timeString.getMinutes(), 0);
        }
        return defaultTime;
    };
    const startTime = values.start_time ? setTime(values.start_time) : ''; 
    const endTime = values.end_time ? setTime(values.end_time) : '';
    
    const startDateChange = (date) => {
        setFieldValue("start_date", date );
        upRef.current = true;
    }

    const endDateChange = (date) => {
        if (!values.start_date || (date && new Date(values.start_date) <= new Date(date))) {
            setFieldValue("end_date", date);
        } else {
            SweetAlert.error("End date must be after start date.");
            setTimeout(() => setFieldValue("end_date", ""), 0); 
        }
        // setFieldValue("end_date", date);
        upRef.current = true;
    }

    const startTimeChange = (time) => { 
        setFieldValue("start_time", time); 
        upRef.current = true;
    }

    const endTimeChange = (time) => { 
        if (!values.start_time || (time && values.start_time <= time)) {
            setFieldValue("end_time", time);
        } else {
            SweetAlert.error("End time must be after start time.");
            setTimeout(() => setFieldValue("end_time", ""), 0);
        }
        // setFieldValue("end_time", time); 
        upRef.current = true;
    }

    const descriptionChange = (e) => { 
        setFieldValue("holiday_desc", e.target.value); 
        upRef.current = true;
    }

    const holidayTypesChange = (e) => { 
        setFieldValue("type", parseInt(e.target.value)); 
        upRef.current = true;
    }

    useEffect(() => {
        if(upRef.current){
            onChange({ ...values });
            upRef.current = false;
        }
    }, [values, onChange]);

    return (
        <tbody>
            <tr>
                {title === "Holidays" && (
                    <td>
                        <input type="text"  className="form-control" value={values.holiday_desc} onChange={descriptionChange} name="holiday_desc"  onBlur={handleBlur} />
                        {errors.holiday_desc && touched.holiday_desc && <p className='text-danger fs-12'>{errors.holiday_desc}</p>}
                    </td>
                )}
                <td>
                    <DatePicker value={values.start_date} onChange={startDateChange} name="start_date" className="form-control" minDate={true} onBlur={handleBlur} />
                    {errors.start_date && touched.start_date && <p className='text-danger fs-12'>{errors.start_date}</p>}
                </td>
                {title !== "Holidays" && (
                    <td>
                        <DatePicker value={values.end_date|| null} onChange={endDateChange} name="end_date" className="form-control" minDate={true} onBlur={handleBlur}/>
                        {errors.end_date && touched.end_date && <p className='text-danger fs-12'>{errors.end_date}</p>}
                    </td>
                )}
                <td>
                    <FormDropdown options={holidayTypes} default_value={values.type} name="type" classnm="form-select"
                     onChange={holidayTypesChange}  onBlur={handleBlur} />
                    {errors.type && touched.type && <p className='text-danger fs-12'>{errors.type}</p>}
                </td>          
                <td>
                    <DatePicker value={startTime} onChange={startTimeChange}  name="start_time" timeOnly  onBlur={handleBlur}  />
                    {errors.start_time && touched.start_time && <p className='text-danger fs-12'>{errors.start_time}</p>}
                </td>
                <td>
                    <DatePicker value={endTime || null} onChange={endTimeChange}  name="end_time" timeOnly  onBlur={handleBlur}/>
                    {errors.end_time && touched.end_time && <p className='text-danger fs-12'>{errors.end_time}</p>}
                </td>
                <td>
                    <span className="icon lnk delete" data-bs-title="Delete" onClick={() => {
                            if (values.id > 0) { onDelete( index, values.id); } else { onDelete(index); }}}>
                        <i className="bi bi-trash-fill"></i>
                    </span>
                </td>
            </tr>
        </tbody>
    );
};

const BreakSection = ({ title, imgPath, data, onAdd, onDelete, onChange  }) => {
    return (
        <>
            <div className="row mb-3">
                <div className="col-md-12">
                    <div className="card border-0">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-md-12">
                                    <p className="fs-12 fw-semibold mb-0"> <img src={imgPath} alt={title} />&nbsp; {title}</p>
                                </div>
                            </div>
                            <div className="row align-items-center mt-10">
                                <div className="col-md-12">
                                    <div className="ss-table table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    {title === "Holidays" && <th>Event</th>}
                                                    <th>{title === "Holidays" ? "Date" : "Start Date"}</th>
                                                    {title !== "Holidays" && <th>End Date</th>}
                                                    <th>Type</th>
                                                    <th>Opening Time</th>
                                                    <th>Closing Time</th>
                                                    <th>
                                                        <span className="me-2 icon lnk edit" data-bs-title="Add New" onClick={onAdd}> <i className="bi bi-plus-lg"></i></span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            {data.map((item, index) => (
                                                    <TblBody key={index} data={item} index={index} title={title} onDelete={onDelete} onChange={(updatedItem) => onChange(index, updatedItem)}/>
                                                ))}
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>                
    );
};


export default function Calendar() {
    const apiRequest = useRequest();
    const [currentLocation, setCurrentLocation] = useState("");
    const [refreshData, setRefreshData] = useState(true);
    const { data: locationdt, loading: locationloading } = GetLocations();
    const currentYear = new Date().getFullYear();
    const [Year, setYear] = useState(currentYear); 
    const [loading, setLoading] = useState(true);
    const [breakSections, setBreakSections] = useState({
        springBreak: [{ id: 0, holiday_desc: "Spring Break", start_date: "", end_date: "", type: 1, start_time: "", end_time: "", }],
        summerBreak: [{ id: 0, holiday_desc: "Summer Break", start_date: "", end_date: "", type: 1, start_time: "", end_time: "", }],
        winterBreak: [{ id: 0, holiday_desc: "Winter Break", start_date: "", end_date: "", type: 1, start_time: "", end_time: "", }],
        thanksGivingBreak: [{ id: 0, holiday_desc: "Thanks Giving Break", start_date: "", end_date: "", type: 1, start_time: "", end_time: "", }],
        christmasBreak: [{ id: 0, holiday_desc: "Christmas Break", start_date: "", end_date: "", type: 1, start_time: "", end_time: "", }],
        holidays: [{ id: 0, holiday_desc: "", start_date: "", type: 1, start_time: "",end_time: "", }],
    });
    const [data, setData] = useState([]);
    const years = [];
    const initialBreakSectionsRef = useRef(breakSections);

    const dropDownChange = (e) => {
        setCurrentLocation(e.target.value);
        setRefreshData(true);
    };

     // ONLOAD //
    useEffect(() => {
        if (!locationloading && locationdt) {
            setCurrentLocation(locationdt.data[0].value);
            setRefreshData(true);
        }
    }, [locationdt, locationloading]);


    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const data = { client_id: currentLocation, year: Year };
                const response = await apiRequest({ url: GETHOIDAYCAL, method: "post", data });
                if (Array.isArray(response.data)) {
                    setData(response.data);
                } else {
                    setData([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setData([]); // Handle error case by setting an empty array
            } finally {
                setLoading(false); // Ensure loading state is turned off
            }
        };
    
        if (refreshData) {
            setRefreshData(false);
            getData();
        }
    }, [refreshData, currentLocation, Year, apiRequest]);

    useEffect(() => {
        if (Array.isArray(data)) {
            const filteredSections = {
                springBreak: data.filter((holiday) => holiday.holiday_desc === "Spring Break"  && holiday.type_id === 2),
                summerBreak: data.filter((holiday) => holiday.holiday_desc === "Summer Break" && holiday.type_id === 3),
                thanksGivingBreak: data.filter((holiday) => holiday.holiday_desc === "Thanks Giving Break" && holiday.type_id === 4),
                winterBreak: data.filter((holiday) => holiday.holiday_desc === "Winter Break" && holiday.type_id === 5),
                christmasBreak: data.filter(
                (holiday) => (holiday.holiday_desc === "Christmas Break" && holiday.type_id === 6) || (holiday.holiday_desc === "Christmas" && holiday.type_id === 6)),
                holidays: data.filter((holiday) => 
                    !["Spring Break", "Summer Break", "Thanks Giving Break", "Winter Break", "Christmas Break", "Christmas"].includes(holiday.holiday_desc) || holiday.type_id === 1
                ),
            }; 
    
            // Ensure at least one default entry per subsection
            const ensureNonEmpty = (section, defaultEntry) => {
                return filteredSections[section].length ? filteredSections[section] : [defaultEntry];
            };
    
            setBreakSections({
                springBreak: ensureNonEmpty("springBreak", { id: 0, holiday_desc: "Spring Break", start_date: "", end_date: "", type: 1, start_time: "", end_time: "" }),
                summerBreak: ensureNonEmpty("summerBreak", { id: 0, holiday_desc: "Summer Break", start_date: "", end_date: "", type: 1, start_time: "", end_time: "" }),
                thanksGivingBreak: ensureNonEmpty("thanksGivingBreak", { id: 0, holiday_desc: "Thanks Giving Break", start_date: "", end_date: "", type: 1, start_time: "", end_time: "" }),
                winterBreak: ensureNonEmpty("winterBreak", { id: 0, holiday_desc: "Winter Break", start_date: "", end_date: "", type: 1, start_time: "", end_time: "" }),
                christmasBreak: ensureNonEmpty("christmasBreak", { id: 0, holiday_desc: "Christmas Break", start_date: "", end_date: "", type: 1, start_time: "", end_time: "" }),
                holidays: ensureNonEmpty("holidays", { id: 0, holiday_desc: "", start_date: "", type: 1, start_time: "", end_time: "" }),
            });
    
            initialBreakSectionsRef.current = JSON.parse(JSON.stringify(filteredSections));
        } else {
            setBreakSections({});
            initialBreakSectionsRef.current = {};
        }
    }, [data]);
    

    for (let i = 0; i < 6; i++) {
        years.push({ id: Year - i, label: Year - i, value: Year - i });
    }

    const yearChange = (e) => {
        setYear(e.target.value);
        setRefreshData(true);
    };

    const updatedSections = {};
    Object.keys(breakSections).forEach((section) => {
        const isEmptyHolidaySection = 
            section === 'holidays' && 
            breakSections[section].every(item => !item.holiday_desc);

        if (
            JSON.stringify(breakSections[section]) !== JSON.stringify(initialBreakSectionsRef.current[section]) &&
            !(isEmptyHolidaySection && breakSections[section].length === 1)
        ) {
            updatedSections[section] = breakSections[section].map((item) => {
                const extractTime = (dateTime) => {
                    if (dateTime instanceof Date && !isNaN(dateTime)) {
                        return dateTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
                    }
                    return dateTime; 
                };
                return {
                    ...item,
                    start_time: extractTime(item.start_time),
                    end_time: extractTime(item.end_time),
                };
            });
        }
    });

    const handleAddEntry = (section, title) => {
        const newEntry = {
            id: 0,
            holiday_desc: section === "holidays" ? "" : title,
            start_date: "",
            ...(title !== "Holidays" && { end_date: "" }),
            type: 1,
            start_time: "",
            end_time: "",
        };
        setBreakSections((prev) => ({  ...prev, [section]: [...prev[section], newEntry] }));
    };

    const handleDeleteEntry = async (section, index, id) => {
        try {
            if (id > 0) {
                const confirm = await SweetAlert.confirm("Are you sure?", "Are you sure you want to delete this record?");
                if (confirm) {
                    const deleteOffer = await apiRequest({ url: DELETEHOLIDAYCALENDAR + id, method: "delete" });
                    messagePop(deleteOffer);
    
                    if (deleteOffer.status === "success") {
                        setRefreshData(false);
                        let updatedSection = breakSections[section].filter(item => item.id !== id);
    
                        // Ensure there's always at least one row in the subsection
                        if (updatedSection.length === 0) {
                            updatedSection = [{
                                id: 0,
                                holiday_desc: section === "holidays" ? "" : section.replace(/([A-Z])/g, " $1").trim(),
                                start_date: "",
                                end_date: "",
                                type: 1,
                                start_time: "",
                                end_time: "",
                            }];
                        }
    
                        setBreakSections({ ...breakSections, [section]: updatedSection });
                    } else {
                        SweetAlert.error("Failed to delete the record: " + deleteOffer.message);
                    }
                }
            } else {
                let updatedSection = breakSections[section].filter((_, idx) => idx !== index);
                // Ensure at least one row remains
                if (updatedSection.length === 0) {
                    updatedSection = [{
                        id: 0,
                        holiday_desc: section === "holidays" ? "" : section.replace(/([A-Z])/g, " $1").trim(),
                        start_date: "",
                        end_date: "",
                        type: 1,
                        start_time: "",
                        end_time: "",
                    }];
                }
    
                setBreakSections({ ...breakSections, [section]: updatedSection });
            }
        } catch (error) {
            SweetAlert.error("Error in deleting the record: " + error);
        }
    };
    
    const handleUpdateEntry = (section, index, updatedItem) => {
        setBreakSections((prev) => {
            const updatedSections = prev[section].map((item, i) => {
                if (i === index) {
                    let newItem = { ...item, ...updatedItem };
    
                    // Validate date
                    if (newItem.start_date && newItem.end_date && new Date(newItem.start_date) > new Date(newItem.end_date)) {
                        SweetAlert.error("Start date must be before end date.");
                        delete newItem.end_date; // Prevent updating end_date
                    }
    
                    // Validate time
                    if (newItem.start_time && newItem.end_time && newItem.start_time > newItem.end_time) {
                        SweetAlert.error("Start time must be before end time.");
                        delete newItem.end_time; // Prevent updating end_time
                    }
    
                    return newItem;
                }
                return item;
            });
    
            return { ...prev, [section]: updatedSections };
        });
    };
    
    const handleSave = async () => {
        // Validate before submitting
        for (const section in breakSections) {
            for (const entry of breakSections[section]) {
                if (entry.start_date && entry.end_date && new Date(entry.start_date) > new Date(entry.end_date)) {
                    SweetAlert.error(`In ${section}, Start date must be before end date.`);
                    return;
                }
                if (entry.start_time && entry.end_time && entry.start_time > entry.end_time) {
                    SweetAlert.error(`In ${section}, Start time must be before end time.`);
                    return;
                }
            }
        }
    
        const data = { client_id: currentLocation, data: updatedSections, year: Year };
        const response = await apiRequest({
            url: HOLIDAYCALENDAR,
            method: "POST",
            data: data
        });
        messagePop(response);
    };
    
    const handleRefresh = () => {
        setYear(currentYear);
        setRefreshData(true); 
    };

    return (
        <div>
            <div className="row mb-3">
                <div className="col-md-12 mb-3 text-md-end">
                    <button className="ss_btn" onClick={handleSave}>Save Setting</button>
                </div>
                {locationloading ? (
                    <>
                        <div className="text-end mb-3">
                        <SkeletonLoader />
                        </div>
                    </>
                    ) : (
                    locationdt && (
                        <div className="col-md-12">
                            <div className="card border-0">
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col-md-3">
                                            <p className="fs-15 fw-semibold mb-0">Holiday Settings</p>
                                        </div>
                                        <div className="col-md-4">&nbsp;</div>
                                        <div className="col-md-3">
                                            <label className="form-label fs-12 fw-semibold">Location</label>
                                                {((locationloading) || (!currentLocation)) ? 'Loading...' : locationdt && <FormDropdown onChange={dropDownChange} name="location" options={locationdt.data} default_value={currentLocation} classnm="form-select fs-12" />}
                                        </div>
                                        <div className="col-md-1">
                                            <label className="form-label fs-12 fw-semibold">Year</label>
                                            <FormDropdown options={years} onChange={yearChange} value={Year} classnm="form-select fs-12" />
                                        </div>
                                        <div className="col-md-1">
                                            <label className="form-label fs-12 fw-semibold">Reset Year</label>
                                            <div  className="icon edit lnk f-ht-30" data-bs-title="Edit"  onClick={handleRefresh} >
                                                <i className="bi bi-arrow-clockwise"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
                {loading 
                    ? 
                    <SkeletonLoader height={400} />
                    : 
                <div>
                    <BreakSection title="Holidays" imgPath="./images/happy.png" data={breakSections.holidays}
                        onAdd={() => handleAddEntry("holidays","Holidays")}
                        onDelete={(index,id) => handleDeleteEntry("holidays", index ,id)}
                        onChange={(index, updatedItem) => handleUpdateEntry("holidays", index, updatedItem)}
                    />
                    <BreakSection title="Spring Break" imgPath="./images/break.png" data={breakSections.springBreak}
                        onAdd={() => handleAddEntry("springBreak","Spring Break")}
                        onDelete={(index,id) => handleDeleteEntry("springBreak", index,id)}
                        onChange={(index, updatedItem) => handleUpdateEntry("springBreak", index, updatedItem)}
                    />
                    <BreakSection title="Summer Break" imgPath="./images/sun-umbrella.png" data={breakSections.summerBreak}
                        onAdd={() => handleAddEntry("summerBreak","Summer Break")}
                        onDelete={(index,id) => handleDeleteEntry("summerBreak", index, id)}
                        onChange={(index, updatedItem) => handleUpdateEntry("summerBreak", index, updatedItem)}
                        />
                    <BreakSection title="Thanks Giving Break" imgPath="./images/leaves.png" data={breakSections.thanksGivingBreak}
                        onAdd={() => handleAddEntry("thanksGivingBreak","Thanks Giving Break")}
                        onDelete={(index,id) => handleDeleteEntry("thanksGivingBreak", index ,id)}
                        onChange={(index, updatedItem) => handleUpdateEntry("thanksGivingBreak", index, updatedItem)}
                        />
                    <BreakSection title="Winter Break" imgPath="./images/snowman.png" data={breakSections.winterBreak}
                        onAdd={() => handleAddEntry("winterBreak","Winter Break")}
                        onDelete={(index,id) => handleDeleteEntry("winterBreak", index, id)}
                        onChange={(index, updatedItem) => handleUpdateEntry("winterBreak", index, updatedItem)}
                        />
                    <BreakSection title="Christmas Break" imgPath="./images/snowman.png" data={breakSections.christmasBreak}
                        onAdd={() => handleAddEntry("christmasBreak","Christmas Break")}
                        onDelete={(index,id) => handleDeleteEntry("christmasBreak", index, id)}
                        onChange={(index, updatedItem) => handleUpdateEntry("christmasBreak", index, updatedItem)}
                        />
                </div>
             }
        </div>
    );
}