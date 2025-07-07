import React, { useEffect, useRef, useState } from 'react'
import FormDropdown from '../../components/FormDropdown'
import GetLocations from '../../hooks/Locations';
import DatePicker from '../../components/DatePicker';
import { useFormik } from 'formik';
import { useRequest } from '../../utils/Requests';
import { GETHOIDAYCAL, HOLIDAYCALENDAR, DELETEHOLIDAYCALENDAR } from '../../utils/Endpoints';
import { holidayTypes, messagePop, weekdays } from '../../utils/Common';
import * as Yup from 'yup';
import SweetAlert from '../../components/SweetAlert';
import SkeletonLoader from '../../components/SkeletonLoader';

// MODIFIED: Updated validation schema for time fields based on section dates
const holidayCalendarValidation = (options = {}) => {
    const { isBreakSection = false, sectionDates = null } = options;

    return Yup.object().shape({
        holiday_desc: Yup.string().when([], {
            is: () => !isBreakSection,
            then: schema => schema.required('Event description is required.'),
            otherwise: schema => schema.notRequired(),
        }),
        start_date: Yup.date().nullable().required('Start date is required.'),
        end_date: Yup.date().nullable().when('start_date', (start_date, schema) => {
            if (start_date && start_date[0]) {
                return schema.min(start_date[0], "End date must be after start date.");
            }
            return schema;
        }),
        type: Yup.number().required('Type is required.'),

        start_time: Yup.mixed().when(['start_date', 'end_date', 'type'], {
            is: (start_date, end_date, type) => {
                // Skip validation if type is 2 (full day)
                if (parseInt(type) === 2) return false;
                
                if (isBreakSection) {
                    // For break sections, check if section has both start and end dates
                    return sectionDates && sectionDates.start_date && sectionDates.end_date;
                } else {
                    // For holidays, require if start_date is set
                    return !!start_date;
                }
            },
            then: schema => schema.required("Opening time is required."),
            otherwise: schema => schema.notRequired(),
        }),
        end_time: Yup.mixed().when(['start_date', 'end_date', 'type'], {
            is: (start_date, end_date, type) => {
                // Skip validation if type is 2 (full day)
                if (parseInt(type) === 2) return false;
                
                if (isBreakSection) {
                    // For break sections, check if section has both start and end dates
                    return sectionDates && sectionDates.start_date && sectionDates.end_date;
                } else {
                    // For holidays, require if start_date is set
                    return !!start_date;
                }
            },
            then: schema => schema.required("Closing time is required.")
                .test('is-after-start-time', 'End time must be after start time.', function(value) {
                    const startTimeValue = this.parent.start_time;
                    if (startTimeValue instanceof Date && value instanceof Date) {
                        return value > startTimeValue;
                    }
                    return true;
                }),
            otherwise: schema => schema.notRequired(),
        }),
    });
};

