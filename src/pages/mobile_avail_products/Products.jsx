import React, { useEffect, useState } from 'react'
import FormDropdown from '../../components/FormDropdown'
import GetLocations from '../../hooks/Locations';
import { useLocation } from 'react-router-dom';
import { useRequest } from '../../utils/Requests';
import { CREATETYPE, GET_PRODUCTS, UPDATE_STATUS } from '../../utils/Endpoints';
import { Skeleton } from '@mui/material';
import { messagePop, cards, available_prd_category, weekdays } from '../../utils/Common';
import SweetAlert from '../../components/SweetAlert';

export default function Products() {
    const apiRequest = useRequest();
    const location = useLocation();
    const [currentLocation, setCurrentLocation] = useState(false);
    // const [allLocation, setAllLocations] = useState([]);
    const [refreshRecords, setRefresRecords] = useState(true);
    const [cardType, setCardType] = useState("1");

    // ##
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [search, setSearch] = useState(null);

    const {data:locationdt, loading:locationloading} = GetLocations();

    // LOCATION CHANGE //
    const dropDownChange = (e) => {
        setCurrentLocation(e.target.value);
        setRefresRecords(true);
    }

    // TYPE CHANGE 
    const handleTypeChange = (e) => {
        setCardType(e.target.value);
        setRefresRecords(true);
    }

     // ONLOAD //
     useEffect(() => {

        if(!locationloading && locationdt){
            if(location.state !== null){
                setCurrentLocation(location?.state?.id);
                setRefresRecords(true);
            }else{
                setCurrentLocation(locationdt?.data[0]?.value);
            }
            // setAllLocations(locationdt.data);
        }

    }, [locationdt, locationloading, location.state]);

    // FETCH ONLOAD //
    useEffect(()=> {
        const getRewards = async () => {
            const records = await apiRequest({
                    url:GET_PRODUCTS, 
                    method:"get", 
                    params: {
                        client_id:currentLocation, 
                        card_id: cardType,
                    }
                });

                const updatedData = records?.data?.plans.map((product) => ({
                    ...product,
                    status: product.status !== undefined ? product.status : 1,
                    days_available: product.days_available && product.days_available.length > 0
                        ? product.days_available
                        : weekdays.map(day => day.id)
                }));
            setData(updatedData);
            // setData(records?.data?.plans);
            setLoading(false);
        }

        if(refreshRecords && currentLocation){
            setLoading(true);
            getRewards();
            setRefresRecords(false);
        }
    }, [apiRequest, refreshRecords, currentLocation, cardType]); // , search

    const changeOption = (id) => {
        setData((prevData) => 
            prevData.map((singleData) => 
                singleData.id === id ? {...singleData, status: singleData.status === 1 ? 0 : 1} : singleData
            )
        )
    };

    const updateStatus = async () => {
        const upData = data.map((dt) => ({id: dt.row_id, status: dt.status ,  days_available: dt.days_available}));
        const response = await apiRequest({url:UPDATE_STATUS, method:"POST", data: upData});

        if(response){
            messagePop(response);
        }
    }

    const changeCategory = async (key, row_id) => {

        const title = "Are you sure?";
        const text  = "Are you sure you want to change the product type?";
        const confirm = await SweetAlert.confirm(title, text);

        if(confirm){
            const cat_key = parseInt(key);
            const category = available_prd_category[cat_key];
            const formData = {
                "id": row_id,
                "type": category
            }

            const response = await apiRequest(
                { url: CREATETYPE, method: "POST", data: formData }
            );
        
            messagePop(response);
            if(response.status === 'success'){
                setRefresRecords(true);
            }
        }
    }

    const toggleDaySelection = (productId, dayId) => {
        setData((prevData) =>
            prevData.map((product) => {
                if (product.id === productId) {
                    let selectedDays = product.days_available ? product.days_available.split(",") : [];
    
                    if (selectedDays.includes(String(dayId))) {
                        selectedDays = selectedDays.filter((id) => id !== String(dayId)); // Remove day
                    } else {
                        selectedDays.push(String(dayId)); // Add day
                    }
    
                    return {
                        ...product,
                        days_available: selectedDays.join(",") // Convert back to string
                    };
                }
                return product;
            })
        );
    };

  return (
    <>
    {locationloading
        ? 
        <>
            <div className="text-end mb-3">              
                <Skeleton variant="rectangular" width="100%" height={80} className="skeleton-custom text-end" />
            </div>
                <Skeleton variant="rectangular" width="100%" height={100} className="skeleton-custom" />
        </> 
        : locationdt &&
        <>
            <div className="row mb-3">
                <div className="col-md-12">
                    <div className="card border-0">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <p className="fs-15 fw-semibold mb-0">Available Products</p>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fs-12 fw-semibold">Location</label>
                                    {((locationloading) || (!currentLocation)) ? 'Loading...' : locationdt && <FormDropdown onChange={dropDownChange} name="location" options={locationdt.data} default_value={currentLocation} classnm="form-select fs-12" />}
                                    
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fs-12 fw-semibold">Type</label>
                                    {((locationloading) || (!currentLocation)) ? 'Loading...' : locationdt && <FormDropdown onChange={handleTypeChange} name="location" options={cards} default_value={cardType} classnm="form-select fs-12" />}
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
        }
         
        <div className="accordion mt-3" id="accordionWithIcon">

            {loading 
            ? 
                <Skeleton variant="rectangular" width="100%" height={400} className="skeleton-custom" />
            : 
            <>
                <div className="text-end mb-3"><span type="button" className="ss_btn" onClick={updateStatus}>Update</span></div>

                <div className="table-responsive text-nowrap">
                    <table className="table table-bordered RjTable mb-0 data-table">
                        <thead>
                            <tr>
                                <th style={{width: 50}}>#</th>
                                <th style={{width: 50}}></th>
                                <th style={{width: 250}}>Description</th>
                                <th style={{width: 150}}>Type</th>
                                <th>Days</th>
                            </tr>
                        </thead>
                        <tbody>
                        {data?.map((product) => {
                            return (
                                <tr key={product.id}>
                                    <td><input type='checkbox' checked={(product.status === 1) ? true : false} onChange={() => changeOption(product.id)} /></td>
                                    <td className='flex-direction'>
                                        <img src={product.imageUrl} alt={product.name} className="rounded w-90" />
                                        <span className="fs-12">{product.name}</span>
                                    </td>
                                    <td><span className="fs-12" style={{textAlign: 'justify'}} title={product.description}>{product.description.slice(0, 40)}...</span></td>
                                    <td>
                                        <FormDropdown options={cards} classnm="form-select fs-12" default_value={cardType} onChange={(e) => changeCategory(e.target.value, product.row_id)} />
                                    </td>
                                    <td className="days-container">
                                        <div className="d-flex flex-wrap">
                                            {weekdays.map((day) => (
                                                <div key={day.id} className="day-item">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            product.days_available
                                                                ? String(product.days_available).split(",").includes(String(day.id))
                                                                : true 
                                                        }
                                                        onChange={() => toggleDaySelection(product.id, day.id)}
                                                    />
                                                    <label className="fs-12 lnk ms-1">{day.label}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </td>

                                    {/* <td className="days-container">
                                        <div className="d-flex flex-wrap">
                                            {weekdays.map((day) => (
                                            <div key={day.id} className="day-item">
                                                <input
                                                type="checkbox"
                                                checked={product.days_available?.split(",").includes(String(day.id))}
                                                onChange={() => toggleDaySelection(product.id, day.id)}
                                                />
                                                <label className="fs-12 lnk ms-1">{day.label}</label>
                                            </div>
                                            ))}
                                        </div>
                                    </td> */}
                                </tr>
                            )
                        })}
                        {/* REPEATING CARD */}
                        </tbody>
                    </table>
                </div>
                
            </>
            }

        </div>
                
    </>
  )
}
