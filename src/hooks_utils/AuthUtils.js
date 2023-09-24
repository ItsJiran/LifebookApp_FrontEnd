import axios from "axios";
import { useContext  } from "react";
import { AuthContext, AuthStatus, AuthAction, AuthInitial } from "../hooks/Authenticated";
import { useNotifierController } from "./NotifierUtils";

// =====================================================================
// ------------------------ CONTROLLER ---------------------------------
export function useAuthController(){
    const [state,dispatch] = useContext(AuthContext);

    const getStatus = () => {
        return state.status;
    }
    const setStatus = (payload) => {
        dispatch({
            type:AuthAction.SET_STATUS,
            payload:{
                content:payload,
            }
        })
    }

    const getJWT = () => {
        return state.jwt.token;
    }
    const setJWT = (payload) => {
        dispatch({
            type:AuthAction.SET_JWT,
            payload:{
                content:payload,
            }
        })
    }

    const getUser = () => {
        return state.user;
    }
    const setUser = (payload) => {
        dispatch({
            type:AuthAction.SET_USER,
            payload:{
                content:payload,
            }
        })
    }

    const clearAuth = (payload) => {
        dispatch({
            type:AuthAction.CLEAR,
        })
    }


    return {
        setStatus : setStatus,
        setJWT : setJWT,
        setUser : setUser,
        clearAuth : clearAuth,
        getStatus : getStatus,
        getJWT : getJWT,
        getUser : getUser,
    }

    //return [setStatus,setJWT,setUser,clearAuth, getStatus];
}

export function useAuthService(){

    const NotifierController = useNotifierController;
    const AuthController = useAuthController();

    const getAuthToken = () => {
    
        // check if auth token jwt is exist on the state if exist then return the current token
        const token = AuthController.getJWT();
        if(token !== undefined) return token;
        
        // check if lcoalstorage has token, if exist return
        var jwt_local = JSON.parse(window.localStorage.getItem('AUTH_JWT'));

        if(jwt_local == undefined || jwt_local == null) return undefined;
        if(jwt_local.token !== undefined) {
            AuthController.setJWT(jwt_local);
            return jwt_local.token;
        }
        
        return undefined;
    }

    // refresh token will return an oject that has status property and the api full data
    const refreshToken = async (token) => {
        const config = {
            method:'get',
            url: process.env.BACKEND_URL + 'api/refresh',
            headers: { 'Authorization': 'Bearer ' + token, Accept:"application/json" },
        }

        // use then catch and finally to be able forward the function
        let tmp_obj = {
            status:0,
            response:'',            
        }

        var api = await axios(config)
        .then((e)=>{
            AuthController.setJWT(e.data);
            window.localStorage.setItem('AUTH_JWT',JSON.stringify(e.data));
            tmp_obj.status = e.status;
            tmp_obj.response = e;
        })
        .catch((e)=>{
            tmp_obj.status = e.response.status;
            if(e.response.status == 401) window.localStorage.removeItem('AUTH_JWT');
            tmp_obj.response = e.response;
        })

        // that's mean the token valid and set the state to use the refreshed version
        return tmp_obj;
    }

    // check token will return a boolean if the api hit 200 status code else will valse
    const checkToken = async (token) => {
        const config = {
            method:'get',
            url: process.env.BACKEND_URL + 'api/me',
            headers: { 'Authorization': 'Bearer ' + token, Accept:"application/json" },
        }

        // updated token container obj
        let tmp_obj = {
            status:0,
            response:'',            
        }

        await axios(config)
        .then((e)=>{
            tmp_obj.status = e.status;
            tmp_obj.response = e;
        })
        .catch((e)=>{
            tmp_obj.status = e.response.status;
            tmp_obj.response = e.response;
        })

        return tmp_obj;
    }

    // will return boolean if the api was hit, if there's an error during the api call or maybe the api server error
    // will return the object axios, so other components can handle they own retry fetching,
    const isTokenAuthenticated = async () => {

        const token = getAuthToken();
        if(token == undefined) return false;

        var obj = await checkToken(token); 
        if(obj.status == 200) return true;
        
        if(obj.status == 401){
            var obj = await refreshToken(token);
            if(obj.status == 200) 
                return true;
            if(obj.status == 401) 
                return false;
            else {
                return obj;
            }
        }

        else {
            return obj;
        }
        
    };

    const authGateway = async () => {
        var result = await isTokenAuthenticated();

        if(result == true)  return AuthController.setStatus(AuthStatus.VALID);
        if(result == false) return AuthController.setStatus(AuthStatus.INVALID);
        if(result !== false && result !== true) {
            AuthController.setStatus(AuthStatus.INITIAL_ERROR);
            NotifierController.addNotification({
                type:'ERROR',
                title:'GAGAL AUTENTIKASI',
                message:result.response.data.message,
            })
        }
    }

    return {
        checkToken:checkToken,
        refreshToken:refreshToken,
        getAuthToken:getAuthToken,
        isTokenAuthenticated:isTokenAuthenticated,
        authGateway:authGateway
    };
}

