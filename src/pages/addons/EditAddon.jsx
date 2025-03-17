import React from 'react'
import { Link } from 'react-router-dom'
import SweetAlert from '../../components/SweetAlert';
import { messagePop } from '../../utils/Common';
import { DELETEADDON } from '../../utils/Endpoints';
import { useRequest } from '../../utils/Requests';

export default function EditAddon({product, index, refreshRecords}) {
  const apiRequest = useRequest();

  const handleDelete = async (id) => {
    const title = "Are you sure?";
    const text  = "Are you sure you want to delete this?";
    const confirm = await SweetAlert.confirm(title, text);

    if(confirm){
        const data = await apiRequest({url:DELETEADDON + id, method:"DELETE"});
        refreshRecords(true);
        messagePop(data);
    }
  }

  return (
    <>
      <td className="fs-12">{(index+1)}.</td>                                           
      <td>
          <img src={product.imageUrl} alt="Avatar" className="rounded-circle w-40" />
      </td>
      <td><span className="badge bg-warning me-1">{product.name}</span></td>
      <td><span className="fs-12">${product.cost.toFixed(2)}</span></td>
      <td>
        <div className="d-flex align-items-center">
            <Link onClick={() => handleDelete(product.add_on.id)} value="Delete" className=" icon delete" data-bs-placement="top" data-bs-title="Delete">
                <i className="bi bi-trash-fill"></i>
            </Link>
        </div>
      </td>
    </>
  )
}
