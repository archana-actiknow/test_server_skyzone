import { useState } from "react";
import PopupModal from "../../components/PopupModal"
import { useFormik } from "formik";
import { encrypt, messagePop } from '../../utils/Common';
import { UPDATE_KITCHEN_SLIDER_IMAGES, UPDATEMANAGER } from "../../utils/Endpoints";
import SweetAlert from "../../components/SweetAlert";
import { useRequest } from "../../utils/Requests";
import { imageValidation, managerValidation } from "../../utils/validationSchemas";

export default function Edit({id, close, data, refreshData, alertMessage}) {  
    const [open, setOpen] = useState(true);
    const apiRequest = useRequest();

    const handleClose = () => {
        setOpen(false)
        close(false)
    }

    // // FORM SUBMIT //

    const onSubmit = async (values, {resetForm}) => {
        const uUser = {
            id: id,
            image: values.image,
        }

        const response = await apiRequest({
            url:UPDATE_KITCHEN_SLIDER_IMAGES, method:"POST", data: uUser},true);

        if(response){
            setOpen(false)
            close(false)
            refreshData(true);
            resetForm();
            messagePop(response);
        }else{
            SweetAlert.error("Error", "There is some issue while adding user.")
        }
    }

    const {values, touched, errors, handleBlur, setFieldValue, handleSubmit} = useFormik({
        initialValues: {
            image:data?.image,
        },
        enableReinitialize: true,
        validationSchema: imageValidation,
        onSubmit
    })

    const handleFileChange = (file) => {
        setFieldValue("image", file);
      };

  return (
    <PopupModal title="Edit Slider Image" open={open} setOpen={handleClose} handleSubmit={handleSubmit} size="md">
        <div className="col-sm-12" id="dis_list"> 
            <div className="form-group row">
                <div className="col-sm-12">
                    <label className="fs-12 fw-semibold">Image<span className='mandatory'>*</span></label>
                    <input className="form-control fs-12" type="file" name="image" onBlur={handleBlur} onChange={(e) => handleFileChange(e.target.files[0]) }/>
                    <span style={{ fontSize: "9px" }}>*(preferred image size 650×350)</span>
                    {errors.image && touched.image && <p className='text-danger fs-12'>{errors.image}</p>}
                <div className="col-md-4">
                    <img src={values.image !== '' ? values.image : ""} alt="" className="w-90" />
                </div>
                </div>
            </div>
        </div>
    </PopupModal>
  )
}