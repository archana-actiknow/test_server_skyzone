import React from 'react'

export default function Pagination({totalPages, currentPage, setCurrentPage, refreshRecords}) {

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        refreshRecords(true);
      };

  return (
    <div className="row align-items-center mb-3">
        <div className="col-md-6 pt-3"></div>
        <div className="col-md-6 pt-3 pb-2">
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end mb-0">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index + 1}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
  )
}
