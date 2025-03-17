import React, { useEffect, useState } from 'react'
import Chart from '../../../components/Chart';
import { useRequest } from '../../../utils/Requests';
import { HRS_COST_PREDICTION } from '../../../utils/Endpoints';
import { currencyFormat } from '../../../utils/Common';

export default function ActualVsPredicted({currentLocation, weekNumber, year, filterClicked, setFilterClicked}) {
    const apiRequest = useRequest();
    const [actualHrs, setActualHrs] = useState(0);
    const [predictedHrs, setPredictedHrs] = useState(0);
    const [hrsPerWeek, setHrsPerWeek] = useState(0);
    const [actualCost, setActualCost] = useState(0);
    const [predictedCost, setPredictedCost] = useState(0);
    const [costPerWeek, setCostPerWeek] = useState(0);
    const [costChart, setCostChart] = useState([]);
    const [hrsChart, setHrsChart] = useState([]);

    useEffect(() => {
        const fetchRecords = async () => {
            let data = { weekPicker:`${year}-${weekNumber}`, client_id:currentLocation };
            const response = await apiRequest({url: HRS_COST_PREDICTION, method: "post", data, });

            // ## ACTUAL //
            const scheduleHoursChart = {};
            const costScheduleChart = {};
            let scheduleHours = response?.data?.scheduleHours;
            const {TotalSchedule, TotalCostSchedule} = scheduleHours.length ? scheduleHours.reduce((acc, item) => {
                scheduleHoursChart[item.schedule_name] = item.PayrollHours;
                costScheduleChart[item.schedule_name] = item.PayrollCost;

                acc.TotalSchedule += parseInt(item.PayrollHours);
                acc.TotalCostSchedule += parseFloat(item.PayrollCost);

                return acc;
            }, {TotalSchedule:0, TotalCostSchedule:0}) : {TotalSchedule:0, TotalCostSchedule:0};
            setActualHrs(TotalSchedule);
            setActualCost(TotalCostSchedule);

            // ## PREDEICTED
            const predictedChart = {};
            const CostPredictedChart = {};
            let predictedHours = response?.data?.PredictedHours;
            const {TotalPredicted, TotalCostPredicted} = predictedHours.length ? predictedHours.reduce((acc, item) => {
                predictedChart[item?.mlistParam?.parameterName] = item.hrs;
                CostPredictedChart[item?.mlistParam?.parameterName] = item.payroll_cost;

                acc.TotalPredicted += parseInt(item.hrs);
                acc.TotalCostPredicted += parseFloat(item.payroll_cost);

                return acc;
            }, {TotalPredicted:0, TotalCostPredicted:0}) : {TotalPredicted:0, TotalCostPredicted:0};
            setPredictedHrs(TotalPredicted);
            setPredictedCost(TotalCostPredicted);

            // ## PER WEEK
            setHrsPerWeek(TotalSchedule - TotalPredicted)
            setCostPerWeek(TotalCostSchedule - TotalCostPredicted)

            // ## CHARTS DATA //
            let ListOfPosition = response?.data?.ListOfPosition;
            let hrsChart = [];
            let costChart = [];
            ListOfPosition?.forEach(item => {
                let hrsVal1 = (scheduleHoursChart[item.parameterName]) ? parseInt(scheduleHoursChart[item.parameterName]) : 0;
                let hrsVal2 = (predictedChart[item.parameterName]) ? parseInt(predictedChart[item.parameterName]) : 0;
                let costVal1 = costScheduleChart[item.parameterName] ? parseFloat(costScheduleChart[item.parameterName]) : 0;
                let costVal2 = CostPredictedChart[item.parameterName] ? parseFloat(CostPredictedChart[item.parameterName]) : 0;

                hrsChart = [...hrsChart, {category: item.parameterName, value1: hrsVal1, value2: hrsVal2}]
                costChart = [...costChart, {category: item.parameterName, value1: costVal1, value2: costVal2}]
            });
            setHrsChart(hrsChart)
            setCostChart(costChart)
        };

        if (filterClicked && currentLocation && weekNumber !== null && year !== null) {
            fetchRecords();
            setFilterClicked(false);
        }
    }, [filterClicked, currentLocation, weekNumber, year, setFilterClicked, apiRequest]);

  return (
    <div className="tab-pane fade active show" id="actualvsPredictedSchedule-tab-pane" role="tabpanel" aria-labelledby="actualvsPredictedSchedule-tab" tabIndex="0">
        <div className="row">
            <div className="col-md-6 mb-3">
                <div className="card border-0 boxShadow">
                    <div className="card-body">
                        <p className="fs-15 fw-semibold mb-3">Hours Saved</p>
                        <div className="row py-3">
                            <div className="col-md-8 col-12">
                                <div className="border-end">
                                    <div className="row">
                                        <div className="col-md-6 col-6">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <div className="ss-value">
                                                    <p>{actualHrs}</p>
                                                    <span>Actual</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-6">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <div className="ss-value">
                                                    <p>{predictedHrs}</p>
                                                    <span>Predicted</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-12 mt-md-0 mt-4">
                                <div className="d-flex align-items-center justify-content-center">
                                    <div className="ss-value">
                                        <p>{hrsPerWeek}</p>
                                        <span>Hours per Week</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6 mb-3">
                <div className="card border-0 boxShadow">
                    <div className="card-body">
                        <p className="fs-15 fw-semibold mb-3">$ Savings</p>
                        <div className="row py-3">
                            <div className="col-md-8 col-12">
                                <div className="border-end">
                                    <div className="row">
                                        <div className="col-md-6 col-6">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <div className="ss-value">
                                                    <p>{currencyFormat(actualCost)}</p>
                                                    <span>Actual</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-6">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <div className="ss-value">
                                                    <p>{currencyFormat(predictedCost)}</p>
                                                    <span>Predicted</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-12 mt-md-0 mt-4">
                                <div className="d-flex align-items-center justify-content-center">
                                    <div className="ss-value">
                                        <p>{currencyFormat(costPerWeek)}</p>
                                        <span>Cost Savings per week</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6 mb-3">
                <div className="card border-0 boxShadow">
                    <div className="card-body">
                        <p className="fs-15 fw-semibold mb-3">Actual vs Predicted Hours
                        </p>
                        <Chart chartData={hrsChart} settings={true} />
                    </div>
                </div>
            </div>
            <div className="col-md-6 mb-3">
                <div className="card border-0 boxShadow">
                    <div className="card-body">
                        <p className="fs-15 fw-semibold mb-3">Actual vs Predicted Cost
                        </p>
                        <Chart chartData={costChart} settings={true} />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
