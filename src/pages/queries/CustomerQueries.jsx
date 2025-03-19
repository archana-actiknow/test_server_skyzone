import React, { useEffect, useState } from 'react'
import { useRequest } from '../../utils/Requests.js';
import { decrypt, FilterstatusChange, items_per_page, messagePop, statusChange } from '../../utils/Common.js';
import { CUSTOMERQUERIES, CUSTOMERQUERIESREPLY, STATUSCHANGE } from '../../utils/Endpoints.js';
import { Skeleton } from '@mui/material';
import Accordion from '../../components/Accordion.jsx';
import moment from 'moment';
import Pagination from '../../components/Pagination.jsx';
import FormDropdown from '../../components/FormDropdown.jsx';
import GetLocations from '../../hooks/Locations.js';
import DatePicker from "../../components/DatePicker.jsx";
import TinyMCEEditor from "../../editor/editor.jsx";
import { sendReply } from '../../utils/validationSchemas.jsx';
import { useFormik } from 'formik';
import SweetAlert from '../../components/SweetAlert.jsx';

const RenderQueryRow = ({query, expandMessages, setExpandMessages}) => {
    const [queryStatus, setQueryStatus] = useState(query.status) ;

    const apiRequest = useRequest();
    const [replyEditors, setReplyEditors] = useState({});

    const handleReplyToggle = (id) => {
        setReplyEditors((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const onSubmit = async (values, { resetForm }) => {
        const formData = {  message: values.reply, query_id: values.id, customer_id: values.customer_id,};
        const response = await apiRequest({url: CUSTOMERQUERIESREPLY, method: "POST", data: formData});
        if (response) {
            messagePop(response);
            resetForm();
        }
    };

    const { values, errors, touched, setFieldValue, handleSubmit } = useFormik({
        initialValues: {
            reply: "",
            id: "", 
            customer_id: ""
        },
        validationSchema: sendReply,
        onSubmit,
    });

    const email = decrypt(query?.mobile_customer?.email);
    const phone = decrypt(query?.mobile_customer?.phone);

    const handleStatusChange = async (event, queryId, currentStatus) => {
        const newStatus = event.target.value;
        if (newStatus === currentStatus) return; 
        setQueryStatus(currentStatus);

        const title = "Are you sure?";
        const text = "Are you sure you want to change the status?";
        const confirm = await SweetAlert.confirm(title, text);
        
        if (confirm) {
            try {
                const response = await apiRequest({ url: STATUSCHANGE,method: "POST",data: { status: newStatus, id: queryId }});
                if (response) {
                    messagePop(response);
                    setQueryStatus(newStatus);
                }
            } catch (error) {
                SweetAlert.alert("Error", "Failed to update status. Please try again.", "error");
            }
        }
    };

    const getStatusColor = (status) => {
        const colours = parseInt(status)
        switch (colours) {
            case 0 : return 'bg-danger'; 
            case 1: return 'bg-warning'; 
            case 2: return 'bg-success';
            default: return 'bg-secondary'; 
        }
    };

    return (
        <Accordion addClass="mt-10" id={query.id} title={query.subject} key={query.id} infoTitle={moment(query.created_at).format("D MMM, YYYY")}  statusColor={getStatusColor(queryStatus)}>
            <div className="ss-table table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th width="5px">&nbsp;</th>
                            <th width="70%">Query</th>
                            <th >Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><i className="bi bi-question-circle-fill"></i></td>
                            <td className="wrap-text pd-15 fs-15">{query.message}</td>
                            <td>
                                <div className='d-flex align-items-center'>
                                    <FormDropdown onChange={(e) => handleStatusChange(e, query.id, queryStatus)} value={queryStatus} options={statusChange} classnm="fs-13 mb-3 form-control form-select length_count" />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={3}>&nbsp;</td>
                        </tr>
                        <tr>
                            <th>&nbsp;</th>
                            <th>Customer Details</th>
                            <th>&nbsp;</th>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td>
                                <b>Name: </b>{query?.mobile_customer?.fname} {query?.mobile_customer?.lname} <br />
                                <b>Email: </b>{email} <br />
                                <b>Phone: </b>{phone}
                            </td>
                            <td> </td>
                        </tr>
                        <tr>
                            <td colSpan={3}>
                                {query.customer_queries_replies?.length > 0 && (
                                    <div className="message-toggle p-2" style={{ marginTop: "16px" }}>
                                        <div className="ss-line" onClick={() => setExpandMessages(!expandMessages)} >
                                            <div className="content">
                                                <span className="message-length">{query.customer_queries_replies.length}</span>
                                                <i className={`bi ${ expandMessages ? " bi-chevron-up" : " bi-chevron-down"} icon-up-down`}/>
                                            </div>
                                        </div>
                                        {expandMessages && (
                                            <div className="previous-messages mt-2">
                                                {query.customer_queries_replies.map((msg, index) => (
                                                    <div key={index}>
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div>
                                                                <b className="mb-0">Message</b><p className="mb-0"> <span dangerouslySetInnerHTML={{ __html: msg.message }} /> </p> 
                                                            </div>
                                                            <span>{moment(msg.created_at).format(" MMM D, YYYY, h:mm A")}</span>
                                                        </div>
                                                        <hr />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <i data-toggle="tooltip" data-placement="top" title={replyEditors[query.id] ? "Close" : "Reply"}
                                    className={`bi ${replyEditors[query.id] ? 'bi bi-x-circle-fill bg-color font-size' : 'bi-arrow-return-left font-size'} float-end`}
                                    onClick={() => handleReplyToggle(query.id)} >
                                </i>
                            </td>
                        </tr>
                        {replyEditors[query.id] && (
                            <tr>
                                <td colSpan={3}>
                                    <form>
                                        <TinyMCEEditor
                                            height={200} name="reply" value={values.reply}
                                            onEditorChange={(content) => setFieldValue("reply", content)} />
                                        {(errors.reply && touched.reply) && (<p className="fs-12 text-danger">{errors.reply}</p>)}
                                        <button
                                            type="button" className="ss_btn text-right mt-2 mb-2 float-end"
                                            onClick={() => {setFieldValue("id", query.id, true); setFieldValue("customer_id", query.customer_id, true);
                                                handleSubmit(); 
                                            }}
                                        >
                                        Submit </button>
                                    </form>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Accordion>
    );
};

export default function CustomerQueries() {
    const [RefresRecords, setRefresRecords] = useState(true);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const apiRequest = useRequest();
    const { data: locationdt, loading: locationloading } = GetLocations();
    const [currentLocation, setCurrentLocation] = useState(false);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [expandMessages, setExpandMessages] = useState(false);
    const [currentStatus,setCurrentStatus] = useState();
    const [selectedStatus, setSelectedStatus] = useState(""); 
    const [currentPage, setCurrentPage] = useState(1);  // PAGE AND ITEMS SETTINGS //
    const [search, setSearch] = useState(null); // SEARCH USERS //
    useEffect(() => {
        setLoading(true);
        setRefresRecords(false);
        setLoading(false);
    }, [RefresRecords]);

    const dropDownChange = (e) => {              // DROPDOWNS CHANGE //
        setCurrentLocation(e.target.value);
        setRefresRecords(true);
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setRefresRecords(true);
    }

    const dropDownChangeStatus = (e) => {
        setSelectedStatus(e.target.value);
    };

    // COMPONENT MOUNTING 

    useEffect(()=>{
        const getCustomerQueries = async () => {
            setLoading(true)
            const client_id = (currentLocation) ? {client_id : currentLocation} : "";
            const to_date = (toDate) ? {toDate : toDate} : "";
            const from_date = (fromDate) ? {fromDate : fromDate} : "";
            const status = currentStatus ? { status: currentStatus } : {}; 
            // const status = currentStatus && currentStatus !== "all" ? { status: currentStatus } : {};
            const data = await apiRequest({url:CUSTOMERQUERIES, method:"get",
                 params: {page: currentPage,  items_per_page: items_per_page, search: search, ...client_id, 
                    ...to_date,
                  ...from_date,
                  ...status 
                }});
            setCurrentPage(data?.data?.page);
            setTotalPages(data?.data?.total_pages);
            setData(data?.data?.data);
            setLoading(false); 
        }
        if(RefresRecords){
            setRefresRecords(false)
            getCustomerQueries();
        }
    }, [RefresRecords, apiRequest, currentPage, search, currentLocation,currentStatus,toDate,fromDate])

    useEffect(()=>{
        setRefresRecords(true);
    }, [currentPage])

    const handleApplyFilter = () => {
        setFromDate(fromDate);
        setToDate(toDate);
        setCurrentStatus(selectedStatus);
        // setCurrentStatus(selectedStatus); 
        setRefresRecords(true);
    };

    const handleClearFilter = () => {
        setFromDate("");
        setToDate("");
        setCurrentStatus(""); 
        setSelectedStatus(FilterstatusChange[0].value);
        setRefresRecords(true);
    };  
    
    return (
        <div className="tab-pane fade active show" id="staffSetting-tab-pane" role="tabpanel" aria-labelledby="staffSetting-tab" tabIndex="0">
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
                                    <div className="col-md-6">
                                        <p className="fs-15 fw-semibold mb-0">Filter Queries</p>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fs-12 fw-semibold">Location</label>
                                        {((locationloading)) ? 'Loading...' :
                                            locationdt &&
                                            <FormDropdown onChange={dropDownChange} name="location" options={locationdt.data} default_value={currentLocation} classnm="form-select fs-12"/>
                                        }
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="searchProduct" className="form-label fs-12 fw-semibold">Search</label>
                                        <input type="text" className="form-control fs-12" id="searchProduct" placeholder="Search Queries" onChange={handleSearch} />
                                    </div>
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
                            <div className="fs-12 payments-filters">
                                <div className='me-3'>
                                    <label htmlFor="status" className="form-label">Status</label>
                                    <div>
                                        <FormDropdown onChange={dropDownChangeStatus} name="status" 
                                        options={FilterstatusChange}  
                                        value={selectedStatus || FilterstatusChange[0].value}
                                         classnm="fs-13 form-control form-select length_count" />
                                    </div>
                    
                                </div>
                                <div className="me-3">
                                    <label htmlFor="fromDate" className="form-label">From Date</label>
                                    <div>
                                        <DatePicker value={fromDate} onChange={(date) => setFromDate(date)} minDate={false} name="startDate"/>
                                    </div>
                                </div>
                                <div className="me-3">
                                    <label htmlFor="toDate" className="form-label"> To Date </label>
                                    <div>
                                        <DatePicker value={toDate} onChange={(date) => setToDate(date)} minDate={false} name="startDate"/>
                                    </div>
                                </div>
                                <div className="me-3 mt-3 pt-md-1">
                                    <button className="ss_btn" onClick={handleApplyFilter}> Apply Filter</button>
                                </div>
                                <div className="me-3 mt-3 pt-md-1">
                                    <button className="refreshbtn" onClick={handleClearFilter}>Clear Filter </button>
                                </div>
                            </div> 
                            {loading ? (
                                <Skeleton variant="rectangular" width="100%" height={400} className="skeleton-custom" />
                            ) : (
                                <>
                                {data?.map((query) => {
                                    return (
                                        <RenderQueryRow
                                            key={query.id} 
                                            query={query}
                                            RefresRecords={RefresRecords}
                                            setRefresRecords={setRefresRecords}
                                            expandMessages={expandMessages}
                                            setExpandMessages={setExpandMessages}
                                        />
                                    );
                                })}
                                </>
                            )}
                            {totalPages > 0 && (
                                <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} refreshRecords={setRefresRecords} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}