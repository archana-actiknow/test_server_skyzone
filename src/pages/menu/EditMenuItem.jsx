import { useFormik } from 'formik';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { menuItemsValidationSchema } from '../../utils/validationSchemas';
import SweetAlert from '../../components/SweetAlert'
import { useRequest } from '../../utils/Requests'
import { DELETEMENUITEM, UPDATEMENUITEM } from '../../utils/Endpoints';
import { messagePop } from '../../utils/Common';

export default function EditMenuItem({singleProduct, product, client_id, setRefresRecords}) {
    const [inProgress, setInProgress] = useState(false);

    const apiRequest = useRequest();

    // FORM SUBMIT //
    const onSubmit = async (values) => {
        setInProgress(true);
        const uMenuItem = {
            title: values.title,
            // price: values.price,
            description: values.description,
            thumbnail: values.thumbnail,
            product_id: values.product_id,
            client_id:Number(client_id),
            id: product.id,
          }

   
          const response = await apiRequest({url:UPDATEMENUITEM, method:"POST", data: uMenuItem}, true);
        
          if(response){
            SweetAlert.success('Success!', 'Menu item updated successfully.')
            setInProgress(false);
            setRefresRecords(true);
          }

    }
    
    const {values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue} = useFormik({
        initialValues:{
            title:product.title,
            description:product.description,
            thumbnail: "",
            // price: singleProduct.cost,
            product_id:singleProduct.Pid,
        },
        validationSchema: menuItemsValidationSchema,
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
            const data = await apiRequest({url:DELETEMENUITEM + id, method:"DELETE"});
            setRefresRecords(true);
            messagePop(data);
        }
      }

    return (
    <>
        <td>
            <img src={prd_img} alt="Avatar" className="rounded-circle w-40" />                                                  
        </td>
        <td>
            <input type="text" className="form-control fs-12" name="title" onChange={handleChange} onBlur={handleBlur} defaultValue={values.title} />
            {errors.title && touched.title && <p className='text-danger fs_11'>{errors.title}</p>}
        </td>
        <td>
            <textarea type="text" rows="3" className="form-control fs-12 textarea-height" name="description" onChange={handleChange} onBlur={handleBlur} value={values.description} />
            {errors.description && touched.description && <p className='text-danger fs_11'>{errors.description}</p>}
        </td>
        <td><span className="fs-12">${singleProduct.cost.toFixed(2)}</span></td>
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
