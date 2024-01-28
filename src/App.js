import React, {useContext,useEffect,useState} from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthRoute, ProtectedRoute } from "./components/Route";

import { RootLayouts } from "./layouts/RootLayouts";
import { AuthLayouts } from "./layouts/AuthLayouts";
import { AppLayouts  } from "./layouts/AppLayouts";
import LogoutPage from "./pages/logout";

import { AuthContext, AuthStatus } from "./hooks/Authenticated";

import { test_notifier_component } from "./unitTesting/test_notifiers";
import { test_choicer_component } from "./unitTesting/test_choicer";

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

    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function (event){
        window.history.pushState(null, document.title,  window.location.href);
    });
    },[])

    return (
    
        <BrowserRouter basename="/lifebook/">
            <Routes>

                {/* ====================== ROOTS ROUTE =============================== */}
                <Route element={<RootLayouts/>}>

                    {/* --- Authenticated Route */}
                    <Route element={<ProtectedRoute/>}>
                        <Route path="/*" Component={AppLayouts}/>
                        <Route exact path="/logout" Component={LogoutPage} />
                    </Route>

                    {/* --- Non Authenticated Route */}
                    <Route element={<AuthRoute/>}>
                        <Route exact path="/login" Component={AuthLayouts} />
                        <Route exact path="/register" Component={AuthLayouts} /> 
                    </Route>

                    {/* --- Testing Route */}
                    { process.env.NODE_ENV == 'development' ? 
                        <>
                            <Route exact path="/test/notifier" Component={test_notifier_component} />
                            <Route exact path="/test/choicer" Component={test_choicer_component} />
                        </>
                    : '' }

                    <Route path="*" element={<h1>Page Not Found</h1>} />

                </Route>

                {/* ====================== STAND ALONE ROUTE =============================== */}
                {/* --- Authenticated Route */}
                <Route element={<ProtectedRoute/>}>
                    <Route exact path="/standalone/materials/view/:id" Component={StandAlone_MaterialsViewPage}/>
                </Route>

                {/* --- Testing Route */}
                { process.env.NODE_ENV == 'development' ? 
                        <>

                        </>
                : '' }
                
            </Routes>
        </BrowserRouter>

    );
}