const TblBody = ({ data = {}, onDelete, index, title, onChange, sectionDates = null }) => { // MODIFIED: Added sectionDates prop
    const upRef = useRef(false);
    const isBreakSection = title !== "Holidays";

    const { values, setFieldValue, errors, touched, handleBlur } = useFormik({
        initialValues: {
            id: data.id || 0,
            holiday_desc: data.holiday_desc || '',
            day_of_week: data.day_of_week,
            start_date: data.start_date && data.start_date !== "0000-00-00" ? new Date(data.start_date) : '',
            end_date: data.end_date && data.end_date !== "0000-00-00" ? new Date(data.end_date) : '',
            type: data.type || 1,
            start_time: data.start_time || '',
            end_time: data.end_time || '',
        },
        enableReinitialize: true,
        // MODIFIED: Pass sectionDates to validation
        validationSchema: holidayCalendarValidation({ isBreakSection, sectionDates }),
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

    const createChangeHandler = (field) => (val) => {
        const value = val.target ? val.target.value : val;
        setFieldValue(field, value);
        upRef.current = true;
    };

    const endDateChange = (date) => {
        if (!values.start_date || (date && new Date(values.start_date) <= new Date(date))) {
            setFieldValue("end_date", date);
        } else {
            SweetAlert.error("End date must be after start date.");
            setTimeout(() => setFieldValue("end_date", ""), 0);
        }
        upRef.current = true;
    }

    const holidayTypesChange = (e) => {
        const newType = parseInt(e.target.value);
        setFieldValue("type", newType);
        if (newType === 2) {
            setFieldValue("start_time", "");
            setFieldValue("end_time", "");
        }
        upRef.current = true;
    }

    useEffect(() => {
        if (upRef.current) {
            onChange({ ...values });
            upRef.current = false;
        }
    }, [values, onChange]);

    const isTimeDisabled = parseInt(values.type) === 2;
    const isDateDisabled = isBreakSection && index > 0;

    return (
        <tbody>
            <tr>
                {title === "Holidays" && (
                    <td>
                        <input type="text" className="form-control" value={values.holiday_desc} onChange={createChangeHandler("holiday_desc")} name="holiday_desc" onBlur={handleBlur} />
                        {errors.holiday_desc && touched.holiday_desc && <p className='text-danger fs-12'>{errors.holiday_desc}</p>}
                    </td>
                )}
                {isBreakSection && (
                     <td>
                        {weekdays.find(w => w.id === values.day_of_week)?.label || ''}
                    </td>
                )}
                <td>
                    <DatePicker value={values.start_date} onChange={createChangeHandler("start_date")} name="start_date" className="form-control" minDate={true} onBlur={handleBlur} disabled={isDateDisabled} />
                    {errors.start_date && touched.start_date && <p className='text-danger fs-12'>{errors.start_date}</p>}
                </td>
                {isBreakSection && (
                    <>
                        <td>
                            <DatePicker value={values.end_date || null} onChange={endDateChange} name="end_date" className="form-control" minDate={true} onBlur={handleBlur} disabled={isDateDisabled}/>
                            {errors.end_date && touched.end_date && <p className='text-danger fs-12'>{errors.end_date}</p>}
                        </td>
                    </>
                )}
                <td>
                    <FormDropdown options={holidayTypes} default_value={values.type} value={values.type} name="type" classnm="form-select"
                        onChange={holidayTypesChange} onBlur={handleBlur} />
                    {errors.type && touched.type && <p className='text-danger fs-12'>{errors.type}</p>}
                </td>
                <td>
                    <DatePicker value={isTimeDisabled ? null : startTime} onChange={createChangeHandler("start_time")} name="start_time" timeOnly onBlur={handleBlur} disabled={isTimeDisabled}/>
                    {errors.start_time && touched.start_time && <p className='text-danger fs-12'>{errors.start_time}</p>}
                </td>
                <td>
                    <DatePicker value={isTimeDisabled ? null : endTime} onChange={createChangeHandler("end_time")} name="end_time" timeOnly onBlur={handleBlur} disabled={isTimeDisabled}/>
                    {errors.end_time && touched.end_time && <p className='text-danger fs-12'>{errors.end_time}</p>}
                </td>
                <td>
                    {!isBreakSection && (
                         <span className="icon lnk delete" data-bs-title="Delete" onClick={() => {
                            if (values.id > 0) { onDelete(index, values.id); } else { onDelete(index); }
                        }}>
                            <i className="bi bi-trash-fill"></i>
                        </span>
                    )}
                </td>
            </tr>
        </tbody>
    );
};

const BreakSection = ({ title, imgPath, data, onAdd, onDelete, onChange }) => {
    const isBreakSection = title !== "Holidays";
    // MODIFIED: Calculate section dates for break sections
    const sectionDates = isBreakSection && data.length > 0 ? {
        start_date: data[0].start_date,
        end_date: data[0].end_date
    } : null;

    return (
        <div className="row mb-3">
            <div className="col-md-12">
                <div className="card border-0">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-12">
                                <p className="fs-12 fw-semibold mb-0"> <img src={imgPath} alt={title} />  {title}</p>
                            </div>
                        </div>
                        <div className="row align-items-center mt-10">
                            <div className="col-md-12">
                                <div className="ss-table table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                {title === "Holidays" && <th>Event</th>}
                                                {isBreakSection && <th>Day</th>}
                                                <th>{title === "Holidays" ? "Date" : "Start Date"}</th>
                                                {isBreakSection && <th>End Date</th>}
                                                <th>Type</th>
                                                <th>Opening Time</th>
                                                <th>Closing Time</th>
                                                <th>
                                                    {!isBreakSection ? (
                                                        <span className="me-2 icon lnk edit" data-bs-title="Add New" onClick={onAdd}> <i className="bi bi-plus-lg"></i></span>
                                                    ) : (
                                                        <span></span>
                                                    )}
                                                </th>
                                            </tr>
                                        </thead>
                                        {data.map((item, index) => (
                                            <TblBody 
                                                key={`${title}-${item.day_of_week}-${index}`} 
                                                data={item} 
                                                index={index} 
                                                title={title} 
                                                onDelete={onDelete} 
                                                onChange={(updatedItem) => onChange(index, updatedItem)}
                                                sectionDates={sectionDates} // MODIFIED: Pass section dates
                                            />
                                        ))}
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
        springBreak: [], summerBreak: [], winterBreak: [], thanksGivingBreak: [], christmasBreak: [],
        holidays: [{ id: 0, holiday_desc: "", start_date: "", type: 1, start_time: "", end_time: "" }],
    });
    const [data, setData] = useState([]);
    const years = [];

    const dropDownChange = (e) => {
        setCurrentLocation(e.target.value);
        setRefreshData(true);
    };

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
                setData(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        if (refreshData) {
            setRefreshData(false);
            getData();
        }
    }, [refreshData, currentLocation, Year, apiRequest]);

    useEffect(() => {
        const filteredSections = {
            springBreak: data.filter((h) => h.holiday_desc.trim() === "Spring Break" && h.type_id === 2),
            summerBreak: data.filter((h) => h.holiday_desc.trim() === "Summer Break" && h.type_id === 3),
            thanksGivingBreak: data.filter((h) => h.holiday_desc.trim() === "Thanks Giving Break" && h.type_id === 4),
            winterBreak: data.filter((h) => h.holiday_desc.trim() === "Winter Break" && h.type_id === 5),
            christmasBreak: data.filter((h) => (h.holiday_desc.trim() === "Christmas Break" || h.holiday_desc.trim() === "Christmas") && h.type_id === 6),
            holidays: data.filter((h) => !["Spring Break", "Summer Break", "Thanks Giving Break", "Winter Break", "Christmas Break", "Christmas"].includes(h.holiday_desc.trim()) || h.type_id === 1),
        };

        const ensureSevenRows = (sectionData, breakName) => {
            const masterRecord = sectionData.length > 0 ? sectionData[0] : null;

            return Array.from({ length: 7 }, (_, i) => {
                const daySpecificRecord = sectionData.find(d => parseInt(d.day_of_week) === i);
                return {
                    id: daySpecificRecord?.id || 0,
                    holiday_desc: breakName,
                    day_of_week: i,
                    start_date: masterRecord?.start_date || "",
                    end_date: masterRecord?.end_date || "",
                    type: daySpecificRecord?.type || masterRecord?.type || 1,
                    start_time: daySpecificRecord?.start_time || masterRecord?.start_time || "",
                    end_time: daySpecificRecord?.end_time || masterRecord?.end_time || "",
                };
            });
        };

        setBreakSections({
            springBreak: ensureSevenRows(filteredSections.springBreak, "Spring Break"),
            summerBreak: ensureSevenRows(filteredSections.summerBreak, "Summer Break"),
            thanksGivingBreak: ensureSevenRows(filteredSections.thanksGivingBreak, "Thanks Giving Break"),
            winterBreak: ensureSevenRows(filteredSections.winterBreak, "Winter Break"),
            christmasBreak: ensureSevenRows(filteredSections.christmasBreak, "Christmas Break"),
            holidays: filteredSections.holidays.length ? filteredSections.holidays : [{ id: 0, holiday_desc: "", start_date: "", type: 1, start_time: "", end_time: "" }],
        });
    }, [data]);

    for (let i = 0; i < 6; i++) {
        years.push({ id: Year - i, label: Year - i, value: Year - i });
    }

    const yearChange = (e) => {
        setYear(e.target.value);
        setRefreshData(true);
    };

    const extractTime = (dateTime) => {
        if (dateTime instanceof Date && !isNaN(dateTime)) {
            return dateTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
        }
        return dateTime;
    };

    const handleAddEntry = (section) => {
        const newEntry = { id: 0, holiday_desc: "", start_date: "", type: 1, start_time: "", end_time: "" };
        setBreakSections((prev) => ({ ...prev, [section]: [...prev[section], newEntry] }));
    };

    const handleDeleteEntry = async (section, index, id) => {
        try {
            if (id > 0) {
                if (await SweetAlert.confirm("Are you sure?", "Are you sure you want to delete this record?")) {
                    const deleteOffer = await apiRequest({ url: DELETEHOLIDAYCALENDAR + id, method: "delete" });
                    messagePop(deleteOffer);
                    if (deleteOffer.status === "success") setRefreshData(true);
                }
            } else {
                let updatedSection = breakSections[section].filter((_, idx) => idx !== index);
                if (updatedSection.length === 0) updatedSection = [{ id: 0, holiday_desc: "", start_date: "", type: 1, start_time: "", end_time: "" }];
                setBreakSections({ ...breakSections, [section]: updatedSection });
            }
        } catch (error) {
            SweetAlert.error("Error in deleting the record: " + error);
        }
    };
    
    const handleUpdateEntry = (section, index, updatedItem) => {
        setBreakSections((prev) => {
            const newSections = { ...prev };
            const currentSection = [...newSections[section]];
            const isBreakSection = section !== 'holidays';
            
            currentSection[index] = { ...currentSection[index], ...updatedItem };

            if (isBreakSection) {
                if ('start_date' in updatedItem || 'end_date' in updatedItem) {
                    const newStartDate = currentSection[index].start_date;
                    const newEndDate = currentSection[index].end_date;
                    for (let i = 0; i < 7; i++) {
                        currentSection[i].start_date = newStartDate;
                        currentSection[i].end_date = newEndDate;
                    }
                }
            }
            
            newSections[section] = currentSection;
            return newSections;
        });
    };

    const handleSave = async () => {
        const payloadData = {};
        // MODIFIED: This loop now includes all data from the state in the payload, without any filtering.
        Object.keys(breakSections).forEach((section) => {
            const sectionData = breakSections[section];
            // Map over all items in the section and format them for the payload.
            payloadData[section] = sectionData.map(item => ({
                ...item,
                start_time: extractTime(item.start_time),
                end_time: extractTime(item.end_time),
            }));
        });

        console.log("payloadData", payloadData);
        
        const data = { client_id: currentLocation, data: payloadData, year: Year };
        try {
            const response = await apiRequest({ url: HOLIDAYCALENDAR, method: "POST", data });
            messagePop(response);
            if(response.status === 'success'){
                setRefreshData(true);
            }
        } catch (error) {
            SweetAlert.error("An error occurred while saving.");
        }
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
                {locationloading ? ( <div className="text-end mb-3"><SkeletonLoader /></div>) : ( locationdt && (
                        <div className="col-md-12">
                            <div className="card border-0">
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col-md-3"><p className="fs-15 fw-semibold mb-0">Holiday Settings</p></div>
                                        <div className="col-md-4"> </div>
                                        <div className="col-md-3">
                                            <label className="form-label fs-12 fw-semibold">Location</label>
                                            <FormDropdown onChange={dropDownChange} name="location" options={locationdt.data} default_value={currentLocation} classnm="form-select fs-12" />
                                        </div>
                                        <div className="col-md-1">
                                            <label className="form-label fs-12 fw-semibold">Year</label>
                                            <FormDropdown options={years} onChange={yearChange} value={Year} classnm="form-select fs-12" />
                                        </div>
                                        <div className="col-md-1">
                                            <label className="form-label fs-12 fw-semibold">Reset Year</label>
                                            <div className="icon edit lnk f-ht-30" data-bs-title="Edit" onClick={handleRefresh}><i className="bi bi-arrow-clockwise"></i></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
            {loading ? <SkeletonLoader height={400} /> : (
                <div>
                    <BreakSection title="Holidays" imgPath="./images/happy.png" data={breakSections.holidays}
                        onAdd={() => handleAddEntry("holidays")}
                        onDelete={(index, id) => handleDeleteEntry("holidays", index, id)}
                        onChange={(index, updatedItem) => handleUpdateEntry("holidays", index, updatedItem)}
                    />
                    <BreakSection title="Spring Break" imgPath="./images/break.png" data={breakSections.springBreak}
                        onAdd={() => {}} onDelete={() => {}} onChange={(index, updatedItem) => handleUpdateEntry("springBreak", index, updatedItem)}
                    />
                    <BreakSection title="Summer Break" imgPath="./images/sun-umbrella.png" data={breakSections.summerBreak}
                        onAdd={() => {}} onDelete={() => {}} onChange={(index, updatedItem) => handleUpdateEntry("summerBreak", index, updatedItem)}
                    />
                    <BreakSection title="Thanks Giving Break" imgPath="./images/leaves.png" data={breakSections.thanksGivingBreak}
                        onAdd={() => {}} onDelete={() => {}} onChange={(index, updatedItem) => handleUpdateEntry("thanksGivingBreak", index, updatedItem)}
                    />
                    <BreakSection title="Winter Break" imgPath="./images/snowman.png" data={breakSections.winterBreak}
                        onAdd={() => {}} onDelete={() => {}} onChange={(index, updatedItem) => handleUpdateEntry("winterBreak", index, updatedItem)}
                    />
                    <BreakSection title="Christmas Break" imgPath="./images/snowman.png" data={breakSections.christmasBreak}
                        onAdd={() => {}} onDelete={() => {}} onChange={(index, updatedItem) => handleUpdateEntry("christmasBreak", index, updatedItem)}
                    />
                </div>
            )}
        </div>
    );
}