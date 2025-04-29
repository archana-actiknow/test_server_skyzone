import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import GetLocations from "../../hooks/Locations";
import FormDropdown from "../../components/FormDropdown";
import DatePicker from "../../components/DatePicker";
import Datatable from '../../components/Datatable';
import { decrypt, sanitizeImage } from "../../utils/Common";
import Moment from 'moment';
import { useRequest } from "../../utils/Requests";
import { GETCUSTOMERQUERIESPOINTS, MOBCUSTOMERLIST } from "../../utils/Endpoints";
import Add from "./Add";
import Table from '../../components/Table';


export default function Lists () {
    const location = useLocation();
    const [data, setData] = useState([true]);
    const [currentLocation, setCurrentLocation] = useState(false);
    const { data: locationdt, loading: locationloading } = GetLocations();

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [search, setSearch] = useState(null); // SEARCH USERS //

    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(100);
    const [totalPages, setTotalPages] = useState(0);
    const [refreshUsers, setRefreshUsers] = useState(true);
    const [isOpenId, setIsOpenId] = useState(false); 
    const [selectedUser, setSelectedUser] = useState(null);
     const [loader, setLoader] = useState(false);
    const [customerQueryData, setCustomerQueryData] = useState(null);
    const apiRequest = useRequest();

    // DROPDOWNS CHANGE //
    const dropDownChange = (e) => {
        setCurrentLocation(e.target.value);
        setRefreshUsers(true);
    };

    // ONLOAD //
    useEffect(() => {
    if (!locationloading && locationdt) {
        if (location.state !== null) {
        setCurrentLocation(location.state?.id);
        setRefreshUsers(true);
        } else {
        setCurrentLocation(locationdt.data[0].value);
        }

    }
    }, [locationdt, locationloading, location.state]);

      // FILTER //
    const handleApplyFilter = () => {
        setFromDate(fromDate);
        setToDate(toDate);
        setRefreshUsers(true);
    };
    const handleClearFilter = () => {
        setFromDate("");
        setToDate("");
        setRefreshUsers(true);
    };

    // SEARCH //
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setRefreshUsers(true);
    }

    const handleEditClick = async(row) => {
        setLoader(row);
        setSelectedUser({
            id: row.id,
            name: `${row.fname} ${row.lname}`,
            profile_picture: row.profile_picture ? decrypt(row.profile_picture) : null,
            client_id:currentLocation
        });
        const customer_id = row.id;
        const  client_id = currentLocation;
          const response = await apiRequest({url:GETCUSTOMERQUERIESPOINTS, method:"get",
            params: {
                client_id: client_id,
                customer_id: customer_id,

            }})
            if (response?.status === "success" && response?.data) {
                setCustomerQueryData(response.data); 
            }
        setIsOpenId(true); 
        setLoader(false);
    };

    // USERS TABLE COLUMNS //
    // const columns = [
    //     {
    //         field: "profile_picture",
    //         headerClassName: "fs-12 fw-semibold",
    //         headerName: "Profile",
    //         renderCell: (params) => {
    //             const profilePic = params?.row?.profile_picture ? decrypt(params.row.profile_picture): "./images/user-image.jpg";
    //             return (
    //                 <img  className="profile-pic img-fluid rounded-circle" src={profilePic} alt={`${params.row.fname}`} onError={(e) => e.target.src = "./images/user-image.jpg"} />
    //             );
    //         }
    //     },        
    //     {
    //         field: "fname", headerClassName: "fs-12 fw-semibold",
    //         headerName: "Name",
    //         flex: 1,
    //         renderCell: (params) => `${params.row.fname} ${params.row.lname}`,
    //     },
    //     { field: "email", headerClassName: "fs-12 fw-semibold", flex: 2, headerName: "Email", renderCell: (params) => decrypt(params.row.email)},
    //     { field: "phone", flex: 1, headerClassName: "fs-12 fw-semibold", headerName: "Contact", renderCell: (params) => decrypt(params.row.phone)},
    //     { 
    //         field: "created", 
    //         headerClassName: "fs-12 fw-semibold", 
    //         flex: 1, 
    //         headerName: "Created On",  
    //         renderCell: (params) =>  Moment(params.row.created).format('D MMM, YYYY') 
    //     },
    //     { field: "action", headerClassName: "header-theme", headerName: "Action", 
    //         renderCell: (param) => {
    //             return (
    //                 <>
    //                     {(loader && loader === param.row) ? 
    //                         <div className='edit-btn'>
    //                             <div className="spinner-border" role="status">
    //                                 <span className="sr-only"></span>
    //                             </div> 
    //                         </div>
    //                         :
    //                         <div className="me-2 icon edit">
    //                             <span onClick={() => handleEditClick(param.row)} className="fs-14 lnk" title="Reward Points">
    //                                 <i className="bi bi-award-fill"></i>
    //                             </span>
    //                         </div>
    //                     }
    //                 </>
    //             )
    //         }
    //     },
        
    // ];


    useEffect(() => {
        if(!locationloading && locationdt){
            setCurrentLocation(locationdt.data[0].value);
        }
    }, [locationdt, locationloading])

    // GET USERS //
    useEffect(()=>{
        const getUsers = async () => {
            setLoading(true)
            const client_id = (currentLocation) ? {client_id : currentLocation} : "";
            const to_date = (toDate) ? {toDate : toDate} : "";
            const from_date = (fromDate) ? {fromDate : fromDate} : "";
            const data = await apiRequest({
                url: MOBCUSTOMERLIST,
                method: "get",
                params: {
                  page: currentPage,
                  items_per_page: itemsPerPage,
                  ...client_id,
                  ...to_date,
                  ...from_date,
                  search: search,

                },
              });

            setCurrentPage(data?.data?.page);
            setTotalPages(data?.data?.total_pages);
            setData(data);
            setLoading(false)    
        }
        
        if(refreshUsers && currentLocation){
            setRefreshUsers(false)
            getUsers();
        }
    }, [refreshUsers, apiRequest, currentPage, itemsPerPage, search, currentLocation, fromDate, toDate])

    useEffect(()=>{
        setRefreshUsers(true);
    }, [currentPage])
    

    return (
        <div className="tab-pane fade active show" id="staffSetting-tab-pane" role="tabpanel" aria-labelledby="staffSetting-tab" tabIndex="0">

            {/* LOCATION FILTER */}
            {locationloading ?
                <>
                    <div className="text-end mb-3">
                        <Skeleton variant="rectangular" width="100%" height={80} className="skeleton-custom text-end" />
                    </div>
                </>
                : locationdt &&
                <div className="row mb-3">
                    <div className="col-md-12">
                        <div className="card border-0">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-md-9">
                                        <p className="fs-15 fw-semibold mb-0">Customers</p>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fs-12 fw-semibold">Location</label>
                                        {((locationloading)) ? 'Loading...' :
                                            locationdt &&
                                            <FormDropdown onChange={dropDownChange} name="location" options={locationdt.data} default_value={currentLocation} classnm="form-select fs-12"/>
                                        }
                                    </div>
                                    {isOpenId && <Add id={isOpenId} close={setIsOpenId} user={selectedUser} data ={customerQueryData}/>}
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

            <div className="card border-0 boxShadow">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12 mb-3">

                            {/* DATE FILTER */}
                            <div className="fs-12 payments-filters">
                                <div className="me-3">
                                    <label htmlFor="fromDate" className="form-label">From Date</label>
                                    <DatePicker value={fromDate} onChange={(date) => setFromDate(date)} minDate={false} name="startDate"/>
                                </div>
                                <div className="me-3">
                                    <label htmlFor="toDate" className="form-label"> To Date </label>
                                    <DatePicker value={toDate} onChange={(date) => setToDate(date)} minDate={false} name="startDate"/>
                                </div>
                                <div className="me-3">
                                    <label htmlFor="searchName" className="form-label">Search Name</label>
                                    <input type="text" className="form-control fs-12" id="searchName" placeholder="" onChange={handleSearch} />
                                </div>
                                <div className="me-3 mt-3 pt-md-1">
                                    <button className="ss_btn" onClick={handleApplyFilter}> Apply Filter</button>
                                </div>
                                <div className="me-3 mt-3 pt-md-1">
                                    <button className="refreshbtn" onClick={handleClearFilter}>Clear Filter </button>
                                </div>
                            </div>

                             <Table
                                title="" 
                                loading={loading} 
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                                itemsPerPage={itemsPerPage}
                                setItemsPerPage={setItemsPerPage}
                                setRefreshRecords={setRefreshUsers}
                                setSearch={setSearch}
                                searhPlaceholder= "Username"
                            >   
                                <thead>
                                    <tr className="bg-color">
                                    <th className="fs-12 fw-semibold sorting sorting_asc" style={{ width: "10%" }}>Profile</th>
                                    <th className="fs-12 fw-semibold sorting" style={{ width: "15%" }}>Name</th>
                                    <th className="fs-12 fw-semibold sorting" style={{ width: "25%" }}>Email</th>
                                    <th className="fs-12 fw-semibold sorting" style={{ width: "15%" }}>Contact</th>
                                    {/* <th className="fs-12 fw-semibold sorting">Location</th> */}
                                    <th className="fs-12 fw-semibold sorting"  style={{ width: "20%" }} tabindex>Created On</th>
                                    <th className="fs-12 fw-semibold sorting" style={{ width: "15%" }}>Action</th></tr>
                                </thead>
                                <tbody className="fs-12 scrollable-tbody">
                                
                                    {data?.data?.data.map((item, idx) => {
                                        const profilePic = item.profile_picture ? decrypt(item.profile_picture): "./images/user-image.jpg";
                                        return(
                                            <tr key={idx} className="odd">
                                            
                                            {/* Profile Picture */}
                                            <td className="sorting_1" style={{ width: "10%" }} >
                                            
                                            <img
                                                className="profile-pic img-fluid rounded-circle"
                                                src={sanitizeImage(profilePic)}
                                                alt={item.fname}
                                                onError={(e) => (e.target.src = "./images/user-image.jpg")}
                                                style={{ width: "28px", height: "28px", objectFit: "cover" }}
                                                // style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                            />
                                            </td>

                                            {/* Full Name */}
                                            <td style={{ width: "15%" }} >{`${item.fname} ${item.lname}`}</td>

                                            {/* Email */}
                                            <td style={{ width: "25%" }} >{decrypt(item.email)}</td>

                                            {/* Phone */}
                                            <td style={{ width: "15%" }} >{decrypt(item.phone)}</td>

                                            {/* Created On */}
                                            <td style={{ width: "20%" }} >{Moment(item.created).format('D MMM, YYYY')}</td>

                                            {/* Action Buttons */}
                                            <td style={{ width: "15%" }} >
                                            <div className="d-flex align-items-center v-align-center">
                                                {(loader && loader === item.id) ? 
                                                    <div className='edit-btn'>
                                                    <div className="spinner-border" role="status">
                                                        <span className="sr-only"></span>
                                                    </div> 
                                                    </div>
                                                    :
                                                    <div className="me-2 icon edit">
                                                    <span onClick={() => handleEditClick(item)} className="fs-14 lnk" title="Reward Points">
                                                        <i className="bi bi-award-fill"></i>
                                                    </span>
                                                    </div>
                                                }
                                            </div>

                                            </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>

                            {/* USERS LISTING */}

                                {/* <Datatable 
                                    rows={data?.data?.data} 
                                    title="" 
                                    columns={columns} 
                                    loading={loading} 
                                    manageListing={{
                                        currentPage,
                                        setCurrentPage,
                                        totalPages,
                                        itemsPerPage,
                                        setItemsPerPage,
                                        setRefreshRecords:setRefreshUsers,
                                        setSearch,
                                        searhPlaceholder: "Username"
                                    }}
                                /> */}
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}