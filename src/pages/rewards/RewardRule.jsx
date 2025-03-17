import { useFormik } from 'formik'
import React, { useState } from 'react'
import { rewardValidationSchema } from '../../utils/validationSchemas'
import SweetAlert from '../../components/SweetAlert'
import { useRequest } from '../../utils/Requests'
import { ADDREWARD } from '../../utils/Endpoints'

export default function RewardRule({product, client_id}) {
    const [disable, setDisable] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const apiRequest = useRequest();

    // FORM SUBMIT //
    const onSubmit = async (values) => {
        setInProgress(true);

        const nReward = {
            title: values.title,
            points: values.points,
            discount_code: values.discountCode,
            thumbnail: values.thumbnail,
            product_id: values.product_id,
            client_id:Number(client_id)
          }

          const response = await apiRequest({url:ADDREWARD, method:"POST", data: nReward}, true); // send file header (2nd argument true)
        
          if(response){
            SweetAlert.success('Success!', 'Rule created successfully.');
            setDisable(true);
            setInProgress(false);
          }

    }

    const {values, handleChange, handleBlur, setFieldValue, errors, touched, handleSubmit} = useFormik({
        initialValues:{
            title:"",
            points:"",
            discountCode:"",
            thumbnail:"",
            product_id: product.Pid
        },
        validationSchema: rewardValidationSchema,
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
            <span className="badge bg-warning me-1">{product.name}</span>
        </td>
        <td>
            <input type="text" name="title" value={values.title} onChange={handleChange} onBlur={handleBlur} className="form-control fs-12" />
            {errors.title && touched.title && <p className='text-danger fs_11'>{errors.title}</p>}
        </td>
        <td>
            <input type="text" name="points" value={values.points} onChange={handleChange} onBlur={handleBlur} className="form-control fs-12" />
            {errors.points && touched.points && <p className='text-danger fs_11'>{errors.points}</p>}
        </td>
        <td>
            <input type="text" name="discountCode" value={values.discountCode} onChange={handleChange} onBlur={handleBlur} className="form-control fs-12" />
            {errors.discountCode && touched.discountCode && <p className='text-danger fs_11'>{errors.discountCode}</p>}
        </td>
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
