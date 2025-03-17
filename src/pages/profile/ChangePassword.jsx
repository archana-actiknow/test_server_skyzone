import React from 'react'
import {useFormik} from 'formik'
import { changePasswordValidationSchema } from '../../utils/validationSchemas'
import { useRequest } from '../../utils/Requests';
import { UPDATEPASSWORD } from '../../utils/Endpoints';
import { messagePop } from '../../utils/Common';

export default function ChangePassword() {
  const apiRequest = useRequest();

  const onSubmit = async (values, { setErrors, resetForm }) => {

    try {
      const nPass = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      }

      const response = await apiRequest({url: UPDATEPASSWORD, method: "POST", data: nPass});

      if(response){
        messagePop(response);
      }
    } catch (error) {
      console.error("Password Change Error:", error);
    }
  };

  const {values, errors, touched, handleBlur, handleChange, isSubmitting, handleSubmit} = useFormik({
    initialValues:{
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: changePasswordValidationSchema,
    onSubmit
  });
  return (
    <>

          <div className="main">
            
            <div className="row mb-3">
              <div className="add-offer-form">


                <div className="card">

                  <div className="card-header">
                    <h4 className="fs-13 text-center">Change Password</h4>
                  </div>

                  <div className="card-body">
                  <p className="fs-15 fw-semibold mb-0">&nbsp;</p>

                    <form name="add_offer" id="add_offer">
                      <div className="container-fluid">
                        

                        <div className="row">
                          <div className="col-md-12">
                            <div className="widget">
                              <div className="widget-content">

                                <div className="form-group row mb-2">
                                  <label className="col-md-2 fs-12 fw-semibold"> Current Password </label>
                                  <div className="col-md-4">
                                    <input type="password" name="currentPassword" className="form-control fs-13" value={values.currentPassword} onChange={handleChange} onBlur={handleBlur} />
                                    {errors.currentPassword && touched.currentPassword && <p className='text-danger fs-12'>{errors.currentPassword}</p>}
                                  </div>
                                </div>

                                <div className="form-group row mb-2">
                                  <label className="col-md-2 fs-12 fw-semibold"> New Password </label>
                                  <div className="col-md-4">
                                    <input type="password" name="newPassword" className="form-control fs-13" value={values.newPassword} onChange={handleChange} onBlur={handleBlur} />
                                    {errors.newPassword && touched.newPassword && <p className='text-danger fs-12'>{errors.newPassword}</p>}
                                  </div>
                                </div>

                                <div className="form-group row mb-2">
                                  <label className="col-md-2 fs-12 fw-semibold"> Confirm Password </label>
                                  <div className="col-md-4">
                                    <input type="password" name="confirmNewPassword" className="form-control fs-13" value={values.confirmNewPassword} onChange={handleChange} onBlur={handleBlur} />
                                    {errors.confirmNewPassword && touched.confirmNewPassword && <p className='text-danger fs-12'>{errors.confirmNewPassword}</p>}
                                  </div>
                                </div>
                               

                                <div className="text-center mb-3">
                                        <div className="position-relative">
                                            <input disabled={isSubmitting} type="button" onClick={handleSubmit} className="ss_btn" value="Change Password" />

                                            {isSubmitting && 
                                              <div className="position-absolute top-50 start-50 translate-middle">
                                                  <div className="spinner-border" role="status">
                                                    <span className="sr-only"></span>
                                                  </div>
                                              </div>
                                            }
                                        </div>
                                        
                                    </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
  )
}
