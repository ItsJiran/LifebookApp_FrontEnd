import React, { createContext, useContext, useReducer} from "react";
import { NotifierContext, NotifierAction } from "../hooks/Notifier";
import { useConfirmerController } from "./NavigateUtils";

export function useNotifierController(){
  const [notifier,notifierDispatch] = useContext(NotifierContext);
  const controller = useConfirmerController();

  const confirm = async (obj=undefined)=>{
    var msg = {};
    if(obj == undefined) msg = { title:'Konfirmasi', message:'Apakah anda yakin ingin melakukan tindakan ini?' };
    else                 msg = obj;
    return await controller.confirm(msg);
}

  const toggleLoading = (payload)=>{
    notifierDispatch({
      type:NotifierAction.TOGGLE_LOADING,
      payload:{
        content:payload,
      },
    })    
  }

  const addNotification = (payload)=>{
    notifierDispatch({
      type:NotifierAction.ADD_NOTIFICATION,
      payload:{
        content:{...payload}
      },
    })
  }

  const removeNotification = (payload)=>{
    notifierDispatch({
      type:NotifierAction.REMOVE_NOTIFICATION,
      payload:payload,
    })
  }

  return {
    addNotification:addNotification,
    removeNotification:removeNotification,
    toggleLoading:toggleLoading,
    confirm:confirm
  };
}