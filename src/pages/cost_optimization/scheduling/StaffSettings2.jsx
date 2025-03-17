import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {useFormik} from 'formik'
import Accordion from '../../../components/Accordion'
import { useRequest } from '../../../utils/Requests';
import { LISTSTAFFSETTINGST, UPSTAFFSETTINGNEXT } from '../../../utils/Endpoints';
import { messagePop, weekdays } from '../../../utils/Common';
import FormDropdown from '../../../components/FormDropdown';
import { Link } from 'react-router-dom';

const ParkTiming = ({weekday, weekOpeningHrs, upOpeningHours}) => {
    
    const {values, handleChange} = useFormik({
        initialValues:{
            id: weekOpeningHrs ? weekOpeningHrs[weekday.label]?.id : 0,
            OpenStartTime: weekOpeningHrs ? weekOpeningHrs[weekday.label]?.OpenStartTime : '',
            OpenEndTime: weekOpeningHrs ? weekOpeningHrs[weekday.label]?.OpenEndTime : ''
        },
        enableReinitialize: true
    });

    const upHrs = () => {
        upOpeningHours(values);
    }

    return (
        <td>
            <table className="table table-borderless">
                <tbody>
                    <tr>
                        <td><input type="text" className="form-control w-55" value={values.OpenStartTime} onChange={handleChange} onBlur={upHrs} name='OpenStartTime' /></td>
                        <td><input type="text" className="form-control w-55" value={values.OpenEndTime} onChange={handleChange} onBlur={upHrs} name='OpenEndTime' /></td>
                    </tr>
                </tbody>
            </table>
        </td>
    )
}

const ShiftHours = ({keyVal, title, minval, maxval, minid, maxid, upShifts}) => {
    const {values, handleChange} = useFormik({
        initialValues: {
            min: minval,
            max: maxval,
        }
    });

    const changeMin = () => {
        const upNew = {id: minid, [keyVal]: values.min};
        upShifts(upNew);
    }

    const changeMax = () => {
        const upNew = {id: maxid, [keyVal]: values.max};
        upShifts(upNew);
    }

    return (
        <tr>
            <td>{title}</td>
            <td><input type="text" name='min' className="form-control w-55" value={values.min} onChange={handleChange} onBlur={changeMin} /></td>
            <td><input type="text" name='max' className="form-control w-55" value={values.max} onChange={handleChange} onBlur={changeMax} /></td>
        </tr>
    )
}

const PreOpeningRequiredStaff = ({model, weekname, modelValue, upStaff, id}) =>{
    const {values, handleChange} = useFormik({
        initialValues: {
            weekname: weekname,
            model: model,
            modelValue: modelValue ? modelValue[model] : ''
        }
    });

    const upInput = () => {
        const NewUp = {[values.model]: values.modelValue}
        upStaff(NewUp)
    }

    return <td key={id}><input type="text" name='modelValue' value={values.modelValue} className="form-control w-70" onChange={handleChange} onBlur={upInput} /></td>
}

