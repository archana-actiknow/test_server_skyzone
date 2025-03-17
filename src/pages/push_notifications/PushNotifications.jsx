import React, { useEffect, useState } from 'react'
import { useRequest } from '../../utils/Requests';
import { messagePop, timezones} from '../../utils/Common';
import Moment from 'moment';
import DOMPurify from 'dompurify';
import { Tooltip } from '@mui/material';
import { NOTIFICATIONS, FETCHNOTIFICATION, DELETENOTIFICATION } from '../../utils/Endpoints';
import Datatable from '../../components/Datatable';
import { Link, useNavigate } from 'react-router-dom';
import SweetAlert from '../../components/SweetAlert';
import GetLocations from '../../hooks/Locations';

export default function PushNotifications() {
    const [data, setData] = useState([]);
    const [refreshRecords, setRefreshRecords] = useState(true);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(null);
    const [editLoader, setEditLoader] = useState(false);
    const { data: locationdt } = GetLocations();
   

    const navigate = useNavigate();
    const apiRequest = useRequest();

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
            const data = await apiRequest({url:NOTIFICATIONS, method:"get", params: {page: currentPage, items_per_page: itemsPerPage, search: search}});
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
    }, [refreshRecords, apiRequest, currentPage, itemsPerPage, search]);

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

        <Datatable 
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
        />
    </>
  )
}
