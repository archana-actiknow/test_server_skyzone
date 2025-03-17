import React, { useState } from 'react'
import {useFormik} from 'formik';
import { PostRequest } from '../../utils/Requests';
import { loginValidationSchema } from '../../utils/validationSchemas';
import { LOGIN } from '../../utils/Endpoints';

export default function ValidateLogin({setUserInfo, setTfaInfo}) {

    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState(null);

    // AFTER SUCCESSFUL SUBMIT //
    const onSubmit = async (e) => {

        const res = await PostRequest(LOGIN, values);

        if(res.status){
            setTfaInfo(res.data.data.data.tfaInfo);
        }else{
            setErr(true);
            const error = res.data;
            setErrMsg(error.response.data.message);
        }
    }

    // FORM VALIDATION : USING FORMIK //
    const {values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit} = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        validationSchema: loginValidationSchema,
        onSubmit
    });


    
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
                                            
                                                <form className="p-4 login_form" onSubmit={handleSubmit} method="post">

                                                <div className="login_header">
                                                    <p className="fw-bold" style={{ color: "#FE5000" }}>
                                                        Welcome
                                                    </p>
                                                    <span>{err ? <span className='text-danger'>{errMsg}</span> : 'Login with Username'}</span>
                                                </div>

                                                <div className="form-floating mb-3">
                                                    <input
                                                        type="text"
                                                        id="username"
                                                        value={values.username} 
                                                        onBlur={handleBlur} 
                                                        onChange={handleChange} 
                                                        className={errors.username && touched.username ? "form-control fs_11 danger": "form-control fs_11"} 
                                                        placeholder="username"
                                                    />
                                                    <label htmlFor="email" className="fs_12">
                                                    Username
                                                    </label>

                                                    {errors.username && touched.username && <p className='text-danger fs_11'>{errors.username}</p>}
                                                </div>

                                                <div className="form-floating mb-5">
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        id="password"
                                                        value={values.password}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        className={errors.password && touched.password ? 'form-control fs_11 danger':"form-control fs_11"}
                                                        placeholder="password"
                                                    />
                                                    <label htmlFor="password" className="fs_12">
                                                        Password
                                                    </label>
                                                    {errors.password && touched.password && <p className='text-danger fs_11'>{errors.password}</p>}
                                                </div>

                                                <div className="text-center mb-3">
                                                    <div className="position-relative">
                                                        <input disabled={isSubmitting} type="submit" name="login" id="login" className="login_btn w-100" value="Login" />

                                                        {isSubmitting && 
                                                        <div className="position-absolute top-50 start-50 translate-middle">
                                                            <div className="spinner-border" role="status">
                                                                <span className="sr-only"></span>
                                                                </div>
                                                        </div>
                                                        }
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
                                        <h1 className="text-white fw-bolder">WELCOME TO SKY ZONE</h1>
                                        <p className="text-white fs-12">
                                            Enter your personal details and start journey with us
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
