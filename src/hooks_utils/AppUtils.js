import React, { useContext } from "react";

import { AppAction, AppContext } from "../hooks/App";

export function useAppController(){
    const [AppState,AppDispatch] = useContext(AppContext);

    const resetNavigateStatus = () => {
        AppDispatch({
            type:AppAction.navigate.reset,
        })
    }
    const setNavigateStatus = (status) => {
        AppDispatch({
            type:AppAction.navigate.set,
            content:status
        })
    }
    const getNavigateStatus = () => {
        return AppState.navigate;
    }

    return {
        resetNavigateStatus:resetNavigateStatus,
        setNavigateStatus:setNavigateStatus,
        getNavigateStatus:getNavigateStatus,
    }
}