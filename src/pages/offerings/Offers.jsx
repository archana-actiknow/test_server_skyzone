import React, { useEffect, useState } from "react";
import GetLocations from "../../hooks/Locations";
import FormDropdown from "../../components/FormDropdown";
import { useRequest } from "../../utils/Requests";
import {
  OFFERS_LIST,
  OFFER_LIST,
  OFFER_STATUS_UPDATE,
  OFFER_DELETE,
} from "../../utils/Endpoints";
import { Skeleton } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import SweetAlert from "../../components/SweetAlert";
import { items_per_page, messagePop, status } from "../../utils/Common";
import Pagination from "../../components/Pagination";

export default function Offers() {
  
    const location = useLocation();
    const navigate = useNavigate();

    const [load, setLoad] = useState(false);
    const [data, setData] = useState([true]);
    const [refreshRecords, setRefresRecords] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(1);
    const [currentLocationName, setCurrentLocationName] = useState("");
    const [allLocation, setAllLocations] = useState([]);

    const apiRequest = useRequest();
    const { data: locationdt, loading: locationloading } = GetLocations();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(items_per_page);
    const [totalPages, setTotalPages] = useState(0);
    const [editLoader, setEditLoader] = useState(false);

    // DROPDOWNS CHANGE //
    const dropDownChange = (e) => {
        setCurrentLocationName(allLocation[e.target.selectedIndex].label);
        setCurrentLocation(e.target.value);
        setRefresRecords(true);
    };

    const dropDownChangeStatus = (e) => {
        setCurrentStatus(e.target.value);
        setRefresRecords(true);
    };


     // ONLOAD //
    useEffect(() => {
        if (!locationloading && locationdt) {
            if (location.state !== null) {
            setCurrentLocation(location.state?.id);
            setCurrentLocationName(location.state?.value);
            setRefresRecords(true);
            } else {
            setCurrentLocation(locationdt.data[0].value);
            setCurrentLocationName(locationdt.data[0].label);
            }

            setAllLocations(locationdt.data);
        }
    }, [locationdt, locationloading, location.state]);

  
    useEffect(() => {
        const getOffersList = async (page = 1) => {
            setLoad(true);
            const offersRec = await apiRequest({
            url: OFFERS_LIST,
            method: "get",
            params: {
                location_id: currentLocation,
                status: currentStatus,
                page: page,
                items_per_page: pageSize,
            },
            });

            setData(offersRec || []); // Assuming `offers` is the key for the data
            setTotalPages(offersRec?.data?.total_pages || 0); // Assuming `totalPages` is provided by API
            setLoad(false);
        };

        if (refreshRecords && currentLocation) {
            
            getOffersList(currentPage);
            setRefresRecords(false);
            
        }
    }, [apiRequest, refreshRecords, currentLocation, currentStatus, currentPage, pageSize]);


    // EDIT
    const handleEditClick = async (id) => {
        setEditLoader(id)
        const offerRec = await apiRequest({
            url: OFFER_LIST,
            method: "get",
            params: {
            id: id,
            },
        });

        navigate(`/update-offer`, {
            state: {
            clientId: currentLocation,
            LocationName: currentLocationName,
            offerId: id,
            OfferData: offerRec?.data,
            },
        });
    };

    // ADD
    const handleAddClick = async () => {
        navigate(`/add-offer`, {
            state: { clientId: currentLocation, LocationName: currentLocationName },
        });
    };

    // DELETE
    const handleDelete = async (currentLocation, id) => {

        const title = "Are you sure?";
        const text  = "Are you sure you want to delete this record?";
        const confirm = await SweetAlert.confirm(title, text);

        if(confirm){
            const deleteOffer = await apiRequest({
            url: OFFER_DELETE,
            method: "delete",
            params: {
                id: id,
            },
            });
            messagePop(deleteOffer);
            if(deleteOffer.status === 'success'){
            setRefresRecords(true);
            }
        }

    };

    // UPDATE
    const handleStatusUpdate = async (offer_id, status) => {

        if (!offer_id || !status) {
            console.error("No offerId or status available.");
            return;
        }

        const title = "Are you sure?";
        const text  = `Are you sure you want to ${(status === '0' ? 'activate' : 'deactivate')} the offer?`;
        const confirm = await SweetAlert.confirm(title, text);

        if(confirm){
            try {
            const updateOfferStatus = await apiRequest({
                url: OFFER_STATUS_UPDATE,
                method: "post",
                data: {
                id: offer_id,
                status: status,
                },
            });

            if (updateOfferStatus.data.length > 0) {
                SweetAlert.fire({
                title: "Updated!",
                text: "Your status has been changed.",
                icon: "success",
                confirmButtonText: "OK",
                }).then(() => {
                setRefresRecords(true);
                });

            } else {
                SweetAlert.error("Error!", "Failed to change offering status.");
            }
            } catch (error) {
            SweetAlert.error("Error!", "Error to change offering status: " + error.message);
            }
        }
    };

  return (

    <>

        <div className="row align-items-center mb-3">
            <div className="col-md-8 mb-2">
                <div className="col col-12">
                <Link className="refreshbtn">Referesh Products</Link> &nbsp;
                <Link className="refreshbtn ml-10px">Referesh Discount</Link>
                </div>
            </div>
            <div className="col-md-4 mb-2">
                <div className="col col-12 text-md-end">
                <button onClick={() => handleAddClick()} className="ss_btn">Add offer</button>
                </div>
            </div>
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
                        <p className="fs-15 fw-semibold mb-0">Offers</p>
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


      {/* Offers LISTING */}
        <div className="row align-items-center">
        {(data?.data?.offers?.length > 0 && !load) ? (
            data?.data?.offers?.map((offering) => (
            <div className="col-md-3 mb-2" key={offering.id}>
                <div className="card border-0">
                <div className="card-body hide-overflow">
                    {offering.image ? (
                        <img src={offering.image} alt={offering.title} className="product-img"/>
                    ) : (
                        <img src="./images/no-image.png" alt={offering.title} className="product-img height-100"/>
                    )}

                    <div className="d-flex align-items-center justify-content-between mb-3">

                        <Link className={`product-status ${offering.status === "1" ? "product-active" : "product-inactive" }`} title={`Click to ${(offering.status === "1" ? 'deactivate' : 'activate')}`} onClick={() => handleStatusUpdate(offering.id, offering.status)}>
                            {offering.status === "1" ? "Active" : "Inactive"}
                        </Link>

                        <div className="d-flex align-items-center">

                            {(editLoader && editLoader === offering.id) ? 
                                <div className='td-btn'>
                                    <div className="spinner-border" role="status">
                                        <span className="sr-only"></span>
                                    </div> 
                                </div>
                                :
                                <Link onClick={() => handleEditClick(offering.id)} className="me-2 icon edit" data-bs-title="Edit">
                                    <i className="bi bi-pencil-square"></i>
                                </Link>
                            }

                            <Link className="icon delete" data-bs-title="Delete" onClick={() => handleDelete(currentLocation, offering.id)}>
                                <i className="bi bi-trash-fill"></i>
                            </Link>
                            
                        </div>

                    </div>

                    <div className="product_detail">
                        <h1>{offering.title}</h1>
                        <p dangerouslySetInnerHTML={{ __html: offering.description }}/>
                    </div>

                </div>
                
                </div>
            </div>
            ))
        ) : (

            
            <div className="row mb-3">
            <div className="col-md-12">
            {data?.data?.offers?.length === 0  && !load ? <>No Data Found!</> :
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
                refreshRecords={setRefresRecords}
            />
        :
            <Skeleton variant="rectangular" width="100%" height={20} className="skeleton-custom text-end"/>
        }
    </>
  );
}