const PreOpeningEvents = ({title, weekLable, PreOpeningEvent, ListModelParam, upPreOpeningEvents}) => {
    const [ReqStaff, setReqStaff] = useState({});
    const [OpeningEvent, setOpeningEvent] = useState({});

    const upRef = useRef(false);
    const {values, setFieldValue} = useFormik({
        initialValues: {
            id: PreOpeningEvent ? PreOpeningEvent[weekLable]?.id : 0, 
            checkRow: ((PreOpeningEvent) ? true : false),
            disableRow: ((PreOpeningEvent) ? false : true),
            StartTime: PreOpeningEvent ? PreOpeningEvent[weekLable]?.StartTime : '',
            EndTime: PreOpeningEvent ? PreOpeningEvent[weekLable]?.EndTime : '',
            requiredStaff: PreOpeningEvent ? PreOpeningEvent[weekLable]?.dayTest : ''
        },
        enableReinitialize: true
    });

    useEffect(() => {
        if(values.id !== 0)
            setOpeningEvent(prev => ({id: values.id, StartTime: values.StartTime, EndTime: values.EndTime, ...ReqStaff}));
        upRef.current = true;
    }, [values, ReqStaff, setOpeningEvent]);

    useEffect(() => {
        if(upRef.current && Object.keys(OpeningEvent).length !== 0){
            upPreOpeningEvents(OpeningEvent)
            upRef.current = false;
        }
    }, [OpeningEvent, upPreOpeningEvents]);

    const changeStartTime = (e) => {
        setFieldValue('StartTime', e.target.value);
        setOpeningEvent(prev => ({...prev, id: values.id, StartTime: e.target.value}))
        upRef.current = true;
    }
    const changeEndTime = (e) => {
        setFieldValue('EndTime', e.target.value);
        setOpeningEvent(prev => ({...prev, id: values.id, EndTime: e.target.value}))
        upRef.current = true;
    }

    return (
        <tr key={values.id}>
            <td>
                <table className="table table-borderless">
                    <tbody>
                        <tr>
                            <td>
                                <div className="form-check w-150">
                                    <input className="form-check-input" type="checkbox" value="" defaultChecked={values.checkRow} disabled={values.disableRow} />
                                    <label className="form-check-label" htmlFor="flexCheckChecked">{title}</label>
                                </div>
                            </td>
                            <td>
                                <input 
                                type="text"
                                    value={values.StartTime} name="StartTime"
                                    className="form-control w-55"
                                    // onBlur={upPreOpeningRequiredStaff} 
                                    onChange={changeStartTime} 
                                    disabled={values.disableRow} 
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={values.EndTime} 
                                    name="EndTime" 
                                    className="form-control w-55" 
                                    // onBlur={upPreOpeningRequiredStaff} 
                                    onChange={changeEndTime} 
                                    disabled={values.disableRow} 
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
            <td>
                <table className="table table-borderless">
                    <tbody key={values.id}>
                        <tr>
                            {ListModelParam?.map((listModel, index) => {
                                
                                return (
                                    <React.Fragment key={index}>
                                    {PreOpeningEvent ? 
                                        <PreOpeningRequiredStaff
                                            id={values.id}
                                            key={values.id}
                                            model={listModel.position_model}
                                            weekname={weekLable}
                                            modelValue={values.requiredStaff}
                                            upStaff={setReqStaff}
                                        />
                                    :
                                        <td><input type="text" className="form-control w-70" disabled={values.disableRow} /></td>
                                    }
                                    </React.Fragment>
                                )
                            })}
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    )
}

const PaidBreak = ({title, breakParam, upPaidBreak}) => {
    const {values, handleChange} = useFormik({
        initialValues: {
            id: breakParam ? breakParam?.id || 0 : 0,
            value: breakParam ? breakParam?.value || '' : ""
        },
        enableReinitialize: true
    });

    const upBreak = () => {
        upPaidBreak(values)
    }

    return (
        <tr>
            <td>{title}</td>
            <td><input type="text" name='value' className="form-control w-55" value={values.value} onChange={handleChange} onBlur={upBreak} /></td>
        </tr>
        
    )
}

const StaffCountComp = ({StaffCount, ListModelParam, upStaffCountComp}) => {
    const thresholds = {
        "0": "0-14",
        "15": "15-30",
        "31": "31-50",
        "51": "51-70",
        "71": "71-100",
        "100": "100+"
    };

    const {values} = useFormik({
        initialValues: {
            jumpers: thresholds[StaffCount?.threshold], 
        },
        enableReinitialize: true
    })
    return (
        <tr>
            <td>{values.jumpers}</td>
            {ListModelParam?.map((listModel, index) => (
                <StaffCountParamModel listModel={listModel} key={index} StaffCount={StaffCount} upStaffCountParamModel={upStaffCountComp} />
            ))}
        </tr>
    )
}

