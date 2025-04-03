import {React, useCallback, useEffect }from 'react';
import { useFormik } from "formik";
import { useState } from 'react';
import {OFFERSPRODUCTS, UPDATEMEMBERSHIPDISCOUNT } from "../../utils/Endpoints";
import { useRequest } from "../../utils/Requests";
import Accordion from '../../components/Accordion';
import PopupModal from '../../components/PopupModal';
import SweetAlert from '../../components/SweetAlert';
import { messagePop } from '../../utils/Common';
import { Skeleton } from '@mui/material';

const EditDiscount = ({id, close, editData,clientID, loadProducts, setLoadProducts, refreshData}) => {
    const apiRequest = useRequest();
    const [load, setLoad] = useState(false);
    const [data,setData] = useState([]);
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [openAccordion, setOpenAccordion] = useState(null);
     const handleClose = () => {
        setOpen(false)
        close(false)
    }
    const fetchProducts = useCallback(async () => {
        setLoad(true);
        setLoading(true)
        try {
            const response = await apiRequest({
                url:OFFERSPRODUCTS, 
                method:"get", 
                params: { offer_type: 1,  location_id: clientID}
            });
            if (response.data) 
            {
                const products = response.data;
                setData(products);
                setLoad(false);
                setLoading(false)
            } else {
                console.error('Failed to fetch products:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, [apiRequest, clientID]);

    useEffect(() => {
        if( clientID && loadProducts) {
            fetchProducts();
            setLoadProducts(false);
        }
    }, [ clientID, fetchProducts, loadProducts, setLoadProducts]);

        // FORM SUBMIT //
        const onSubmit = async (values, { resetForm }) => {
            setLoad(true); 
            const selectedProductData = data
            .flatMap((product) => product.rest_products)
            .find((product) => product.Pid === values.selectedProduct);

            const formData = {
                id:id,
                productId: selectedProductData.Pid,
                client_id: selectedProductData.client_id,
                discount_code: values.discountCode,
            };
            const response = await apiRequest( {
                url: UPDATEMEMBERSHIPDISCOUNT, 
                method: "POST", data: formData});
          if(response){
             setOpen(false)
            close(false)
            refreshData(true);
            resetForm();
            messagePop(response);
          }else{
                SweetAlert.error("Error", "There is some issue while adding user.")
          }
        setLoad(false);
        }
    
        const {values, handleSubmit,handleChange} = useFormik({
            initialValues: {
               discountCode: editData.discount_code,
                selectedProduct: editData.productId,
            },
            enableReinitialize: true,
            onSubmit
        })

        useEffect(() => {
            if (values.selectedProduct) {
                const parentProduct = data.find((product) =>
                    product.rest_products.some((prod) => prod.Pid === values.selectedProduct)
                );
                if (parentProduct) {
                    setOpenAccordion(parentProduct.parent_id); 
                } else {
                    setOpenAccordion(null); 
                }
            }
        }, [values.selectedProduct, data]);
        
    return (
    <>
        <PopupModal title="Edit Discount"  open={open} setOpen={handleClose} handleSubmit={handleSubmit} size="lg">
            <div className="col-sm-12" id="dis_list"> 
                <div className="form-group row mb-3">
                    <label className="col-md-3 fs-12 fw-semibold">Discount Code</label>
                    <div className="col-md-9">
                        <input
                            type="text"
                            name="discountCode"
                            className="mt-0 mb-3 fs-13 form-control length_count"
                            placeholder="Enter Discount Code"
                            value={values.discountCode}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {loading 
                    ? 
                        <Skeleton variant="rectangular" width="100%" height={400} className="skeleton-custom" />
                    : 
                <div className="form-group row mb-3">
                    <label className="col-md-3 fs-12 fw-semibold">Products</label>
                    <div className="col-md-9 height-300 overflow-y">
                        {data.map((product) => (
                            <Accordion className='fs-12 fw-semibold'key={product.parent_id}
                                id={product.parent_id}
                                title={product.parent_name}
                                open={openAccordion === product.parent_id}
                            >
                                {!load && (
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th className='fs-12 fw-semibold'>Image</th>
                                                <th className='fs-12 fw-semibold'>Item</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {product?.rest_products?.map((prod) => (
                                                <tr key={prod.Pid}>
                                                    <td>
                                                        <input
                                                            type="radio"
                                                            name="selectedProduct"
                                                            value={prod.Pid}
                                                            checked={values.selectedProduct === prod.Pid}
                                                            // checked={values.selectedProduct}
                                                            onChange={handleChange}
                                                        />
                                                    </td>
                                                    <td>
                                                        <img
                                                            src={prod.imageUrl}
                                                            style={{ width: "60px" }}
                                                            alt={prod.parent_name}
                                                        />
                                                    </td>
                                                    <td className='fs-12'>{prod.name}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </Accordion>
                            
                        ))}
                    </div>
                </div>
                }
            </div>
        </PopupModal>
    </>
    )
}

export default EditDiscount;
