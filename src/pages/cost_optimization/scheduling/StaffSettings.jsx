import React, { useEffect, useState } from 'react'
import Accordion from '../../../components/Accordion'
import { useRequest } from '../../../utils/Requests';
import { LISTSTAFFSETTINGS, SAVESTAFFSETTING } from '../../../utils/Endpoints';
import { Skeleton } from '@mui/material';
import FormDropdown from '../../../components/FormDropdown';
import { useFormik } from 'formik';
import { messagePop } from '../../../utils/Common';

const PayRateSingle = ({id, position, position_model, pay_rate, modelParams, upAll}) => {
    const [res, setRes] = useState({});
    const [upall, setUpall] = useState(false);
    const {values, setFieldValue} = useFormik({
        initialValues: {
            id:id,
            positionModel: position_model,
            payRate: pay_rate
        },
        enableReinitialize: true
    })

    useEffect(() => {
        if(Object.keys(res).length > 0 && upall){
            upAll(res);
            setUpall(false);
        }
    }, [res, upAll, upall])

    const handleModel = (e) => {
        setFieldValue('positionModel', e.target.value);
        setRes({id: values.id, position_model: e.target.value, pay_rate: values.payRate});
        setUpall(true)
    }

    const handleRate = (e) => {
        setFieldValue('payRate', e.target.value);
        setRes({id: values.id, position_model: values.positionModel, pay_rate: e.target.value})
        setUpall(true)
    }
    return (
        <tr>
            <td>{position}</td>
            <td>
                <FormDropdown name="positionModel" onChange={handleModel} options={modelParams} default_value={values.positionModel} aria-label="Default select example" classnm="form-select w-150" />
            </td>
            <td>
                <div className="input-group w-150">
                    <span className="input-group-text fw-600 bg-transparent fs-12" id="basic-addon1">$</span>
                    <input type="text" name='payRate' onChange={handleRate} value={values.payRate} className="form-control"  aria-label="Pay Rate" aria-describedby="basic-addon1" />
                </div>
            </td>
        </tr>
    )
}

export default function StaffSettings({currentLocation, weekNumber, year, filterClicked, setFilterClicked, loading, setLoading}) {
    const apiRequest = useRequest();
    const [payRateList, setPayRateList] = useState([]);
    const [modelParam, setModelParam] = useState([]);
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
            url: SAVESTAFFSETTING,
            method: "POST",
            data
        });
        messagePop(response);
        setFilterClicked(true)
    }
    

    useEffect(() => {
        const fetchRecords = async () => {
          let data = { client_id:currentLocation };
          const response = await apiRequest({url: LISTSTAFFSETTINGS, method: "post", data});

          setPayRateList(response?.data?.payRateListParamResult);
          setModelParam([...response?.data?.modelParamResult, {id:0, label:"Do Not Map", value:"N/A"}]);
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
                        <Accordion id="hourly-pay-rate" title="Hourly Pay Rate" defaultCollapse={true}>
                            <div className="ss-table table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Staff Shift</th>
                                            <th>Assign As</th>
                                            <th>Pay Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    
                                        {payRateList?.map((payRate, index) => (
                                            <PayRateSingle 
                                                key={index}
                                                id={payRate?.listParam?.id} 
                                                position={payRate?.position} 
                                                position_model={payRate?.listParam?.position_model} 
                                                modelParams={modelParam} 
                                                pay_rate={payRate?.listParam?.payRate}
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