const StaffCountParamModel = ({listModel, StaffCount, upStaffCountParamModel}) => {
    const {values, handleChange} = useFormik({
        initialValues:{
            id: StaffCount.id,
            modelStarffCount: StaffCount[listModel.position_model],
            posistionModel: listModel.position_model
        },
        enableReinitialize: true
    });

    const upStaffCount = () => {
        const upNew = {id: values.id, [values.posistionModel]: values.modelStarffCount};
        upStaffCountParamModel(upNew);

    }

    return (
        <td><input type="text" name='modelStarffCount' className="form-control w-55" value={values.modelStarffCount} onChange={handleChange} onBlur={upStaffCount} /></td>
    )
}

const StaffModelShift = ({type, shift, model, upStaff}) => {

    const {values, handleChange} = useFormik({
        initialValues:{
            id: shift ? shift.id : 0,
            type: type,
            shiftTime: shift ? shift[model] : "",
        },
        enableReinitialize: true
    })

    const upStaffShift = () => {
        const upNew = {id: values.id, [model]: values.shiftTime};
        upStaff(upNew);
    }
    return (
        <td><input type="text" name="shiftTime" className="form-control w-55" value={values.shiftTime} onChange={handleChange} onBlur={upStaffShift} /></td>
    )
}

const StaffShiftNew = ({ListModelParam, Shift, index, delItem, upNew}) => {

    const [StaffModelShiftVar, setStaffModelShiftVar] = useState(Shift);
    const [StaffModleShiftRes, setStaffModleShiftRes] = useState({});
    const FinalPrevObj = useRef();
    
    const types =  [
        { id: 1, value: 1, label: "Opening"},
        { id: 2, value: 2, label: "Closing"},
    ];

    const sType = {'Staff minimum (opening shift)': 1, 'Staff minimum (closing shift)': 2};
    
    
    const {values, setFieldValue} = useFormik({
        initialValues:{
            keyv: index,
            id: Shift ? Shift.id : 0,
            weekday: (Shift && Shift.weekday !== '') ? Shift.weekday : weekdays[0].value,
            type: (Shift && Shift.parameter !== '') ? sType[Shift.parameter] : types[0].value,
        },
        enableReinitialize: true
    });

    const changeWeekday = (e) => {
        setFieldValue('weekday', e.target.value);
    }

    const typeChange = (e) => {
        setFieldValue('type', e.target.value);
    }

    const FinalObj = useMemo(() => {
        const sType1 = {1: 'Staff minimum (opening shift)', 2: 'Staff minimum (closing shift)'};
        setStaffModelShiftVar(prev => ({...prev, ...StaffModleShiftRes}));
        return {id: values.id, weekday: values.weekday, parameter: sType1[parseInt(values.type)], ...StaffModleShiftRes};;
    }, [values, StaffModleShiftRes]);

    const debouncedUpNew = useCallback(() => {
        if(FinalPrevObj.current && JSON.stringify(FinalPrevObj.current) !== JSON.stringify(FinalObj)){
            upNew(FinalObj);
        }
        FinalPrevObj.current = FinalObj;
    }, [FinalObj, upNew]);

    useEffect(() => {
            debouncedUpNew();
    }, [debouncedUpNew]);


    
   return (
        <tr>
            <td>
                <FormDropdown name="weekday" options={weekdays} default_value={values.weekday} aria-label="Default select example" onChange={changeWeekday} classnm="form-select w-150" />
            </td>
            <td>
                <FormDropdown name="type" options={types} default_value={values.type} aria-label="Default select example" onChange={typeChange} classnm="form-select w-150" />
            </td>
            {ListModelParam?.map((listModel, index) => (
                <StaffModelShift type={values.type} shift={StaffModelShiftVar} model={listModel.position_model} key={index} upStaff={setStaffModleShiftRes} />
            ))}

            {Shift && <td><span className="icon delete" data-bs-title="Delete" value={values.keyv} onClick={() => delItem(values.keyv)}><i className="bi bi-trash-fill"></i></span></td>}
        </tr>
    )
}

