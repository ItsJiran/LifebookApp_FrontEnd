import React, { createContext, useContext } from "react";

export const ChoicerContext = createContext();
export const ChoicerInitial = {
    show:false,
    elm : [],
};
export const Choicer = {
    visible:{
        hide:'hide',
        show:'show',
    },
    elm:{
        add:'elm_add',
        reset:'elm_reset',
    }
}

export const ChoicerReducer = (state = ChoicerInitial, action) => {
    switch (action.type) {
        case Choicer.visible.show:
            return {
                show: true,
                elm: action.payload.content,
            };
        case Choicer.visible.hide:
            return ChoicerInitial;
        default:
            return ChoicerInitial;
    }
};
