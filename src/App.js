import React, {useContext,useEffect,useState} from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthRoute, ProtectedRoute } from "./components/Route";

import { RootLayouts } from "./layouts/RootLayouts";
import { AuthLayouts } from "./layouts/AuthLayouts";
import { AppLayouts  } from "./layouts/AppLayouts";
import LogoutPage from "./pages/logout";

import { AuthContext, AuthStatus } from "./hooks/Authenticated";

import { test_notifier_components } from "./unitTesting/test_notifiers";
import { useAuthController, useAuthService } from "./hooks_utils/AuthUtils";
import { useNotifierController } from "./hooks_utils/NotifierUtils";
import { useAppService } from "./hooks_utils/AppUtils";
import StandAlone_MaterialsViewPage from "./pages/materials/standalone.view";

export default function App() {

    const [authState,authDispatch] = useContext(AuthContext);

    const AuthService = useAuthService();
    const AuthController = useAuthController();
    const AppService = useAppService();
    const NotifierController = useNotifierController();

    useEffect(()=>{
        AuthService.authGateway();

        window.addEventListener('storage',(e)=>{
        
            // Listening to storage so everytime the user logout or login 
            // the other tab will syncronize it

            if(e.key == 'AUTH_JWT'){
                if(e.newValue == null) {
                    AuthService.clear();
                    AuthService.setAuthStatus(AuthStatus.INVALID);
                    AppService.reset();
                } else if (e.oldValue == null && e.newValue !== null) {
                    var data = JSON.parse(e.newValue);
                    if( AuthService.checkAuthJwtData(data) ) {
                        AuthController.setJWT(data);
                        AuthController.setStatus(AuthStatus.VALID);
                        AppService.reset();
                    }
                }
            }

            if(e.key == 'AUTH_USER'){
                if (e.oldValue == null && e.newValue !== null) {
                    var data = JSON.parse(e.newValue);
                    if( AuthService.checkAuthUserData(data) ) AuthController.setUser(data);
                }
            }

        },false)

    },[])

    return (
    
        <BrowserRouter basename="/">
            <Routes>

                <Route element={<RootLayouts/>}>

                    <Route element={<ProtectedRoute/>}>
                        <Route path="/*" Component={AppLayouts}/>
                        <Route exact path="/logout" Component={LogoutPage} />
                    </Route>

                    <Route element={<AuthRoute/>}>
                        <Route exact path="/login" Component={AuthLayouts} />
                        <Route exact path="/register" Component={AuthLayouts} /> 
                    </Route>

                    { process.env.NODE_ENV == 'development' ? 
                        <Route exact path="/test/notifier" Component={test_notifier_components} />
                    : '' }

                    <Route path="*" element={<h1>Page Not Found</h1>} />

                </Route>

                <Route element={<ProtectedRoute/>}>
                    <Route exact path="/standalone/materials/view/:id" Component={StandAlone_MaterialsViewPage}/>
                </Route>
                
            </Routes>
        </BrowserRouter>

    );
}

