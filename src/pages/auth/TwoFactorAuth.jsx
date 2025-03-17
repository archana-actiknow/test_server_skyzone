import React, { useState } from 'react'
import {useFormik} from 'formik';
import { otpValidationSchema } from '../../utils/validationSchemas';
import { PostRequest } from '../../utils/Requests';
import { VERIFY } from '../../utils/Endpoints';

export default function TwoFactorAuth({tfaInfo, setResult, setUserInfo}) {

    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState(null);

    const onSubmit = async (e) => {
        const verify_payload = {
            secret: tfaInfo.auth_secret_key,
            otp: values.otpToken,
            token: tfaInfo.token
        }
        const res = await PostRequest(VERIFY, verify_payload);

        if(res.status){
            const resData = res.data.data.data;
            setUserInfo(resData.userInfo)
            setResult(res.status);
        }else{
            setErr(true);
            const error = res.data;
            setErrMsg(error.response.data.message);
        }
    }


    // FORM VALIDATION : USING FORMIK //
    const {values, errors, touched, isSubmitting, handleChange, handleSubmit} = useFormik({
        initialValues: {
            otpToken: "",
        },
        validationSchema: otpValidationSchema,
        onSubmit
    });

    return (
        <section className="py-5 d-flex justify-content-center align-items-center min-vh-100 flex-column d-flex">
            <div className="container">
                <div className="border_radius_left">
                    
                        <div className="row d-flex justify-content-center">
                            <div className="col-lg-8 col-md-12 shadow border_radius_right border_radius_left" style={{background: "#fe5000"}}>
                                <div className="row d-flex align-items-center">
                                    <div className="col-md-6 px-0">
                                        <div className="py-4 bg-white border_radius_left position-relative overflow-hidden">
                                            <form className="p-4 login_form" onSubmit={handleSubmit} method="post">
                                            <div className="card-body">
                                                <div className="py-4">
                                                    <div className="login_header">
                                                        <p className="fw-bold" style={{color: "#fe5000"}}>Welcome</p>
                                                        <span className="fw-semibold">{err ? <span className='text-danger'>{errMsg}</span> : 'Verify OTP'}</span>
                                                        <span></span>
                                                    </div>
                                                    <div className="form-floating mb-5" style={{margin: "18px"}}>
                                                        <input 
                                                            type="password" 
                                                            id="otpToken" 
                                                            placeholder="OTP Number" 
                                                            value={values.otpToken} 
                                                            onChange={handleChange}
                                                            name="otpToken" 
                                                            className="form-control input-md"
                                                        />
                                                        <label htmlFor="text" className="fs_12">OTP Number</label>
                                                        {errors.otpToken && touched.otpToken && <p className='text-danger fs_11'>{errors.otpToken}</p>}
                                                    </div>
                                                    
                                                    <div className="text-center mb-3">
                                                        <div className="position-relative">
                                                            <input type="submit" disabled={isSubmitting} name="verify_otp" id="verify_otp" className="login_btn w-100 verifyOtpButton" value="Verify OTP" style={{}} />

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
                                            </form>
                                        </div>
                                    </div>
                                    <div className="col-md-6 px-0 d-md-block d-none">
                                    {tfaInfo.qr_code_url ? (
                                            <div className="text-center">
                                                <h1 style={{fontSize: "16px", color:"#fff"}}>Scan QR Code with OTP App</h1>
                                                <p style={{fontSize: "11px", color:"#fff", fontWeight: "600"}}>Scan the QR code below using your OTP app (e.g., Google Authenticator):</p>
                                                <img src={tfaInfo.qr_code_url} style={{objectFit: "cover"}} alt="QR Code" />
                                            </div>
                                        )
                                        :
                                        (
                                            <div className="text-center">
                                            <img src={process.env.REACT_APP_LOGO} style={{width: 130}} alt='logo' />
                                            <h3 className="text-white fw-bolder">Verify OTP Token</h3>
                                            <p style={{fontSize: "13px", color:"#fff", fontWeight: "600"}}>
                                                (Verify Using your Google Authenticator Code)
                                            </p>
                                            </div>
                                        )
                                    }
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                </div>
            </div>
        </section>
    )
}
