import React, { useEffect, useState } from 'react'
import Chart from '../../../components/Chart';
import { TRAFFIC_PREDICTION } from '../../../utils/Endpoints';
import { useRequest } from '../../../utils/Requests';
import { Skeleton } from '@mui/material';

export default function TrafficPrediction({currentLocation, weekNumber, year, filterClicked, setFilterClicked}) {

    const [walkinActual, setWalkinActual] = useState([]);
    const [birthdayActual, setBirthdayActual] = useState([]);
    const [walkinPredicted, setWalkinPredicted] = useState([]);
    const [birthdayPredicted, setBirthdayPredicted] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const apiRequest = useRequest();

    const getJumperForDay = (jumpers, day) => {
        const jumperVal = jumpers.find(jumper => jumper.weekday === day);
        return (jumperVal && jumperVal.total !== null) ? parseInt(jumperVal.total) : 0;
    }

    const getTotalForDay = (actual, predicted, day) => {
        const actualVal = actual.find(a => a.weekday === day);
        const actualDayVal = parseInt((actualVal && actualVal.total !== null) ? actualVal.total : 0);

        const predictedVal = predicted.find(a => a.weekday === day);
        const predictedDayVal = parseInt((predictedVal && predictedVal.total !== null) ? predictedVal.total : 0);

        return (actualDayVal + predictedDayVal);
    }

    // FIRST LOAD //
    useEffect(() => {

        const fetchJumpers = async () => {
            setIsLoading(true);
            let data = {
                weekPicker:`${year}-${weekNumber}`,
                client_id:currentLocation
            };

            const response = await apiRequest({
                url: TRAFFIC_PREDICTION,
                method: "post",
                data,
            });

            setWalkinActual(response?.data?.walkinActual);
            setBirthdayActual(response?.data?.birthdayActual);
            setWalkinPredicted(response?.data?.walkinPredicted);
            setBirthdayPredicted(response?.data?.birthdayPredicted);
            
        };
        if (filterClicked && currentLocation && weekNumber !== null && year !== null) {
            fetchJumpers();
            setFilterClicked(false);
            setIsLoading(false); 
        }
    }, [filterClicked, currentLocation, weekNumber, year, setFilterClicked, apiRequest]);


    // GRAPH //
    useEffect(() => {

        const chartData = [
            { category: "Mon", value1: getTotalForDay(walkinActual, birthdayActual, 1), value2: getTotalForDay(walkinPredicted, birthdayPredicted, 1) },
            { category: "Tues", value1: getTotalForDay(walkinActual, birthdayActual, 2), value2: getTotalForDay(walkinPredicted, birthdayPredicted, 2) },
            { category: "Wed", value1: getTotalForDay(walkinActual, birthdayActual, 3), value2: getTotalForDay(walkinPredicted, birthdayPredicted, 3) },
            { category: "Thurs", value1: getTotalForDay(walkinActual, birthdayActual, 4), value2: getTotalForDay(walkinPredicted, birthdayPredicted, 4) },
            { category: "Fri", value1: getTotalForDay(walkinActual, birthdayActual, 5), value2: getTotalForDay(walkinPredicted, birthdayPredicted, 5) },
            { category: "Sat", value1: getTotalForDay(walkinActual, birthdayActual, 6), value2: getTotalForDay(walkinPredicted, birthdayPredicted, 6) },
            { category: "Sun", value1: getTotalForDay(walkinActual, birthdayActual, 0), value2: getTotalForDay(walkinPredicted, birthdayPredicted, 0) },
        ];

        setChartData(chartData);
    }, [walkinActual, birthdayActual, walkinPredicted, birthdayPredicted])

    return (
    
    <div className="tab-pane fade active show" id="predictedTraffic-tab-pane" role="tabpanel" aria-labelledby="predictedTraffic-tab" tabIndex="0">
            <div className="row">
                <div className="col-md-12 mb-3">
                    <div className="card border-0 boxShadow">
                        <div className="card-body">
                            <p className="fs-15 fw-semibold mb-2">Predicted vs Actual</p>
                            {isLoading 
                            ? 
                                <Skeleton variant="rectangular" width="100%" height={250} className="skeleton-custom text-end"/> 
                            :
                                <Chart chartData={chartData} settings={false} />
                            }
                        </div>
                    </div>
                </div>
                <div className="col-md-12 mb-3">
                    <div className="card border-0 boxShadow">
                        <div className="card-body">
                            <p className="fs-15 fw-semibold mb-2">Traffic</p>
                            <div className="ss-table table-responsive">
                            {isLoading 
                            ? 
                                <Skeleton variant="rectangular" width="100%" height={250} className="skeleton-custom text-end"/> 
                            :
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                            <th>Monday</th>
                                            <th>Tuesday</th>
                                            <th>Wednesday</th>
                                            <th>Thursday</th>
                                            <th>Friday</th>
                                            <th>Saturday</th>
                                            <th>Sunday</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td rowSpan="3" className="td-blue-color">
                                                <div className="td-center">Actual</div>
                                            </td>
                                            <td className="fw-600">Walkin Jumpers</td>
                                            <td>{getJumperForDay(walkinActual, 1)}</td>
                                            <td>{getJumperForDay(walkinActual, 2)}</td>
                                            <td>{getJumperForDay(walkinActual, 3)}</td>
                                            <td>{getJumperForDay(walkinActual, 4)}</td>
                                            <td>{getJumperForDay(walkinActual, 5)}</td>
                                            <td>{getJumperForDay(walkinActual, 6)}</td>
                                            <td>{getJumperForDay(walkinActual, 0)}</td> 
                                        </tr>
                                        <tr>
                                            <td className="fw-600">Birthday Jumpers</td>
                                            <td>{getJumperForDay(birthdayActual, 1)}</td>
                                            <td>{getJumperForDay(birthdayActual, 2)}</td>
                                            <td>{getJumperForDay(birthdayActual, 3)}</td>
                                            <td>{getJumperForDay(birthdayActual, 4)}</td>
                                            <td>{getJumperForDay(birthdayActual, 5)}</td>
                                            <td>{getJumperForDay(birthdayActual, 6)}</td>
                                            <td>{getJumperForDay(birthdayActual, 0)}</td> 
                                        </tr>
                                        <tr className="fw-600">
                                            <td>Total</td>
                                            <td>{getTotalForDay(birthdayActual, walkinActual, 1)}</td>
                                            <td>{getTotalForDay(birthdayActual, walkinActual, 2)}</td>
                                            <td>{getTotalForDay(birthdayActual, walkinActual, 3)}</td>
                                            <td>{getTotalForDay(birthdayActual, walkinActual, 4)}</td>
                                            <td>{getTotalForDay(birthdayActual, walkinActual, 5)}</td>
                                            <td>{getTotalForDay(birthdayActual, walkinActual, 6)}</td>
                                            <td>{getTotalForDay(birthdayActual, walkinActual, 0)}</td> 
                                        </tr>
                                        <tr>
                                            <td rowSpan="3" className="td-green-color">
                                                <div className="td-center">
                                                    Predicted
                                                </div>
                                            </td>
                                            <td className="fw-600">Walkin Jumpers</td>
                                            <td>{getJumperForDay(walkinPredicted, 1)}</td>
                                            <td>{getJumperForDay(walkinPredicted, 2)}</td>
                                            <td>{getJumperForDay(walkinPredicted, 3)}</td>
                                            <td>{getJumperForDay(walkinPredicted, 4)}</td>
                                            <td>{getJumperForDay(walkinPredicted, 5)}</td>
                                            <td>{getJumperForDay(walkinPredicted, 6)}</td>
                                            <td>{getJumperForDay(walkinPredicted, 0)}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-600">Birthday Jumpers</td>
                                            <td>{getJumperForDay(birthdayPredicted, 1)}</td>
                                            <td>{getJumperForDay(birthdayPredicted, 2)}</td>
                                            <td>{getJumperForDay(birthdayPredicted, 3)}</td>
                                            <td>{getJumperForDay(birthdayPredicted, 4)}</td>
                                            <td>{getJumperForDay(birthdayPredicted, 5)}</td>
                                            <td>{getJumperForDay(birthdayPredicted, 6)}</td>
                                            <td>{getJumperForDay(birthdayPredicted, 0)}</td>
                                        </tr>
                                        <tr className="fw-600">
                                            <td>Total</td>
                                            <td>{getTotalForDay(birthdayPredicted, walkinPredicted, 1)}</td>
                                            <td>{getTotalForDay(birthdayPredicted, walkinPredicted, 2)}</td>
                                            <td>{getTotalForDay(birthdayPredicted, walkinPredicted, 3)}</td>
                                            <td>{getTotalForDay(birthdayPredicted, walkinPredicted, 4)}</td>
                                            <td>{getTotalForDay(birthdayPredicted, walkinPredicted, 5)}</td>
                                            <td>{getTotalForDay(birthdayPredicted, walkinPredicted, 6)}</td>
                                            <td>{getTotalForDay(birthdayPredicted, walkinPredicted, 0)}</td> 
                                        </tr>
                                    </tbody>
                                </table>
                            }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}
