import { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import { useRequest } from "../../utils/Requests"; 
import PopupModal from '../../components/PopupModal';
import { ADDMEMBERSHIPDISCOUNT, OFFERSPRODUCTS } from "../../utils/Endpoints";
import SweetAlert from '../../components/SweetAlert';
// import "./AddDiscount.css"; // Custom styles to match UI

const AddDiscount = ({ close, clientID, loadProducts, setLoadProducts, refreshData }) => {
    const apiRequest = useRequest();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(true);
    const [index, setIndex] = useState(0);

    const handleClose = () => {
        setOpen(false);
        close(false);
    };

    // Fetch products from API
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiRequest({
                url: OFFERSPRODUCTS,
                method: "get",
                params: { offer_type: 1, location_id: clientID },
            });
            if (response.data) {
                setProducts(response.data);
            } else {
                console.error("Failed to fetch products:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, [apiRequest, clientID]);

    useEffect(() => {
        if (clientID && loadProducts) {
            fetchProducts();
            setLoadProducts(false);
        }
    }, [clientID, fetchProducts, loadProducts, setLoadProducts]);

    // Form submission logic
    const onSubmit = async (values, { resetForm }) => {
        setLoading(true);
        const selectedProduct = products
            .flatMap((p) => p.rest_products)
            .find((p) => p.Pid === values.selectedProduct);

        if (!selectedProduct) {
            SweetAlert.error("Error", "Please select a valid product.");
            setLoading(false);
            return;
        }

        const formData = {
            productId: selectedProduct.Pid,
            client_id: selectedProduct.client_id,
            discount_code: values.discountCode,
        };

        try {
            const response = await apiRequest({
                url: ADDMEMBERSHIPDISCOUNT,
                method: "POST",
                data: formData,
            });

            if (response) {
                SweetAlert.success("Success", "Discount added successfully!");
                resetForm();
                setOpen(false);
                refreshData(true);
            } else {
                SweetAlert.error("Error", "There was an issue adding the discount.");
            }
        } catch (error) {
            console.error("Error submitting discount:", error);
            SweetAlert.error("Error", "Something went wrong.");
        }

        setLoading(false);
    };

    const { values, errors, handleSubmit, handleChange } = useFormik({
        initialValues: {
            discountCode: "",
            selectedProduct: "",
        },
        // validationSchema: addMembershipDiscount,
        onSubmit,
    });

    const nextSlide = () => {
        setIndex((prevIndex) => (prevIndex + 1) % products.length);
    };

    const prevSlide = () => {
        setIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
    };

    const goToSlide = (slideIndex) => {
        setIndex(slideIndex);
    };
    return (
    <PopupModal title="Add Discount" open={open} setOpen={handleClose} handleSubmit={handleSubmit} size="md">
        <div className="discount-container">
            <div className="input-group">
                <label  className="fs-12 fw-semibold">Discount Code</label>
                <input
                    type="text"
                    name="discountCode"
                    className="fs-13"
                    placeholder="Enter Discount Code"
                    value={values.discountCode}
                    onChange={handleChange}
                />
                {errors.discountCode && <p className="error-text">{errors.discountCode}</p>}
            </div>

            {/* Bootstrap Carousel */}
            <div id="productCarousel" className="carousel slide" data-bs-ride="carousel">
                {/* <ol className="carousel-indicators">
                    {products.map((_, i) => (
                        <li
                            key={i}
                            className={i === index ? "active" : ""}
                            onClick={() => goToSlide(i)}
                        ></li>
                    ))}
                </ol> */}
                <div className="carousel-indicators">
                    {products.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            data-bs-target="#productCarousel"
                            data-bs-slide-to={i}
                            className={i === index ? "active" : ""}
                            aria-label={`Slide ${i + 1}`}
                            onClick={() => goToSlide(i)}
                        ></button>
                    ))}
                </div>
                <div className="carousel-inner">
                    {loading ? (
                        <div className="carousel-item active">
                            <p>Loading products...</p>
                        </div>
                    ) : (
                        products.map((category, categoryIndex) =>
                            category.rest_products.map((product, productIndex) => {
                                const isActive = categoryIndex === index;
                                return (
                                    <div
                                        key={product.Pid}
                                        className={`carousel-item ${isActive ? "active" : ""}`}
                                        onClick={() =>
                                            handleChange({ target: { name: "selectedProduct", value: product.Pid } })
                                        }
                                    >
                                        <div className="product-card">
                                            <img src={product.imageUrl} className="product-img" />
                                            <h4 className="fs-16 fw-semibold">{product.name}</h4>
                                            <p className="fs-14 ">{category.parent_name}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )
                    )}
                </div>

                {/* Carousel Controls */}
                <button className="carousel-control-prev" type="button" onClick={prevSlide}>
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button className="carousel-control-next" type="button" onClick={nextSlide}>
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
            </div>
        </div>
    </PopupModal>
    );
};

export default AddDiscount;

