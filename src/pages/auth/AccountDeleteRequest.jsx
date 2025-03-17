import React from 'react'
import {useFormik} from 'formik';
import { accountDelVelidationSchema } from '../../utils/validationSchemas';

export default function AccountDeleteRequest() {
    const {values, errors, handleBlur, handleChange, touched, handleSubmit} = useFormik({
        initialValues:{
            username: "",
            reason: "",
        },
        validationSchema: accountDelVelidationSchema
    })
  return (
    <section className="py-5 d-flex justify-content-center align-items-center min-vh-100 flex-column d-flex">
            <div className="container">
                <div className="border_radius_left">
                    <div className="row d-flex justify-content-center">
                        <div
                            className="col-lg-8 col-md-12 shadow border_radius_right border_radius_left"
                            style={{ background: "#FE5000" }}
                        >
                            <div className="row d-flex align-items-center">
                                
                                <div className="col-md-6 px-0">
                                    <div className="py-4 bg-white border_radius_left position-relative overflow-hidden">
                                        <div className="card-body">
                                            <div className="py-4">

                                                <form className="p-4 login_form" method="post" onSubmit={handleSubmit}>

                                                <div className="login_header">
                                                    <p className="fw-bold" style={{ color: "#FE5000" }}>
                                                    Delete Account
                                                    </p>
                                                </div>

                                                <div className="form-floating mb-3">
                                                    <input
                                                        type="text"
                                                        id="username"
                                                        className="form-control fs_11"
                                                        value={values.username} 
                                                        onBlur={handleBlur} 
                                                        onChange={handleChange} 
                                                        placeholder="username"
                                                    />
                                                    <label htmlFor="email" className="fs_12">
                                                        Username
                                                    </label>

                                                    {errors.username && touched.username && <p className='text-danger fs_11'>{errors.username}</p>}
                                                </div>

                                                <div className="form-floating mb-5">
                                                    <textarea id="reason" 
                                                    value={values.username} 
                                                    onBlur={handleBlur} 
                                                    onChange={handleChange} className='form-control fs_11'>

                                                    </textarea>
                                                    <label className="fs_12">
                                                        Reason for Account Deletion
                                                    </label>

                                                    {errors.reason && touched.reason && <p className='text-danger fs_11'>{errors.reason}</p>}
                                                </div>

                                                <div className="text-center mb-3">
                                                    <div className="position-relative">
                                                        <input type="submit" name="submit_request" id="submit_request" className="login_btn w-100" value="Submit Request" />                                                        
                                                    </div>
                                                    
                                                </div>

                                                </form>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 px-0 d-md-block d-none">
                                    <div className="py-4 d-flex justify-content-center align-items-center flex-column d-flex text-center">
                                        <img
                                            src={process.env.REACT_APP_LOGO}
                                            style={{ width: 130 }}
                                            alt="skyzon logo"
                                        />
                                        <h1 className="text-white fw-bolder">Skyzone</h1>
                                        <p className="text-white fs-12">
                                            Please provide reason.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
  )
}
