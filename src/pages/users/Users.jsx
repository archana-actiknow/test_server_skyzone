import React, { useEffect, useState } from 'react'
import { useRequest } from '../../utils/Requests';
import Moment from 'moment'
import { Link } from 'react-router-dom';
import { decrypt, items_per_page, messagePop, timezones} from '../../utils/Common';
import { DELETEUSER, FIND_USER, USER_DETAIL, USERS } from '../../utils/Endpoints';
import SweetAlert from '../../components/SweetAlert';
import EditUserProfile from './EditUserProfile';
import ViewUserProfile from './ViewUserProfile';
import AddUserProfile from './AddUserProfile';
// import Table from '../../components/Table';
import Datatable from '../../components/Datatable';

export default function Users() {
    const [refreshUsers, setRefreshUsers] = useState(true);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpenId, setIsOpenId] = useState(false); // Edit User Popup
    const [isOpen, setIsOpen] = useState(false); // Add User Popup
    const [isOpenViewId, setIsOpenViewId] = useState(false); // View User Popup
    const [editData, setEditData] = useState(0);
    const [viewData, setViewData] = useState(0);
    const [loader, setLoader] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const apiRequest = useRequest();

    // PAGE AND ITEMS SETTINGS //
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(items_per_page);

    // SEARCH USERS //
    const [search, setSearch] = useState(null);

    // USERS TABLE COLUMNS //
    const columns = [
        { field: "username", headerClassName: "fs-12 fw-semibold", flex: 1, headerName: "UserName" },
        { field: "first_name", headerClassName: "fs-12 fw-semibold", flex: 1, headerName: "Name", },
        { field: "email", headerClassName: "fs-12 fw-semibold", flex: 2, headerName: "Email", renderCell: (params) => decrypt(params.row.email)},
        // { field: "contact_number", flex: 1, headerClassName: "fs-12 fw-semibold", flex: 1, headerName: "Contact"},
        {
            field: "status", headerClassName: "fs-12 fw-semibold",
            headerName: "Status",
            flex: 1,
            renderCell: (params) => {

                if(params.row.status === 1) 
                return (
                    <div className="fw-semibold d-flex align-items-center">
                        <span className="p-1 bg-success rounded-circle"></span>
                        <span className="ms-1 text-success">Active</span>
                    </div>
                );
                else
                return (
                    <div className="fw-semibold d-flex align-items-center">
                        <span className="p-1 bg-danger rounded-circle"></span>
                        <span className="ms-1 text-success">Inactive</span>
                    </div>
                );
            },
        },
        // { field: "location", flex: 1, headerClassName: "fs-12 fw-semibold", headerName: "Location", renderCell: (params) => params.row.clientmaster.location},
        { 
            field: "created", 
            headerClassName: "fs-12 fw-semibold", 
            flex: 1, 
            headerName: "Created On",  
            renderCell: (params) =>  Moment(params.row.created).format('D MMM, YYYY') 
        },
        { field: "action", flex: 1, headerClassName: "fs-12 fw-semibold", headerName: "Action",
            renderCell: (param) => {
                return (
                    <>
                    
                    <div className="d-flex align-items-center v-align-center">
                    {(loader && loader === `${param.row.id}-view`) ? 
                            <div className='edit-btn'>
                                <div className="spinner-border" role="status">
                                    <span className="sr-only"></span>
                                </div> 
                            </div>
                            :
                            <Link className="me-2 icon edit" data-bs-title="View" onClick={() => toggleView(param.row.id)}>
                                <i className="bi bi-eye"></i>
                            </Link>
                        }
                            
                            
                        {(loader && loader === param.row.id) ? 
                            <div className='edit-btn'>
                                <div className="spinner-border" role="status">
                                    <span className="sr-only"></span>
                                </div> 
                            </div>
                            :
                            <Link className="me-2 icon edit" data-bs-title="Edit" onClick={() => toggleEdit(param.row.id)}>
                                <i className="bi bi-pencil-square"></i>
                            </Link>
                        }

                        <Link className=" icon delete" data-bs-title="Delete" onClick={() => deleteUser(param.row.id)}>
                            <i className="bi bi-trash-fill"></i>
                        </Link>
                    </div>

                    </>
                )
            }
        },
    ];
    
    // REFRESH USERS LISTING ON USERS RECORD ADD / UPDATED
    const refreshListing = (response) => {
        if(response){
            setRefreshUsers(true);
        }
        else{
            SweetAlert.error('Oops!', 'Something went wrong.')
            setRefreshUsers(false);
        }
    }

    // COMPONENT MOUNTING / UPDATING
    useEffect(()=>{
        const getUsers = async () => {
            setLoading(true)
            const data = await apiRequest({url:USERS, method:"get", params: {page: currentPage, items_per_page: itemsPerPage, search: search}});
            setCurrentPage(data?.data?.page);
            setTotalPages(data?.data?.total_pages);
            setData(data);
            setLoading(false)    
        }
        
        if(refreshUsers){
            setRefreshUsers(false)
            getUsers();
        }
    }, [refreshUsers, apiRequest, currentPage, itemsPerPage, search])

    useEffect(()=>{
        setRefreshUsers(true);
    }, [currentPage])

    // TOGGLE EDIT POPUP
    const toggleEdit = async (id) => {
        setLoader(id);
        var singleRec = {};
        if(id !== 'undefined'){
            const user = await apiRequest({url:FIND_USER, method:"get", params: {id: id}});
            const usrT = user?.data?.timezone;
            const userTimezone = (usrT !== '' && usrT !== 0 && usrT !== '0') ? timezones.find(timezone => timezone.id === usrT) : timezones[0];

            
            singleRec = {
                id: user?.data.id,
                username:user?.data.username,
                password:"",
                name:user?.data.first_name,
                email:user&&decrypt(user.data.email),
                contact:user&&decrypt(user.data.contact_number),
                role:user?.data.role,
                timezone:userTimezone.value,
                location:user?.data?.location,
            }
        }
        setEditData(singleRec)
        setIsOpenId(id);
        setLoader(false);
    }

    // TOGGLE VIEW POPUP
    const toggleView = async (id) => {
        setLoader(`${id}-view`);
       var singleRec = {};
        if(id !== 'undefined'){
            const user = await apiRequest({url:USER_DETAIL, method:"get", params: {id: id}});

            singleRec = {
                id: user?.data.id,
                username:user?.data.username,
                password:"",
                name:user?.data.first_name,
                email:user&&decrypt(user.data.email),
                contact:user&&decrypt(user.data.contact_number),
                role:user?.data.role,
                timezone:user?.data.timezone,
                location:user?.data.location,
            }
        }
        setViewData(singleRec)
        setIsOpenViewId(id);
        setLoader(false);
    }

    // DELETE USER //
    const deleteUser = async (id) => {
        const title = "Are you sure?";
        const text  = "Are you sure you want to deactivate this user?";
        const confirm = await SweetAlert.confirm(title, text);

        if(confirm){
            const data = await apiRequest({url:DELETEUSER + id, method:"DELETE"});
            setRefreshUsers(true);
            messagePop(data);
        }
    }

    const toggleAdd = () => {
        setIsOpen(prev => !prev);
    }

  return (
    <>
        {/* ADD USER POPUP */}
        <div className="text-end mb-3">
            <button className='ss_btn' onClick={toggleAdd} >Add User</button>
            {isOpen && <AddUserProfile refreshData={refreshListing} close={toggleAdd} />}
        </div>

        {/* EDIT USER POPUP */}
        {isOpenId && <EditUserProfile id={isOpenId} close={setIsOpenId} data={editData} refreshData={refreshListing} />}

        {/* VIEW USER DETAIL */}
        {isOpenViewId && <ViewUserProfile id={isOpenViewId} close={setIsOpenViewId} data={viewData} refreshData={refreshListing} />}
        

        {/* TABLE */}
        {/* <Table
            title="List Users" 
            loading={loading} 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            setRefreshRecords={setRefreshUsers}
            setSearch={setSearch}
            searhPlaceholder= "Username / Name"
        >   
            <thead>
                <tr className="bg-color">
                <th className="fs-12 fw-semibold sorting sorting_asc">UserName</th>
                <th className="fs-12 fw-semibold sorting">Name</th>
                <th className="fs-12 fw-semibold sorting">Email</th>
                <th className="fs-12 fw-semibold sorting">Status</th>
                <th className="fs-12 fw-semibold sorting">Location</th>
                <th className="fs-12 fw-semibold sorting" tabindex>Created On</th>
                <th className="fs-12 fw-semibold sorting">Action</th></tr>
            </thead>

            <tbody className="fs-12">
                {data?.data?.listing.map((item => (
                    <tr className="odd">
                    <td className="sorting_1">{item.username}</td>
                    <td>{item.first_name}</td>
                    <td>{decrypt(item.email)}</td>
                    <td>

                    {item.status === 1 ?
                    <div className="fw-semibold d-flex align-items-center">
                        <span className="p-1 bg-success rounded-circle"></span><span className="ms-1 text-success">Active</span>
                    </div>
                    :
                    <div className="fw-semibold d-flex align-items-center">
                        <span className="p-1 bg-success rounded-circle"></span><span className="ms-1 text-success">Active</span>
                    </div>
                    }
                    </td>								
                    <td>{item.clientmaster.location}</td>
                    <td>{Moment(item.created).format('D MMM, YYYY') }</td>
                    <td>

                        <div className="d-flex align-items-center v-align-center">
                            {(loader && loader === item.id) ? 
                                <div className='edit-btn'>
                                    <div className="spinner-border" role="status">
                                        <span className="sr-only"></span>
                                    </div> 
                                </div>
                                :
                                <Link className="me-2 icon edit" data-bs-title="Edit" onClick={() => toggleEdit(item.id)}>
                                    <i className="bi bi-pencil-square"></i>
                                </Link>
                            }
                            
                            <Link className=" icon delete" data-bs-title="Delete" onClick={() => deleteUser(item.id)}>
                                <i className="bi bi-trash-fill"></i>
                            </Link>
                        </div>
                    </td>
                    </tr>
                )))}
            
            </tbody>
        </Table> */}


        {/* USERS LISTING */}
        <Datatable 
            rows={data?.data?.listing} 
            title="List Users" 
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
                searhPlaceholder: "Name / Username"
            }}
        />
    </>
  )
}
