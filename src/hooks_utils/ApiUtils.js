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

        // If custom exist
        if ( custom_title !== undefined ) return custom_title;
        if(fetch.status){
            // Specific Api Title
            if(fetch.status == 200) return 'Sukses';
            if(fetch.status == 401) return 'Unauthorized';
            // General Api Title
            if (fetch.status >= 100 && fetch.status < 200) return 'Informational';
            if (fetch.status >= 200 && fetch.status < 300) return 'Sukses';
            if (fetch.status >= 300 && fetch.status < 400) return 'Redirection';
            if (fetch.status >= 400 && fetch.status < 500) return 'Request Failed';
            if (fetch.status >= 500 && fetch.status < 600) return 'Server Error';
        }

        if (fetch.code !== undefined){
            if(fetch.code == 'ERR_NETWORK') return 'Jaringan Gagal';
        }
        // General Api Error
        if(fetch.response !== undefined){
            if(fetch.response.error) return fetch.response.error;
        }
        
        if(fetch instanceof AxiosError) return 'Axios Error';
        else                                 return 'Request Error'; 
    }
    const generateApiTitleByResponse = (fetch)=>{
        var title = 'Error';        
        
        if (fetch.code){
            if(fetch.code == 'ERR_NETWORK') title = 'Jaringan Gagal';
        }
        // General Api Error
        else if(fetch.response){
            if(fetch.response.error) title = fetch.response.error;
        }
        else if(fetch instanceof AxiosError) title = 'Axios Error';
        else                                 title = 'Request Failed';  
               
        return title;
    }
    const generateApiMessageByResponse = (fetch)=>{
        var msg = 'Terjadi Kesalahan';        
        if (fetch.code){
            if(fetch.code == 'ERR_NETWORK') msg = 'Terjadi Kesalahan Pada Jaringan Anda..';
        }
        // General Api Error
        else if (fetch.response){
            if(fetch.response.message)    msg = fetch.response.message;
            else if(fetch.response.error) msg = fetch.response.error;                
        }
        else if(fetch instanceof AxiosError) msg = fetch.message;
        else                                 msg = 'Terjadi Kesalahan pada request';  

        return msg;
    }
    const generateApiMessage = (fetch,custom=()=>{return undefined})=>{
        var custom_msg = custom(fetch);
        
        // If custom exist
        if ( custom_msg !== undefined ) return custom_msg;

        // If By Status
        if(fetch.status){
            // Specific Api Message
            if(fetch.status == 200) return 'Request berhasil dilakukan..';
            if(fetch.status == 401) return 'Request akses yang anda lakukan tidak sah..';
            if(fetch.status == 408) return 'Terjadi masalah pada jaringan anda..';
            if(fetch.status == 422) return fetch.response.data.message;
            // General Api Message
            if (fetch.status >= 100 && fetch.status < 200) return 'Informational response.....';
            if (fetch.status >= 200 && fetch.status < 300) return 'Request berhasil dilakukan...';
            if (fetch.status >= 300 && fetch.status < 400) return 'Request yang anda lakukan tidak valid...';
            if (fetch.status >= 400 && fetch.status < 500) return 'Request yang anda lakukan tidak valid...';
            if (fetch.status >= 500 && fetch.status < 600) return 'Terjadi masalah pada server...';
        }

        // Specific Api Error 
        if (fetch.code !== undefined){
            if(fetch.code == 'ERR_NETWORK') return 'Terjadi Kesalahan Pada Jaringan Anda..';
        }

        // General Api Error
        if (fetch.response !== undefined){
            if(fetch.response.message)           return fetch.response.message;
            else if(fetch.response.error)        return fetch.response.error;   
            else if(fetch.response.data.message) return fetch.response.data.message;
            else if(fetch.response.data.error)   return fetch.response.data.error;                
        }

        if(fetch instanceof AxiosError) return fetch.message;
        else                            return 'Terjadi kesalahan..';  
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
        generateApiMessageByResponse:generateApiMessageByResponse,
        generateApiTitleByResponse:generateApiTitleByResponse,
        generateApiMessage:generateApiMessage,
        generateApiTitle:generateApiTitle,
        isAxiosError:isAxiosError,
        isApiError:isApiError,
        isReturnError:isReturnError,
    }
}

