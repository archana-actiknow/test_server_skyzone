import React, { useEffect, useState } from 'react'
import FormDropdown from '../../components/FormDropdown'
import GetLocations from '../../hooks/Locations';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useRequest } from '../../utils/Requests';
import { NONADDONS } from '../../utils/Endpoints';
import { Skeleton } from '@mui/material';
import NewAddon from './NewAddon';
import Accordion from '../../components/Accordion';

export default function CreateAddon() {
    const apiRequest = useRequest();
    const location = useLocation();
    const [currentLocation, setCurrentLocation] = useState(false);
    const [currentLocationName, setCurrentLocationName] = useState("");
    const [allLocation, setAllLocations] = useState([]);
    const [refreshRecords, setRefresRecords] = useState(true);

    // ##
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(null);

    const {data:locationdt, loading:locationloading} = GetLocations();

    // LOCATION CHANGE //
    const dropDownChange = (e) => {
        setCurrentLocationName(allLocation[e.target.selectedIndex].label);
        setCurrentLocation(e.target.value);
        setRefresRecords(true);
    }

     // ONLOAD //
     useEffect(() => {

        if(!locationloading && locationdt){
            if(location.state !== null){
                setCurrentLocation(location.state?.id);
                setCurrentLocationName(location.state?.value);
                setRefresRecords(true);
            }else{
                setCurrentLocation(locationdt.data[0].value);
                setCurrentLocationName(locationdt.data[0].label);
            }
            setAllLocations(locationdt.data);
        }

    }, [locationdt, locationloading, location.state]);

    // FETCH ONLOAD //
    useEffect(()=> {
        const getRewards = async () => {
            const rewardsRec = await apiRequest({
                    url:NONADDONS, 
                    method:"get", 
                    params: {
                        location_id:currentLocation, 
                        search: search
                    }
                });
            setData(rewardsRec?.data);
            setLoading(false);
        }

        if(refreshRecords && currentLocation){
            getRewards();
            setRefresRecords(false);
        }
    }, [apiRequest, search, refreshRecords, currentLocation]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setRefresRecords(true);
    }

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
            <div className="text-end mb-3">              
                <Link to="/addons" type="button" className="ss_btn" state={{id: currentLocation, value: currentLocationName}}>
                    <i className="bi bi-arrow-left"></i>
                    Back
                </Link>
            </div>

            <div className="row mb-3">
                <div className="col-md-12">
                    <div className="card border-0">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <p className="fs-15 fw-semibold mb-0">Addons</p>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fs-12 fw-semibold">Location</label>
                                    {((locationloading) || (!currentLocation)) ? 'Loading...' : locationdt && <FormDropdown onChange={dropDownChange} name="location" options={locationdt.data} default_value={currentLocation} classnm="form-select fs-12" />}
                                    
                                </div>
                                {/* <div className="col-md-3">
                                    <label className="form-label fs-12 fw-semibold">Type</label>
                                    {((locationloading) || (!currentLocation)) ? 'Loading...' : locationdt && <FormDropdown onChange={handleTypeChange} name="location" options={offer_type} default_value={cardType} classnm="form-select fs-12" />}
                                    
                                </div> */}
                                <div className="col-md-3">
                                    <label htmlFor="searchProduct" className="form-label fs-12 fw-semibold">Search
                                        Product</label>
                                    <input type="text" className="form-control fs-12" id="searchProduct" placeholder="Search Product" onChange={handleSearch} />
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
                {/* REPEATING CARD */}
                {data?.listing?.map((products) => {
                    return (
                        
                        <Accordion id={products.Pid} title={products.name} key={products.Pid}>
                            <table className="table table-bordered RjTable mb-0 data-table">
                                <thead>
                                    <tr>
                                        <th style={{width: 50}}>#</th>
                                        <th style={{width: 100}}></th>
                                        <th>Item</th>
                                        <th style={{width: 200}}>Cost</th>
                                        <th style={{width: 200}}>Type</th>
                                        <th style={{width: 50}}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.rest_products.map((product, index) => {
                                        return (
                                            <tr key={product.Pid}>
                                                <NewAddon product={product} index={index} parent_id={products.Pid} location_id={currentLocation} />
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </Accordion>
                       
                    )
                })}
                {/* REPEATING CARD */}
            </>
            }
        </div>
    </>
  )
}
