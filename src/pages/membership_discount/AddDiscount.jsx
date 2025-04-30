import {React, useCallback, useEffect }from 'react';
import { useFormik } from "formik";
import { useState } from 'react';
import { ADDMEMBERSHIPDISCOUNT, OFFERSPRODUCTS } from "../../utils/Endpoints";
import { useRequest } from "../../utils/Requests";
import Accordion from '../../components/Accordion';
import PopupModal from '../../components/PopupModal';
import { addMembershipDiscount } from '../../utils/validationSchemas';
import SweetAlert from '../../components/SweetAlert';
import { messagePop } from '../../utils/Common';
import SkeletonLoader from "../../components/SkeletonLoader"

const AddDiscount = ({close, clientID, loadProducts, setLoadProducts,refreshData}) => {

    const apiRequest = useRequest();
    const [load, setLoad] = useState(false);
    const [data,setData] = useState([]);
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const fetchProducts = useCallback(async () => {
        setLoad(true);
        setLoading(true)
        try {
            const response = await apiRequest({
                url:OFFERSPRODUCTS, 
                method:"get", 
                params: { offer_type: 1,  location_id:clientID}
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
            productId: selectedProductData.Pid,
            client_id: selectedProductData.client_id,
            discount_code: values.discountCode,
        };
        const response = await apiRequest( {
            url: ADDMEMBERSHIPDISCOUNT, 
            method: "POST", data: formData});
        if(response){
            messagePop(response);
            refreshData(true);
            resetForm();
            close();
            setOpen(false)
        }else{
            SweetAlert.error("Error", "There is some issue while adding user.")
        }
    setLoad(false);
    }

    const handleClose = () => {
        setOpen(false)
        close(false)
    }

    const {values, errors, handleSubmit,handleChange} = useFormik({
        initialValues: {
            discountCode: "",
            selectedProduct: "",
        },
        validationSchema:addMembershipDiscount,
        onSubmit
    })

    return (
    <>
        <PopupModal title="Add Discount" open={open} setOpen={handleClose}  handleSubmit={handleSubmit} size="lg">
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
                        {errors.discountCode && (<p className="text-danger fs-11">{errors.discountCode}</p>)}
                    </div>
                </div>
                 {loading 
                    ? 
                    <SkeletonLoader height={400} />
                    : 
                <div className="form-group row mb-3">
                    <label className="col-md-3 fs-12 fw-semibold">Products</label>
                    <div className="col-md-9 height-300 overflow-y">
                        {data.map((product) => (
                            <Accordion className='fs-12 fw-semibold' key={product.Pid} id={product.Pid} title={product.parent_name} open={false}>
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
                        {errors.selectedProduct && (
                            <p className="text-danger fs-11">{errors.selectedProduct}</p>
                        )}
                    </div>
                </div>
                }
            </div>
        </PopupModal>
    </>
    )
}

export default AddDiscount;

