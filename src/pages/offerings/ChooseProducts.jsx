import {React, useCallback, useEffect }from 'react';
import { Modal } from 'react-bootstrap';
import { useState } from 'react';
import { OFFERSPRODUCTS } from "../../utils/Endpoints";
import { useRequest } from "../../utils/Requests";
import Accordion from '../../components/Accordion';


const ChooseProducts = ({ open, setOpen, offerType, clientID, setSelectedProducts, loadProducts, setLoadProducts}) => {

    const apiRequest = useRequest();

    const [load, setLoad] = useState(false);
	const [selected, setSelected] = useState([]);
    const [data,setData] = useState([]);

	const handleClose = () => setOpen(false);

    const fetchProducts = useCallback(async () => {
        setLoad(true);
        try {
            const response = await apiRequest({
                url:OFFERSPRODUCTS, 
                method:"get", 
                params: {
                    offer_type: offerType,
                    location_id:clientID
                }
            });

            if (response.data) 
            {
                const products = response.data;
                setData(products);
                setLoad(false);
            } else {
                console.error('Failed to fetch products:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, [apiRequest, clientID, offerType]);

    useEffect(() => {
        if(offerType && clientID && loadProducts) {
            fetchProducts();
            setLoadProducts(false);
        }
    }, [offerType, clientID, fetchProducts, loadProducts, setLoadProducts]);

        
    const handleProductChange = (event) => {

        const productId = event.target.value;
        const isChecked = event.target.checked;

        setSelected(prevSelected => {
        if (isChecked) {
            return [
                ...prevSelected, 
                productId
            ];
        } else {
            return prevSelected.filter(id => id !== productId);
        }
        });
    };

    const addProducts = () => {
        // Filter the selected products based on their Pid
        const productsToAdd = data
            .flatMap(product => product.rest_products) // Flatten the nested Products array
            .filter(product => selected.includes(product.Pid)); // Filter by selected Pid
    
   
        // Set the selected products state
        setSelectedProducts(prevSelectedProducts => [
            // ...prevSelectedProducts,
            ...productsToAdd
        ]);
    
        // Close the modal
        setOpen(false);
    };


    return (
        <Modal show={open} onHide={handleClose} size="lg" aria-labelledby="modalLabel">
        <Modal.Header closeButton>
            <Modal.Title id="modalLabel">Add Products</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '250px', overflow: 'auto' }} key={`${data[0]?.Pid}`}>
            <div className="accordion mt-3" id="accordionWithIcon">
                {data.map((product, index) => (
                    <Accordion id={product.Pid} title={product.parent_name} key={product.Pid}>
                        {!load &&
                            <table className="table table-bordered RjTable">
                                <thead>
                                    <tr>
                                    <th>#</th>
                                    <th>Image</th>
                                    <th>Item</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {product?.rest_products?.map((product, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name={product.name}
                                                value={product.Pid}
                                                onChange={handleProductChange}
                                                data-image={product.imageUrl}
                                            />
                                        </td>
                                        <td>
                                            <img src={product.imageUrl} style={{width: '60px'}} alt={product.parent_name} />
                                        </td>
                                        <td className="fs-12">{product.name}</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        }
                    </Accordion>
                ))}
                </div>
        </Modal.Body>
        <Modal.Footer>
            <button type="button" className="refreshbtn" onClick={handleClose}>Cancel</button>
            <button type="button" className="ss_btn" onClick={addProducts}>Add Products</button>
        </Modal.Footer>
        </Modal>
    );
};

export default ChooseProducts;
