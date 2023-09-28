import React, {useContext,useEffect,useState} from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthRoute, ProtectedRoute } from "./components/Route";

import { RootLayouts } from "./layouts/RootLayouts";
import { AuthLayouts } from "./layouts/AuthLayouts";
import { AppLayouts  } from "./layouts/AppLayouts";
import LogoutPage from "./pages/logout";

import { AuthContext } from "./hooks/Authenticated";

import { test_notifier_components } from "./unitTesting/test_notifiers";
import { useAuthController, useAuthService } from "./hooks_utils/AuthUtils";

export default function App() {

    const [authState,authDispatch] = useContext(AuthContext);

    const AuthService = useAuthService();
    const AuthController = useAuthController();

    useEffect(()=>{
        AuthService.authGateway();
    },[])

    return (
     
        <RootLayouts>

            <BrowserRouter basename="/">
                <Routes>

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

                </Routes>
            </BrowserRouter>

        </RootLayouts>

    );
}

