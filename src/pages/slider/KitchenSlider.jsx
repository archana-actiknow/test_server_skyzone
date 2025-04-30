import React, { useEffect, useState } from 'react'
import { useRequest } from '../../utils/Requests';
import { Link } from 'react-router-dom';
import Add from './Add';
import SweetAlert from '../../components/SweetAlert';
import Edit from './Edit';
import { DELETE_KITCHEN_SLIDER_IMAGES, GET_KITCHEN_SLIDER_IMAGES } from '../../utils/Endpoints';
import { messagePop } from '../../utils/Common';
import SkeletonLoader from "../../components/SkeletonLoader";

export default function KitchenSlider() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshRecords, setRefresRecords] = useState(true);
    const [isOpen, setIsOpen] = useState(false); // Add Manager Popup
    const [isOpenId, setIsOpenId] = useState(false); // Edit User Popup
    const [editData, setEditData] = useState(0);
    const [load, setLoad] = useState(false);

    const apiRequest = useRequest();
    const refreshListing = (response) => {
        if(response){
          setRefresRecords(true);
        }
        else{
          SweetAlert.error('Oops!', 'Something went wrong.')
          setRefresRecords(false);
        }
    }

    // FETCH ONLOAD //
    useEffect(()=> {
        const getRecords = async () => {
            setLoading(true)
            const rec = await apiRequest({url:GET_KITCHEN_SLIDER_IMAGES,   method:"get"});
            setData(rec?.data);
            setLoading(false);
        }

        if(refreshRecords ){
            getRecords();
            setRefresRecords(false);
        }
    }, [apiRequest, refreshRecords]);

    const toggleAdd = () => {setIsOpen(prev => !prev);}

    const toggleEdit = async (id) => {
        setLoad(id);
        if (id !== 'undefined') {
            const user = await apiRequest({ url: GET_KITCHEN_SLIDER_IMAGES,method: "get",params: { id: id }});
            const singleRec = user?.data?.length > 0  ? { id: user.data[0].id,image: user.data[0].imageUrl} : {};
            setEditData(singleRec); 
        }
        setIsOpenId(id);
        setLoad(false);
    };

    // DELETE
    const handleDelete = async (id) => {
        const title = "Are you sure?";
        const text  = "Are you sure you want to delete this record?";
        const confirm = await SweetAlert.confirm(title, text);
        if(confirm){
            const deleteImage= await apiRequest({url: DELETE_KITCHEN_SLIDER_IMAGES + id, method: "delete"});
            messagePop(deleteImage);
            setRefresRecords(true);
        }
    };
 
  return (
    <>
        <>
            <div className="text-end mb-3"> 
            <button className='ss_btn' onClick={toggleAdd} >Add Image</button>
            {isOpen && <Add close={toggleAdd} refreshData={refreshListing} />} 

            {isOpenId && <Edit id={isOpenId} close={setIsOpenId} data={editData} refreshData={refreshListing} />}            
            </div>
            <div className="row mb-3">
                <div className="col-md-12">
                    <div className="card border-0">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <p className="fs-15 fw-semibold mb-0">Items</p>
                                </div>
                                <div className="col-md-3">

                                </div>
                                <div className="col-md-3">
                                </div>
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {loading 
                ? 
                <SkeletonLoader height={400} />
                : 
            <div className="row align-items-center">
            {(data?.length > 0 && !load) ? (
                data?.map((slider) => (
                <div className="col-md-3 mb-2" key={slider.id}>
                    <div className="card border-0">
                        <div className="card-body hide-overflow">
                            {slider.imageUrl ? (
                                <img src={slider.imageUrl} alt={slider.title} className="product-img"/>
                            ) : (
                                <img src="./images/no-image.png" alt={slider.title} className="product-img height-100"/>
                            )}
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div></div>
                                <div className="d-flex align-items-center">
                                    <Link onClick={() => toggleEdit(slider.id)} className="me-2 icon edit" data-bs-title="Edit">
                                        <i className="bi bi-pencil-square"></i>
                                    </Link>
                                    <Link  onClick={() => handleDelete(slider.id)} className="icon delete" data-bs-title="Delete">
                                        <i className="bi bi-trash-fill"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ))
            )
            : (
                <div className="row mb-3">
                    <div className="col-md-12">
                    {data?.length === 0  && !load ? <>No Data Found!</> :
                    <SkeletonLoader height={300} />
                    }
                    </div>
                </div>
            )}
            </div>
            }
        </>
    </>
  )
}
