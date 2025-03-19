import React, { useEffect, useState } from 'react'
import { useRequest } from '../../utils/Requests';
import { messagePop} from '../../utils/Common';
import { Link, useNavigate ,useLocation} from 'react-router-dom';
import SweetAlert from '../../components/SweetAlert';
import { FETCHLOCATIONS, UPDATELOCATION, UPDATESTATUSCHANGE } from '../../utils/Endpoints';
import GetLocations from "../../hooks/Locations";
import FormDropdown from "../../components/FormDropdown";
import { Skeleton } from "@mui/material";

export default function LocationSetup() {
    const location = useLocation();
    const [data, setData] = useState([]);
    const [refreshRecords, setRefreshRecords] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(false);
    const navigate = useNavigate();
    const apiRequest = useRequest();
    const { data: locationdt, loading: locationloading } = GetLocations();

    // DROPDOWNS CHANGE //
    const dropDownChange = (e) => {
        setCurrentLocation(e.target.value);
        setRefreshRecords(true);
    };

    // ONLOAD //
    useEffect(() => {
        if (!locationloading && locationdt) {
            if (location.state !== null) {
            setCurrentLocation(location.state?.id);
            setRefreshRecords(true);
            } else {
            setCurrentLocation(locationdt.data[0].value);
            }
        }
    }, [locationdt, locationloading, location.state]);
    

    // COMPONENT MOUNTING / UPDATING
    useEffect(() => {
        const getRecords = async () => {
            try {
                const response = await apiRequest({ 
                    url: `${FETCHLOCATIONS}?id=${currentLocation}`, 
                    method: "get",
                });
                if (response?.status === "success" && response?.data) {
                    const listing = response.data;
                    setData(listing);
                } else {
                    console.error("Unexpected API response:", response);
                }
            } catch (error) {
                console.error("Error fetching records:", error);
            } finally {
                setRefreshRecords(false);
            }
        };
    
        if (refreshRecords && currentLocation) {
            getRecords();
        }
    }, [refreshRecords, apiRequest,currentLocation]);

    useEffect(()=>{
        setRefreshRecords(true);
    }, [])

    const handleEditClick = async (id) => {
        const response = await apiRequest({
            url: `${FETCHLOCATIONS}?id=${id}`,
            method:"get"});

        navigate(`/edit-location`, {
          state: {
            id: id,
            locationData: response?.data,
          },
        });
    };

    // STATUS CHANGE USER //
    const handleStatusChange = async (id) => {
        const title = "Are you sure?";
        const text  = "Are you sure you want to change the status ?";
        const confirm = await SweetAlert.confirm(title, text);

        if(confirm){
            const data = await apiRequest({
                url:UPDATESTATUSCHANGE,
                 method:"POST",
                data:{id:id}});
            setRefreshRecords(true);
            messagePop(data)
        }
    }

    // DELETE USER //
    // const handleDelete = async (id) => {
    //     const title = "Are you sure?";
    //     const text  = "Are you sure you want to change the status ?";
    //     const confirm = await SweetAlert.confirm(title, text);

    //     if(confirm){
    //         const data = await apiRequest({
    //             url:UPDATESTATUSCHANGE,
    //              method:"POST",
    //             data:{
    //                 id:id,
    //                 deleted:1
    //             }});
    //         setRefreshRecords(true);
    //         messagePop(data)
    //     }
    // }

    // const handleCafeChange = async (id, cafe_module) => {
    //     const title = "Are you sure?";
    //     const text  = "Are you sure you want to change the fuel zone module visibility ?";
    //     const confirm = await SweetAlert.confirm(title, text);

    //     if(confirm){
    //         const upCafeVisibility = { id: id, cafe_module:(cafe_module) ? 0 : 1};
    //         const data = await apiRequest( {url: UPDATELOCATION, method: "POST", data: upCafeVisibility});
    //         setRefreshRecords(true);
    //         messagePop(data)
    //     }
    // }

    const handleCafeChange = async (id, cafe_module) => {
        const title = "Are you sure?";
        const text  = "Are you sure you want to change the fuel zone module visibility?";
        const confirm = await SweetAlert.confirm(title, text);
    
        if (confirm) {
            const upCafeVisibility = { id: id, cafe_module: !cafe_module }; // Toggle true/false
            const data = await apiRequest({ url: UPDATELOCATION, method: "POST", data: upCafeVisibility });
            setRefreshRecords(true);
            messagePop(data);
        }
    };

  return (
    <>
        <div className='text-end mb-3'>
            <Link to="/add-locations" className="ss_btn">Add Locations</Link>
        </div>

        {locationloading ? (

        <>
            <div className="text-end mb-3">
            <Skeleton variant="rectangular" width="100%" height={80} className="skeleton-custom text-end"/>
            </div>
        </>

        ) : (

            locationdt && (
                <div className="row mb-2" >
                    <div className="col-md-12">
                    <div className="card border-0">
                        <div className="card-body">
                            <div className="row align-items-center">

                                <div className="col-md-6">
                                <p className="fs-15 fw-semibold mb-0">Location Setup</p>
                                </div>

                                <div className='col-md-3'>

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
            )
        )}

        <div className="row align-items-center">
            <div className="col-md-12 mb-2">
                <div className="card border-0">
                    <div className="card-body hide-overflow">
                        {/* <div className="d-flex align-items-center justify-content-between mb-3">
                            <h2></h2>
                            <div className="d-flex align-items-center">
                                <Link className={`product-status me-2 ${data.cafe_module === true ? "product-active" : "product-inactive" }`} title={`Click to ${(data.cafe_module === true ? 'deactivate' : 'activate')}`} onClick={() => handleCafeChange(data.client_id, data.cafe_module)}>
                                    {data.cafe_module === true ? "Fuel Zone : visible" : "Fuel Zone : hidden"}
                                </Link>
                                <Link className={`product-status me-2 ${data.status === "1" ? "product-active" : "product-inactive" }`} title={`Click to ${(data.status === "1" ? 'deactivate' : 'activate')}`} onClick={() => handleStatusChange(data.client_id)}>
                                    {data.status === "1" ? "Active" : "Inactive"}
                                </Link>
                                <Link  onClick={() => handleEditClick(data.client_id)} className="me-2 icon edit" title="Edit" data-bs-title="Edit" >
                                    <i className="bi bi-pencil-square"></i>
                                </Link>
                                <Link className="icon delete" title="Delete" data-bs-title="Delete" onClick={() => handleDelete(data.client_id)}>
                                    <i className="bi bi-trash-fill"></i>
                                </Link>
                            </div>
                        </div> */}

                        <div className="col-sm-6 padding-right mx-auto mt-40">
                            <div className="card boxShadow mb-2 position-relative">
                                <div className="initials-circle fs-50">
                                    <i className='bi bi-geo-alt-fill'></i>
                                </div>
                                <div className="card-body text-center">
                                    <div className="col-md-8 mt-40 mx-auto text-start">
                                        <label className="fs-20 fw-semibold d-block text-center margin">{data.location}</label>
                                        <p className="fs-14 mt-20 d-flex align-items"> <b>{data.address}</b> </p>


                                        {/* <div className="col-md-8 mt-40 mx-auto text-start">
                                            <span className="fs-13 d-flex gap-2"><i className="bi bi-envelope"></i> {data.client_email} </span>
                                            <span className="fs-13 d-flex gap-2"><i className="bi bi-telephone"></i> {data.phone_number}</span>
                                            
                                            <span className="fs-13 d-flex gap-2"><i className="bi bi-globe"></i> 
                                                <a href={data.website} target="_blank" rel="noopener noreferrer">{data.website}</a>
                                            </span>
                                            <span className="fs-13 d-flex gap-2"><i className="bi bi-clock"></i> {data.client_timezone} </span>
                                        </div> */}
                                        <div className="col-md-8 mt-40 mx-auto text-start">
                                            <div className="d-flex flex-column gap-2">
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-envelope"></i> 
                                                    <span className="fs-13 ms-2">{data.client_email}</span>
                                                </div>
                                                <div className="d-flex align-items-center ">
                                                    <i className="bi bi-telephone"></i> 
                                                    <span className="fs-13 ms-2">{data.phone_number}</span>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-globe"></i> 
                                                    <a href={data.website} target="_blank" rel="noopener noreferrer" className="fs-13 ms-2 text-break">{data.website}</a>
                                                </div>
                                                <div className="d-flex align-items-center ">
                                                    <i className="bi bi-clock"></i> 
                                                    <span className="fs-13 ms-2">{data.client_timezone}</span>
                                                </div>
                                            </div>
                                        </div>



                                        <div className="col-md-8 mt-40 mx-auto text-start">
                                            <div className="d-flex">
                                                {/* <Link className={`product-status me-2 ${data.cafe_module === true ? "product-active" : "product-inactive" }`} title={`Click to ${(data.cafe_module === true ? 'hide' : 'show')}`} onClick={() => handleCafeChange(data.client_id, data.cafe_module)}>
                                                    {data.cafe_module === true ? "Fuel Zone : visible" : "Fuel Zone : hidden"}
                                                </Link> */}
                                                <Link 
                                                    className={`product-status me-2 ${data.cafe_module ? "product-active" : "product-inactive"}`} 
                                                    title={`Click to ${data.cafe_module ? 'hide' : 'show'}`} 
                                                    onClick={() => handleCafeChange(data.client_id, data.cafe_module)}
                                                >
                                                    {data.cafe_module ? "Fuel Zone : visible" : "Fuel Zone : hidden"}
                                                </Link>
                                                <Link className={`product-status me-2 ${data.status === "1" ? "product-active" : "product-inactive" }`} title={`Click to ${(data.status === "1" ? 'deactivate' : 'activate')}`} onClick={() => handleStatusChange(data.client_id)}>
                                                    {data.status === "1" ? "Active" : "Inactive"}
                                                </Link>
                                                <Link  onClick={() => handleEditClick(data.client_id)} className="me-2 icon edit" title="Edit" data-bs-title="Edit" >
                                                    <i className="bi bi-pencil-square"></i>
                                                </Link>
                                                {/* <Link className="icon delete" title="Delete" data-bs-title="Delete" onClick={() => handleDelete(data.client_id)}>
                                                    <i className="bi bi-trash-fill"></i>
                                                </Link> */}
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div className="col-sm-6 padding-right mx-auto">
                            <div className="card boxShadow mb-2 position-relative">
                                <div className="initials-circle">
                                    {data.client_name 
                                        ? data.client_name.split(" ").map(word => word.charAt(0).toUpperCase()).join("") 
                                        : "N"}
                                </div>
                                <div className="card-body text-center">
                                    <div className="col-md-6 mt-40 mx-auto text-start">
                                        <label className="fs-20 fw-semibold d-block text-center margin">{data.client_name}</label>
                                        
                                        <p className="fs-14 d-flex align-items-center gap-2"><i className="bi bi-envelope-fill"></i> {data.client_email} </p>
                                        <p className="fs-14 d-flex align-items-center gap-2"><i className="bi bi-phone-fill"></i> {data.phone_number}</p>
                                        <p className="fs-14 d-flex align-items-center gap-2"> <i className="bi bi-geo-alt-fill"></i> {data.address} </p>
                                        <p className="fs-14 d-flex align-items-center gap-2"><i className="bi bi-globe"></i> 
                                            <a href={data.website} target="_blank" rel="noopener noreferrer">{data.website}</a>
                                        </p>
                                        <p className="fs-14 d-flex align-items-center gap-2"><i className="bi bi-clock-fill"></i> {data.client_timezone} </p>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}