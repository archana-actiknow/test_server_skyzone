import React from 'react'
import FormDropdown from './FormDropdown';
import { list_per_page_items } from '../utils/Common';

export default function Table({title, loading, manageListing, currentPage, setCurrentPage, totalPages, itemsPerPage, setItemsPerPage, setRefreshRecords, setSearch, searhPlaceholder, children}) {
    
    const handlePageItemChange = (e) => {
        setItemsPerPage(e.target.value);
        setRefreshRecords(true);
    }

    const handSearchChange = (e) => {
        setSearch(e.target.value);
        setRefreshRecords(true);
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
    <>
        <div className="row">
            <div className="col-md-12">
                <div className="card border-0">
                    <div className="card-body">
                        <p className="fs-15 fw-semibold">{title}</p>

                        <div className="row search-container">
                            <div className="col-md-1" style={{display: "flex", width: '150px', marginBottom: '12px', fontSize: 12}}>
                                Show &nbsp;{list_per_page_items &&<FormDropdown className="showRj" options={list_per_page_items} default_value={itemsPerPage} onChange={handlePageItemChange} />} &nbsp;entries
                            </div>
                            <div className="col-md-8"></div>
                            <div className="col-md-2">
                                <div id="customer_table_filter " className="dataTables_filter text-right">
                                    {setSearch &&
                                    <label>Search:<input type="text" name="search" onChange={handSearchChange} className="form-control fs-12" placeholder={searhPlaceholder?searhPlaceholder:"Search"} aria-controls="customer_table" /></label>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive">

                            <table className="table dataTable no-footer" id="customer_table" aria-describedby="customer_table_info">
                                {children}
                            </table>
                        
                        </div>

                        


                        <div className="card border-0">
                            <div className="row paginationRj">
                                <div className="col-md-12 fs_12">&nbsp;</div>
                                <div className="col-md-6 fs_12">
                                    {/* Showing 1 to 2 of 2 entries */}
                                </div>
                                <div className="col-md-6">

                                    {/* PAGINATION */}
                                    {totalPages &&
                                    <nav aria-label="Page navigation example">
                                        <ul className="pagination justify-content-end mb-0">

                                            {/* PREVIOUS */}
                                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                                <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                                                    Previous
                                                </button>
                                            </li>

                                            {/* PAGES */}
                                            {[...Array(totalPages).keys()].map((pagenum) => (
                                            <li key={pagenum + 1} className={`page-item ${ currentPage === pagenum + 1 ? "active" : ""}`}>
                                                <button className="page-link" onClick={() => paginate(pagenum + 1)}>
                                                    {pagenum + 1}
                                                </button>
                                            </li>
                                            ))}

                                            {/* NEXT */}
                                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                                <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                                                    Next
                                                </button>
                                            </li>

                                        </ul>
                                    </nav>
                                    }

                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
