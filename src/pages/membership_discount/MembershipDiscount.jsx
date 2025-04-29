import React, { useEffect, useState } from 'react'
import { useRequest } from '../../utils/Requests';
import { useLocation, Link } from 'react-router-dom';
import GetLocations from "../../hooks/Locations";
import FormDropdown from "../../components/FormDropdown";
import { Skeleton } from "@mui/material";
import { items_per_page, messagePop, sanitizeImage, sanitizeText, status } from "../../utils/Common";
import AddDiscount from './AddDiscount';
import Pagination from "../../components/Pagination";
import { DELETEMEMBERSHIPDISCOUNT, FETCHMEMBERSHIPDISCOUNT, SINGLEMEMBERSHIPDISCOUNT } from '../../utils/Endpoints';
import SweetAlert from '../../components/SweetAlert';
import EditDiscount from './EditDiscount';

export default function MembershipDiscount() {
    const location = useLocation();
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(false);
    const [refreshRecords, setRefreshRecords] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(false);
    const [loadProducts, setLoadProducts] = useState(true);
    const [currentStatus, setCurrentStatus] = useState(1);
    const [search, setSearch] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(items_per_page);
    const [totalPages, setTotalPages] = useState(0);
    const [editLoader, setEditLoader] = useState(false);
    const [editData, setEditData] = useState(0);
    const [openDialogbox, setOpendialogbox] = useState(false);// Add Manager Popup
    const [isOpenId, setIsOpenId] = useState(false); // Edit User Popup
    const apiRequest = useRequest();
    const { data: locationdt, loading: locationloading } = GetLocations();

    // DROPDOWNS CHANGE //
    const dropDownChange = (e) => {
        setCurrentLocation(e.target.value);
        setRefreshRecords(true);
    };

    const refreshListing = (response) => {
        if(response){
            setRefreshRecords(true);
            setLoadProducts(true);
        }
        else{
            SweetAlert.error('Oops!', 'Something went wrong.')
            setRefreshRecords(false);
        }
    }

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

    const openDialog = () => {
        // setLoadProducts(true);
        setOpendialogbox(prev => !prev);
        setLoadProducts(true);
        // setOpendialogbox(true);
    };

    const dropDownChangeStatus = (e) => {
        setCurrentStatus(e.target.value);
        setRefreshRecords(true);
    };

    
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setRefreshRecords(true);
    }

    useEffect(() => {
        const getDiscountList = async (page = 1) => {
            setLoad(true);
            const offersRec = await apiRequest({
            url: FETCHMEMBERSHIPDISCOUNT,
            method: "get",
            params: {
                client_id: currentLocation,
                status: currentStatus,
                page: page,
                items_per_page: pageSize,
                search: search
            },
            });

            setData(offersRec || []); // Assuming `offers` is the key for the data
            setTotalPages(offersRec?.data?.total_pages || 0); // Assuming `totalPages` is provided by API
            setLoad(false);
        };

        if (refreshRecords && currentLocation) {
            getDiscountList(currentPage);
            setRefreshRecords(false);
        }
    }, [apiRequest, refreshRecords, currentLocation, currentStatus, currentPage, pageSize,search]);

       // EDIT
    const handleEditClick = async (id) => {
        setEditLoader(id);
        setLoadProducts(true);
        const offerRec = await apiRequest({
            url: SINGLEMEMBERSHIPDISCOUNT,
            method: "get",
            params: { id: id, },
        });
        const singleRec = offerRec?.data ? { 
            id: offerRec.data.id,
            client_id: offerRec.data.client_id,
            discount_code: offerRec.data.discount_code,
            productId: offerRec.data.productId,
        } : {};
        setEditData(singleRec); 
        setIsOpenId(id);
        setEditLoader(false);
    };

    const handleStatusChange = async (id) => {
        const title = "Are you sure?";
        const text  = "Are you sure you want to change the status ?";
        const confirm = await SweetAlert.confirm(title, text);

        if(confirm){
            const data = await apiRequest({
                url:DELETEMEMBERSHIPDISCOUNT,
                    method:"POST",
                data:{id:id}});
            setRefreshRecords(true);
            messagePop(data)
        }
    }

    return (
        <>

            <div className="row align-items-center mb-3">
                <div className="col-md-8 mb-2">
                    <div className="col col-12"> </div>
                </div>
                <div className="col-md-4 mb-2">
                    <div className="col col-12 text-md-end" onClick={openDialog}>
                        <button className="ss_btn">Add Discount</button>
                    </div>
                    {openDialogbox && <AddDiscount close={setOpendialogbox} loadProducts={loadProducts} setLoadProducts={setLoadProducts}  clientID={currentLocation} refreshData={refreshListing}/>}
                    {isOpenId && <EditDiscount id={isOpenId} close={setIsOpenId} editData={editData} loadProducts={loadProducts} setLoadProducts={setLoadProducts}  clientID={currentLocation} refreshData={refreshListing}/>}
                </div>
            </div>
            {locationloading ? (
                <>
                    <div className="text-end mb-3">
                        <Skeleton variant="rectangular" width="100%" height={80} className="skeleton-custom text-end" />
                    </div>
                </>
            ) : (
                locationdt && (
                    <div className="row mb-2" >
                        <div className="col-md-12">
                            <div className="card border-0">
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col-md-3">
                                            <p className="fs-15 fw-semibold mb-0">Membership Discount</p>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label fs-12 fw-semibold">Status</label>
                                            {locationloading || !currentLocation ? (
                                                "Loading..."
                                            ) : (
                    
                                                <FormDropdown
                                                onChange={dropDownChangeStatus}
                                                name="status"
                                                options={status}
                                                default_value={currentStatus || "active"}
                                                classnm="form-select fs-12"
                                                />
                    
                                            )}
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label fs-12 fw-semibold">Location</label>
                                            {locationloading || !currentLocation
                                            ? "Loading..."
                                            : locationdt && (<FormDropdown onChange={dropDownChange} name="location" options={locationdt.data} default_value={currentLocation} classnm="form-select fs-12"/> )}
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="searchProduct" className="form-label fs-12 fw-semibold">Search
                                                Product</label>
                                            <input type="text" className="form-control fs-12" id="searchProduct" placeholder="Search Membership Code" onChange={handleSearch} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}

             <div className="row align-items-center">
                {(data?.data?.listing?.length > 0 && !load) ? (
                    data?.data?.listing?.map((list) => (
                    <div className="col-md-3 mb-2" key={list.id}>
                        <div className="card border-0">
                        
                            <div className="card-body hide-overflow">
                             <img src={ sanitizeImage(list.Membersproduct.imageUrl)}  alt={list.title} className="product-img"/>
                                <div className="product_detail">
                                    <h1>{list.title}</h1>
                                    <p dangerouslySetInnerHTML={{ __html:  sanitizeText(list.description)}}/>
                                    <p className='fs-14 semibold'><strong>Discount Code :</strong> {list.discount_code}</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-center mb-3">
                                <Link className={`product-status me-2 ${list.status === 1 ? "product-active" : "product-inactive" }`} title={`Click to ${(list.status === 1 ? 'deactivate' : 'activate')}`} onClick={() => handleStatusChange(list.id)}>
                                    {list.status === 1 ? "Active" : "Inactive"}
                                </Link>
                                <div className="d-flex align-items-center">
                                    {(editLoader && editLoader === list.id) ? 
                                        <div className='td-btn'>
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only"></span>
                                            </div> 
                                        </div>
                                        :
                                        <Link onClick={() => handleEditClick(list.id)} className="me-2 icon edit" data-bs-title="Edit">
                                            <i className="bi bi-pencil-square"></i>
                                        </Link>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    ))
                ) : (  
                    <div className="row mb-3">
                        <div className="col-md-12">
                        {data?.data?.listing?.length === 0  && !load ? <>No Data Found!</> :
                            <Skeleton variant="rectangular" width="100%" height={300} className="skeleton-custom" />
                        }
                        </div>
                    </div>
                )}
            </div>
            {totalPages > 0 ?
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    refreshRecords={setRefreshRecords}
                />
            :
                <Skeleton variant="rectangular" width="100%" height={20} className="skeleton-custom text-end"/>
            }
        </>
    )
}