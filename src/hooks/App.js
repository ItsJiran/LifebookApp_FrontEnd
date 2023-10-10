import React, { createContext } from "react";

export const AppAction = {
    navigate:{
        reset :'navigate_reset', 
        set:'navigate_set',
        setStatus:'navigate_set_status',    
        setMessage:'navigate_set_message',
    },
    navbar:{
        reset :'navbar_reset', 
        set:'navbar_set',
        setStatus:'navbar_set_status',    
    },
    reset:'reset'
}
export const AppStatus = {
    navigate:{
        status:{
            initial : 'initial',   // Implement Able To Freely Navigate Without Confirm,
            validate : 'validate', // Implement Integrate with Confirm Context to validate if the user want to navigate then they should confirm
            fixed : 'fixed',       // Implement the user can't navigate
        }
    },
    navbar:{
        status:{
            show:'show',
            hidden:'hidden',
        }
    }
}


export const AppContext = createContext(null);
export const AppInitial = {
    navigate:{
        status:AppStatus.navigate.status.initial,
        message:undefined,
    },
    navbar : {
        status:AppStatus.navbar.status.show,
    }
};

export const AppReducer = (state=AppInitial,action) => {

    switch(action.type){
        // ================== NAVBAR
        case AppAction.navbar.setStatus:
            return {
                ...state,
                navbar:{
                    ...state.navbar,
                    status:action.payload.content
                }
            };
        case AppAction.navbar.reset:
            return {
                ...state,
                navbar:AppInitial.navbar,
            }
        // ================== NAVIGATE
        case AppAction.navigate.setMessage:
            return {
                ...state,
                navigate:{
                    ...state.navigate,
                    message:action.payload.content
                }
            };
        case AppAction.navigate.setStatus:
            console.log(action);
            return {
                ...state,
                navigate:{
                    ...state.navigate,
                    status:action.payload.content
                }
            };
        case AppAction.navigate.set:
            return {
                ...state,
                navigate:action.payload.content
            };
        case AppAction.navigate.reset:
            return {
                ...state,
                navigate:AppInitial.navigate,
            }

        case AppAction.reset:
            return AppInitial;
        default:
            return state;
    }

}