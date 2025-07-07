import React, { useEffect, useRef, useState } from 'react'
import FormDropdown from '../../components/FormDropdown'
import GetLocations from '../../hooks/Locations';
import DatePicker from '../../components/DatePicker';
import { useFormik } from 'formik';
import { useRequest } from '../../utils/Requests';
import { GETHOIDAYCAL, HOLIDAYCALENDAR, DELETEHOLIDAYCALENDAR } from '../../utils/Endpoints';
import { holidayTypes, messagePop, Weekdays } from '../../utils/Common';
import { holidayCalendarValidation } from '../../utils/validationSchemas';
import SweetAlert from '../../components/SweetAlert';
import SkeletonLoader from '../../components/SkeletonLoader';

const TblBody = ({ data = {}, onDelete, index, title, onChange, isFixed = false }) => {
    const upRef = useRef(false);
    const { values, setFieldValue, errors, touched, handleBlur, setFieldTouched } = useFormik({
        initialValues: {
            id: data.id || 0,
            holiday_desc: data.holiday_desc || '',
            weekday: data.weekday || '',
            start_date: data.start_date && data.start_date !== "0000-00-00" ? new Date(data.start_date) : '',
            end_date: data.end_date && data.end_date !== "0000-00-00" ? new Date(data.end_date) : '',
            type: data.type || 1,
            start_time: data.start_time || '',
            end_time: data.end_time || '',
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
            return timeString;
        }
        return defaultTime;
    };

    const startTime = values.start_time ? setTime(values.start_time) : '';
    const endTime = values.end_time ? setTime(values.end_time) : '';

    const startDateChange = (date) => {
        setFieldValue("start_date", date);
        upRef.current = true;
    }

    // const endDateChange = (date) => {
    //     setFieldValue("end_date", date);
    //     upRef.current = true;
    // }

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

    // const endTimeChange = (time) => {
    //     setFieldValue("end_time", time);
    //     upRef.current = true;
    // }

    const endTimeChange = (time) => {
        const startTimeAsDate = values.start_time ? setTime(values.start_time) : null;
        if (!startTimeAsDate || (time && startTimeAsDate <= time)) {
            setFieldValue("end_time", time);
        } else {
            SweetAlert.error("End time must be after start time.");
            setTimeout(() => setFieldValue("end_time", values.end_time || ""), 0);
        }
        upRef.current = true;
    }
    

    const descriptionChange = (e) => {
        setFieldValue("holiday_desc", e.target.value);
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

    const isTimeDisabled = parseInt(values.type) === 2 || parseInt(values.type) === 3 ;
    const areDatesDisabled = isFixed && index > 0;

    return (
        <tbody>
            <tr>
                <td>
                    <input
                        type="text"
                        className="form-control"
                        value={isFixed ? values.weekday : values.holiday_desc}
                        onChange={descriptionChange}
                        name="holiday_desc"
                        onBlur={handleBlur} 
                        readOnly={isFixed}
                    />
                    {errors.holiday_desc && touched.holiday_desc && <p className='text-danger fs-12'>{errors.holiday_desc}</p>}
                </td>

                <td>
                    <DatePicker value={values.start_date} onChange={startDateChange} name="start_date" className="form-control" onBlur={() => setFieldTouched('start_date', true)} disabled={areDatesDisabled} />
                    {errors.start_date && touched.start_date && <p className='text-danger fs-12'>{errors.start_date}</p>}
                </td>
                
                {title !== "Holidays" && (
                    <td>
                        <DatePicker value={values.end_date || null} onChange={endDateChange} name="end_date" className="form-control" onBlur={() => setFieldTouched('end_date', true)} disabled={areDatesDisabled} />
                        {errors.end_date && touched.end_date && <p className='text-danger fs-12'>{errors.end_date}</p>}
                    </td>
                )}

                <td>
                    <FormDropdown options={holidayTypes} value={values.type} name="type" classnm="form-select" onChange={holidayTypesChange} onBlur={handleBlur} />
                    {errors.type && touched.type && <p className='text-danger fs-12'>{errors.type}</p>}
                </td>
                <td>
                    <DatePicker value={isTimeDisabled ? null : startTime} onChange={startTimeChange} name="start_time" timeOnly onBlur={() => setFieldTouched('start_time', true)} disabled={isTimeDisabled} />
                    {errors.start_time && touched.start_time && <p className='text-danger fs-12'>{errors.start_time}</p>}
                </td>
                <td>
                    <DatePicker value={isTimeDisabled ? null : endTime} onChange={endTimeChange} name="end_time" timeOnly onBlur={() => setFieldTouched('end_time', true)} disabled={isTimeDisabled} />
                    {errors.end_time && touched.end_time && <p className='text-danger fs-12'>{errors.end_time}</p>}
                </td>
                <td>
                    {!isFixed && (
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

const BreakSection = ({ title, imgPath, data, onAdd, onDelete, onChange, isFixed = false }) => {
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
                                                <th>{isFixed ? "Day" : "Event"}</th>
                                                <th>{title === "Holidays" ? "Date" : "Start Date"}</th>
                                                {title !== "Holidays" && <th>End Date</th>}
                                                <th>Type</th>
                                                <th>Opening Time</th>
                                                <th>Closing Time</th>
                                                <th>
                                                    {!isFixed && (
                                                        <span className="me-2 icon lnk edit" data-bs-title="Add New" onClick={onAdd}>
                                                            <i className="bi bi-plus-lg"></i>
                                                        </span>
                                                    )}
                                                </th>
                                            </tr>
                                        </thead>
                                        {data.map((item, index) => (
                                            <TblBody key={item.id || index} data={item} index={index} title={title} onDelete={onDelete} onChange={(updatedItem) => onChange(index, updatedItem)} isFixed={isFixed} />
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
    const initialDataRef = useRef(null);

    const createWeekdayBreakData = (breakName) => Weekdays.map(day => ({
        id: 0, holiday_desc: breakName, weekday: day,
        start_date: "", end_date: "", type: 1, start_time: "", end_time: "",
    }));

    const [breakSections, setBreakSections] = useState({
        holidays: [{ id: 0, holiday_desc: "", start_date: "", type: 1, start_time: "", end_time: "" }],
        springBreak: createWeekdayBreakData("Spring Break"),
        summerBreak: createWeekdayBreakData("Summer Break"),
        winterBreak: createWeekdayBreakData("Winter Break"),
        thanksGivingBreak: createWeekdayBreakData("Thanks Giving Break"),
        christmasBreak: createWeekdayBreakData("Christmas Break"),
    });

    const [data, setData] = useState([]);
    const years = [];

    const formatTimeFromAPI = (hour, minute) => {
        if (hour === null || hour === undefined || hour === 0 && (minute === null || minute === undefined)) {
            return '';
        }
        const date = new Date();
        date.setHours(parseInt(hour, 10), parseInt(minute || 0, 10), 0, 0);
        return date;
    };
    
    const breakNameMapping = {
        "Spring Break": "springBreak",
        "Summer Break": "summerBreak",
        "Winter Break": "winterBreak",
        "Thanks Giving Break": "thanksGivingBreak",
        "Christmas Break": "christmasBreak",
    };

    const dropDownChange = (e) => { setCurrentLocation(e.target.value); setRefreshData(true); };

    useEffect(() => { if (!locationloading && locationdt) { setCurrentLocation(locationdt.data[0].value); setRefreshData(true); } }, [locationdt, locationloading]);

    const formatDateForAPI = (date) => {
        if (date instanceof Date && !isNaN(date)) {
            return date.toISOString().split('T')[0];
        }
        return "";
    };

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const data = { client_id: currentLocation, year: Year };
                const response = await apiRequest({ url: GETHOIDAYCAL, method: "post", data: data});
                if (Array.isArray(response.data)) {
                    setData(response.data);
                } else {
                    setData([]);
                }
            } catch (error) { console.error("Error fetching data:", error); setData([]); }
            finally { setLoading(false); }
        };

        if (refreshData) { setRefreshData(false); getData(); }
    }, [refreshData, currentLocation, Year, apiRequest]);

    useEffect(() => {
        let processedSections = {
            holidays: [],
            springBreak: [], summerBreak: [], winterBreak: [],
            thanksGivingBreak: [], christmasBreak: [],
        };

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(apiItem => {
                const transformedItem = {
                    id: apiItem.id,
                    holiday_desc: apiItem.description,
                    weekday: apiItem.weekday,
                    start_date: apiItem.startDate ? new Date(apiItem.startDate) : '',
                    end_date: apiItem.endDate ? new Date(apiItem.endDate) : '',
                    type: (apiItem.startTime === null || apiItem.startTime === 0) ? 2 : 1,
                    start_time: formatTimeFromAPI(apiItem.startTime, apiItem.startTimeMinutes),
                    end_time: formatTimeFromAPI(apiItem.endTime, apiItem.endTimeMinutes),
                };

                if (apiItem.parameter === "National Holiday") {
                    processedSections.holidays.push(transformedItem);
                } else if (apiItem.parameter === "School break") {
                    const sectionKey = breakNameMapping[apiItem.description];
                    if (sectionKey && processedSections[sectionKey]) {
                        processedSections[sectionKey].push(transformedItem);
                    }
                }
            });
        }
        Object.keys(breakNameMapping).forEach(breakName => {
            const sectionKey = breakNameMapping[breakName];
            const apiDataForBreak = processedSections[sectionKey];
            const defaultData = createWeekdayBreakData(breakName);

            const mergedData = defaultData.map(dayData => {
                const foundApiData = apiDataForBreak.find(apiItem => apiItem.weekday === dayData.weekday);
                return foundApiData ? { ...foundApiData, holiday_desc: breakName } : dayData;
            });
            processedSections[sectionKey] = mergedData;
        });

        if (processedSections.holidays.length === 0) {
            processedSections.holidays = [{ id: 0, holiday_desc: "", start_date: "", type: 1, start_time: "", end_time: "" }];
        }

        setBreakSections(processedSections);
        initialDataRef.current = JSON.parse(JSON.stringify(processedSections));

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
        return dateTime || "";
    };

     const getFriendlySectionName = (key) => {
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    }
    const isFormValid = () => {
        for (const [sectionKey, items] of Object.entries(breakSections)) {
            if (sectionKey === 'holidays') continue;

            for (const item of items) {
                const hasDates = item.start_date && item.end_date;
                const isPartialDay = parseInt(item.type) === 1;
                const hasTimes = item.start_time && item.end_time;

                if (isPartialDay && hasDates && !hasTimes) {
                    SweetAlert.error(`In the "${getFriendlySectionName(sectionKey)}" section, you must provide both a start and end time when dates are set.`);
                    return false;
                }
            }
        }
        return true;
    };

    
    const handleSave = async () => {
         if (!isFormValid()) {
            return;
        }
        const changedData = {};
        const initialSections = initialDataRef.current;

        if (!initialSections) {
            SweetAlert.error("Data is not ready. Please wait and try again.");
            return;
        }

        const areItemsEqual = (item1, item2) => {
            const dateToString = (date) => (date instanceof Date ? date.toISOString().split('T')[0] : (date || null));
            const timeToString = (time) => {
                if (time instanceof Date) return time.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
                return time || null;
            };

            return (
                item1.holiday_desc === item2.holiday_desc &&
                (item1.weekday || null) === (item2.weekday || null) &&
                dateToString(item1.start_date) === dateToString(item2.start_date) &&
                dateToString(item1.end_date) === dateToString(item2.end_date) &&
                parseInt(item1.type) === parseInt(item2.type) &&
                timeToString(item1.start_time) === timeToString(item2.start_time) &&
                timeToString(item1.end_time) === timeToString(item2.end_time)
            );
        };

        for (const sectionKey of Object.keys(breakSections)) {
            const currentItems = breakSections[sectionKey];
            const initialItems = initialSections[sectionKey] || [];
            const sectionChanges = [];
            for (const currentItem of currentItems) {
                if (currentItem.id === 0) {
                    if (sectionKey === 'holidays' && !currentItem.holiday_desc && !currentItem.start_date) {
                        continue; 
                    }
                    sectionChanges.push(currentItem);
                } else {
                    const originalItem = initialItems.find(item => item.id === currentItem.id);
                    if (originalItem && !areItemsEqual(currentItem, originalItem)) {
                        sectionChanges.push(currentItem);
                    }
                }
            }
            if (sectionChanges.length > 0) {
                changedData[sectionKey] = sectionChanges.map(item => ({
                    ...item,
                    start_date: formatDateForAPI(item.start_date),
                    end_date: formatDateForAPI(item.end_date),
                    start_time: extractTime(item.start_time),
                    end_time: extractTime(item.end_time),
                    weekday: item.weekday || null,
                }));
            }
        }
        
        if (Object.keys(changedData).length === 0) {
            SweetAlert.info("No changes to save.");
            return;
        }
        const dataToPost = { client_id: currentLocation, data: changedData };

        try {
            setLoading(true);
            const response = await apiRequest({
                url: HOLIDAYCALENDAR,
                method: "POST",
                data: dataToPost
            });
            messagePop(response);
            if (response.status === 'success') {
                setRefreshData(true);
            }
        } catch (error) {
            SweetAlert.error("Failed to save settings: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEntry = (section) => {
        const newEntry = { id: 0, holiday_desc: "", start_date: "", type: 1, start_time: "", end_time: "" };
        setBreakSections((prev) => ({ ...prev, [section]: [...prev[section], newEntry] }));
    };

    const handleDeleteEntry = async (section, index, id) => {
        try {
            if (id > 0) {
                const confirm = await SweetAlert.confirm("Are you sure?", "Are you sure you want to delete this record?");
                if (confirm) {
                    const deleteOffer = await apiRequest({ url: DELETEHOLIDAYCALENDAR + id, method: "delete" });
                    messagePop(deleteOffer);
                    if (deleteOffer.status === "success") { setRefreshData(true); }
                }
            } else {
                let updatedSection = breakSections[section].filter((_, idx) => idx !== index);
                if (updatedSection.length === 0) {
                    updatedSection = [{ id: 0, holiday_desc: "", start_date: "", type: 1, start_time: "", end_time: "" }];
                }
                setBreakSections({ ...breakSections, [section]: updatedSection });
            }
        } catch (error) { SweetAlert.error("Error in deleting the record: " + error); }
    };
    
    const handleUpdateEntry = (section, index, updatedItem) => {
        const isFixedSection = section !== 'holidays';
        if (isFixedSection) {
            setBreakSections(prev => {
                const sourceOfTruth = { ...prev[section][index], ...updatedItem };
                const oldStartDate = prev[section][index].start_date ? new Date(prev[section][index].start_date).getTime() : null;
                const newStartDate = sourceOfTruth.start_date ? new Date(sourceOfTruth.start_date).getTime() : null;
                const oldEndDate = prev[section][index].end_date ? new Date(prev[section][index].end_date).getTime() : null;
                const newEndDate = sourceOfTruth.end_date ? new Date(sourceOfTruth.end_date).getTime() : null;
                const anyDateDidChange = (oldStartDate !== newStartDate) || (oldEndDate !== newEndDate);
    
                const updatedSectionData = prev[section].map((item, i) => {
                    if (i === index) { return sourceOfTruth; }
                    if (anyDateDidChange) {
                        return { ...item, start_date: sourceOfTruth.start_date, end_date: sourceOfTruth.end_date };
                    }
                    return item;
                });
                return { ...prev, [section]: updatedSectionData };
            });
        } else {
            setBreakSections(prev => {
                const updatedSectionData = [...prev[section]];
                updatedSectionData[index] = { ...updatedSectionData[index], ...updatedItem };
                return { ...prev, [section]: updatedSectionData };
            });
        }
    };
    
    const handleRefresh = () => { setYear(currentYear); setRefreshData(true); };

    return (
        <div>
            <div className="row mb-3">
                <div className="col-md-12 mb-3 text-md-end">
                    <button className="ss_btn" onClick={handleSave}>Save Setting</button>
                </div>
                {locationloading ? ( <div className="text-end mb-3"><SkeletonLoader /></div> ) : (
                    locationdt && (
                        <div className="col-md-12">
                            <div className="card border-0">
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col-md-3">
                                            <p className="fs-15 fw-semibold mb-0">Holiday Settings</p>
                                        </div>
                                        <div className="col-md-4"> </div>
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
                                            <div className="icon edit lnk f-ht-30" data-bs-title="Edit" onClick={handleRefresh} >
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
            {loading ? <SkeletonLoader height={400} /> :
                <div>
                    <BreakSection title="Holidays" imgPath="./images/happy.png" data={breakSections.holidays} isFixed={false}
                        onAdd={() => handleAddEntry("holidays")}
                        onDelete={(index, id) => handleDeleteEntry("holidays", index, id)}
                        onChange={(index, updatedItem) => handleUpdateEntry("holidays", index, updatedItem)}
                    />
                    <BreakSection title="Spring Break" imgPath="./images/break.png" data={breakSections.springBreak} isFixed={true}
                        onChange={(index, updatedItem) => handleUpdateEntry("springBreak", index, updatedItem)}
                    />
                    <BreakSection title="Summer Break" imgPath="./images/sun-umbrella.png" data={breakSections.summerBreak} isFixed={true}
                        onChange={(index, updatedItem) => handleUpdateEntry("summerBreak", index, updatedItem)}
                    />
                    <BreakSection title="Thanks Giving Break" imgPath="./images/leaves.png" data={breakSections.thanksGivingBreak} isFixed={true}
                        onChange={(index, updatedItem) => handleUpdateEntry("thanksGivingBreak", index, updatedItem)}
                    />
                    <BreakSection title="Winter Break" imgPath="./images/snowman.png" data={breakSections.winterBreak} isFixed={true}
                        onChange={(index, updatedItem) => handleUpdateEntry("winterBreak", index, updatedItem)}
                    />
                    <BreakSection title="Christmas Break" imgPath="./images/snowman.png" data={breakSections.christmasBreak} isFixed={true}
                        onChange={(index, updatedItem) => handleUpdateEntry("christmasBreak", index, updatedItem)}
                    />
                </div>
            }
        </div>
    );
}