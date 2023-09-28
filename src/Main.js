import React, { useReducer } from "react";

import { ConfirmerReducer, ConfirmerContext, ConfirmerInitial } from "./hooks/Confirmer";
import { NotifierContext, NotifierReducer, NotifierInitial } from "./hooks/Notifier";
import { AuthContext, AuthInitial, AuthReducer } from "./hooks/Authenticated";
import { AppContext, AppInitial, AppReducer } from "./hooks/App";

import App from "./App";


export default function Main(){

    const [app, appDispatch] = useReducer(AppReducer, AppInitial);
    const [notifier, notifierDispatch] = useReducer( NotifierReducer, NotifierInitial);
    const [confirmerState, confirmerDispatch] = useReducer( ConfirmerReducer, ConfirmerInitial );
    const [authState, authDispatch] = useReducer( AuthReducer, AuthInitial );

    return (

        <AppContext.Provider value={[app, appDispatch]}>
    
            <NotifierContext.Provider value={[notifier, notifierDispatch]}> 

                <ConfirmerContext.Provider value={[ confirmerState, confirmerDispatch ]}>

                    <AuthContext.Provider value={[authState,authDispatch]}>

                        <App/>

                    </AuthContext.Provider>

                </ConfirmerContext.Provider>

            </NotifierContext.Provider>

        </AppContext.Provider>

    );

}