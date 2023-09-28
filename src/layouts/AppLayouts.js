import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { LayerBackground, LayerMain } from "../components/Layers";

import IndexPage from "../pages";
import JournalsPage from "../pages/journals";

import { IndexBG } from "../pages/background";
import { NavigationBar } from "../pages/navigation";

export function AppLayouts({ children }) {
    const location = useLocation();
    const location_path = location.pathname.split('/')[1];

    return (
        <div className="flex flex-col h-full">
            <LayerBackground id='LAYER_BACKGROUND'>
                <Routes location={location}>
                    <Route exact path='/' Component={IndexBG}></Route>
                    <Route exact path='/dashboard' Component={IndexBG}></Route>
                    <Route exact path='/journals' Component={IndexBG}></Route>
                    <Route exact path='/routines' Component={IndexBG}></Route>
                    <Route path="*" element={<h1>Page Not Found</h1>} />
                </Routes>                
            </LayerBackground>

            {/* ======================== LAYER PAGE CONTENT ========================== */}
            <LayerMain id='LAYER_MAIN_CONTENT' className="px-0 py-0 flex flex-1 overflow-auto flex-col h-full">
                <Routes location={location}>
                    <Route exact path='/' Component={IndexPage}></Route>
                    <Route exact path='/dashboard' Component={IndexPage}></Route>
                    <Route exact path='/journals' Component={JournalsPage}></Route>
                    <Route exact path='/routines' Component={IndexPage}></Route>
                    <Route path="*" element={<h1>Page Not Found</h1>} />
                </Routes>
            </LayerMain>

            {/* ======================== NAVIGATION BAR ========================== */}
            <Routes location={location}>
                <Route path="/" Component={NavigationBar}/>
                <Route path="/dashboard" Component={NavigationBar}/>
                <Route path="/journals" Component={NavigationBar}/>
                <Route path="/routines" Component={NavigationBar}/>
                <Route path="*" element={<></>} /> 
            </Routes>
        </div>
    )
}