import React, { useEffect, useState } from 'react'
import GetLocations from '../../hooks/Locations';
import FormDropdown from '../../components/FormDropdown';
import DatePickerComponent from '../../components/DatePicker';
import TrafficPrediction from './scheduling/TrafficPrediction';
import ActualVsPredicted from './scheduling/ActualVsPredicted';
import { getWeekNumber, weekdays } from '../../utils/Common';
import StaffScheduling from './scheduling/StaffScheduling';
import StaffSettings from './scheduling/StaffSettings';
import StaffSettings2 from './scheduling/StaffSettings2';
import ShiftCustomizing from './scheduling/ShiftCustomizing';

export default function Scheduling() {

    // TABS HANDLING
    const [activeTab, setActiveTab] = useState('predictedTraffic');
    const [showShiftCustomizing, setShowShiftCustomizing] = useState(false); 
    const [showStaffSetting2, setShowStaffSetting2] = useState(false); 
    const [filterClicked, setFilterClicked] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date('2019-11-16'));
    const [year, setYear] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleTabClick = (tab) => {
        setFilterClicked(true)
        setActiveTab(tab);
        if (tab === 'staffScheduling') {
            
            setShowShiftCustomizing(true);
            setShowStaffSetting2(false);
        } else if (tab === 'staffSetting') {
            
            setShowShiftCustomizing(false);
            setShowStaffSetting2(true);
        }
    };

    // LOCATION //
    const [currentLocation, setCurrentLocation] = useState(false);
    const { data: locationdt, loading: locationloading } = GetLocations();
    const dropDownChange = (e) => {
        setCurrentLocation(e.target.value);
        setFilterClicked(true)
    };

    useEffect(() => {
        if (!locationloading && locationdt) {
            setCurrentLocation(locationdt.data[0].value);
            const weeknumber = getWeekNumber(selectedDate);
            setWeekNumber(weeknumber);
            setLoading(true);

            const selectedYear = selectedDate.getFullYear();
            setYear(selectedYear);
        }
    }, [locationdt, locationloading, selectedDate]);


    // TAB CONTENT //
    const renderTabContent = () => {
        switch (activeTab) {
            case 'predictedTraffic':
                return (
                    <TrafficPrediction
                        currentLocation={currentLocation}
                        weekNumber={weekNumber}
                        year={year}
                        weekdays={weekdays}
                        filterClicked={filterClicked} 
                        setFilterClicked={setFilterClicked}
                    />
                );
            case 'actualvsPredictedSchedule':
                return (
                    <ActualVsPredicted 
                        currentLocation={currentLocation}
                        weekNumber={weekNumber}
                        year={year}
                        weekdays={weekdays}
                        filterClicked={filterClicked} 
                        setFilterClicked={setFilterClicked}
                    />
                );
            case 'staffScheduling':
                return (
                    <StaffScheduling
                        currentLocation={currentLocation}
                        weekNumber={weekNumber}
                        year={year}
                        weekdays={weekdays}
                        filterClicked={filterClicked} 
                        setFilterClicked={setFilterClicked}
                    />
                );
            case 'staffSetting':
                return(
                    <StaffSettings
                        currentLocation={currentLocation}
                        weekNumber={weekNumber}
                        year={year}
                        weekdays={weekdays}
                        filterClicked={filterClicked} 
                        setFilterClicked={setFilterClicked}
                        loading={loading}
                        setLoading={setLoading}
                    />
                );
            case 'staffSetting2': 
                return (
                    <StaffSettings2
                        currentLocation={currentLocation}
                        weekNumber={weekNumber}
                        year={year}
                        weekdays={weekdays}
                        filterClicked={filterClicked} 
                        setFilterClicked={setFilterClicked}
                        loading={loading}
                        setLoading={setLoading}
                    />
                );
            case 'ShiftCustomizing':
                return (
                    <ShiftCustomizing
                        currentLocation={currentLocation}
                        weekNumber={weekNumber}
                        year={year}
                        weekdays={weekdays}
                        filterClicked={filterClicked} 
                        setFilterClicked={setFilterClicked}
                        loading={loading}
                        setLoading={setLoading}
                    />
                );
            default:
                return null;
        }
    };
    
    // DATE CHANGE //
    // const [weekdayName, setWeekdayName] = useState('');
    // const [weekdayNumber, setWeekdayNumber] = useState(null);
    const [weekNumber,setWeekNumber] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const selectedYear = date.getFullYear();
        setYear(selectedYear);
        
        // const dayOfWeek = date.getDay(); 
        // const selectedWeekday = weekdays[dayOfWeek];
        // setWeekdayName(selectedWeekday.name);
        // setWeekdayNumber(selectedWeekday.number);
        const weeknumber = getWeekNumber(date);
        setWeekNumber(weeknumber);
    };

    const handleFilterClick = () => {
        setFilterClicked(true);
    };

  return (
    <>
        <div className="row mb-3">
            <div className="col-md-12">
                <div className="card border-0">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-9">
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fs-12 fw-semibold">Location</label>
                                {locationloading || !currentLocation
                                    ? "Loading..."
                                    : locationdt && (
                                    <FormDropdown onChange={dropDownChange} name="location" options={locationdt.data} default_value={currentLocation} classnm="form-select fs-12"/>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="row mb-3">
            <div className="col-md-12">
                <div className="card border-0">
                    <div className="card-body">
                        <div className="row align-items-end">
                            <div className="col-md-8">
                                <ul className="nav nav-tabs ss-nav-tabs" id="myTab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className={`nav-link ${activeTab === 'predictedTraffic' ? 'active' : ''}`}
                                            onClick={() => handleTabClick('predictedTraffic')}
                                        >
                                            Predicted Traffic
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className={`nav-link ${activeTab === 'actualvsPredictedSchedule' ? 'active' : ''}`}
                                            onClick={() => handleTabClick('actualvsPredictedSchedule')}
                                        >
                                            Actual vs Predicted Schedule
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className={`nav-link ${activeTab === 'staffScheduling' ? 'active' : ''}`}
                                            onClick={() => handleTabClick('staffScheduling')}
                                        >
                                            Staff Scheduling
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className={`nav-link ${activeTab === 'staffSetting' ? 'active' : ''}`}
                                            onClick={() => handleTabClick('staffSetting')}
                                        >
                                            Staff Setting
                                        </button>
                                    </li>
                                    {showShiftCustomizing && (
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${activeTab === 'ShiftCustomizing' ? 'active' : ''}`}
                                                onClick={() => handleTabClick('ShiftCustomizing')}
                                            >
                                                Shift Customizing
                                            </button>
                                        </li>
                                    )}
                                    {showStaffSetting2 && (
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${activeTab === 'staffSetting2' ? 'active' : ''}`}
                                                onClick={() => handleTabClick('staffSetting2')}
                                            >
                                                Staff Setting 2
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </div>
                            {['predictedTraffic', 'actualvsPredictedSchedule', 'staffScheduling'].includes(activeTab) && (
                                <div className="col-md-4">
                                    <div className="row align-items-end">
                                        <div className="col-md-8">
                                            <label htmlFor="searchProduct" className="form-label fs-12 fw-semibold">Week</label>
                                            <DatePickerComponent value={selectedDate} onChange={handleDateChange} className="fs-12 fw-500 form-control" showWeekPicker={true} />
                                        </div>
                                        <div className="col-md-4 mb-2 mt-3 mt-md-0 mb-sm-0">
                                            <button className="refreshbtn" onClick={handleFilterClick}>
                                                Filter
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="col-md-12 mt-3">
                                <div className="tab-content" id="myTabContent">
                                    {renderTabContent()}
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
