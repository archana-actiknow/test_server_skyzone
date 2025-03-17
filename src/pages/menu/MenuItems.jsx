import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import GetLocations from '../../hooks/Locations';
import FormDropdown from '../../components/FormDropdown';
import { useRequest } from '../../utils/Requests';
import { MENUITEMS } from '../../utils/Endpoints';
import { Skeleton } from '@mui/material';
import { useLocation } from 'react-router-dom';
import EditMenuItem from './EditMenuItem';
import Accordion from '../../components/Accordion';

export default function MenuItems() {
    const location = useLocation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshRecords, setRefresRecords] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(false);
    const [currentLocationName, setCurrentLocationName] = useState("");
    const [allLocation, setAllLocations] = useState([]);

    const apiRequest = useRequest();
    const {data:locationdt, loading:locationloading} = GetLocations();
    

    // PAGE AND ITEMS SETTINGS //
    // const [currentPage, setCurrentPage] = useState(1);
    // const [itemsPerPage, setItemsPerPage] = useState(items_per_page);

    // SEARCH USERS //
    const [search, setSearch] = useState(null);

    // DROPDOWNS CHANGE //
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
    }, [locationdt, locationloading, location.state])

    // FETCH ONLOAD //
    useEffect(()=> {
        const getRecords = async () => {
            setLoading(true)
            const rec = await apiRequest({
                    url:MENUITEMS, 
                    method:"get", 
                    params: {
                        location_id:currentLocation, 
                        search: search
                    }
                });
            setData(rec?.data);
            setLoading(false);
        }

        if(refreshRecords && currentLocation){
            getRecords();
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
                <Link to="/add-menu-items" type="button" className="ss_btn" state={{id: currentLocation, value: currentLocationName}}>
                    Add Items
                </Link>
            </div>

            <div className="row mb-3">
                <div className="col-md-12">
                    <div className="card border-0">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <p className="fs-15 fw-semibold mb-0">Items</p>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fs-12 fw-semibold">Location</label>
                                    {((locationloading) || (!currentLocation)) ? 'Loading...' : locationdt && <FormDropdown onChange={dropDownChange} name="location" options={locationdt.data} default_value={currentLocation} classnm="form-select fs-12" />}
                                </div>
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
                {(data === 'undefined' || data === '') && <>No Result found</>}
                {data?.map((product) => {
                    return (

                        <Accordion id={product.Pid} title={product.name} key={product.Pid}>
                    
                            <table className="table table-bordered RjTable mb-0 data-table">
                                <thead>
                                    <tr key={product.Pid}>
                                        <th>Product</th>
                                        <th style={{width:250}}>Item</th>
                                        <th style={{width:420}}>Description</th>
                                        <th style={{width:50}}>Price</th>
                                        <th>Thumbnail</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {product.rest_products?.map((singleProduct, index) => {

                                        return(
                                            <React.Fragment key={`${singleProduct.Pid}-${index}`}>
                                                {singleProduct.restaurantMenuItems.map((restaurantMenuItems, i)=> {
                                                    return (
                                                        <tr key={restaurantMenuItems.id}>
                                                            <EditMenuItem singleProduct={singleProduct} product={restaurantMenuItems} client_id={currentLocation} setRefresRecords={setRefresRecords} />
                                                        </tr>
                                                    )
                                                })}
                                            </React.Fragment>
                                        )

                                    })}
                                </tbody>
                            </table>
                                
                        </Accordion>
                    )
                })}
            </>
            }
        </div>
    </>
  )
}
