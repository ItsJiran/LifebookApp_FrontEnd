import React from "react";
import axios from "axios";

export const fetchApi = async (obj,throwError = false) => {

    const isParameterValid = obj.slug !== undefined && 
                             obj.method !== undefined;

    if(!isParameterValid && throwError) throw Error('fetchApi config parameter not valid');
    else if(!isParameterValid) return Error('fetchApi config parameter not valid');

    const config = {
        method:obj.method,
        url: process.env.BACKEND_URL + 'api/' + obj.slug,
        headers:{Accept:"application/json"}
    }

    if(obj.data !== undefined) config.data = obj.data;
    if(obj.token !== undefined) config.headers.Authorization = 'Bearer ' + token;
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
        fetch.status = e.response.status;
        fetch.response = e.response;
    })

    return fetch;
}