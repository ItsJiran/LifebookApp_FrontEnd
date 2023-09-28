import axios from "axios";
import { useContext  } from "react";
import { set } from "react-hook-form";
import { AuthContext, AuthStatus, AuthAction, AuthInitial } from "../hooks/Authenticated";
import { useNotifierController } from "./NotifierUtils";
import { fetchApi } from "../utils/ApiUtils";

class ApiError{

    constructor(fetch){
        this.status = fetch.status;
        this.response = fetch.response;
    }

}

// =====================================================================
// ------------------------ CONTROLLER ---------------------------------
export function useAuthController(){
    const [state,dispatch] = useContext(AuthContext);

    const getStatus = () => {
        return state.status;
    }
    const setStatus = (payload) => {
        dispatch({
            type:AuthAction.status.set,
            payload:{
                content:payload,
            }
        })
    }
    const clearStatus = (payload) => {
        dispatch({
            type:AuthAction.status.clear,
        })
    }

    const getJWT = () => {
        return state.jwt;
    }
    const setJWT = (payload) => {
        dispatch({
            type:AuthAction.jwt.set,
            payload:{
                content:payload,
            }
        })
    }
    const clearJWT = (payload) => {
        dispatch({
            type:AuthAction.jwt.clear,
        })
    }

    const getUser = () => {
        return state.user;
    }
    const setUser = (payload) => {
        dispatch({
            type:AuthAction.user.set,
            payload:{
                content:payload,
            }
        })
    }
    const clearUser = (payload) => {
        dispatch({
            type:AuthAction.user.clear,
        })
    }

    const clear = (payload) => {
        dispatch({
            type:AuthAction.clear,
        })
    }

    return {
        setStatus : setStatus,
        setJWT : setJWT,
        setUser : setUser,
        clearJWT : clearJWT,
        clearUser : clearUser,
        clear : clear,
        getStatus : getStatus,
        getJWT : getJWT,
        getUser : getUser,
    }

    //return [setStatus,setJWT,setUser,clearAuth, getStatus];
}

