import React, { useEffect, useState } from 'react'
import { useRequest } from '../../utils/Requests';
import { items_per_page} from '../../utils/Common';
import { GENERALQUERIES } from '../../utils/Endpoints';
import Accordion from '../../components/Accordion';
import moment from 'moment';
import Pagination from '../../components/Pagination';
import SkeletonLoader from "../../components/SkeletonLoader";

export default function GeneralQueries(){
    const [RefresRecords, setRefresRecords] = useState(true);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const apiRequest = useRequest();

    // PAGE AND ITEMS SETTINGS //
    const [currentPage, setCurrentPage] = useState(1);

    // SEARCH USERS //
    const [search, setSearch] = useState(null);

    

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setRefresRecords(true);
    }
    
    // COMPONENT MOUNTING 
    useEffect(()=>{
        const getCustomerQueries = async () => {
            setLoading(true)
            const data = await apiRequest({
                url:GENERALQUERIES, 
                method:"get", 
                params: {
                    page: currentPage, 
                    items_per_page: items_per_page, 
                    search: search
                }
            });

            setCurrentPage(data?.data?.page);
            setTotalPages(data?.data?.total_pages);
            setData(data?.data?.data);
            setLoading(false)    
        }
        
        if(RefresRecords){
            setRefresRecords(false)
            getCustomerQueries();
        }
    }, [RefresRecords, apiRequest, currentPage, search])

    
    useEffect(()=>{
        setRefresRecords(true);
    }, [currentPage])

    return(
        <div className="tab-pane fade active show" id="staffSetting-tab-pane" role="tabpanel" aria-labelledby="staffSetting-tab" tabIndex="0">
            
                <div className="row mb-3">
                    <div className="col-md-12">
                        <div className="card border-0">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-md-9">
                                        <p className="fs-15 fw-semibold mb-0">Filter Queries</p>
                                    </div>
                                    
                                    <div className="col-md-3">
                                        <label htmlFor="searchProduct" className="form-label fs-12 fw-semibold">Search</label>
                                        <input type="text" className="form-control fs-12" id="searchProduct" placeholder="Search Queries"  onChange={handleSearch} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            <div className="card border-0 boxShadow">
                <div className="card-body">
                    
                    <div className="row">

                        <div className="col-md-12 mb-3">

                        {loading ? 
                        <SkeletonLoader height={400} />
                        :

                        <>
                            {data?.map(query => {
                                const email = query.user;
                                return(
                                    <Accordion addClass="mt-10" id={query.id} title={`${query.subject}`} key={query.id} infoTitle={moment(query.created_at).format('D MMM, YYYY') } >
                                        <div className="ss-table table-responsive">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th width="5px">&nbsp;</th>
                                                        <th width="80%">Query</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <i className="bi bi-question-circle-fill"></i> 
                                                        </td>
                                                        <td className='wrap-text pd-15 fs-15'>
                                                            {query.message}
                                                        </td>
                                                        <td>Open</td>
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
                                                            {email} <br />
                                                        </td>
                                                        <td>&nbsp;</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </Accordion>
                                )
                            })}
                        </>

                        }

                        {totalPages > 0 ?
                            <Pagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                refreshRecords={setRefresRecords}
                            />
                        :
                        <SkeletonLoader height={20} />
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}