import React from "react";
import axios, { Axios, AxiosError } from "axios";
import { useAuthService } from "./AuthUtils";
import { useNotifierController } from "./NotifierUtils";
import { AuthStatus } from "../hooks/Authenticated";

class BasicError extends Error{
    constructor(obj={}){
        super();
        this.title = obj.title ? obj.title : 'Terjadi Kesalahan';
        this.message = obj.message ? obj.message : 'Terjadi pada sistem yang sedang berjalan';
        this.isNotifier = obj.isNotifier ? obj.isNotifier : false;
        this.error = obj.error ? obj.error : undefined;
    }
}
class ApiError extends BasicError{
    // -- inherenticane
}

// this function will wrap to detect if the fetch api failed caused by token expired
// then it will call refresh token and recalling the fetch api
export const useApiService = ()=>{

    const AuthService = useAuthService();
    const NotifierController = useNotifierController(); 

    // The purpose of this method so i don't need to import AxiosError in other files..
    const isReturnError = (fetch) => {
        if(isApiError(fetch))        return true;
        else if(isAxiosError(fetch)) return true;
        else return false;
    }
    const isAxiosError = (fetch)=>{
        return fetch instanceof AxiosError;
    }
    const isApiError = (fetch)=>{
        return fetch instanceof ApiError;
    }

    // Generate Api Error And Title For Notifier
    const generateApiTitle = (fetch,custom=()=>{return undefined})=>{
        var custom_title = custom(fetch);
        var title = '';

        // If custom exist
        if ( custom_title !== undefined ) return custom_title;
        // Specific Api Title
        else if(fetch.status == 200) title = 'Sukses';
        else if(fetch.status == 401) title = 'Unauthorized';
        // General Api Title
        else if (fetch.status >= 100 && fetch.status < 200) title = 'Informational';
        else if (fetch.status >= 200 && fetch.status < 300) title = 'Sukses';
        else if (fetch.status >= 300 && fetch.status < 400) title = 'Redirection';
        else if (fetch.status >= 400 && fetch.status < 500) title = 'Client Error';
        else if (fetch.status >= 500 && fetch.status < 600) title = 'Server Error';
        else if (fetch.code){
            if(fetch.code == 'ERR_NETWORK') title = 'Jaringan Gagal';
        }
        // General Api Error
        else if(fetch.response){
            if(fetch.response.error) title = fetch.response.error;
        }
        else if(fetch instanceof AxiosError) title = 'Axios Error';
        else                                 title = '';  

        return title;       
    }
    const generateApiMessage = (fetch,custom=()=>{return undefined})=>{
        var custom_msg = custom(fetch);
        var msg = '';

        // If custom exist
        if ( custom_msg !== undefined ) return custom_msg;
        // Specific Api Message
        else if(fetch.status == 200) msg = 'Request berhasil dilakukan..';
        else if(fetch.status == 401) msg = 'Request akses yang anda lakukan tidak sah..';
        else if(fetch.status == 408) msg = 'Terjadi masalah pada jaringan anda..';
        else if(fetch.status == 422) msg = fetch.response.data.message;
        // General Api Message
        else if (fetch.status >= 100 && fetch.status < 200) msg = 'Informational response.....';
        else if (fetch.status >= 200 && fetch.status < 300) msg = 'Request berhasil dilakukan...';
        else if (fetch.status >= 300 && fetch.status < 400) msg = 'Request yang anda lakukan tidak valid...';
        else if (fetch.status >= 400 && fetch.status < 500) msg = 'Request yang anda lakukan tidak valid...';
        else if (fetch.status >= 500 && fetch.status < 600) msg = 'Terjadi masalah pada server...';
        // Specific Api Error 
        else if (fetch.code){
            if(fetch.code == 'ERR_NETWORK') msg = 'Terjadi Kesalahan Pada Jaringan Anda..';
        }
        // General Api Error
        else if (fetch.response){
            if(fetch.response.message)    msg = fetch.response.message;
            else if(fetch.response.error) msg = fetch.response.error;                
        }
        else if(fetch instanceof AxiosError) msg = fetch.message;
        else                                 msg = '';  

        return msg;
    }

    const fetch = async (obj={})=>{
        if(obj.url == undefined) return Error('fetchApi config parameter not valid');

        const config = {
            ...obj,
            method:obj.method ? obj.method : 'get',
            url: obj.url,
        }

        if(obj.data !== undefined)    config.data = obj.data;
        if(obj.token !== undefined)   config.headers.Authorization = 'Bearer ' + obj.token;
        if(obj.headers !== undefined) config.headers = {...config.headers,...obj.headers};

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

            if(e instanceof AxiosError){
                
                if(e.code == 'ERR_BAD_REQUEST') {
                    fetch.status = e.response.status;
                    fetch.response = e.response;
                } else {
                    fetch = e;
                };

            } else {
                fetch = e;
            }
            
        })

        return fetch;
    }

    const fetchApi = async (obj={})=>{
        if(obj.slug == undefined) return Error('fetchApi config parameter not valid');

        const config = {
            method:obj.method,
            url: process.env.BACKEND_URL + 'api/' + obj.slug,
            ...obj,
            headers:{Accept:"application/json"},
        }

        if(obj.method == undefined)   config.method = 'get';
        if(obj.data !== undefined)    config.data = obj.data;
        if(obj.token !== undefined)   config.headers.Authorization = 'Bearer ' + obj.token;
        if(obj.headers !== undefined) config.headers = {...config.headers,...obj.headers};
        
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

            if(e instanceof AxiosError){
                
                if(e.code == 'ERR_BAD_REQUEST') {
                    fetch.status = e.response.status;
                    fetch.response = e.response;
                } else {
                    fetch = e;
                };

            } else {
                fetch = e;
            }
            
        })

        return fetch;
    }

    // This method will automate refresh token if the current token is expired and will automate log out the user
    // if after refresh the token still invalid.
    const fetchAuth = async (obj)=>{

        // Getting the jwt token
        if(obj.token == undefined){
            var jwt = AuthService.getJWT();
            if(jwt) {
                obj.token = jwt.token;
            } else {
                AuthService.clear();
                AuthService.setAuthStatus(AuthStatus.INVALID);                
                throw new ApiError({message:'Sistem tidak mendetksi autentikasi'});
            }
        }

        // fetch api 
        var fetch = await fetchApi(obj);

        // -- Handling Success
        if(fetch.status == 200){
            return fetch;
        }

        // -- Handling Unauthorized
        else if(fetch.status == 401){

            // Getting new jwt
            var fetchRefresh = await AuthService.refreshJWT(obj.token);

            // !! Handling Success
            if(fetchRefresh.status == 200) {
                AuthService.setJWT(fetchRefresh.response.data);
                obj.token = AuthService.getJWT().token;
                return await fetchApi(obj);
            }

            // !! Handling Failed Expired / Blacklisted
            else if(fetchRefresh.status == 401){
                throw new ApiError({
                    message:'Terjadi kesalahan dengan autentikasi anda, \n anda dapat melakukan login ulang di halaman lain untuk melanjutkan aksi..',
                    isNotifier:true,
                    error:fetchRefresh,
                });
            }

            // !! Handling Request Error
            else {
                return fetchRefresh;
            }
        }

        // -- Handling Etc
        else {
            return fetch;
        }

    }

    return {
        fetch:fetch,
        fetchAuth : fetchAuth,
        fetchApi : fetchApi,
        generateApiMessage:generateApiMessage,
        generateApiTitle:generateApiTitle,
        isAxiosError:isAxiosError,
        isApiError:isApiError,
        isReturnError:isReturnError,
    }
}

