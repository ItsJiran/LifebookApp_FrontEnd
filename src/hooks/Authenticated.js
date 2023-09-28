import axios from "axios";
import React, { createContext, useContext, useReducer} from "react";

export const AuthStatus = {
    INITIAL : 'INITIAL', 
    INITIAL_ERROR : 'INITIAL_ERROR', // error when fetching the first time
    VALID   : 'VALID',
    INVALID : 'INVALID',
}
export const AuthAction = {
    status:{
        clear:'status_clear',
        set:'status_set',
    },
    jwt:{
        clear:'jwt_clear',
        set:'jwt_set',
    },
    user:{
        clear:'user_clear',
        set:'user_set',
    },
    clear:'clear',
}
export const AuthContext = createContext(null);
export const AuthInitial = {
    status:AuthStatus.INITIAL,
    jwt:{},
    user:{},
};

export const AuthReducer = (state = AuthInitial, action) => {
    switch (action.type) {
        case AuthAction.status.set:
            return {
                ...state,
                status:action.payload.content,
            };

        case AuthAction.jwt.set:
            return {
                ...state,
                jwt:action.payload.content,
            };

        case AuthAction.user.set:
            return {
                ...state,
                user:action.payload.content,
            };

        case AuthAction.jwt.clear:
            return {
                ...state,
                jwt:AuthInitial.jwt,
            };

        case AuthAction.user.clear:
            return {
                ...state,
                user:AuthInitial.user,
            };

        case AuthAction.clear:
            return AuthInitial;
            
        default:
            return AuthInitial;
    }
};