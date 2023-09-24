import axios from "axios";
import React, { createContext, useContext, useReducer} from "react";

export const AuthStatus = {
    INITIAL : 'INITIAL', 
    INITIAL_ERROR : 'INITIAL_ERROR', // error when fetching the first time
    VALID   : 'VALID',
    INVALID : 'INVALID',
}
export const AuthAction = {
    SET_JWT : 'SET_JWT',
    SET_USER : 'SET_USER',
    SET_STATUS : 'SET_STATUS',
    CLEAR_JWT : 'CLEAR_JWT',
    CLEAR_USER : 'CLEAR_USER',
    CLEAR : 'CLEAR',
}
export const AuthContext = createContext(null);
export const AuthInitial = {
    status:AuthStatus.INITIAL,
    jwt:{},
    user:{},
};

export const AuthReducer = (state = AuthInitial, action) => {
    switch (action.type) {
        case AuthAction.SET_STATUS:
            return {
                ...state,
                status:action.payload.content,
            };

        case AuthAction.SET_JWT:
            return {
                ...state,
                jwt:action.payload.content,
            };

        case AuthAction.SET_USER:
            return {
                ...state,
                user:action.payload.content,
            };

        case AuthAction.CLEAR:
            return AuthInitial;
            
        default:
            return AuthInitial;
    }
};