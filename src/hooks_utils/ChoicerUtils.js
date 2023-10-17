
import React, { useContext } from "react";
import { Choicer, ChoicerContext } from "../hooks/Choicer";


let resolveCallback;
export function useChoicerController() {
    const [state, dispatch] = useContext(ChoicerContext);

    const choicer = {
        
        state: state,

        action : (action) => {
            choicer.hide();
            resolveCallback(action);
        },

        show : payload => {
            dispatch({
                type:Choicer.visible.show,
                payload:{ content:payload },
            })
            return new Promise((res,rej)=>{
                resolveCallback = res;
            });
        },

        showCustom : payload => {
            dispatch({
                type:Choicer.visible.show_custom,
                payload:{ content:payload },
            })
            return new Promise((res,rej)=>{
                resolveCallback = res;
            });
        },

        hide : ()=>{
            dispatch({
                type:Choicer.visible.hide
            })
        }

    }

    // const confirmVerified = () => {
    //     closeConfirm();
    //     resolveCallback(true);
    // };
    // const confirmCancel = () => {
    //     closeConfirm();
    //     resolveCallback(false);
    // };
    // const confirm = payload => {
    //     dispatch({
    //         type: ConfirmerStatus.SHOW_CONFIRM,
    //         payload: {
    //             content:{...payload}
    //         }
    //     });
    //     return new Promise((res, rej) => {
    //         resolveCallback = res;
    //     });
    // };
    // const closeConfirm = () => {
    //     dispatch({
    //         type: ConfirmerStatus.HIDE_CONFIRM
    //     });
    // };

    return choicer;
}
