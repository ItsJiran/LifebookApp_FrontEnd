import React, { createContext, useContext } from "react";

export const ConfirmerContext = createContext();
export const ConfirmerInitial = {
    show:false,
    content:{
        title:'',
        message:'',
    }
};
export const ConfirmerStatus = {
    SHOW_CONFIRM:'SHOW_CONFIRM',
    HIDE_CONFIRM:'HIDE_CONFIRM',
}

export const SHOW_CONFIRM = 'SHOW_CONFIRM';
export const HIDE_CONFIRM = 'HIDE_CONFIRM';

export const ConfirmerReducer = (state = ConfirmerInitial, action) => {
    switch (action.type) {
        case SHOW_CONFIRM:
            return {
                show: true,
                content: action.payload.content,
            };
        case HIDE_CONFIRM:
            return ConfirmerInitial;
        default:
            return ConfirmerInitial;
    }
};
