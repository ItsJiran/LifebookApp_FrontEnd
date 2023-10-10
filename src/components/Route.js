import React, {useContext, useState} from "react";
import { Outlet, Navigate } from "react-router-dom";

import { AuthStatus } from "../hooks/Authenticated";
import { Loading } from "./Components";
import { Button } from "./ui/Buttons";
import { useAuthController, useAuthService } from "../hooks_utils/AuthUtils";

export const AuthLoading = ()=>{
    return (
        <div className="absolute bg-white h-full w-full top-0 bottom-0 left-0 right-0 flex items-center justfiy-center">
            <Loading className="h-6 w-6 mx-auto filter-blue-400"/>
        </div>
    )
}

export const AuthGatewayError = ()=>{
    const AuthService = useAuthService();
    const [action,setAction] = useState(false);

    async function handleRetry(){
        if(action) return '';
        setAction(true);
        await AuthService.authGateway();
        setAction(false);
    }

    return (
        <div className="absolute h-full w-full bg-white container flex flex-col items-center justify-center px-4 py-2">
            
            <h3 className="font-bold text-blue-dark-300 text-lg">!Ooops</h3>
            <p className="text-sm mb-6 text-center text-blue-dark-400"> Seems like there's an error when try to authenticate, click this button to re-authenticate..</p>
            <Button onClick={handleRetry} className='w-32 py-2 text-lg mx-auto block' type='submit' variant={action ? 'blue-pressed' : 'blue'} >
                {action ? <Loading className="h-6 w-6 filter-black-100 mx-auto" /> : <p className="cursor-pointer">RETRY</p>}
            </Button>
          
        </div>
    )
}

export const AuthRoute = ({redirectPath='/'}) => {
    const AuthController = useAuthController();

    if(AuthController.getStatus() == AuthStatus.INITIAL) 
        return <AuthLoading/>;
    if(AuthController.getStatus() == AuthStatus.INITIAL_ERROR) 
        return <AuthGatewayError/> 
    if(AuthController.getStatus() == AuthStatus.VALID) 
        return <Navigate to={redirectPath} replace/>
        
    return <Outlet/>
}

export const ProtectedRoute = ({redirectPath = '/login' }) => {
    const AuthController = useAuthController();

    if(AuthController.getStatus() == AuthStatus.INITIAL) 
        return <AuthLoading/>;
    if(AuthController.getStatus() == AuthStatus.INITIAL_ERROR) 
        return <AuthGatewayError/> 
    if(AuthController.getStatus() == AuthStatus.INVALID) 
        return <Navigate to={redirectPath} replace/>

    return <Outlet/>
  };

  