export function useAuthService(){
    
    const NotifierController = useNotifierController();
    const AuthController = useAuthController();

    const getJWT = () => {
        // check if auth token jwt is exist on the state if exist then return the current token
        const jwt_state = AuthController.getJWT();
        const jwt_local = JSON.parse(window.localStorage.getItem('AUTH_JWT'));

        if(jwt_state !== jwt_local && jwt_local == undefined) return undefined;
        if(jwt_state !== undefined && jwt_state.token !== undefined) return jwt_state;
        
        if(jwt_local == undefined || jwt_local == null) return undefined;
        if(jwt_local.token !== undefined) {
            AuthController.setJWT(jwt_local);
            return jwt_local;
        }
        
        return undefined;
    }

    // NOTE : the goal is persisting between state and the local memory so if one is set with new value
    // the other one need to be set with the same value..
    // * jwt and user variable are object 
    const clear = ()=>{
        clearJWT();
        clearUser();
    }
    const clearJWT = () => {
        AuthController.clearJWT();
        window.localStorage.removeItem('AUTH_JWT');
    }
    const clearUser = () => {
        AuthController.clearUser();
        window.localStorage.removeItem('AUTH_USER');
    }
    const setJWT = (jwt) => {
        AuthController.setJWT(jwt);
        window.localStorage.setItem('AUTH_JWT',JSON.stringify(jwt));
    }
    const setUser = (user) => {
        AuthController.setUser(user);
        window.localStorage.setItem('AUTH_USER',JSON.stringify(user));
    }
    const setAuthStatus = (status, data) => {
        if(status == AuthStatus.INVALID){
            clearJWT();
            clearUser();   
            AuthController.setStatus(status);
        } 

        if(status == AuthStatus.VALID){
            checkAuthData(data,true);
            setJWT(data.jwt);
            setUser(data.user);   
            AuthController.setStatus(status);
        }

        if(status == AuthStatus.INITIAL){
            AuthController.setStatus(status)
        }

        if(status == AuthStatus.INITIAL_ERROR){
            AuthController.setStatus(status)
        }
    }

    const checkAuthData = (data, error=false) => {
        const jwt = data.jwt;
        const user = data.user;
        
        if(jwt.token == undefined || jwt.type == undefined || jwt.expires_in == undefined) {
            if(!error) return false;
            throw Error('JWT in AuthData Is Not Valid');
        }
        if(user.id == undefined || user.email == undefined || user.role == undefined) {
            if(!error) return false;
            throw Error('User in AuthData Is Not Valid');
        }

        return true;
    }

    // Fetch
    const fetchAuthApi = async (slug,method,token) => {
        const config = {
            method:method,
            url: process.env.BACKEND_URL + 'api/' + slug,
            headers: { 'Authorization': 'Bearer ' + token, Accept:"application/json" },
        }

        let fetch = {
            status:0,
            response:'',            
        }

        await axios(config)
        .then((e)=>{
            fetch.status = e.status;
            fetch.response = e;
        })
        .catch((e)=>{
            fetch.status = e.response.status;
            fetch.response = e.response;
        })

        return fetch;
    }

    // Will return obj and validate if the response obj contain id, email, and role
    const fetchDataUser = async (token, throwError=false)=>{
        const fetch = await fetchAuthApi('me','get',token);
        const response = fetch.response;
        
        const isDataValid = response.data.id !== undefined &&
                            response.data.email !== undefined && 
                            response.data.email !== undefined; 

        if(fetch.status == 401) return fetch;
        if(fetch.status == 200 && isDataValid) return fetch;

        if(throwError) throw new ApiError(fetch);
        else           return new ApiError(fetch);
    }
    // Will return true or false else than that then will be recognize as error
    const isTokenAuthenticated = async (token, throwError=false) => {
        const fetch = await fetchAuthApi('me','get',token);

        if(fetch.status == 200) return true;
        if(fetch.status == 401) return false;

        if(throwError) throw new ApiError(fetch);
        else           return new ApiError(fetch);
    }

    // refresh token will return an oject that has status property and the api full data else than that then will be recognize as error
    const refreshJWT = async (token,throwError=false) => {
        const fetch = await fetchAuthApi('refresh','get',token);

        if(fetch.status == 200) return fetch;
        
        if(throwError) throw new ApiError(fetch);
        else           return new ApiError(fetch);
    }

    // When the app is first open this function will be called to 
    const authGatewayLogin = async (credentials,returnError=false)=>{
        try{
            const fetchConfig = {
                method:'post',
                slug:'login',
                data:credentials,
                headers:{
                  "Content-Type": "multipart/form-data",
                }
            }

            const fetch = await fetchApi(fetchConfig);
            const data = fetch.response.data;

            if(fetch.status == 200){
                setAuthStatus(AuthStatus.VALID, data);
                NotifierController.addNotification({
                    title:'Berhasil',
                    message:'Berhasil Login..',
                    type:'Success',
                });
                return fetch;
            } else {
                throw new ApiError(fetch);
            }

        } catch(e) {
            
            let notifier = {
                title:'Gagal',
                message:'Terjadi gangguan..',
                type:'Error',
            }

            if(e instanceof ApiError){
                if(e.status >= 500 && e.status <= 511){
                    setAuthStatus(AuthStatus.INVALID);
                    notifier.message = 'Terjadi masalah pada server'
                }

                else if(e.status == 408){
                    setAuthStatus(AuthStatus.INITIAL_ERROR);
                    notifier.message = 'Terjadi masalah pada jaringan anda..'
                }

                else if(e.status == 401){
                    setAuthStatus(AuthStatus.INVALID);
                    notifier.message = 'Email atau password yang anda masukkan salah..'
                }

                else if(e.status >= 400 && e.status <= 404){
                    setAuthStatus(AuthStatus.INVALID);
                    notifier.message = 'Email atau password yang anda masukkan salah..'
                }

                else { 
                    setAuthStatus(AuthStatus.INVALID);
                    notifier.message = e.response.message;
                }
            }

            NotifierController.addNotification(notifier);

            if(returnError) return e;
            else            return console.error(e);
        }
    }
    const authGatewayRegister = async (credentials,returnError=false)=>{
        try{
            const fetchConfig = {
                method:'post',
                slug:'register',
                data:credentials,
                headers:{
                  "Content-Type": "multipart/form-data",
                }
            }

            const fetch = await fetchApi(fetchConfig);
            const data = fetch.response.data;

            if(fetch.status == 200){
                setAuthStatus(AuthStatus.VALID, data);
                NotifierController.addNotification({
                    title:'Berhasil',
                    message:'Berhasil Login..',
                    type:'Success',
                });
                return fetch;
            } else {
                throw new ApiError(fetch);
            }
        } catch(e) {
            let notifier = {
                title:'Gagal',
                message:'Terjadi gangguan..',
                type:'Error',
            }

            if(e instanceof ApiError){
                if(e.status >= 500 && e.status <= 511){
                    setAuthStatus(AuthStatus.INVALID);
                    notifier.message = 'Terjadi masalah pada server'
                }

                else if(e.status == 408){
                    setAuthStatus(AuthStatus.INITIAL_ERROR);
                    notifier.message = 'Terjadi masalah pada jaringan anda..'
                }

                else if(e.status == 401){
                    setAuthStatus(AuthStatus.INVALID);
                    notifier.message = 'Email atau password yang anda masukkan salah..'
                }

                else if(e.status >= 400 && e.status <= 404){
                    setAuthStatus(AuthStatus.INVALID);
                    notifier.message = 'Email atau password yang anda masukkan salah..'
                }

                else if(e.status == 422){
                    setAuthStatus(AuthStatus.INVALID);
                    notifier.message = e.response.data.message;
                }

                else {
                    setAuthStatus(AuthStatus.INVALID);
                    notifier.message = e.response.data.message;
                }
            }

            NotifierController.addNotification(notifier);

            if(returnError) return e;
            else            return console.error(e);
        }
    }
    const authGateway = async (returnError=false) => {
        try{
            let jwt = getJWT();
            if(jwt == undefined) return setAuthStatus(AuthStatus.INVALID);

            let isValid = await isTokenAuthenticated(jwt.token,true);
            if(!isValid) {
                const fetchRefresh = await refreshJWT(jwt.token);
                if(fetchRefresh.status == 200) jwt = fetchRefresh.response.data;
                else if(fetchRefresh.status == 401) return setAuthStatus(AuthStatus.INVALID);
                else                                throw fetchRefresh;
            }

            const fetchUser = await fetchDataUser(jwt.token,true);
            const dataUser = fetchUser.response.data;

            const authData = {
                jwt:jwt,
                user:dataUser,
            }

            if(fetchUser.status >= 200 && fetchUser.status <= 204) {
                return setAuthStatus(AuthStatus.VALID, authData);
            } else {
                return setAuthStatus(AuthStatus.INVALID);
            }
        } catch (e){
            let notifier = {
                title:'Gagal',
                message:'Terjadi gangguan..',
                type:'Error',
            }

            if(e instanceof ApiError){
                if(e.status >= 500 && e.status <= 511){
                    setAuthStatus(AuthStatus.INVALID);
                    notifier.message = 'Terjadi masalah pada server..'
                }

                if(e.status == 408){
                    setAuthStatus(AuthStatus.INITIAL_ERROR);
                    notifier.message = 'Terjadi masalah pada jaringan anda..'
                }

                if(e.status >= 400 && e.status <= 404){
                    setAuthStatus(AuthStatus.INVALID);
                }
            }

            NotifierController.addNotification(notifier);
            setAuthStatus(AuthStatus.INVALID);

            if(returnError) return e;
            else            return console.error(e);
        }
    }

    return {
        authGateway:authGateway,
        authGatewayLogin:authGatewayLogin,
        authGatewayRegister:authGatewayRegister,
        fetchDataUser:fetchDataUser,
        fetchAuthApi:fetchAuthApi,
        refreshJWT:refreshJWT,
        isTokenAuthenticated:isTokenAuthenticated,
        setJWT:setJWT,
        setUser:setUser,
        clearJWT:clearJWT,
        clearUser:clearUser,
        clear:clear,
        getJWT:getJWT,
    }
}
