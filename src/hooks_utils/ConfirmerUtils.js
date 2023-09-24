import React, {useContext} from "react";
import { ConfirmerContext, ConfirmerStatus } from "../hooks/Confirmer";

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
                ...payload
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
