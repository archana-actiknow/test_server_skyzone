import { useFormik } from 'formik';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { rewardValidationSchema } from '../../utils/validationSchemas';
import SweetAlert from '../../components/SweetAlert'
import { useRequest } from '../../utils/Requests'
import { DELETEREWARD, UPDATEREWARD } from '../../utils/Endpoints';
import { messagePop } from '../../utils/Common';

export default function EditRewardRule({singleProduct, product, client_id, setRefresRecords}) {
    const [inProgress, setInProgress] = useState(false);

    const apiRequest = useRequest();

    // FORM SUBMIT //
    const onSubmit = async (values) => {
        setInProgress(true);

        const uReward = {
            title: values.title,
            points: values.points,
            discount_code: values.discountCode,
            thumbnail: values.thumbnail,
            product_id: values.product_id,
            client_id:Number(client_id),
            id: product.id
          }
    
          const response = await apiRequest({url:UPDATEREWARD, method:"POST", data: uReward}, true);
        
          if(response){
            SweetAlert.success('Success!', 'Rule updated successfully.')
            setInProgress(false);
            setRefresRecords(true);
          }

    }
    
    const {values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue} = useFormik({
        initialValues:{
            title:product.title,
            points:product.points,
            discountCode:product.discount_code,
            thumbnail: "",
            product_id:singleProduct.Pid,
        },
        validationSchema: rewardValidationSchema,
        onSubmit
    })

    const disc_p_image = product.parent_img;
    const prd_img = (disc_p_image === '') ? singleProduct.imageUrl : disc_p_image;

    const handleFileChange = (file) => {
        setFieldValue('thumbnail', file);
    };

    const handleDelete = async (id) => {
        const title = "Are you sure?";
        const text  = "Are you sure you want to delete this?";
        const confirm = await SweetAlert.confirm(title, text);

        if(confirm){
            const data = await apiRequest({url:DELETEREWARD + id, method:"DELETE"});
            setRefresRecords(true);
            messagePop(data);
        }
    }

    return (
    <>
        <td>
            <img src={prd_img} alt="Avatar" className="rounded-circle w-40" />                                                  
        </td>
        <td><span className="badge bg-warning me-1">{singleProduct.name}</span></td>
        <td>
            <input type="text" className="form-control fs-12" name="title" onChange={handleChange} onBlur={handleBlur} defaultValue={values.title} />
            {errors.title && touched.title && <p className='text-danger fs_11'>{errors.title}</p>}
        </td>
        <td>
            <input type="text" className="form-control fs-12" name="points" onChange={handleChange} onBlur={handleBlur} defaultValue={values.points} />
            {errors.points && touched.points && <p className='text-danger fs_11'>{errors.points}</p>}
        </td>
        <td>
            <input type="text" className="form-control fs-12" name="discountCode" onChange={handleChange} onBlur={handleBlur} defaultValue={values.discountCode} />
            {errors.discountCode && touched.discountCode && <p className='text-danger fs_11'>{errors.discountCode}</p>}
        </td>
        <td>
            <div className="d-flex align-items-center">
                <img src={values.thumbnail !== '' ? URL.createObjectURL(values.thumbnail) : ""} alt="" className="rounded-circle w-40" /> &nbsp;
                <input className="form-control fs-12" type="file" id="formFile" name="thumbnail" onBlur={handleBlur} onChange={(e) => handleFileChange(e.target.files[0])} />
            </div>

            {errors.thumbnail && touched.thumbnail && <p className='text-danger fs_11'>{errors.thumbnail}</p>}
        </td>
        <td>
            <div className="d-flex align-items-center">
                <div className='td-Updatebtn'>
                    {inProgress 
                    ? 
                        <div className="spinner-border" role="status">
                            <span className="sr-only"></span>
                        </div> 
                    :
                        <Link className="ss_btn" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Edit" title="Update" onClick={handleSubmit}>
                            {/* <i className="bi bi-arrow-repeat"></i> */}
                            Update
                        </Link>
                    }
                </div>
                
                <Link onClick={() => handleDelete(product.id)} className=" icon delete" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete" title="Delete">
                    <i className="bi bi-trash-fill"></i>
                </Link>
            </div>
        </td>
    </>
  )
}
