import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Accordion from '../../../components/Accordion'
import { useRequest } from '../../../utils/Requests';
import { CREATESCHEDULE, FUTURE_STAFF_LISTS } from '../../../utils/Endpoints';
import { Skeleton } from '@mui/material';
import { useFormik } from 'formik';
import { messagePop } from '../../../utils/Common';

const CheckBox = ({position, date, setSchedule}) => {
  const {values, setFieldValue} = useFormik({
    initialValues: {
      forDate: date,
      position: position
    },
    enableReinitialize: true,
  });

  const handleChange = (e) => {
    setFieldValue('position', e.target.value)
    if(e.target.checked){
      setSchedule(prev => [...prev, {...values}])
    }
  }

  return (
    <input className="form-check-input" type="checkbox" value={values.position} name='position' onChange={handleChange} />
  )
}

export default function StaffScheduling({currentLocation, weekNumber, year, filterClicked, setFilterClicked}) {
  const apiRequest = useRequest();
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finalRes, setFinalRes] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [createSchedule, setCreateSchedule] = useState(false);

  const handleAction = (e) => {
    const scheduleDate = e.target.value;
    const finalPositions = schedule.reduce((acc, singleSchedule) => singleSchedule.forDate === scheduleDate ? [...acc, singleSchedule.position] : acc, []);

    if(finalPositions.length > 0){
      setFinalRes({forDate: scheduleDate, client_id: currentLocation, pos: finalPositions});
      setCreateSchedule(true);
    }
  }

  useEffect(() => {
    const createNewSchedule = async () => {
      const response = await apiRequest({
          url: CREATESCHEDULE,
          method: "POST",
          data: finalRes
      });
      messagePop(response);
    }

    if(createSchedule){
      setCreateSchedule(false);
      createNewSchedule();
    }
  }, [finalRes, createSchedule, apiRequest])

  const formatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  useEffect(() => {
    const fetchRecords = async () => {
      let data = { weekPicker:`${year}-${weekNumber}`, client_id:currentLocation };
      const response = await apiRequest({url: FUTURE_STAFF_LISTS, method: "post", data});
      setWeeklySchedule(response.data);
      setLoading(false);
    };


    if (filterClicked && currentLocation && weekNumber !== null && year !== null) {
      fetchRecords();
      setFilterClicked(false);
    }
  }, [filterClicked, currentLocation, weekNumber, year, setFilterClicked, apiRequest])
  return (
    <div className="tab-pane fade active show" id="staffScheduling-tab-pane" role="tabpanel" aria-labelledby="staffScheduling-tab" tabIndex="0">
      <div className="row">
        <div className="col-12">
          <div className="card border-0 boxShadow">
            <div className="card-body">

              <div className="row mb-3">

                <div className="col-md-9">
                  <p className="fs-15 fw-semibold mb-3">Weekly Employee Schedule</p>
                </div>

                <div className="col-md-3 text-md-end">
                  <Link className="ss_btn">Download XLS</Link>
                </div>

              </div>

              {loading ? <Skeleton variant="rectangular" width="100%" height={400} className="skeleton-custom" />
              
              :

              <>
              {weeklySchedule.map((schedules, index) => (
                <React.Fragment key={index}>
                  <Accordion id={index} title={schedules.date} actionTitle="Create Schedule" actionValue={schedules.date} handleAction={handleAction} >
                    <div className="ss-table table-responsive">
                      <table className="table">
                        <thead>
                          {/* <tr>
                            <td colSpan="20">
                            
                            </td>
                          </tr> */}
                          <tr>
                            <th>Publish</th>
                            <th>Position</th>
                            <th>7 : 00 AM</th>
                            <th>8 : 00 AM</th>
                            <th>9 : 00 AM</th>
                            <th>10 : 00 AM</th>
                            <th>11 : 00 AM</th>
                            <th>12 : 00 PM</th>
                            <th>01 : 00 PM</th>
                            <th>02 : 00 PM</th>
                            <th>03 : 00 PM</th>
                            <th>04 : 00 PM</th>
                            <th>05 : 00 PM</th>
                            <th>06 : 00 PM</th>
                            <th>07 : 00 PM</th>
                            <th>08 : 00 PM</th>
                            <th>09 : 00 PM</th>
                            <th>10 : 00 PM</th>
                            <th>11 : 00 PM</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schedules.items.map((schedule, ind) => (
                            <tr key={ind}>
                              <td>
                                <div className="form-check">
                                {schedule.checkVal && <CheckBox date={schedules.date} position={schedule.Position} setSchedule={setSchedule} />}
                                </div>
                              </td>
                              <td>{schedule.Position}</td>
                              <td>{schedule[7] === 0 ? '' : schedule[7]}</td>
                              <td>{schedule[8] === 0 ? '' : schedule[8]}</td>
                              <td>{schedule[9] === 0 ? '' : schedule[9]}</td>
                              <td>{schedule[10] === 0 ? '' : schedule[10]}</td>
                              <td>{schedule[11] === 0 ? '' : schedule[11]}</td>
                              <td>{schedule[12] === 0 ? '' : schedule[12]}</td>
                              <td>{schedule[13] === 0 ? '' : schedule[13]}</td>
                              <td>{schedule[14] === 0 ? '' : schedule[14]}</td>
                              <td>{schedule[15] === 0 ? '' : schedule[15]}</td>
                              <td>{schedule[16] === 0 ? '' : formatter.format(schedule[16])}</td>
                              <td>{schedule[17] === 0 ? '' : schedule[17]}</td>
                              <td>{schedule[18] === 0 ? '' : schedule[18]}</td>
                              <td>{schedule[19] === 0 ? '' : schedule[19]}</td>
                              <td>{schedule[20] === 0 ? '' : schedule[20]}</td>
                              <td>{schedule[21] === 0 ? '' : schedule[21]}</td>
                              <td>{schedule[22] === 0 ? '' : schedule[22]}</td>
                              <td>{schedule[23] === 0 ? '' : schedule[23]}</td>
                              <td>{Math.round(schedule[7] + schedule[8] + schedule[9] + schedule[10] + schedule[11] + schedule[12] + schedule[13] + schedule[14] + schedule[15] + schedule[16] + schedule[17] + schedule[18] + schedule[19] + schedule[20] + schedule[21] + schedule[22] + schedule[23])}</td>
                            </tr>
                          ))}
                          
                        </tbody>
                      </table>
                    </div>
                  </Accordion>
                  <br />
                </React.Fragment>
              ))}
              </>
            }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
