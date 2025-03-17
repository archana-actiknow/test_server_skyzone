import React, { useEffect, useState } from 'react'
import Accordion from '../../../components/Accordion'
import { useRequest } from '../../../utils/Requests'
import { SAVESHIFTCUSTOMIZATION, SHIFTCUSTOMIZATION } from '../../../utils/Endpoints';
import { Skeleton } from '@mui/material';
import { useFormik } from 'formik';
import { messagePop } from '../../../utils/Common';

const CustomShift = ({id, timeBefore, timeAfter, position, upAll}) => {
    const [res, setRes] = useState({});
    const [upall, setUpall] = useState(false);
    const {values, setFieldValue} = useFormik({
        initialValues:{
            id:(id === null) ? 0 : id,
            timeAfter: (timeAfter === null) ? 0 : timeAfter,
            timeBefore: (timeBefore === null) ? 0 : timeBefore
        },
        enableReinitialize: true
    });
    const handleTimeBefore = (e) => {
        setFieldValue('timeBefore', e.target.value);
        const pos = (values.id === 0) ? {position: position} : {}
        setRes({...values, timeBefore: parseInt(e.target.value), ...pos});
        setUpall(true)
    }

    const handleTimeAfter = (e) => {
        setFieldValue('timeAfter', e.target.value);
        const pos = (values.id === 0) ? {position: position} : {}
        setRes({...values, timeAfter: parseInt(e.target.value), ...pos});
        setUpall(true)
    }


    useEffect(() => {
        if(Object.keys(res).length > 0 && upall){
            upAll(res);
            setUpall(false);
        }
    }, [res, upAll, upall])

    return (
        <tr>
            <td>{position}</td>
            <td>
                <div className="input-group w-150">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="0" 
                        name='timeBefore' 
                        onChange={handleTimeBefore} 
                        onBlur={handleTimeBefore} 
                        value={values.timeBefore} 
                        aria-label="0" 
                        aria-describedby="basic-addon1" 
                    />
                </div>
            </td>
            <td>
                <div className="input-group w-150">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="0" 
                        name='timeAfter' 
                        onChange={handleTimeAfter} 
                        onBlur={handleTimeAfter} 
                        value={values.timeAfter} 
                        aria-label="0" 
                        aria-describedby="basic-addon1" 
                    />
                </div>
            </td>
        </tr>
    )
}

export default function ShiftCustomizing({currentLocation, weekNumber, year, filterClicked, setFilterClicked, loading, setLoading}) {
    const apiRequest = useRequest();
    const [customShifts, setCustomShifts] = useState([]);
    const [finalResponse, setFinalResponse] = useState([]);

    const upAll = (obj) => {
        setFinalResponse(prevFinalRes => {
            const ex = prevFinalRes.find(res => res.id === obj.id && res);

            if(ex){
                return prevFinalRes.map(res => res.id === obj.id ? {...obj} : res)
            }else{
                return [...prevFinalRes, {...obj}];
            }
        })
    }

    const saveStaffSettings = async () => {
        const data = {client_id: currentLocation, data: finalResponse};
        const response = await apiRequest({
            url: SAVESHIFTCUSTOMIZATION,
            method: "POST",
            data
        });
        messagePop(response);
        setFilterClicked(true)
    }

    useEffect(() => {
        const fetchRecords = async () => {
            let data = { client_id:currentLocation };
            const response = await apiRequest({url: SHIFTCUSTOMIZATION, method: "post", data});

            setCustomShifts(response?.data);
            setLoading(false);
        };
    
        if (filterClicked && currentLocation && weekNumber !== null && year !== null) {
            fetchRecords();
            setFilterClicked(false);
        }
    }, [filterClicked, currentLocation, weekNumber, year, setFilterClicked, apiRequest, setLoading])

    return (
    <div className="tab-pane fade active show" id="staffSetting-tab-pane" role="tabpanel" aria-labelledby="staffSetting-tab" tabIndex="0">
        <div className="card border-0 boxShadow">
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12 mb-3 text-md-end">
                    <button onClick={saveStaffSettings} className="ss_btn">Save Setting</button>
                    </div>
                    <div className="col-md-12 mb-3">

                    {loading ? <Skeleton variant="rectangular" width="100%" height={400} className="skeleton-custom" />
              
                    :

                        <Accordion id={1} title="Shift Customization" key={1} defaultCollapse={true}>
                            <div className="ss-table table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Staff Shift</th>
                                            <th>Time Add Before Shift(In Minutes)</th>
                                            <th>Time Add After Shift(In Minutes)</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {customShifts.map((shift, index) => (
                                            <CustomShift
                                                key={index}
                                                id={shift?.id}
                                                timeAfter={shift?.timeAfter}
                                                timeBefore={shift?.timeBefore}
                                                position={shift?.position}
                                                upAll={upAll}
                                            />
                                        ))}
                                        
                                    </tbody>
                                </table>
                            </div>
                        </Accordion>

                    }
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}
