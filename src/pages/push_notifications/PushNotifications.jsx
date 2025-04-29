import React, { useEffect, useState } from 'react'
import { useRequest } from '../../utils/Requests';
import { can_access, messagePop, status, timezones} from '../../utils/Common';
import Moment from 'moment';
import DOMPurify from 'dompurify';
import { Tooltip } from '@mui/material';
import { NOTIFICATIONS, FETCHNOTIFICATION, DELETENOTIFICATION } from '../../utils/Endpoints';
import Datatable from '../../components/Datatable';
import { Link, useNavigate } from 'react-router-dom';
import SweetAlert from '../../components/SweetAlert';
import GetLocations from '../../hooks/Locations';
import FormDropdown from '../../components/FormDropdown';
import Table from '../../components/Table';

export default function PushNotifications() {
    const [data, setData] = useState([]);
    const [refreshRecords, setRefreshRecords] = useState(true);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(null);
    const [editLoader, setEditLoader] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(1);
    const [notified, setNotified] = useState(1);
    const { data: locationdt } = GetLocations();
   

    const navigate = useNavigate();
    const apiRequest = useRequest();

    const dropDownChangeStatus = (e) => {
        setCurrentStatus(e.target.value);
        setRefreshRecords(true);
    };

    const dropDownChangeNotified = (e) => {
        setNotified(e.target.value);
        setRefreshRecords(true);
    };
  

    // PAGE AND ITEMS SETTINGS //
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);

    // TABLE COLUMNS //
    const columns = [
        { field: "title", flex: 1, headerClassName: "header-theme", headerName: "Title", },
        {
            field: "message", headerClassName: "header-theme",
            flex: 1,
            headerName: "Message",
            
            renderCell: (params) => <Tooltip PopperProps={{
                modifiers: [
                {
                    name: 'preventOverflow',
                    options: {
                    padding: 8,
                    },
                },
                ],
            }} ><div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(params.row.message) }} /></Tooltip>
        },
        { field: "cust_timezone", width:150, headerClassName: "header-theme", headerName: "Timezone", renderCell: (params) => {
            const timezoneObj = timezones.find((timezone)=>(params.row.cust_timezone === timezone.value))
            return (timezoneObj.label)
        } },
        { field: "location", width:250, headerClassName: "header-theme", headerName: "Locations",  renderCell: (params) => {

            const location_ids_ary = params.row.client_ids.split(",").map(Number)
            const location_names = locationdt?.data?.filter(location => location_ids_ary.includes(location.id)).map(location => location.label)
            return location_names.join(", ")
        } },
        { field: "date_to_notify", headerClassName: "header-theme", headerName: "Date",  renderCell: (params) =>  Moment(params.row.date_to_notify).format('D MMM, YYYY') },
        { field: "time_to_notify", headerClassName: "header-theme", headerName: "Time", },
        {
            field: "status", headerClassName: "header-theme",
            headerName: "Status",
            
            renderCell: (params) => {
                // const chngStatusTo = (params.row.status === '1') ? '0' : '1'
                return (
                    <div className="fw-semibold d-flex align-items-center">
                        <span className={`p-1 bg-${(params.row.status === '1') ? 'success' : 'secondary'} rounded-circle`}></span>
                        <span className={`ms-1 text-${(params.row.status === '1') ? 'success' : 'secondary'}`}>{(params.row.status === '1') ? 'Active' : 'Inactive'} </span>
                    </div>

                    // <input 
                    //     type="button" 
                    //     value={(params.row.status === '1') ? 'Active' : 'Inactive'} 
                    //     className={`btn v-btn-${(params.row.status === '1') ? 'success' : 'secondary'} btn-xs dis `} 
                    //     // onClick={() => changeStatus(chngStatusTo, params.row.id)}
                    // />
                );
            },
        },
        { field: "notified", headerClassName: "header-theme", headerName: "Notified",  renderCell: (params) => (params.row.notified === '1') ? 'YES' : 'NO' },
        { field: "action", headerClassName: "header-theme", headerName: "Action", 
            renderCell: (param) => {
                return (
                    <>
                        {param.row.notified !== '1' ?
                        <>
                            {/* <button className='btn btn-sm v-btn-primary space-right' onClick={() => togglePopup(param.row.id)}><FontAwesomeIcon icon={faPenToSquare} /></button>
                            <button className='btn btn-sm v-btn-danger' onClick={() => handleDialogOpen(param.row.id)}><FontAwesomeIcon icon={faTrash} /></button> */}

                            <div className="d-flex align-items-center v-align-center">
                                {(editLoader && editLoader === param.row.id) ? 
                                    <div className='td-btn'>
                                        <div className="spinner-border" role="status">
                                            <span className="sr-only"></span>
                                        </div> 
                                    </div>
                                    :
                                    <Link onClick={() => handleEditClick(param.row.id)} className="me-2 icon edit" data-bs-title="Edit">
                                        <i className="bi bi-pencil-square"></i>
                                    </Link>
                                }

                                
                                <Link onClick={() => handleDelete(param.row.id)} className=" icon delete" data-bs-toggle="tooltip" data-bs-title="Delete">
                                    <i className="bi bi-trash-fill"></i>
                                </Link>
                            </div>

                        </>
                        : "NA"
                        }
                    </>
                )
            }
        },

    ];

    // COMPONENT MOUNTING / UPDATING
    useEffect(()=>{

        const getRecords = async () => {
            const data = await apiRequest({url:NOTIFICATIONS, method:"get", params: {page: currentPage,
                 items_per_page: itemsPerPage,
                  search: search, 
                  status: currentStatus,
                  notified: notified
                }});
            setData(data);
            setCurrentPage(data?.data?.page);
            setTotalPages(data?.data?.total_pages);
            setLoading(false)    
        }
        
        if(refreshRecords){
            setLoading(true)
            setRefreshRecords(false)
            getRecords();
        }
    }, [refreshRecords, apiRequest, currentPage, itemsPerPage, search,currentStatus,notified]);

    useEffect(()=>{
        setRefreshRecords(true);
    }, [currentPage])

    const handleEditClick = async (id) => {
        setEditLoader(id)
        const response = await apiRequest({url:FETCHNOTIFICATION + id, method:"get"});
    

        navigate(`/edit-notification`, {
          state: {
            id: id,
            notificationData: response?.data,
          },
        });
    };

    // DELETE USER //
    const handleDelete = async (id) => {
        const title = "Are you sure?";
        const text  = "Are you sure you want to deactivate this record?";
        const confirm = await SweetAlert.confirm(title, text);

        if(confirm){
            const data = await apiRequest({url:DELETENOTIFICATION + id, method:"DELETE"});
            setRefreshRecords(true);
            messagePop(data)
        }
    }

  return (
    <>
        <div className='text-end mb-3'>
            <Link to="/add-notification" className="ss_btn">Add Notification</Link>
        </div>

        <div className="card border-0 boxShadow">
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12 mb-3">
                        {/* DATE FILTER */}
                        <div className="fs-12 payments-filters">
                            <div className='col-md-8'>
                                    
                            </div>
                            <div className="col-md-2 margin-right-20">
                                <label className="form-label fs-12 fw-semibold">Status</label>
                                <FormDropdown
                                    name="status"
                                    options={status}
                                    onChange={dropDownChangeStatus}
                                    default_value={currentStatus || "active"}
                                    classnm="form-select fs-12"
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label fs-12 fw-semibold">Notified</label>
                                <FormDropdown
                                    name="status"
                                    options={can_access}
                                    onChange={dropDownChangeNotified}
                                    default_value={notified || "no"}
                                    classnm="form-select fs-12"
                                />
                            </div>
                                
                            {/* <div className="me-3">
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
                            </div> */}
                        </div>

                         {/* TABLE */}
                        <Table
                            style={{ tableLayout: "fixed", width: "100%" }}
                            title="List Users" 
                            loading={loading} 
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                            setRefreshRecords={setRefreshRecords}
                            setSearch={setSearch}
                            searhPlaceholder= "Title / Message"
                        >   
                            {/* <thead>
                                <tr className="bg-color">
                                <th className="fs-12 fw-semibold sorting sorting_asc">Title</th>
                                <th className="fs-12 fw-semibold sorting">Message</th>
                                <th className="fs-12 fw-semibold sorting">Timezone</th>
                                <th className="fs-12 fw-semibold sorting">Locations</th>
                                <th className="fs-12 fw-semibold sorting">Date</th>
                                <th className="fs-12 fw-semibold sorting" >Time</th>
                                <th className="fs-12 fw-semibold sorting" >Status</th>
                                <th className="fs-12 fw-semibold sorting" >Notified</th>
                                <th className="fs-12 fw-semibold sorting">Action</th></tr>
                            </thead> */}
                            <thead>
                            <tr className="bg-color">
                                <th className="fs-12 fw-semibold sorting sorting_asc" style={{ width: "50px" }}>Title</th>
                                <th className="fs-12 fw-semibold sorting" style={{ width: "100px" }}>Message</th>
                                <th className="fs-12 fw-semibold sorting" style={{ width: "150px" }}>Timezone</th>
                                <th className="fs-12 fw-semibold sorting" style={{ width: "200px" }}>Locations</th>
                                <th className="fs-12 fw-semibold sorting" style={{ width: "200px" }}>Date</th>
                                <th className="fs-12 fw-semibold sorting" style={{ width: "120px" }}>Time</th>
                                <th className="fs-12 fw-semibold sorting" style={{ width: "100px" }}>Status</th>
                                <th className="fs-12 fw-semibold sorting" style={{ width: "100px" }}>Notified</th>
                                <th className="fs-12 fw-semibold sorting" style={{ width: "150px" }}>Action</th>
                            </tr>
                            </thead>

                
                            <tbody className="fs-12">
                                {data?.data?.listing.map((item) => {
                                    const location_ids_ary = item.client_ids?.split(",").map(Number) || [];
                                    const location_names = locationdt?.data
                                    ?.filter(location => location_ids_ary.includes(location.id))
                                    .map(location => location.label)
                                    .join(", ") || "";

                                    const timezoneObj = timezones.find((timezone) => item.cust_timezone === timezone.value);
                                    const timezoneLabel = timezoneObj ? timezoneObj.label : "";

                                    return (
                                    <tr key={item.id} className="odd">
                                        <td style={{ width: "50px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            <span title={item.title}>
                                                {item.title.length > 30 ? item.title.slice(0,10) + "..." : item.title}
                                            </span>
                                        </td>

                                        {/* <td className="sorting_1">{item.title}</td> */}

                                        <td style={{ maxWidth: "100px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        <span title={item.message?.replace(/<[^>]+>/g, '')}>
                                            {item.message ? (
                                            DOMPurify.sanitize(item.message.replace(/<[^>]+>/g, '')).slice(0, 10) + (item.message.length > 30 ? "..." : "")
                                            ) : ""}
                                        </span>
                                        </td>

                                        <td>{timezoneLabel}</td>

                                        <td style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        <span title={location_names}>
                                            {location_names.length > 30 ? location_names.slice(0, 30) + "..." : location_names}
                                        </span>
                                        </td>

                                        <td style={{ maxWidth: "200px"}} >{Moment(item.date_to_notify).format('D MMM, YYYY')}</td>
                                        <td>{item.time_to_notify}</td>

                                        <td>
                                        <div className="fw-semibold d-flex align-items-center">
                                            <span className={`p-1 bg-${item.status === '1' ? 'success' : 'secondary'} rounded-circle`}></span>
                                            <span className={`ms-1 text-${item.status === '1' ? 'success' : 'secondary'}`}>
                                            {item.status === '1' ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        </td>

                                        <td>{item.notified === '1' ? 'YES' : 'NO'}</td>

                                        <td>
                                        {item.notified !== '1' ? (
                                            <div className="d-flex align-items-center v-align-center">
                                            {(editLoader && editLoader === item.id) ? (
                                                <div className='td-btn'>
                                                <div className="spinner-border" role="status">
                                                    <span className="sr-only"></span>
                                                </div>
                                                </div>
                                            ) : (
                                                <>
                                                <Link onClick={() => handleEditClick(item.id)} className="me-2 icon edit" data-bs-title="Edit">
                                                    <i className="bi bi-pencil-square"></i>
                                                </Link>
                                                <Link onClick={() => handleDelete(item.id)} className="icon delete" data-bs-title="Delete">
                                                    <i className="bi bi-trash-fill"></i>
                                                </Link>
                                                </>
                                            )}
                                            </div>
                                        ) : (
                                            "NA"
                                        )}
                                        </td>
                                    </tr>
                                    );
                                })}
                            </tbody>


                        </Table>

                        {/* USERS LISTING */}

                        {/* <Datatable 
                            rows={data?.data?.listing} 
                            title="Notifications" 
                            columns={columns} 
                            loading={loading} 
                            manageListing={{
                                currentPage,
                                setCurrentPage,
                                totalPages,
                                itemsPerPage,
                                setItemsPerPage,
                                setRefreshRecords,
                                setSearch,
                                searhPlaceholder: "Title / Message"
                            }}
                        /> */}
                        
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
