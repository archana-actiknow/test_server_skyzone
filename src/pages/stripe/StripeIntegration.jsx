import React, { useEffect, useState } from 'react'
import { items_per_page } from '../../utils/Common';
import Datatable from '../../components/Datatable';
import { FETCHSTRIPE } from '../../utils/Endpoints';
import { useRequest } from '../../utils/Requests';
import { Link } from 'react-router-dom';

export default function StripeIntegration() {
    const apiRequest = useRequest();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(items_per_page);
    const [search, setSearch] = useState(null);
    const [refreshRecords, setRefreshRecords] = useState(true);

    

    useEffect(()=>{
        const getRecords = async () => {
            const data = await apiRequest({url:FETCHSTRIPE, method:"post", params: {page: currentPage, items_per_page: itemsPerPage, search: search}});
            setData(data);
            setLoading(false)
        }

        if(refreshRecords){
            getRecords();
            setRefreshRecords(false);
        }
    }, [refreshRecords, setRefreshRecords, apiRequest, currentPage, itemsPerPage, search]);
    

    const columns = [
        { field: "client_name", headerClassName: "fs-12 fw-semibold", width: 200, headerName: "Client Name" },
        { field: "location", headerClassName: "fs-12 fw-semibold", width: 250, headerName: "Location", },
        { field: "address", headerClassName: "fs-12 fw-semibold", width: 450, headerName: "Address"},
        { field: "url", headerClassName: "fs-12 fw-semibold", flex: 1, headerName: "Action", 
            renderCell: (param) => {
                return (
                    <div className="td-Updatebtn">
                        <Link className="ss_btn" to={param.row.url}>View Stripe Dashboard</Link>
                    </div>
                )
            }
        },
    ]

  return (
    <Datatable 
        rows={data?.data} 
        title="" 
        columns={columns} 
        loading={loading} 
        manageListing={{
            currentPage,
            setCurrentPage,
            itemsPerPage,
            setItemsPerPage,
            setSearch,
            searhPlaceholder: "Location",
            setRefreshRecords
        }}
    />
  )
}
