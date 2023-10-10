import React, { createContext, useContext, useReducer} from "react";

export const NotifierContext = createContext(null);
export const NotifierInitial = {
  loading:false,
  notification:[],
};
export const NotifierAction = {
  TOGGLE_LOADING:'TOGGLE_LOADING',
  ADD_NOTIFICATION : 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION : 'REMOVE_NOTIFICATION',
  REMOVE_ALL_NOTIFICATION : 'REMOVE_ALL_NOTIFICATION',
  ADD : 'ADD',
  REMOVE : 'REMOVE',
  CLEAR : 'CLEAR',
}

// NOTIFICATION CONTENT {
//   'message','title','type'
// }

export const NotifierReducer = (state, action) => {
  switch (action.type) {
    case NotifierAction.TOGGLE_LOADING:
      return {
        ...state,
        loading:action.payload.content      
      }
      
    case NotifierAction.ADD_NOTIFICATION:
      return {
        ...state,
        notification:[...state['notification'], {
          id: Math.floor(Date.now() + Math.random()),
          content: action.payload.content,
        }]
      };

    case NotifierAction.REMOVE_NOTIFICATION:
      return {
        ...state,
        notification:state['notification'].filter(t => t.id !== action.payload.id)
      };

    case NotifierAction.REMOVE_ALL_NOTIFICATION:
      return {...state,notification:[]};

    case NotifierAction.CLEAR:
      return NotifierInitial;

    default:
      return state;
  }
};
