import React, { useState } from 'react'
import FormDropdown from '../../components/FormDropdown'
import { messagePop, offer_type } from '../../utils/Common'
import {useFormik} from 'formik'
import { useRequest } from '../../utils/Requests'
import { CREATEADDON } from '../../utils/Endpoints'

export default function NewAddon({product, index, parent_id, location_id}) {
  
  const apiRequest = useRequest();

  const [inProgress, setInProgress] = useState(false);
  const [disable, setDisable] = useState(false);

  const onSubmit = async (values) => {
    setInProgress(true);

    const nAddon = {
      card_id: values.card_id,
      parent_id: values.parent_id,
      product_id: values.product_id,
      client_id:Number(location_id)
    }

    const response = await apiRequest({url:CREATEADDON, method:"POST", data: nAddon});
  
    if(response){
      messagePop(response);
      setDisable(true);
      setInProgress(false);
    }
  }

  const {values, setFieldValue, handleSubmit} = useFormik({
    initialValues:{
      product_id: product.Pid,
      parent_id: parent_id,
      card_id: offer_type[0].value,
    },
    onSubmit
  });

  const handleTypeChange = (e) => {
      setFieldValue('card_id', e.target.value);
  };

  return (
    <>
      <td className="fs-12">{(index+1)}.</td>                                           
      <td>
          <img src={(product.imageUrl) ? product.imageUrl : "/images/product_placeholder.jpg"} alt="Avatar" className="rounded-circle w-40" />
      </td>
      <td><span className="badge bg-warning me-1">{product.name}</span></td>
      <td><span className="fs-12">${product.cost.toFixed(2)}</span></td>
      <td>
        <FormDropdown name="card_id" onChange={handleTypeChange} options={offer_type} default_value={values.card_id} classnm="form-select fs-12" />
      </td>
      <td>
        <div className="td-btn">
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
