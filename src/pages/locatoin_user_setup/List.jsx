import { useEffect, useState } from "react";
import GetLocations from "../../hooks/Locations";
import FormDropdown from "../../components/FormDropdown";
import { useLocation } from 'react-router-dom';
import { Skeleton } from "@mui/material";
import Add from "./Add";
import { FETCHMANAGER, LISTMANAGERS, UPDATEMANAGERSTATUS } from "../../utils/Endpoints";
import { items_per_page, messagePop, status, decrypt } from "../../utils/Common";
import Pagination from "../../components/Pagination";
import SweetAlert from "../../components/SweetAlert";
import { useRequest } from "../../utils/Requests";
import { Link } from "react-router-dom";
import Edit from "./Edit";

function List() {
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Add Manager Popup
  const [isOpenId, setIsOpenId] = useState(false); // Edit Manager Popup
  const [load, setLoad] = useState(false);
  const [refreshRecords, setRefresRecords] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(items_per_page);
  const [totalPages, setTotalPages] = useState(0);
  const [data, setData] = useState([true]);
  const [currentStatus, setCurrentStatus] = useState(1);
  const [editData, setEditData] = useState(0);

  const apiRequest = useRequest();
    
  // SEARCH USERS //
  const [search, setSearch] = useState(null);

  const {data: locationdt, loading: locationloading} = GetLocations();

  // DROPDOWNS CHANGE //
    const dropDownChange = (e) => {
      setCurrentLocation(e.target.value);
      setRefresRecords(true);
    }

    const dropDownChangeStatus = (e) => {
      setCurrentStatus(e.target.value);
      setRefresRecords(true);
    };

  // ONLOAD //
    useEffect(() => {

        if(!locationloading && locationdt){
            if(location.state !== null){
                setCurrentLocation(location.state?.id);
                setRefresRecords(true);
            }else{
                setCurrentLocation(locationdt.data[0].value);
            }
            
        }
    }, [locationdt, locationloading, location.state]);

    const toggleAdd = () => {
        setIsOpen(prev => !prev);
    }

    
    const handleSearch = (e) => {
      setSearch(e.target.value);
      setRefresRecords(true);
    }

    useEffect(() => {
        const getList = async (page = 1) => {
            setLoad(true);
            const offersRec = await apiRequest({
            url: LISTMANAGERS,
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
            
            getList(currentPage);
            setRefresRecords(false);
            
        }
    }, [apiRequest, refreshRecords, currentLocation, currentStatus, currentPage, pageSize,search]);

    const refreshListing = (response) => {
      if(response){
        setRefresRecords(true);
      }
      else{
          SweetAlert.error('Oops!', 'Something went wrong.')
          setRefresRecords(false);
      }
    }


    // TOGGLE VIEW POPUP
    const toggleEdit = async (id) => {
      setLoad(id)
      var singleRec = {};
      if(id !== 'undefined'){
          const user = await apiRequest({url:FETCHMANAGER, method:"get", params: {id: id}});

          singleRec = {
              id: user?.data.id,
              fname:user?.data.fname,
              lname:user?.data.lname,
              email:user&&decrypt(user.data.email),
              contact:user&&decrypt(user.data.contact),
              designation:user?.data.designation
          }
      }
      setEditData(singleRec)
      setIsOpenId(id);
      setLoad(false);
    }


     // UPDATE
     const handleStatusUpdate = async (list_id, status) => {
      if (!list_id || !status) {
          console.error("No offerId or status available.");
          return;
      }

      const title = "Are you sure?";
      const text  = `Are you sure you want to ${(status === 0 ? 'activate' : 'deactivate')} the offer?`;
      const confirm = await SweetAlert.confirm(title, text);

      if(confirm){
          try {
          const updateOfferStatus = await apiRequest({
              url: UPDATEMANAGERSTATUS,
              method: "post",
              data: {
              id: list_id,
              status: status,
              },
          });

          if (updateOfferStatus.data.length > 0) {
              messagePop(updateOfferStatus.data);
              setRefresRecords(true);
          } else {
              SweetAlert.error("Error!", "Failed to change offering status.");
          }
          } catch (error) {
            SweetAlert.error("Error!", "Error to change offering status: " + error.message);
          }
        }
      }

  return (
    <div>
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
            {/* ADD POPUP */}
            <div className="text-end mb-3">
                <button className='ss_btn' onClick={toggleAdd} >Add Manager</button>
                {isOpen && <Add close={toggleAdd} currentLocation={currentLocation} refreshData={refreshListing} />}
            </div>

            {/* EDIT USER POPUP */}
            {isOpenId && <Edit id={isOpenId} close={setIsOpenId} data={editData} refreshData={refreshListing} />}

            <div className="row mb-3">
                <div className="col-md-12">
                    <div className="card border-0">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-md-5">
                                    <p className="fs-15 fw-semibold mb-0">Manager Setup</p>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fs-12 fw-semibold">Location</label>
                                    {((locationloading) || (!currentLocation)) ? 'Loading...' : locationdt && <FormDropdown 
                                    onChange={dropDownChange} name="location" options={locationdt.data} 
                                    default_value={currentLocation} classnm="form-select fs-12" />}
                                </div>
                                
                                <div className="col-md-2">
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
                                <div className="col-md-2">
                                    <label htmlFor="searchProduct" className="form-label fs-12 fw-semibold">Search</label>
                                    <input type="text" className="form-control fs-12" id="searchProduct" placeholder="Search" onChange={handleSearch} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        }

        <div className="row align-items-center">
          {(data?.data?.listing?.length > 0 && !load) ? (
              data?.data?.listing?.map((list) => (
              <div className="col-md-4 mb-2" key={list.id}>
                  <div className="card border-0">
                  <div className="card-body hide-overflow">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <Link className={`product-status ${list.status === 1 ? "product-active" : "product-inactive" }`} title={`Click to ${(list.status === 1 ? 'deactivate' : 'activate')}`} onClick={() => handleStatusUpdate(list.id, list.status)}>
                          {list.status === 1 ? "Active" : "Inactive"}
                      </Link>
                      <div className="d-flex align-items-center">
                          <span onClick={() => toggleEdit(list.id)} className="me-2 icon edit lnk" data-bs-title="Edit">
                              <i className="bi bi-pencil-square"></i>
                          </span>
                        <span className="icon delete lnk" data-bs-title="Delete" href="/latest-offerings">
                          <i className="bi bi-trash-fill"></i>
                        </span>
                      </div>
                    </div>
                    <div className="product_detail">
                        <h1>{list.fname + ' ' + list.lname}</h1>
                        <p><i className="bi bi-envelope-fill"></i> {decrypt(list.email)}</p>
                        <p><i className="bi bi-phone-fill"></i> {decrypt(list.contact)}</p>

                        <p><i className="bi bi-award-fill"></i> <b>{list.designation}</b></p>
                    </div>
                  </div>
                  
                  </div>
              </div>
              ))
          ) : ( 
            <div className="row mb-3">
              <div className="col-md-12">
              {data?.data?.listing?.length === 0  ? <>No Data Found!</> :
                  <Skeleton variant="rectangular" width="100%" height={300} className="skeleton-custom" />
              }
              </div>
            </div>         
          )}
        </div>

        <div className="row align-items-center">
           {totalPages > 0 &&
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    refreshRecords={setRefresRecords}
                />
            }
        </div>
    </div>
  )
}

export default List