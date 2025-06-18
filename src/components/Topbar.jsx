import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';

export default function Topbar({title}) {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const {dispatch, user} = useContext(AuthContext);
    const handleLogout = () => {
        dispatch({type: "LOGOUT"});
        navigate("/");
        window.location.reload();
    }

    const toggleShow = () => {
        setShow(prevShow => !prevShow);
    }

  return (
    <div className="pb-2 mb-3 border-bottom">
        <div className="row d-flex align-items-center justify-content-between">
            <div className="col-9">
                <span className="fs-15 fw-semibold">{title}</span>
            </div>
            
            <div className="col-3 text-end">
                {user.user.name &&
                    <span className="fs-15 fw-semibold">Welcome {user.user.name} </span>
                }
                <Link
                    onClick={toggleShow}
                    className={`rounded-circle head-icon text-dark${(show) ? ' show' : ''}`}
                    type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <div className="head-icon text-center">
                        <img src="./images/images.png" className="img-fluid rounded-circle" alt="settings" />
                    </div>
                </Link>
                <ul className={`dropdown-menu dropdown-menu-end border-0 shadow${(show) ? ' show' : ''}`} style={{right: '30px'}}>   
                    {/* <li>
                        <Link className="dropdown-item fs-12 fw-semibold d-flex align-items-center" >
                            <span className="">Set a Status</span>
                        </Link>
                    </li>
                    
                    <li>
                        <Link className="dropdown-item fs-12 fw-semibold d-flex align-items-center" >
                            <span className="">Feedback</span>
                        </Link>
                    </li>
                    <li>
                        <div className="dropdown-divider"></div>
                    </li>
                    <li>
                        <Link className="dropdown-item fs-12 fw-semibold d-flex align-items-center" >
                            <span className="">Setting</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile" className="dropdown-item fs-12 fw-semibold d-flex align-items-center" >
                            <span className="">Profile & Account</span>
                        </Link>
                    </li> */}
                    <li>
                        <Link to="/change-password" className="dropdown-item fs-12 fw-semibold d-flex align-items-center" >
                            <span className="">Change Password</span>
                        </Link>
                    </li>
                    <li>
                        <div className="dropdown-divider"></div>
                    </li>
                    <li>
                        <Link className="dropdown-item fs-12 fw-semibold d-flex align-items-center" onClick={handleLogout}>
                            <span className="">Logout</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  )
}
