import React, { useEffect, useState } from 'react'
import { items_per_page } from '../../utils/Common';
import Datatable from '../../components/Datatable';
import { FETCHSTRIPE } from '../../utils/Endpoints';
import { useRequest } from '../../utils/Requests';
import { Link } from 'react-router-dom';
import Table from '../../components/Table';

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
    <>
    <Table
        loading={loading} 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setRefreshRecords={setRefreshRecords}
        setSearch={setSearch}
        searhPlaceholder= "Location"
    >   
       <thead>
            <tr className="bg-color">
                <th style={{ width: '20%' }} className="fs-12 fw-semibold sorting sorting_asc">Client Name</th>
                <th style={{ width: '20%' }} className="fs-12 fw-semibold sorting">Location</th>
                <th style={{ width: '40%' }} className="fs-12 fw-semibold sorting">Address</th>
                <th style={{ width: '20%' }} className="fs-12 fw-semibold sorting">Action</th>
            </tr>
        </thead>
        <tbody className="fs-12">
        {data?.data?.map((item, idx) => (
            <tr key={idx} className="odd">
                <td style={{ width: '20%' }} className="sorting_1">{item.client_name}</td>
                <td style={{ width: '20%' }}>{item.location}</td>
                <td style={{ width: '40%' }}>{item.address}</td>
                <td style={{ width: '20%',flex: 1 }}>
                    <div className="td-Updatebtn">
                        <Link className="ss_btn" to={item.url}>View Stripe Dashboard</Link>
                    </div>
                </td>
            </tr>
        ))}
        </tbody>
    </Table>
    {/* <Datatable 
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
        /> */}
    </>
  )
}
