import { useFormik } from 'formik'
import React, { useState } from 'react'
import { menuItemsValidationSchema } from '../../utils/validationSchemas'
import SweetAlert from '../../components/SweetAlert'
import { useRequest } from '../../utils/Requests'
import { ADDMENU } from '../../utils/Endpoints'

export default function MenuItem({product, client_id}) {
    const [disable, setDisable] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const apiRequest = useRequest();

    // FORM SUBMIT //
    const onSubmit = async (values) => {
        
        setInProgress(true);

        const nMenuItem = {
            title: values.title,
            price: values.price,
            description: values.description,
            thumbnail: values.thumbnail,
            product_id: values.product_id,
            client_id:Number(client_id),
            parent_product_id: values.product_parent_id
          }

          const response = await apiRequest({url:ADDMENU, method:"POST", data: nMenuItem}, true); // send file header (2nd argument true)
        
          if(response){
            // SweetAlert.success('Success!', 'Menu item created successfully.');
            if(response.status === 'success'){
                SweetAlert.success("Success", response.message);
            }else if(response.status === 'Info'){
                SweetAlert.info(response.status, response.message);
            }else if(response.status === 'Warning'){
                SweetAlert.warning(response.status, response.message);
            }
            
            setDisable(true);
            setInProgress(false);
          }

    }

    const {values, handleChange, handleBlur, setFieldValue, errors, touched, handleSubmit} = useFormik({
        initialValues:{
            title:product.name,
            price:product.cost,
            description:"",
            thumbnail:"",
            product_id: product.Pid,
            product_parent_id: product.parent_id
        },
        validationSchema: menuItemsValidationSchema,
        onSubmit
    })

    const handleFileChange = (file) => {
        setFieldValue('thumbnail', file);
    };

    const prd_img = product.imageUrl;
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
            <textarea type="text" rows="3" className="form-control fs-12" name="description" onChange={handleChange} onBlur={handleBlur} defaultValue={values.description} />
            {errors.description && touched.description && <p className='text-danger fs_11'>{errors.description}</p>}
        </td>
        <td><span className="fs-12">${values.price.toFixed(2)}</span></td>
        <td>
            <div className="d-flex align-items-center">
                <img src={values.thumbnail !== '' ? URL.createObjectURL(values.thumbnail) : prd_img} alt="" className="rounded-circle w-40" /> &nbsp;
                <input className="form-control fs-12" type="file" id="formFile" name="thumbnail" onBlur={handleBlur} onChange={(e) => handleFileChange(e.target.files[0])} />
            </div>
            {errors.thumbnail && touched.thumbnail && <p className='text-danger fs_11'>{errors.thumbnail}</p>}
        </td>
        <td>
            <div className='td-btn'>
                {inProgress ? 
                    <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                    </div>    
                :
                    disable ? 
                        <i className='bi bi-check2-circle'></i>
                    :
                        <button type='button' onClick={handleSubmit} className='ss_btn small'>Add</button>
                }
            </div>
        </td>
    </>
  )
}