export default function StaffSettings2({currentLocation, weekNumber, year, filterClicked, setFilterClicked, loading, setLoading}) {
    const apiRequest = useRequest();
    const [ListModelParam, setListModelParam] = useState([]);
    const [PreOpeningEventListParam, setPreOpeningEventListParam] = useState([]);
    const [OpeningHourListParam, setOpeningHourListParam] = useState([]);
    const [PaidBreakListParam, setPaidBreakListParam] = useState({});
    const [BreakDurationListParam, setBreakDurationListParam] = useState({});
    const [ShiftHoursListParam, setShiftHoursListParam] = useState([]);
    const [StaffCountListParam, setStaffCountListParam] = useState([]);
    const [StaffMinimumListParam, setStaffMinimumListParam] = useState([]);
    const [allStaffMinimumListParam, setallStaffMinimumListParam] = useState([]);
    const [closingStaffMinimumListParam, setclosingStaffMinimumListParam] = useState([]);
    const [upStaffShiftings, setUpStaffShiftings] = useState([]);

    useEffect(() => {
        const fetchRecords = async () => {
            let data = { client_id:currentLocation };
            const response = await apiRequest({url: LISTSTAFFSETTINGST, method: "post", data});
            setListModelParam(response?.data?.ListModelParam);
            setPreOpeningEventListParam(response?.data?.PreOpeningEventListParam);
            setOpeningHourListParam(response?.data?.OpeningHourListParam);
            setPaidBreakListParam(response?.data?.PaidBreakListParam);
            setBreakDurationListParam(response?.data?.BreakDurationListParam);
            setShiftHoursListParam(response?.data?.ShiftHoursListParam);
            setStaffCountListParam(response?.data?.StaffCountListParam);
            setStaffMinimumListParam(response?.data?.StaffMinimumListParam);
            setallStaffMinimumListParam(response?.data?.allStaffMinimumListParam);
            setclosingStaffMinimumListParam(response?.data?.closingStaffMinimumListParam);
            setLoading(false);

        };
    
        if (filterClicked && currentLocation && weekNumber !== null && year !== null) {
            fetchRecords();
            setFilterClicked(false);
        }

    }, [filterClicked, currentLocation, weekNumber, year, setFilterClicked, apiRequest, setLoading]);

    const addAllStaffMinListParam = () => {
        const NewList = [...allStaffMinimumListParam, {
            "id": 0,
            "client": currentLocation,
            "parameter": "",
            "weekday": "",
            "man": "",
            "cafe": "",
            "park": "",
            "desk": "",
            "jump": "",
            "gman": "",
            "lead": "",
            "floater": ""
        }]
        setallStaffMinimumListParam(NewList);
    }
    
    const delItem = (ind) => {
        const NewList = allStaffMinimumListParam.filter((list, index) => {
            return (index !== ind && list)
        })
        setallStaffMinimumListParam(NewList);
    }

    // COMMON UPDATE FUNCTION //
    const upAll = (obj) => {
        setUpStaffShiftings(prev => {
            var NewUp = prev.map(single => (single.id === obj.id && obj.id !== 0) ? {...single, ...obj} : single);

            if(!prev.some(single => single.id === obj.id) || (obj.id === 0)){
                NewUp = [...prev, obj];
            }

            return NewUp;
        })
    }
    // SAVE SETTINGS //
    const saveSettings = async () => {
        const data = {client_id: currentLocation, data: upStaffShiftings};
        const response = await apiRequest({
            url: UPSTAFFSETTINGNEXT,
            method: "POST",
            data
        });
        messagePop(response);
    }

    return (
    <div className="tab-pane fade active show" id="staffSetting-tab-pane" role="tabpanel" aria-labelledby="staffSetting-tab" tabIndex="0">
        <div className="card border-0 boxShadow">
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12 mb-3 text-md-end">
                        <button onClick={saveSettings} className='ss_btn'>Save Setting</button>
                    </div> 

                    {!loading && 
                    <div className="col-md-12 mb-3">
                        
                        {/* REGULAR PARK TIMING */}
                        <Accordion id={1} addClass="mt-20" title="Regular Park Timing">
                            <div className="ss-table table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Events</th>
                                            {weekdays.map((weekday, index) => {
                                                const currentIndex = (index + 1) % weekdays.length;
                                                return (
                                                <th className="text-center" key={index}>{weekdays[currentIndex].shortLabel}</th>
                                            )})}
                                        </tr>
                                        <tr>
                                            <th></th>
                                            <th>
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th className="border-0">Open</th>
                                                            <th className="border-0">Close</th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </th>
                                            <th>
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th className="border-0">Open</th>
                                                            <th className="border-0">Close</th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </th>
                                            <th>
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th className="border-0">Open</th>
                                                            <th className="border-0">Close</th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </th>
                                            <th>
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th className="border-0">Open</th>
                                                            <th className="border-0">Close</th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </th>
                                            <th>
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th className="border-0">Open</th>
                                                            <th className="border-0">Close</th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </th>
                                            <th>
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th className="border-0">Open</th>
                                                            <th className="border-0">Close</th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </th>
                                            <th>
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th className="border-0">Open</th>
                                                            <th className="border-0">Close</th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Park Timing</td>
                                            {weekdays.map((weekday, index) => {
                                                const currentIndex = (index + 1) % weekdays.length;
                                                const OpeningHours = OpeningHourListParam.find(openingHr => openingHr.hasOwnProperty(weekdays[currentIndex].label));

                                                return (
                                                <ParkTiming
                                                    key={index}
                                                    weekday={weekdays[currentIndex]}
                                                    weekOpeningHrs={OpeningHours}
                                                    upOpeningHours={upAll}
                                                />
                                            )})}
                                        </tr>                                                                                        
                                    </tbody>
                                </table>
                            </div>
                        </Accordion>

                        {/* PRE OPENING EVENT */}
                        {ListModelParam &&
                        <Accordion id={2} addClass="mt-20" title="Pre Opening Event">
                            <div className="ss-table table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th className="td-bg-color">
                                            </th>
                                            <th className="text-center">Staff Required</th>
                                        </tr>
                                        <tr>
                                            <th className="td-bg-color">
                                                <table className="table table-borderless">
                                                    <thead>
                                                        <tr>
                                                            <th className="td-bg-color">Pre Opening Event</th>
                                                            <th className="text-center w-55 td-bg-color">Open Time</th>
                                                            <th className="text-center w-55 td-bg-color">Close Time</th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </th>
                                            <th>
                                                <table className="table table-borderless">
                                                    <thead>
                                                        <tr>
                                                            {ListModelParam?.map((listModel, index) => (
                                                                <th className="text-center w-70" key={index}>{listModel?.parameterName}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {weekdays.map((weekday) => {
                                            const PreOpeningEvent = PreOpeningEventListParam.find(paidBreak => paidBreak.hasOwnProperty(weekday?.label) && paidBreak);

                                            return (
                                                <PreOpeningEvents 
                                                    key={weekday?.id}
                                                    title={weekday?.shortLabel}
                                                    weekLable={weekday?.label} 
                                                    PreOpeningEvent={PreOpeningEvent}
                                                    ListModelParam={ListModelParam}
                                                    upPreOpeningEvents={upAll}
                                                />
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Accordion>
                        }

                        {/* BREAK HOURS */}
                        {PaidBreakListParam && BreakDurationListParam && 
                        <Accordion id={3} addClass="mt-20" title="Break Hours">
                            <div className="ss-table table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Event</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <PaidBreak
                                            title="Paid Break after how many hrs?"
                                            breakParam={PaidBreakListParam}
                                            upPaidBreak={upAll}
                                        />
                                        <PaidBreak
                                            title="Break Duration in minutes"
                                            breakParam={BreakDurationListParam}
                                            upPaidBreak={upAll}
                                        />
                                    </tbody>
                                </table>
                            </div>
                        </Accordion>
                        }

                        {/* SHIFT MINIMUM HOURS */}
                        {ListModelParam && ShiftHoursListParam &&
                        <Accordion id={4} addClass="mt-20" title="Shift Minimum Hours">
                            <div className="ss-table table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Staff Shift</th>
                                            <th>Min Hrs.</th>
                                            <th>Max Hrs.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ListModelParam.map((listModel, index) => (
                                            <ShiftHours 
                                                key={index}
                                                title={listModel.parameterName} 
                                                keyVal={listModel.position_model}
                                                minval={ShiftHoursListParam[0][listModel.position_model]} 
                                                maxval={ShiftHoursListParam[1][listModel.position_model]} 
                                                minid={ShiftHoursListParam[0].id}
                                                maxid={ShiftHoursListParam[1].id}
                                                upShifts={upAll}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Accordion>
                        }

                        {/* STAFF COUNT */}
                        {ListModelParam &&
                        <Accordion id={5} addClass="mt-20" title="Staff Count (Enter Minimum staff count required based on jumpers)">
                            <div className="ss-table table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th># Jumpers</th>
                                            {ListModelParam?.map((listModel, index) => (
                                                <th key={index}>{listModel.parameterName}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {StaffCountListParam && 
                                            StaffCountListParam.map((StaffCount, index) => 
                                                <StaffCountComp StaffCount={StaffCount} ListModelParam={ListModelParam} key={index} upStaffCountComp={upAll} />
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </Accordion>
                        }

                        {/* MINIMUM REQUIRED STAFF */}
                        {ListModelParam &&
                        <Accordion id={6} addClass="mt-20" title="Minimum staff required in opening/closing shift">
                            <div className="ss-table table-responsive mb-3">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Day of Week</th>
                                            {ListModelParam?.map((listModel, index) => (
                                                <th key={index}>{listModel?.parameterName}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="fw-600" colSpan="7">Default</td>
                                        </tr>
                                        <tr>
                                            <td>Opening Shift</td>
                                            {ListModelParam?.map((listModel, index) => (
                                                <StaffModelShift key={index} type="Opening" shift={StaffMinimumListParam} model={listModel?.position_model} upStaff={upAll} />
                                            ))}
                                        </tr>
                                        <tr>
                                            <td>Closing Shift</td>
                                            {ListModelParam?.map((listModel, index) => (
                                                <StaffModelShift key={index} type="Closing" shift={closingStaffMinimumListParam} model={listModel?.position_model} upStaff={upAll} />
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="row">
                                <div className="col-12 text-md-end mb-3">
                                    <Link className="ss_btn" onClick={addAllStaffMinListParam}>Add Field</Link>
                                </div>
                                <div className="col-md-12">
                                    <div className="ss-table table-responsive mb-3">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Day of Week</th>
                                                    <th>&nbsp;</th>
                                                    {ListModelParam?.map((listModel, index) => (
                                                        <th key={index}>{listModel?.parameterName}</th>
                                                    ))}
                                                    {allStaffMinimumListParam.length > 0 && <th>&nbsp;</th> }
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allStaffMinimumListParam.length > 0
                                                ?
                                                    allStaffMinimumListParam.map((singleShift, index) => (<StaffShiftNew upNew={upAll} delItem={delItem} ListModelParam={ListModelParam} Shift={singleShift} key={index} index={index} />))
                                                :
                                                    <StaffShiftNew upNew={upAll} delItem={delItem} ListModelParam={ListModelParam} />
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </Accordion>
                        }

                    </div>
                    }

                </div>
            </div>
        </div>
    </div>
  )
}
