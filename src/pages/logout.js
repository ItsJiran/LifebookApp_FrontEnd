import React, { useCallback, useState, useContext } from "react";
import axios from "axios";

import { Loading } from "../components/Components";
import { Button } from "../components/ui/Buttons";
import { AuthStatus } from "../hooks/Authenticated";
import { useAuthController, useAuthService } from "../hooks_utils/AuthUtils";


export default function LogoutPage() {

    const AuthController = useAuthController();
    const AuthService = useAuthService();

    const [action, setAction] = useState(false);
    const [error, setError] = useState(false);

    const handleRetry = async () => {
        await handleLogout();
    }
    const handleLogout = async () => {
        if (action) return;
        setAction(true);

        const token = AuthService.getAuthToken();
        const config = {
            method: 'post',
            url: process.env.BACKEND_URL + 'api/logout',
            headers: {
                Authorization: 'Bearer ' + token,
                Accept: 'application/json',
            }
        }

        await axios(config)
            .then((e) => {
                setAction(false);
                setError(false);
            })
            .catch((e) => {
                setAction(false);
                setError(true);
            });

        if (error == false) {
            window.localStorage.removeItem('JWT_AUTH');
            AuthController.clearAuth();
            AuthController.setStatus(AuthStatus.INVALID);
        }
    }

    React.useEffect(() => {
        handleLogout();
    }, [])

    if (error)
        return (
            <div className="absolute h-full w-full bg-white container flex flex-col items-center justify-center px-4 py-2">

                <h3 className="font-bold text-blue-dark-300 text-lg">!Ooops</h3>
                <p className="text-sm mb-6 text-center text-blue-dark-400"> Seems like there's an error when try to authenticate, click this button to re-authenticate..</p>
                <Button onClick={handleRetry} className='w-32 py-2 text-lg mx-auto block' type='submit' variant={action ? 'blue-pressed' : 'blue'} >
                    {action ? <Loading className="h-6 w-6 filter-black-100 mx-auto" /> : <p className="cursor-pointer">RETRY</p>}
                </Button>

            </div>
        )
    else return (
        <div className="absolute h-full w-full bg-white container flex flex-col items-center justify-center px-4 py-2">
            <Loading className="h-6 w-6 mx-auto filter-blue-400"/>
        </div>
    );

}