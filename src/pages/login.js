import axios, { AxiosError } from "axios";
import React, { useContext, useReducer } from "react";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, redirect } from "react-router-dom";
import { useForm } from "react-hook-form";

import { LayerMain } from "../components/Layers";
import { Input, InputPassword } from "../components/ui/Inputs";
import { Button } from "../components/ui/Buttons";
import { AnimateMotions, TimingMotions } from "../utils";

import { Loading } from "../components/Components";
import { AuthStatus } from "../hooks/Authenticated";

import { useAuthController, useAuthService } from "../hooks_utils/AuthUtils";
import { useNotifierController } from "../hooks_utils/NotifierUtils";
import { useApiService } from "../hooks_utils/ApiUtils";

export default function LoginPage() {
  // ========================================================================================================
  // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
  // ========================================================================================================

  const [action, setAction] = React.useState(false);

  const NotifierController = useNotifierController();
  const AuthController = useAuthController();
  const AuthService = useAuthService();
  const ApiService = useApiService();

  const validator = yup.object().shape({
    email: yup.string().email('Email is not valid').required(),
    password: yup.string().min(6, 'The minimum length is 6..').required(),
  });
  const { register, watch, formState, handleSubmit, setValue, getValues } = useForm({
    resolver: yupResolver(validator),
    mode: 'onBlur' && 'onChange',
    delayError: 300,
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const regisrator = {
    email: register('email', validator.email),
    password: register('password', validator.password),
  }

  // ========================================================================================================
  // ------------------------------------------- REACT EFFECT -----------------------------------------------
  // ========================================================================================================
  React.useEffect(() => {
    var storage = JSON.parse(window.sessionStorage.getItem('inputsLogin'));
    for (let key in storage) setValue(key, storage[key]);
  }, []);
  React.useEffect(() => {
    watch((data) => {
      window.sessionStorage.setItem('inputsLogin', JSON.stringify(watch(data)));
    });
  }, [watch]);

  // ========================================================================================================
  // -------------------------------------------- FUNCTIONS -------------------------------------------------
  // ========================================================================================================
  function toggleAction(action) {
    setAction(action);
    NotifierController.toggleLoading(action);
  }
  async function formSubmit(credentials) {
    // PREVENT MULTIPLE FORM SUBMIT
    if (!action) toggleAction(true);
    else return console.error('Login Form Already Submitted !!');

    // Use Try And Catch So If There's an Error on the App Can Still Be Run
    try{
      const fetch = await ApiService.fetchApi({
        slug:'login',
        method:'post',
        data:credentials,
        headers:{
          'Content-Type':'multipart/form-data',
      }});

      // Generate Notification Title And Message
      var title = ApiService.generateApiTitle(fetch);
      var msg = ApiService.generateApiMessage(fetch,(e)=>{
        if(e.status == 401) return 'Email atau password yang anda masukkan salah..';
      });

      // ---  Handle Success
      if(fetch.status == 200){
        // from the backend will return fetch.response.data = {user:etc,jwt:etc};
        AuthService.setAuthStatus(AuthStatus.VALID, fetch.response.data)
        NotifierController.addNotification({
          title:title,
          message:msg,
          type:'Success',
        })

        // removing cache
        window.sessionStorage.removeItem('inputsLogin');
        window.sessionStorage.removeItem('inputsRegister');
      }

      // --- Handle Client Request Failed
      else if (fetch.status !== 200 || fetch instanceof AxiosError){
        if(fetch instanceof AxiosError) console.error(fetch);

        NotifierController.addNotification({
          title:title,
          message:msg,
          type:'Error',
        });
      }

    } catch(e) {
      if(e instanceof Error || ApiService.isReturnError(e)){
          console.error('ERROR_INSTANCE',e);
          if(e.isNotifier){
              NotifierController.addNotification({
                  title:e.title ? e.title : 'Terjadi Kesalahan Sistem',
                  message:e.message ? e.message : 'Terjadi kesalahan pada sistem yang sedang berjalan..',
                  type:'Error',
              })                    
          }
      } else {
          console.error(e);
      }
    }

    toggleAction(false);
  }

  // ========================================================================================================
  // ---------------------------------------------- RENDER --------------------------------------------------
  // ========================================================================================================
  return (
    <LayerMain animate={{ ...AnimateMotions['swipe-left-fade-in'], ...TimingMotions['ease-0.5'] }} className="py-6 px-5">
      {/* Header */}
      <img src='/public/assets/svg/auth-ilus-1.svg' className='mx-auto mb-6 h-60' />
      <h1 className="font-bold font-sans text-2xl text-blue-400 mb-2">SIGN IN</h1>
      <p className="font-normal font-sans text-blue-dark-300 mb-8 text-sm mr-2">Masukkan data anda untuk masuk ke dalam aplikasi.</p>

      {/* Form */}
      <form onSubmit={handleSubmit(formSubmit)} action='/' method='POST' className="w-full h-fit mb-8">
        <Input formState={formState} register={regisrator.email} className='mb-6' placeholder='Email' />
        <InputPassword formState={formState} register={regisrator.password} className="mb-8" placeholder='Password' />
        <Button className='w-52 py-2 text-lg mx-auto block' type='submit' variant={action ? 'blue-pressed' : 'blue'} >
          {action ? <Loading className="h-6 w-6 filter-black-100 mx-auto" /> : <p className="cursor-pointer">MASUK</p>}
        </Button>
      </form>

      {/* Footer */}
      <p className="block text-center font-normal font-sans text-blue-dark-300 text-sm mb-8">Belum punya akun ? <Link to='/register' className="text-blue-400">Register Sekarang</Link></p>
    </LayerMain>
  );
}


