import React, { createContext, useContext, useReducer} from "react";
import { NotifierContext, NotifierAction } from "../hooks/Notifier";

export function useNotifierController(){
  const [notifier,notifierDispatch] = useContext(NotifierContext);

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
  };
}