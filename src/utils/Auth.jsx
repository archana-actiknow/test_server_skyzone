import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import Content from '../components/Content';
import { IsUser } from './Common';


export default function Auth({children, title, adminOnly}) {
    const {isLoggedIn} = useContext(AuthContext);
    const adminAccess = (adminOnly === undefined) ? false : true;
    
    return isLoggedIn ? (
        <>
        <Sidebar />

        <section className="main-content bg_color" id="mainFull">
            <div className="main">

                <Topbar title={title}/>

                <Content>{((adminAccess && !IsUser) || !adminAccess) ? children : "You are not authorized to access this page!"}</Content>
            </div>
        </section>
        </>
        
    ) : <Navigate to="/" />
}
