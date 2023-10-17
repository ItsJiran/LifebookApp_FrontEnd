import React from "react";
import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import { LayerBackground, LayerMain } from "../components/Layers";

import IndexPage from "../pages";
import JournalsPage from "../pages/journals";

import { LightBlueBG, WhiteBG } from "../pages/background";
import { NavigationBar } from "../pages/navigation";
import MaterialsAddPage from "../pages/materials/add";
import MaterialsViewPage from "../pages/materials/view";
import { useAuthService } from "../hooks_utils/AuthUtils";
import { useAppService } from "../hooks_utils/AppUtils";
import JournalsDate from "../pages/journals/index.date";
import RoutinesPage from "../pages/routines";
import JournalsAddPage from "../pages/journals/add";

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
            <div className="h-0 -z-1" id='LAYER_BACKGROUND'>
                <Routes location={location}>
                    {/* ------------- REGULAR USER --------------- */}
                    <Route element={<LightBlueBG style={AppNavbarClass}/>}>
                        <Route exact path='/'></Route>
                        <Route exact path='/dashboard'></Route>

                        <Route exact path='/journals'></Route>
                        <Route exact path='/journals/date' ></Route>

                        <Route exact path='/routines'></Route>
                    </Route>

                    <Route element={<WhiteBG style={AppNavbarClass}/>}>
                        <Route exact path='/materials/view/:id'></Route>
                    </Route>

                    <Route element={<div className="bg-white" style={AppNavbarClass}/>}>
                        <Route exact path='/journals/add'></Route>
                    </Route>
                                        
                    {/* -------------- ADMIN USER --------------- */}
                    { AuthService.getUser().role == 'admin' ?
                        <>
                            <Route exact path='/materials/add' Component={WhiteBG}></Route>    
                        </>
                    : '' }

                    <Route path="*" Component={WhiteBG} />
                </Routes>                
            </div>

            {/* ======================== NAVIGATION BAR ========================== */}
            <Routes location={location}>
                <Route path="/" Component={NavigationBar}/>
                <Route path="/dashboard" Component={NavigationBar}/>
                <Route path="/materials/*" Component={NavigationBar}/>
                <Route path="/journals/*" Component={NavigationBar}/>
                <Route path="/routines" Component={NavigationBar}/>
                <Route path="*" Component={NavigationBar}/> 
            </Routes>

            {/* ======================== LAYER PAGE CONTENT ========================== */}
            <LayerMain id='LAYER_MAIN_CONTENT' className={"px-0 py-0 flex overflow-auto flex-col"} style={AppNavbarClass}>
                <Routes location={location}>
                    {/* ------------- REGULAR USER --------------- */}
                    <Route exact path='/' Component={IndexPage}></Route>
                    <Route exact path='/dashboard' Component={IndexPage}></Route>
                    <Route exact path='/journals' Component={JournalsPage}></Route>
                    <Route exact path='/journals/add' Component={JournalsAddPage}></Route>
                    <Route exact path='/journals/date' Component={JournalsDate}></Route>
                    <Route exact path='/journals/:year/:month/:day' Component={JournalsDate}></Route>
                    <Route exact path='/routines' Component={RoutinesPage}></Route>
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

        </div>
    )
}