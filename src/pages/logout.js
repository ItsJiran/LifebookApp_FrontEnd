import React, { useCallback, useState, useContext } from "react";
import axios, { AxiosError } from "axios";

import { Loading } from "../components/Components";
import { Button } from "../components/ui/Buttons";
import { AuthStatus } from "../hooks/Authenticated";
import { useAuthController, useAuthService } from "../hooks_utils/AuthUtils";
import { useAppService } from "../hooks_utils/AppUtils";
import { useApiService } from "../hooks_utils/ApiUtils";


export default function LogoutPage() {

    const AppService = useAppService();
    const AuthController = useAuthController();
    const AuthService = useAuthService();
    const ApiService = useApiService();

    const [action, setAction] = useState(false);
    const [error, setError] = useState(false);

    const handleRetry = async () => {
        await handleLogout();
    }
    const handleLogout = async () => {
        if (action) return;
        setAction(true);

        try{
            const fetch = await ApiService.fetchAuth({slug:'api/logout',method:'post'});

            if(fetch.status == 200 || fetch.status == 401){
                AuthService.clear();
                AuthService.setAuthStatus(AuthStatus.INVALID);
                AppService.resetApp();
            } 
            
            else if(fetch.status >= 400) {
                setError(true);
            }
    
            else if(fetch instanceof AxiosError){
                setError(true);
            }

        } catch (e) {
            if(e instanceof Error || ApiService.isReturnError(e)){
                console.error('ERROR_INSTANCE',e);
                if(e.isNotifier){
                    NotifierController.addNotification({
                        title:e.title ? e.title : 'Terjadi Kesalahan Sistem',
                        message:e.message ? e.message : 'Terjadi kesalahan pada sistem yang sedang berjalan..',
                        type:'Error',
                    })                    
                }
            } else {
                console.error(e);
            }
        }

        setAction(false);
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