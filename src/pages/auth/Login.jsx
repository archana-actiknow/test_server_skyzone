import React, { useEffect, useContext,useState } from 'react' //  
import ValidateLogin from './ValidateLogin';
import TwoFactorAuth from './TwoFactorAuth';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const navigate = useNavigate();
    const {dispatch, role, isLoading} = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState(false);
    const [tfaInfo, setTfaInfo] = useState(false);
    const [result, setResult] = useState(false);

    useEffect(()=>{
        const login_verified_user = async () =>{
                        
            if(role === null)
            {
                await dispatch({type: "LOGIN", payload: {user: userInfo}});
            }else{
                if(role.IsAgent){
                    navigate("/customer-queries")
                }else{
                    navigate("/mobile-available-products")
                }

                window.location.reload();
            }
            
        }

        if(result)
            login_verified_user();
    }, [result, userInfo, dispatch, navigate, role, isLoading])
    
    // 


    return (
        tfaInfo ? 
                <TwoFactorAuth tfaInfo={tfaInfo} setUserInfo={setUserInfo} setResult={setResult} /> 
            :
                <ValidateLogin setTfaInfo={setTfaInfo} />
        )
}
