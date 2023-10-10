import React, {useContext} from "react";
import { ConfirmerContext, ConfirmerStatus } from "../hooks/Confirmer";
import { redirect, useNavigate } from "react-router-dom";
import { useAppService } from "./AppUtils";
import { useNotifierController } from "./NotifierUtils";

let resolveCallback;
export function useConfirmerController() {
    const [confirmState, dispatch] = useContext(ConfirmerContext);

    const confirmVerified = () => {
        closeConfirm();
        resolveCallback(true);
    };
    const confirmCancel = () => {
        closeConfirm();
        resolveCallback(false);
    };
    const confirm = payload => {
        dispatch({
            type: ConfirmerStatus.SHOW_CONFIRM,
            payload: {
                content:{...payload}
            }
        });
        return new Promise((res, rej) => {
            resolveCallback = res;
        });
    };
    const closeConfirm = () => {
        dispatch({
            type: ConfirmerStatus.HIDE_CONFIRM
        });
    };

    return {
        confirm:confirm,
        confirmCancel:confirmCancel,
        confirmVerified:confirmVerified,
        closeConfirm:closeConfirm,
        confirmState:confirmState,
    };
}

export function useNavigateService(){
    const notifier = useNotifierController();
    const navigate = useNavigate();
    const app = useAppService();

    const redirect = async (link)=>{
        return navigate(link,{replace:true});
    }
    const redirectConfirm = async (link,msg=undefined)=>{
        var result = await notifier.confirm(msg);
        if(result) navigate(link,{replace:true});
    }
    const redirectBasedApp = async (link,reset_state=true,msg=undefined, used_from_param=false)=>{
        // get if current app navigate status let the user to redirect
        let navigate_status = app.navigate.get.status();
        let canRedirect = false;

        let navigate_msg_app = app.navigate.get.message();
        if(navigate_msg_app !== undefined && !used_from_param) msg = navigate_msg_app;

        switch(navigate_status){
            case app.navigate.status().validate:
                canRedirect = await notifier.confirm(msg);
                break;
            case app.navigate.status().initial:
                canRedirect = true;
                break;
            default:
                canRedirect = false;  
                break;              
        }

        if(canRedirect && reset_state) app.navigate.reset();
        if(canRedirect) navigate(link,{replace:true});
    }   

    return {
        redirect : redirect,
        redirectConfirm:redirectConfirm,
        redirectBasedApp:redirectBasedApp
    }
}