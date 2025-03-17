import { useState } from "react";
import PopupModal from "../../components/PopupModal"
import { useFormik } from "formik";
import {messagePop } from '../../utils/Common';
import { ADDCUSTOMERPOINTS} from "../../utils/Endpoints";
import SweetAlert from "../../components/SweetAlert";
import { useRequest } from "../../utils/Requests";
import { addMobileUsersPoints } from "../../utils/validationSchemas";

export default function Add({close,user,data }) {  
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false)
        close(false)
    }
    const apiRequest = useRequest();
    const client_id = user.client_id;

    // FORM SUBMIT //
    const onSubmit = async (values, { resetForm }) => {
        const nUser = {
            points: values.points,
            description: values.reason,
            client_id:client_id,
            customer_id: user.id
        }

      const response = await apiRequest({url:ADDCUSTOMERPOINTS, method:"POST", data: nUser});
        if(response){
            messagePop(response);
            resetForm();
            close();
            setOpen(false)
        }else{
            SweetAlert.error("Error", "There is some issue while adding user.")
        }
    }

    const {values, touched, errors, handleBlur, handleChange, setFieldValue, handleSubmit} = useFormik({
        initialValues: {
            points: "",
            reason: "",
        },
        validationSchema: addMobileUsersPoints,
        onSubmit
    })

  return (
    <PopupModal  open={open} setOpen={handleClose} handleSubmit={handleSubmit} size="lg">
        <div className="col-sm-12" id="dis_list"> 
            <div className="">
                <div className="row align-items-center">
                    <div className="col-sm-4 padding-right">
                        <div className="card boxShadow mb-2">
                            <div className="card-body">
                                <div className="text-center">
                                    <img className="img-fluid rounded-circle" src={user.profile_picture ? user.profile_picture : "./images/user-image.jpg"}  alt="User"
                                    style={{ height: "100px" }}
                                    />
                                    <div className="mt-2">
                                        <label className="fs-14 fw-semibold d-block">{user.name}</label>
                                        <label className="fw-semibold navbar-brand color d-block">{data?.earned_points || 0}</label>
                                        <label className="fs-12 fw-semibold d-block">Rewards Points</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="card boxShadow mb-2">
                            <div className="card-body">
                                <div style={{ height:"205px", overflowY: "auto" }}>
                                    
                                    <table className="table table-bordered" style={{ borderCollapse: "collapse", borderStyle: "none", width: "100%" }}>
                                        <thead className="border-style">
                                            <tr className="border-style" >
                                                <th className="border-style fs-14">Points</th>
                                                <th className="border-style fs-14">Reason</th>
                                            </tr>
                                        </thead>
                                        <tbody className="border-style">
                                            {data?.data?.length > 0 ? (
                                                data.data.map((item, index) => (
                                                    <tr key={index}  className="border-style">
                                                        <td className="fs-12 border-style color">{item.point_earn || 0}</td>
                                                        <td className="fs-12 border-style">{item.description ? item.description : "No description"}</td>
                                                    </tr>
                                                ))
                                                ) : (
                                                <tr>
                                                    <td colSpan="2" className="fs-12 border-style text-center">No data available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card boxShadow mb-2">
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col-sm-12">
                            <label className="fs-12 fw-semibold">Points<span className='mandatory'>*</span></label>
                            <input type="number" value={values.points} onBlur={handleBlur} onChange={handleChange} name="points" className="mt-0 fs-13 mb-3 form-control length_count" placeholder="points"  />
                            {errors.points && touched.points && <p className='text-danger fs_11'>{errors.points}</p>}
                        </div>
                        <div className="col-sm-12">
                            <label className="fs-12 fw-semibold" >Reason <span className="mandatory">*</span></label>
                            <textarea className="fs-13 mb-3 form-control length_count f-ht-70" id="reason" name="reason" rows="4" cols="50" placeholder="Enter your reason" onChange={(e) => setFieldValue("reason", e.target.value)}  value={values.reason} onBlur={handleBlur}/>
                            {(errors.reason && touched.reason) && <p className='fs-12 text-danger'>{errors.reason}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </PopupModal>
  )
}