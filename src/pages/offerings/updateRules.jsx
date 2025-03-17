import React, { useEffect, useState } from "react";
import { useRequest } from "../../utils/Requests";
import {
  UPDATEOFFERRULE,
  OFFER_LIST,
  OFFER_PRODUCT_DELETE,
} from "../../utils/Endpoints";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import SweetAlert from "../../components/SweetAlert";
import { useFormik } from "formik";
import { latestOfferingValidationSchema } from "../../utils/validationSchemas";
import { Skeleton } from "@mui/material";

// edit

import TinyMCEEditor from "../../editor/editor.jsx";
import ChooseProducts from "./ChooseProducts";

export default function UpdateRule() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { clientId, LocationName, offerId, OfferData } = location.state || {};
  const [offerProductItems, setOfferProductItems] = useState(
    OfferData.latest_offer_products
  );
  const [campaignType, setCampaignType] = useState(OfferData.camp_type);
  const apiRequest = useRequest();
  const [disable, setDisable] = useState(false);
  const [inProgress, setInProgress] = useState(false);

  console.log("location.state", location.state);

  console.log("selectedProducts of addrules", selectedProducts);

  const handleOfferTypeChange = (e) => {
    setOfferType(e.target.value);
  };

  const handleCampaignTypeChange = (event) => {
    setCampaignType(event.target.value);
  };

  const handledisplayToChange = (e) => {
    setDisplayTo(e.target.value);
  };

  const openDialog = () => {
    setOpen(true);
  };

  const handleDelete = (productId) => {
    const updatedProducts = selectedProducts.filter(
      (product) => product.Pid !== productId
    );
    console.log("updatedProducts", updatedProducts);
    setSelectedProducts(updatedProducts);
  };

  const handleDeleteItem = async (id) => {
    const result = await SweetAlert.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      const deleteOfferProduct = await apiRequest({
        url: OFFER_PRODUCT_DELETE,
        method: "delete",
        params: {
          id: id,
        },
      });
      if (deleteOfferProduct.success) {
        SweetAlert.fire({
          title: "Deleted!",
          text: "Your record has been deleted successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          const updatedOfferProductItems = offerProductItems.filter(
            (product) => product.id !== id
          );
          setOfferProductItems(updatedOfferProductItems);
        });
      }
    }
  };

  // const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clientName = LocationName;
  const clientID = clientId;
  const offeringID = offerId;

  //   console.log('OfferData',OfferData.latest_offer_products);

  const [offerType, setOfferType] = useState(OfferData.offer_type);
  const [displayTo, setDisplayTo] = useState(OfferData.display_to);
  const [discountType, setDiscountType] = useState(OfferData.discount_type);

  // FORM SUBMIT //
  const onSubmit = async (values) => {
    setInProgress(true);

    console.log("values", values);

    // return false;

    const formData = {
      id: offerId,
      title: values.title,
      description: values.description,
      camp_type: campaignType,
      image: values.image,
      camp_start_date: values.camp_start_date,
      camp_end_date: values.camp_end_date,
      discount_code: values.discount_code,
      discount_type: discountType,
      discount_amount: values.discount_amount,
      discount_percent: values.discount_percent,
      reward_points: values.reward_points,
      offer_type: offerType,
      display_to: displayTo,
      client_id: clientID,
      selected_products: selectedProducts,
    };

    console.log("formData", formData);
    const response = await apiRequest(
      { url: UPDATEOFFERRULE, method: "POST", data: formData },
      true
    ); // send file header (2nd argument true)

    if (response) {
      SweetAlert.success("Success!", "Rule Updated successfully.");
      setDisable(true);
      setInProgress(false);
    }
  };

  // console.log('data',data);

  // const {
  //   values,
  //   handleChange,
  //   handleBlur,
  //   setFieldValue,
  //   errors,
  //   touched,
  //   handleSubmit,
  // } = useFormik({
  //   initialValues: {
  //     id: offerId,
  //     title: OfferData.title,
  //     description: OfferData.description,
  //     camp_type: OfferData.camp_type,
  //     image: OfferData.image,
  //     camp_start_date: OfferData.camp_start_date,
  //     camp_end_date: OfferData.camp_end_date,
  //     discount_code: OfferData.discount_code,
  //     discount_type: OfferData.discount_type,
  //     discount_amount: OfferData.discount_amount,
  //     discount_percent: OfferData.discount_percent,
  //     reward_points: OfferData.reward_points,
  //     offer_type: OfferData.offer_type,
  //     display_to: OfferData.display_to,
  //     client_id: clientID,
  //     selected_products: "",
  //     // product_id: product.Pid
  //   },
  //   // validationSchema: rewardValidationSchema,
  //   onSubmit,
  // });


  const {values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting} = useFormik({
    initialValues: {
      title:"",
      description:"",
      campaignType:"1",
      rewardPoint:"",
      discountCode:"",
      discountAmount:"",
      discountPercent:"",
      startDate: "",
      endDate: "",
      image:"",
      offerType:"1",
      displayTo:"1",
    },
    validationSchema: latestOfferingValidationSchema,
    onSubmit
  })

  useEffect(() => {
    const getOfferDetail = async () => {
      const offersRec = await apiRequest({
        url: OFFER_LIST,
        method: "get",
        params: {
          id: offerId,
        },
      });

      console.log("offersRec", offersRec?.data);
      // setData(offersRec?.data || []);

      setFieldValue("title", offersRec?.data.title)
      setFieldValue("description", offersRec?.data.description)
      setFieldValue("campaignType", offersRec?.data.camp_type)
      setFieldValue("rewardPoint", offersRec?.data.reward_points)
      setFieldValue("discountCode", offersRec?.data.discount_code)
      setFieldValue("discountAmount", offersRec?.data.discount_amount)
      setFieldValue("discountPercent", offersRec?.data.discount_percent)
      setFieldValue("startDate", offersRec?.data.camp_start_date)
      setFieldValue("endDate", offersRec?.data.camp_end_date)
      setFieldValue("image", offersRec?.data.image)
      setFieldValue("offerType", offersRec?.data.offer_type)
      setFieldValue("displayTo", offersRec?.data.display_to)
      
    };
    getOfferDetail();
    console.log("Values: ", values);
  }, [setFieldValue]);

  const handleFileChange = (file) => {
    setFieldValue("image", file);
  };

  return (
    <>
      {" "}
      {data.lenght > 0 ? (
        <>
          <div className="text-end mb-3">
            <Skeleton variant="rectangular" width="100%" height={80} className="skeleton-custom text-end"/>
          </div>
          <Skeleton variant="rectangular" width="100%" height={100} className="skeleton-custom"/>
        </>
      ) : (
        <>
          <div className="text-end mb-3">
            <Link to="/latest-offerings" type="button" className="ss_btn" state={{id: clientId, value: LocationName}}>
              <i className="bi bi-arrow-left"></i> Back
            </Link>
          </div>
          <div className="main">
            <div className="row" id="show-msg" style={{ display: "none" }}>
              <div className="col-md-12">
                <div className="alert alert-success" role="alert">
                  <h4 className="alert-heading">Success!</h4>
                  <p>
                    <span id="msg-title">Products</span> updated successfully.
                  </p>
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-12">
                <div className="card border-0">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-md-4">
                        <p className="fs-15 fw-semibold mb-0">{LocationName}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="add-offer-form">
                <div className="card">
                  <div className="card-body">
                    <form name="add_offer" id="add_offer">
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-md-12" id="show-add-alert"></div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="widget">
                              <div className="widget-content">
                                <div className="form-group row mb-2">
                                  <label className="col-md-2 fs-12 fw-semibold">
                                    Title
                                  </label>
                                  <div className="col-md-10">
                                    <input
                                      type="text"
                                      name="title"
                                      className="form-control fs-13"
                                      value={values.title}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                  </div>
                                </div>
                                <div className="form-group row mb-2">
                                  <label
                                    className="col-md-2 fs-12 
                              fw-semibold
                              "
                                  >
                                    Description
                                  </label>
                                  <div className="col-md-10">
                                    <TinyMCEEditor
                                      value={values.description}
                                      name="description"
                                      onEditorChange={(content) =>
                                        setFieldValue("description", content)
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="form-group row mb-2">
                                  <label className="col-md-2 fs-12 fw-semibold">
                                    Image
                                  </label>
                                  <div className="col-md-6">
                                    <input
                                      className="fs-13"
                                      type="file"
                                      id="image"
                                      name="image"
                                      onBlur={handleBlur}
                                      onChange={(e) =>
                                        handleFileChange(e.target.files[0])
                                      }
                                    />
                                    <br />
                                    <span
                                      style={{ fontSize: "9px", color: "red" }}
                                    >
                                      *(preferred image size 650×350)
                                    </span>
                                  </div>
                                  <div className="col-md-2">
                                    <img
                                      src={OfferData.image}
                                      style={{ width: "50px" }}
                                      alt={OfferData.title}
                                    />
                                  </div>
                                </div>

                                <div className="form-group row mb-2">
                                  <label className="col-md-2 fs-12 fw-semibold">
                                    Campaign Type
                                  </label>
                                  <div className="col-md-4">
                                    <select
                                      name="campaign_type"
                                      id="campaign_type"
                                      className="form-control input-sm fs-13"
                                      value={campaignType}
                                      onChange={handleCampaignTypeChange}
                                    >
                                      <option value="1">Rewards program</option>
                                      <option value="2">Discount offer</option>
                                      <option value="3">
                                        Special products
                                      </option>
                                    </select>
                                  </div>
                                </div>
                                {campaignType === "2" && (
                                  <div
                                    className="form-group row mb-2"
                                    id="discount_code_sec"
                                  >
                                    <label className="col-md-2 fs-12 fw-semibold">
                                      Discount Code
                                    </label>
                                    <div className="col-md-4">
                                      <input
                                        type="text"
                                        name="discount_code"
                                        id="discount_code"
                                        className="fs-13 form-control"
                                        placeholder="Discount Code"
                                        autoComplete="off"
                                        value={values.discount_code}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                    </div>

                                    <div className="col-md-6">
                                      <table width="100%">
                                        <tbody>
                                          <tr>
                                            <td width="2%">Amount</td>
                                            <td width="1%">
                                              <input
                                                type="radio"
                                                name="discount_type"
                                                id="discount_amount"
                                                value="0"
                                                checked={discountType === "0"}
                                                onChange={() =>
                                                  setDiscountType("0")
                                                }
                                              />
                                            </td>
                                            <td width="20%">
                                              <input
                                                type="number"
                                                className="form-control"
                                                name="discount_amount"
                                                step="any"
                                                value={values.discount_amount}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                              />
                                            </td>
                                            <td width="2%">Percentage</td>
                                            <td width="1%">
                                              <input
                                                type="radio"
                                                name="discount_type"
                                                id="discount_percent"
                                                value="1"
                                                checked={discountType === "1"}
                                                onChange={() =>
                                                  setDiscountType("1")
                                                }
                                              />
                                            </td>
                                            <td width="20%">
                                              <input
                                                type="number"
                                                className="form-control"
                                                name="discount_percent"
                                                step="any"
                                                value={values.discount_percent}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                              />
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}

                                {campaignType === "1" && (
                                  <div className="form-group row mb-2">
                                    <label className="col-md-2 fs-12 fw-semibold">
                                      Reward Points
                                    </label>
                                    <div className="col-md-4">
                                      <input
                                        type="number"
                                        className="form-control fs-13"
                                        name="reward_points"
                                        id="reward_points"
                                        step="any"
                                        value={values.reward_points}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                    </div>
                                  </div>
                                )}

                                <div className="form-group row mb-2">
                                  <label className="col-md-2 fs-12 fw-semibold">
                                    Offer Start Date
                                  </label>
                                  <div className="col-md-4">
                                    <input
                                      type="date"
                                      name="camp_start_date"
                                      id="camp_start_date"
                                      className="form-control fs-13"
                                      required
                                      value={values.camp_start_date}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                  </div>

                                  <label className="col-md-2 fs-12 fw-semibold">
                                    Offer End Date
                                  </label>
                                  <div className="col-md-4">
                                    <input
                                      type="date"
                                      name="camp_end_date"
                                      id="camp_end_date"
                                      className="form-control fs-13"
                                      required
                                      value={values.camp_end_date}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                  </div>
                                </div>
                                <div className="form-group row mb-2">
                                  <label className="col-md-2 fs-12 fw-semibold">
                                    Offer Type
                                  </label>
                                  <div className="col-md-10">
                                    <table width="100%">
                                      <tbody>
                                        <tr>
                                          <td
                                            width="1%"
                                            style={{ verticalAlign: "middle" }}
                                          >
                                            <input
                                              type="radio"
                                              name="offer_type"
                                              id="membership-yes"
                                              value="1"
                                              checked={offerType === "1"}
                                              onChange={handleOfferTypeChange}
                                            />
                                          </td>
                                          <td width="20%">
                                            <label
                                              for="membership-yes"
                                              className="fs-12 fw-semibold"
                                            >
                                              {" "}
                                              Membership
                                            </label>
                                          </td>

                                          <td
                                            width="1%"
                                            style={{ verticalAlign: "middle" }}
                                          >
                                            <input
                                              type="radio"
                                              name="offer_type"
                                              id="tickets-yes"
                                              value="2"
                                              checked={offerType === "2"}
                                              onChange={handleOfferTypeChange}
                                            />
                                          </td>
                                          <td width="30%">
                                            <label
                                              for="tickets-yes"
                                              className="fs-12 fw-semibold"
                                            >
                                              {" "}
                                              Ticket Purchase
                                            </label>
                                          </td>

                                          <td
                                            width="1%"
                                            style={{ verticalAlign: "middle" }}
                                          >
                                            <input
                                              type="radio"
                                              name="offer_type"
                                              id="packages-yes"
                                              value="3"
                                              checked={offerType === "3"}
                                              onChange={handleOfferTypeChange}
                                            />
                                          </td>
                                          <td>
                                            <label
                                              for="packages-yes"
                                              className="fs-12 fw-semibold"
                                            >
                                              {" "}
                                              Packages
                                            </label>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                <div className="form-group row mb-2">
                                  <label className="col-md-2 fs-12 fw-semibold">
                                    Display Offer To
                                  </label>
                                  <div className="col-md-10">
                                    <table width="100%">
                                      <tbody>
                                        <tr>
                                          <td
                                            width="1%"
                                            style={{ verticalAlign: "middle" }}
                                          >
                                            <input
                                              type="radio"
                                              name="display_to"
                                              id="clients-only"
                                              value="1"
                                              checked={displayTo === "1"}
                                              onChange={handledisplayToChange}
                                            />
                                          </td>
                                          <td width="20%">
                                            <label
                                              htmlFor="Members only"
                                              className="fs-12 fw-semibold"
                                            >
                                              Members only
                                            </label>
                                          </td>
                                          <td
                                            width="1%"
                                            style={{ verticalAlign: "middle" }}
                                          >
                                            <input
                                              type="radio"
                                              name="display_to"
                                              id="all-customers"
                                              value="2"
                                              checked={displayTo === "2"}
                                              onChange={handledisplayToChange}
                                            />
                                          </td>
                                          <td>
                                            <label
                                              htmlFor="all-customers"
                                              className="fs-12 fw-semibold"
                                            >
                                              All Customers
                                            </label>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                <div className="form-group row mb-2">
                                  <label className="col-md-2 fs-12 fw-semibold">
                                    Products
                                  </label>
                                  <div className="col-md-10">
                                    <div>
                                      {offerProductItems.length > 0 && (
                                        <span
                                          id="selected_products"
                                          style={{
                                            height: "200px",
                                            overflowY: "auto",
                                          }}
                                        >
                                          <div className="widget">
                                            <div className="widget-content skin-white p-2">
                                              <div className="table-scroll">
                                                <table className="table table-bordered RjTable">
                                                  <tbody>
                                                    <tr>
                                                      <th></th>
                                                      <th>
                                                        <b>Items</b>
                                                      </th>
                                                      <th width="">Action</th>
                                                    </tr>
                                                    {offerProductItems.map(
                                                      (product) => (
                                                        <tr key={product.id}>
                                                          <td width="70px">
                                                            <input
                                                              type="hidden"
                                                              name="selected_items[]"
                                                              value={product.id}
                                                            />
                                                            <img
                                                              src={
                                                                product
                                                                  .rest_product
                                                                  .imageUrl
                                                              }
                                                              style={{
                                                                width: "60px",
                                                              }}
                                                              alt={
                                                                product
                                                                  .rest_product
                                                                  .name
                                                              }
                                                            />
                                                          </td>
                                                          <td>
                                                            {
                                                              product
                                                                .rest_product
                                                                .name
                                                            }
                                                          </td>
                                                          <td>
                                                            <a
                                                              className="icon delete"
                                                              data-bs-toggle="tooltip"
                                                              data-bs-placement="top"
                                                              data-bs-title="Delete"
                                                              onClick={() =>
                                                                handleDeleteItem(
                                                                  product.id
                                                                )
                                                              }
                                                            >
                                                              <i className="bi bi-trash-fill deleteBtn"></i>
                                                            </a>
                                                          </td>
                                                        </tr>
                                                      )
                                                    )}
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          </div>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="form-group row mb-2">
                                  <label className="col-md-2 fs-12 fw-semibold">
                                    Select Products
                                  </label>
                                  <div className="col-md-10">
                                    <button
                                      type="button"
                                      className="btn btn-primary"
                                      onClick={openDialog}
                                    >
                                      Choose Products
                                    </button>

                                    <div>
                                      {selectedProducts.length > 0 && (
                                        <span
                                          id="selected_products"
                                          style={{
                                            height: "200px",
                                            overflowY: "auto",
                                          }}
                                        >
                                          <div className="widget">
                                            <div className="widget-content skin-white p-2">
                                              <div className="table-scroll">
                                                <table className="table table-bordered RjTable">
                                                  <tbody>
                                                    <tr>
                                                      <th></th>
                                                      <th>
                                                        <b>Items</b>
                                                      </th>
                                                      <th width="">Action</th>
                                                    </tr>
                                                    {selectedProducts.map(
                                                      (product) => (
                                                        <tr key={product.id}>
                                                          <td width="70px">
                                                            <input
                                                              type="hidden"
                                                              name="selected_items[]"
                                                              value={product.id}
                                                            />
                                                            <img
                                                              src={
                                                                product.imageUrl
                                                              }
                                                              style={{
                                                                width: "60px",
                                                              }}
                                                              alt={product.name}
                                                            />
                                                          </td>
                                                          <td>
                                                            {product.name}
                                                          </td>
                                                          <td>
                                                            <a
                                                              className="icon delete"
                                                              data-bs-toggle="tooltip"
                                                              data-bs-placement="top"
                                                              data-bs-title="Delete"
                                                              onClick={() =>
                                                                handleDelete(
                                                                  product.Pid
                                                                )
                                                              }
                                                            >
                                                              <i className="bi bi-trash-fill deleteBtn"></i>
                                                            </a>
                                                          </td>
                                                        </tr>
                                                      )
                                                    )}
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          </div>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="form-group row mb-2">
                                  <div className="col-md-12 text-right">
                                    {/* <button
                                  type="submit"
                                  className="btn btn-success"
                                >
                                  Save
                                </button> */}
                                    <ChooseProducts
                                      open={open}
                                      setOpen={setOpen}
                                      offerType={offerType}
                                      clientID={clientID}
                                      setSelectedProducts={setSelectedProducts}
                                    />
                                    <button
                                      onClick={handleSubmit}
                                      type="button"
                                      className="ss_btn text-right"
                                      id="add_offer_btn"
                                    >
                                      Submit
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}