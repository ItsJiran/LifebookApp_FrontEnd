import React, { createContext } from "react";
import { set } from "react-hook-form";

export const AppAction = {
    navigate:{
        reset :'navigate_reset', 
        set:'navigate_set',    
    },
    reset:'reset'
}
export const AppStatus = {
    navigate:{
        initial : 'initial',   // Implement Able To Freely Navigate Without Confirm,
        validate : 'validate', // Implement Integrate with Confirm Context to validate if the user want to navigate then they should confirm
        fixed : 'fixed',       // Implement the user can't navigate
    }
}

export const AppContext = createContext(null);
export const AppInitial = {
    navigate:AppStatus.navigate.initial,
};

export const AppReducer = (state=AppInitial,action) => {

    switch(action.type){
        case AppAction.navigate.set:
            return {
                ...state,
                navigate:action.payload.content
            };
        case AppAction.navigate.reset:
            return {
                ...state,
                navigate:AppStatus.navigate.initial,
            }
        case AppAction.reset:
            return AppInitial;
        default:
            return state;
    }

}