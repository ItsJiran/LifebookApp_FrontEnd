import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { LayerBackground, LayerMain } from "../components/Layers";

import IndexPage from "../pages";
import JournalsPage from "../pages/journals";

import { LightBlueBG, WhiteBG } from "../pages/background";
import { NavigationBar } from "../pages/navigation";
import MaterialsAddPage from "../pages/materials/add";
import MaterialsViewPage from "../pages/materials/view";
import { useAuthService } from "../hooks_utils/AuthUtils";
import { useAppService } from "../hooks_utils/AppUtils";

export function AppLayouts({ children }) {
    const location = useLocation();
    const location_path = location.pathname.split('/')[1];

    const AuthService = useAuthService();
    const AppService = useAppService();

    let AppNavbarClass = '';
    if( AppService.navbar.get.status() == AppService.navbar.status().show ) AppNavbarClass = {height:'calc(100% - 70px)'};
    else                                                                    AppNavbarClass = {};

    return (
        <div className="flex flex-col h-full relative overflow-hidden">
            <LayerBackground id='LAYER_BACKGROUND' style={AppNavbarClass}>
                <Routes location={location}>
                    {/* ------------- REGULAR USER --------------- */}
                    <Route exact path='/' Component={LightBlueBG}></Route>
                    <Route exact path='/dashboard' Component={LightBlueBG}></Route>
                    <Route exact path='/journals' Component={LightBlueBG}></Route>
                    <Route exact path='/routines' Component={LightBlueBG}></Route>
                    
                    <Route exact path='/materials/view/:id' Component={WhiteBG}></Route>

                    {/* -------------- ADMIN USER --------------- */}
                    { AuthService.getUser().role == 'admin' ?
                        <>
                            <Route exact path='/materials/add' Component={WhiteBG}></Route>    
                        </>
                    : '' }

                    <Route path="*" Component={WhiteBG} />
                </Routes>                
            </LayerBackground>

            {/* ======================== LAYER PAGE CONTENT ========================== */}
            <LayerMain id='LAYER_MAIN_CONTENT' className={"px-0 py-0 flex overflow-auto flex-col h-full"} style={AppNavbarClass}>
                <Routes location={location}>
                    {/* ------------- REGULAR USER --------------- */}
                    <Route exact path='/' Component={IndexPage}></Route>
                    <Route exact path='/dashboard' Component={IndexPage}></Route>
                    <Route exact path='/journals' Component={JournalsPage}></Route>
                    <Route exact path='/routines' Component={IndexPage}></Route>
                    
                    <Route exact path='/materials/view/:id' Component={MaterialsViewPage}></Route>

                    {/* -------------- ADMIN USER --------------- */}
                    { AuthService.getUser().role == 'admin' ?
                        <>
                            <Route exact path='/materials/add' Component={MaterialsAddPage}></Route>
                        </> : ''
                    }
                    <Route path="*" element={<h1>Page Not Found</h1>} />
                </Routes>
            </LayerMain>

            {/* ======================== NAVIGATION BAR ========================== */}
            <Routes location={location}>
                <Route path="/" Component={NavigationBar}/>
                <Route path="/materials/*" Component={NavigationBar}/>
                <Route path="/dashboard" Component={NavigationBar}/>
                <Route path="/journals" Component={NavigationBar}/>
                <Route path="/routines" Component={NavigationBar}/>
                <Route path="*" Component={NavigationBar}/> 
            </Routes>
        </div>
    )
}