import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRequest } from '../../utils/Requests';
import { NONREWARDS } from '../../utils/Endpoints';
import { Skeleton } from '@mui/material';
import { useLocation } from 'react-router-dom';
import RewardRule from './RewardRule';
import Accordion from '../../components/Accordion';
// import { useFormik } from 'formik';

export default function AddRewardRule() {
    const location = useLocation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshRecords, setRefresRecords] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(false);
    const [currentLocationName, setCurrentLocationName] = useState("");

    const apiRequest = useRequest();
    

    // SEARCH USERS //
    const [search, setSearch] = useState(null);


    // ONLOAD //
    useEffect(() => {
        if(location.state && location.state.id)
        {
            setCurrentLocation(location.state?.id);
            const LocationName = location.state?.value;
            setCurrentLocationName(LocationName)
        }else {
            console.log('No data found in location.state');
          }
    }, [location.state])

    // FETCH ONLOAD //
    useEffect(()=> {
        const getRewards = async () => {
            const rewardsRec = await apiRequest({
                    url:NONREWARDS, 
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
        {(!currentLocation) 
        ? 
        <>
            <div className="text-end mb-3">              
                <Skeleton variant="rectangular" width="100%" height={80} className="skeleton-custom text-end" />
            </div>
                <Skeleton variant="rectangular" width="100%" height={100} className="skeleton-custom" />
        </> 
        : 
        <>
            <div className="text-end mb-3">              
                <Link to="/rewards" type="button" className="ss_btn" state={{id: currentLocation, value: currentLocationName}}>
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
                                    <p className="fs-15 fw-semibold mb-0">{currentLocationName}</p>
                                </div>
                                <div className="col-md-3">&nbsp;</div>
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
        </>}
      

        <div className="accordion mt-3" id="accordionWithIcon">
        {(loading) || (!currentLocation)
        ? 
            <Skeleton variant="rectangular" width="100%" height={400} className="skeleton-custom" />
        : 
        <>
            {data?.map((product) => {
                return (
                    <Accordion id={product.Pid} title={product.name} key={product.Pid}>
                        <form className='p-4row group-panel add-user' method='post'>
                            <table className="table table-bordered RjTable">
                                <thead>
                                    <tr key={product.Pid}>
                                    
                                        <th>Product</th>
                                        <th>Item</th>
                                        <th>Title</th>
                                        <th>Points</th>
                                        <th>Discount Code</th>
                                        <th>Thumbnail</th>
                                        <th>Action</th>

                                    </tr>
                                </thead>
                                <tbody>
                                { product.rest_products?.map((singleProduct, index) => { // .filter((singleProduct) => singleProduct.ProdcutsDiscount.length === 0)
                                    return (
                                        <tr key={singleProduct.Pid}>
                                            <RewardRule product={singleProduct} client_id={currentLocation} />
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </form>
                    </Accordion>
                )
            })}
        </>}
      </div>
    </>
  )
}
