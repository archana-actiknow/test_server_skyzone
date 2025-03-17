import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRequest } from '../../utils/Requests';
import { NONMENUITEMS } from '../../utils/Endpoints';
import { Skeleton } from '@mui/material';
import { useLocation } from 'react-router-dom';
import MenuItem from './MenuItem';
import Accordion from '../../components/Accordion';
// import { useFormik } from 'formik';

export default function AddMenuItems() {
    const location = useLocation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshRecords, setRefresRecords] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(false);
    const [currentLocationName, setCurrentLocationName] = useState("");

    const apiRequest = useRequest();
    

    // // PAGE AND ITEMS SETTINGS //
    // const [currentPage, setCurrentPage] = useState(1);
    // const [itemsPerPage, setItemsPerPage] = useState(items_per_page);

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
                    url:NONMENUITEMS, 
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
                <Link to="/menu-items" type="button" className="ss_btn" state={{id: currentLocation, value: currentLocationName}}>
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
                // <div className="accordion-item card" key={product.Pid}>
                //     <h2 className="accordion-header d-flex align-items-center">
                //         <button type="button" className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target={`#accordionWithIcon-${product.Pid}`} aria-expanded="false">
                //             <i className="bx bx-bar-chart-alt-2 me-2"></i>
                //             <p className="fs-13 fw-semibold mb-0">{product.name}</p>
                //         </button>
                //     </h2>

                //     <div id={`accordionWithIcon-${product.Pid}`} className="accordion-collapse collapse">
                //         <div className="accordion-body">
                //             <div className="table-responsive text-nowrap">
                //             <form className='p-4row group-panel add-user' method='post'>

                            <Accordion id={product.Pid} title={product.name} key={product.Pid}>
                                <table className="table table-bordered RjTable">
                                    <thead>
                                        <tr key={product.Pid}>
                                        
                                            <th>Product</th>
                                            <th style={{width:250}}>Item</th>
                                            <th style={{width:460}}>Description</th>
                                            <th style={{width:50}}>Price</th>
                                            <th>Thumbnail</th>
                                            <th>Action</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                    { product.rest_products?.map((singleProduct, index) => { // .filter((singleProduct) => singleProduct.ProdcutsDiscount.length === 0)
                                        return (
                                            <tr key={singleProduct.Pid}>
                                                <MenuItem product={singleProduct} client_id={currentLocation} />
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            {/* </form>
                            </div>
                        </div>
                    </div>
                </div> */}
                </Accordion>
                )
            })}
        </>}
      </div>
    </>
  )
}
