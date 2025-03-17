import { useState } from "react";
import PopupModal from "../../components/PopupModal"
import { useFormik } from "formik";
import { messagePop } from "../../utils/Common";
import SweetAlert from "../../components/SweetAlert";
import { useRequest } from "../../utils/Requests";
import { imageValidation } from "../../utils/validationSchemas";
import { ADD_KITCHEN_SLIDER_IMAGES } from "../../utils/Endpoints";

function Add({refreshData, close}) {    
    const apiRequest = useRequest();

    // FORM SUBMIT //
    const onSubmit = async (values, { resetForm }) => {
        const formData = {
            image: values.image,
        }
        const response = await apiRequest( {
            url: ADD_KITCHEN_SLIDER_IMAGES, 
            method: "POST", data: formData}, true);
      if(response){
            messagePop(response);
            refreshData(true);
            resetForm();
            close();
            setOpen(false)
      }else{
            SweetAlert.error("Error", "There is some issue while adding user.")
      }
    }

    const {values, touched, errors, handleBlur, setFieldValue, handleSubmit} = useFormik({
        initialValues: {
            image:"",
        },
        validationSchema:imageValidation,
        onSubmit
    })

    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false)
        close(false)
    }

    const handleFileChange = (file) => {
        setFieldValue("image", file);
      };

  return (
    <PopupModal title="Add Slider Image" open={open} setOpen={handleClose} handleSubmit={handleSubmit} size="md">
        <div className="col-sm-12" id="dis_list"> 
            <div className="form-group row">
                <div className="col-sm-12">
                        <label className="fs-12 fw-semibold">Image<span className='mandatory'>*</span></label>
                        <input className="form-control fs-12" type="file" name="image" onBlur={handleBlur} onChange={(e) => handleFileChange(e.target.files[0]) }/>
                        <span style={{ fontSize: "9px" }}>*(preferred image size 650×350)</span>
                        {errors.image && touched.image && <p className='text-danger fs-12'>{errors.image}</p>}
                    <div className="col-md-4">
                        <img src={values.image !== '' ? URL.createObjectURL(values.image) : ""} alt="" className="w-90" />
                    </div>
                </div>
            </div>
        </div>
    </PopupModal>
  )
}

export default Add