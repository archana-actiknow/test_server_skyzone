import React, { useEffect, useState } from "react";
import GetLocations from "../../hooks/Locations";
import FormDropdown from "../../components/FormDropdown";
import { useRequest } from "../../utils/Requests";
import {
  PAYMENT_LIST,
  PAYMENT_REFUND,
  PAYMENT_DETAILS,
  SUBSCRIPTION_CANCEL,
} from "../../utils/Endpoints";
import { Skeleton } from "@mui/material";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";
import SweetAlert from "../../components/SweetAlert";
import { items_per_page, messagePop } from "../../utils/Common";
import DatePicker from "../../components/DatePicker.jsx";

export default function Payments() {
  const location = useLocation();
  const [data, setData] = useState([true]);
  const [refreshRecords, setRefresRecords] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(false);
  const [currentLocationName, setCurrentLocationName] = useState("");
  const [allLocation, setAllLocations] = useState([]);
  const apiRequest = useRequest();
  const { data: locationdt, loading: locationloading } = GetLocations();
  const [showModal, setShowModal] = useState(false);
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [fromDate, setFromDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(items_per_page);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);


  // DROPDOWNS CHANGE //
  const dropDownChange = (e) => {
    setCurrentLocationName(allLocation[e.target.selectedIndex].label);
    setCurrentLocation(e.target.value);
    setRefresRecords(true);
  };

  // ONLOAD //
  useEffect(() => {
    if (!locationloading && locationdt) {
      if (location.state !== null) {
        setCurrentLocation(location.state?.id);
        setCurrentLocationName(location.state?.value);
        setRefresRecords(true);
      } else {
        setCurrentLocation(locationdt.data[0].value);
        setCurrentLocationName(locationdt.data[0].label);
      }

      setAllLocations(locationdt.data);
    }
  }, [locationdt, locationloading, location.state]);

  // FETCH ONLOAD //
  useEffect(() => {
    const getPaymentRecords = async (page = 1) => {
      setLoading(true);
      const paymentRec = await apiRequest({
        url: PAYMENT_LIST,
        method: "post",
        params: {
          location_id: currentLocation,
          start_date: fromDate,
          end_date: toDate,
        },
      });

      if(paymentRec.error) {
        SweetAlert.error("Error!", paymentRec.error);
      }

      setData(paymentRec);
      setLoading(false);
   };

    if (refreshRecords && currentLocation) {
      getPaymentRecords();
      setRefresRecords(false);
    }
  }, [apiRequest, refreshRecords, currentLocation, fromDate, toDate]);

  const handleRefund = async (charge_id, amount) => {

    const title = "Are you sure?";
    const text  = "Are you sure you want to issue a refund for this record?";
    const confirm = await SweetAlert.confirm(title, text);

    if(confirm){
      const response = await apiRequest({
        url: PAYMENT_REFUND,
        method: "post",
        data: {
          location_id: currentLocation,
          charge_id,
          amount,
        },
      });
      messagePop(response);
    }

  };

  const handleCancelSub = async (id) => {

    const title = "Are you sure?";
    const text  = "Are you sure you want to cancel this subscription?";
    const confirm = await SweetAlert.confirm(title, text);

    if (confirm) {
      try {
        const response = await apiRequest({
          url: SUBSCRIPTION_CANCEL,
          method: "post",
          data: {
            location_id: currentLocation,
            id:id
          },
        });

        if (response) {
          SweetAlert.success("Success!", "Refund processed successfully!"); // setData(data)
        } else {
          const errorData = await response.json();
          alert(`Refund failed: ${errorData.message}`);
        }
        
      } catch (error) {
        console.error("Error processing refund:", error);
      }
    }
  };

  const handleShowDetail = async (paymentId) => {

    const response = await apiRequest({
      url: PAYMENT_DETAILS,
      method: "post",
      data: {
        location_id: currentLocation,
        id: paymentId,
      },
    });

    const paymentData = response.data;
    setPaymentDetail(paymentData);
    setShowModal(true);
  };

  const handleApplyFilter = () => {
    setFromDate(fromDate);
    setToDate(toDate);
    setRefresRecords(true);
  };

  const handleClearFilter = () => {
    setFromDate(new Date().toISOString().split("T")[0]);
    setToDate(new Date().toISOString().split("T")[0]);
    setRefresRecords(true);
  };

  const handleClose = () => setShowModal(false);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filtered data based on the search term
  const filteredPayments = data?.data?.filter((payment) =>
    payment.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCard = currentPage * pageSize;
  const indexOfFirstCard = indexOfLastCard - pageSize;
  const currentPayments = filteredPayments?.slice(indexOfFirstCard, indexOfLastCard) || [];
  const totalItems = filteredPayments?.length || 0;


  const totalPages = Math.ceil(totalItems / pageSize) || 1;


  return (
    <>
      {locationloading ? (
        <>
          <div className="text-end mb-3">
          </div>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={100}
            className="skeleton-custom"
          />
        </>
      ) : (
        locationdt && (
          <>
            <div className="row mb-3">
              <div className="col-md-12">
                <div className="card border-0">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <p className="fs-15 fw-semibold mb-0">Payments</p>
                      </div>
                      <div className="col-md-3"></div>
                      <div className="col-md-3">
                        <label className="form-label fs-12 fw-semibold">
                          Location
                        </label>
                        {locationloading || !currentLocation
                          ? "Loading..."
                          : locationdt && (
                              <FormDropdown
                                onChange={dropDownChange}
                                name="location"
                                options={locationdt.data}
                                default_value={currentLocation}
                                classnm="form-select fs-12"
                              />
                            )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      )}

      {/* Payments LISTING */}
      <div className="row">
        <div className="col-md-12">
          <div className="card border-0">
            <div className="card-body">
              <div className="payments">
                <h3 className="fs-14">{currentLocationName}</h3>
                <span>
                  {loading ? 
                  <div className="text-center mb-3">
                    <div className="position-relative">
                      <div className="position-absolute top-50 start-50 translate-middle">
                          <div className="spinner-border" role="status">
                            <span className="sr-only"></span>
                          </div>
                      </div>
                    </div>
                  </div>
                  :
                    (data?.sum)
                  }
                </span>
              </div>
              <div className="fs-12 payments-filters">
                <div className="me-3">
                  <label htmlFor="fromDate" className="form-label">
                    From Date
                  </label>
                  <div>
                    <DatePicker
                      value={fromDate}
                      onChange={(date) => setFromDate(date)}
                      minDate={false} 
                      name="startDate" 
                    />
                  </div>
                </div>
                <div className="me-3">
                  <label htmlFor="toDate" className="form-label">
                    To Date
                  </label>
                  <div>
                  <DatePicker
                    value={toDate}
                    onChange={(date) => setToDate(date)}
                    minDate={false} 
                    name="startDate" 
                  />
                  </div>
                </div>
                <div className="me-3 mt-3 pt-md-1">
                  <button className="ss_btn" onClick={handleApplyFilter}>
                    Apply Filter
                  </button>
                </div>
                <div className="me-3 mt-3 pt-md-1">
                  <button className="refreshbtn" onClick={handleClearFilter}>
                    Clear Filter
                  </button>
                </div>
              </div>
              <div className="table-responsive">
                {loading ? 
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={80}
                  className="skeleton-custom text-end"
                />
                :
                <table className="table" id="">
                  <thead>
                    <tr>
                      <td>
                        <input
                          type="text"
                          className="form-control fs-12 fw-semibold"
                          placeholder="Search by Customer Name"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </td>
                      <td colSpan={7}></td>
                    </tr>
                    <tr className="bg-color">
                      <th className="fs-12 fw-semibold">Customer</th>
                      <th className="fs-12 fw-semibold">
                        Rivette Booking Ref.{" "}
                      </th>
                      <th className="fs-12 fw-semibold">Amount</th>
                      <th className="fs-12 fw-semibold">Net</th>
                      <th className="fs-12 fw-semibold">Status</th>
                      <th className="fs-12 fw-semibold">Created</th>
                      <th className="fs-12 fw-semibold">Action</th>
                      <th className="fs-12 fw-semibold">Subscription</th>
                    </tr>
                  </thead>
                  <tbody className="fs-12">
                    {currentPayments.length < 0 ? (
                      <>
                        <div className="text-end mb-3">
                          <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={80}
                            className="skeleton-custom text-end"
                          />
                        </div>
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height={100}
                          className="skeleton-custom"
                        />
                      </>
                    ) : (
                      currentPayments && (
                        <>
                          {currentPayments.length > 0 ? (
                            currentPayments.map((payment) => (
                              <tr key={payment.result.id}>
                                <td>{payment.customer_name}</td>
                                <td>{payment.result.description}</td>
                                <td>{payment.result.amount / 100}</td>
                                <td>
                                  {(payment.result.amount -
                                    payment.result.application_fee_amount) /
                                    100}
                                </td>
                                <td>{payment.result.status}</td>
                                <td>
                                  <span className="badge bg-success">
                                    {moment
                                      .unix(payment.result.created)
                                      .format("YYYY/MM/DD kk:mm:ss")}
                                  </span>
                                </td>
                                <td>
                                  {payment.result.refunded ? (
                                    <span
                                      className=""
                                      style={{ cursor: "default" }}
                                    >
                                      Refunded
                                    </span>
                                  ) : payment.result.status === "succeeded" ? (
                                    <>
                                      <button
                                        type="button"
                                        className="btn bg-warning-subtle btn-sm"
                                        onClick={() =>
                                          handleShowDetail(payment.result.id)
                                        }
                                      >
                                        Payment Detail
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() =>
                                          handleRefund(
                                            payment.result.id,
                                            payment.result.amount
                                          )
                                        }
                                      >
                                        Refund
                                      </button>
                                    </>
                                  ) : (
                                    <span className="">
                                      Refund not applicable
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {/* <span className="badge bg-primary">NA</span> */}
                                  {/* <td> */}
                                  {payment.bookingDt && payment.bookingDt.membership_cancelled==='1' ? (
                                    <span
                                      className=""
                                      style={{ cursor: "default" }}
                                    >
                                      Membership Cancelled
                                    </span>
                                  ) : payment.bookingDt && payment.bookingDt.membership_cancelled==='0' ? (
                                    <>
                                      <button
                                        type="button"
                                        className="v-btn v-btn-danger btn-sm mb-1"
                                        onClick={() => 
                                            handleCancelSub(
                                            btoa(payment.bookingDt.capacity_reservation_id) + 
                                            btoa(payment.bookingDt.booking_id)
                                            )
                                        }
                                        >
                                        Cancel
                                        </button>
                                    </>
                                  ) : (
                                    <span className="badge bg-primary">NA</span>
                                  )}
                                {/* </td> */}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="text-center">
                                No data available
                              </td>
                            </tr>
                          )}
                        </>
                      )
                    )}
                  </tbody>
                </table>
                }
              </div>
            </div>
            <nav className="pagination-nav mt-3">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPages).keys()].map((number) => (
                  <li
                    key={number + 1}
                    className={`page-item ${
                      currentPage === number + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(number + 1)}
                    >
                      {number + 1}
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
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Payment Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {paymentDetail ? (
            <div>
              <p>
                <strong>Payment ID:</strong> {paymentDetail?.amount / 100}
              </p>
              <p>
                <strong>Amount:</strong> {paymentDetail?.amount}
              </p>
              <p>
                <strong>Status:</strong> {paymentDetail?.amount}
              </p>
              {/* Add more details as necessary */}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}