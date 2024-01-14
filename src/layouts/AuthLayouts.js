import React from "react";

import { LayerBackground } from "../components/Layers";
import { AnimatePresence } from "framer-motion";


import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import { CircleDecoration } from "../components/Components";
import { useLocation } from "react-router-dom";

export function AuthLayouts({ children, animate }) {

    const location = useLocation();

    return (
        <div className="flex flex-col justify-center container box-border relative min-h-screen bg-white w-full">
            <LayerBackground>
                <CircleDecoration className="h-32 w-32 absolute -bottom-16 -right-5 pointer-events-none" />
            </LayerBackground>

            <AnimatePresence mode='wait'>
                {location.pathname == '/login' ? <LoginPage key='login' /> : <RegisterPage key='register' />}
            </AnimatePresence>
        </div>
    )
}