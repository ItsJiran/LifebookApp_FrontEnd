import React, { useContext } from "react";

import { AppAction, AppContext, AppStatus } from "../hooks/App";

export function useAppController(){
    const [AppState,AppDispatch] = useContext(AppContext);

    const appStatus = ()=>{
        return AppStatus;
    }

    const resetNavigate = () => {
        AppDispatch({
            type:AppAction.navigate.reset,
        })
    }
    const setNavigateMessage = (msg) => {
        AppDispatch({
            type:AppAction.navigate.setMessage,
            payload:{content:msg}
        })
    }
    const getNavigateMessage = () => {
        return AppState.navigate.message;
    }
    const setNavigateStatus = (status) => {
        AppDispatch({
            type:AppAction.navigate.setStatus,
            payload:{content:status}
        })
    }
    const getNavigateStatus = () => {
        return AppState.navigate.status;
    }
    const setNavbarStatus = (status) => {
        AppDispatch({
            type:AppAction.navbar.setStatus,
            payload:{content:status}
        })
    }
    const getNavbarStatus = () => {
        return AppState.navbar.status;
    }
    const resetApp = () => {
        resetNavigate();
    }

    return {
        resetNavigate:resetNavigate,
        setNavigateMessage:setNavigateMessage,
        getNavigateMessage:getNavigateMessage,
        setNavigateStatus:setNavigateStatus,
        getNavigateStatus:getNavigateStatus,
        setNavbarStatus:setNavbarStatus,
        getNavbarStatus:getNavbarStatus,
        resetApp:resetApp,
        appStatus:appStatus,
    }
}

export function useAppService(){
    const [AppState,AppDispatch] = useContext(AppContext);
    const AppController = useAppController();

    const appStatus = ()=>{
        return AppStatus;
    }

    const navigate = {
        status : ()=>{ return appStatus().navigate.status },
        set:{
            status: status => AppDispatch({ type:AppAction.navigate.setStatus, payload:{content:status} }),
            message: message => AppDispatch({ type:AppAction.navigate.setMessage, payload:{content:message} }),  
        },
        get:{
            status:()=>{ return AppState.navigate.status },
            message:()=>{ return AppState.navigate.message },
        },
        reset : ()=>{ AppDispatch({ type:AppAction.navigate.reset }); },
    }

    const navbar = {
        status : ()=>{ return appStatus().navbar.status },
        set:{
            status: status => AppDispatch({ type:AppAction.navbar.setStatus, payload:{content:status} }),  
        },
        get:{
            status:()=>{ return AppState.navbar.status },
        },
        show : ()=>{ navbar.set.status( navbar.status().show ) },
        hidden : ()=>{ navbar.set.status( navbar.status().hidden ) },
        reset : ()=>{ AppDispatch({ type:AppAction.navbar.reset }); },
    }

    const reset = ()=>{
        AppController.resetApp();
    }

    return {
        appStatus:appStatus,
        navbar:navbar,
        navigate:navigate,
        reset:reset,
    }
}