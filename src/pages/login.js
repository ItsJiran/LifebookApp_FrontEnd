import React, { useEffect } from "react";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";

import { CircleDecoration, Loading, Notification } from "../components/Decoration";
import { Input, InputPassword } from "../components/inputs/Inputs";
import { Button } from "../components/buttons/Buttons";
import { Motions } from "../utils";

export default function LoginPage() {
  // ========================================================================================================
  // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
  // ========================================================================================================
  const BACKEND = process.env.BACKEND_URL;
  const [action,setAction] = React.useState(false);
  const [notification,setNotification] = React.useState([
    {
      'title':'Test',
      'message':'Test',
      'type':'success',
    }
  ]);

  const validator = yup.object().shape({
    email:yup.string().email('Email is not valid').required(),
    password:yup.string().min(6,'The minimum length is 6..').required(),
  });
  const { register, watch, formState, handleSubmit, setValue, getValues } = useForm({
      resolver:yupResolver(validator),
      mode:'onBlur' && 'onChange',
      delayError:300,
      defaultValues:{
          email:'',
          password:'',
      },
  });
  const regisrator = {
      email      : register('email',validator.email),
      password   : register('password',validator.password),
  }

  // ========================================================================================================
  // ------------------------------------------- REACT EFFECT -----------------------------------------------
  // ========================================================================================================
  React.useEffect(() => {
    var storage = JSON.parse(window.sessionStorage.getItem('inputsLogin'));
    for(let key in storage) setValue(key, storage[key]);
  }, []);
  React.useEffect(() => {
    watch((data)=>{
        window.sessionStorage.setItem('inputsLogin', JSON.stringify(watch(data)));
    });
  },[watch]);

  // ========================================================================================================
  // -------------------------------------------- FUNCTIONS -------------------------------------------------
  // ========================================================================================================
  function formSubmit(e) {
      // PREVENT MULTIPLE FORM SUBMIT
      if(!action) setAction(true);
      else        return console.error('Login Form Already Submitted !!');

      setTimeout(()=>{setAction(false)},1000);
      setNotification([...notification,{
        'title':'Test',
        'message':'Test',
        'type':'success',
      }])

      // window.sessionStorage.clear('inputsLogin');
      // window.sessionStorage.clear('inputsRegister');
  }

  // ========================================================================================================
  // ---------------------------------------------- RENDER --------------------------------------------------
  // ========================================================================================================
  return (
    <motion.div className="container box-border relative min-h-screen bg-white overflow-hidden w-full flex flex-col justify-center"
      initial={Motions['swipe-right'].out}
      animate={Motions['swipe-right'].in}
      exit={Motions['swipe-right'].out}
      transition={{ ease: [0.08, 0.65, 0.53, 0.96], duration: 0.5 }}
    >

      {/* Notification And Loading */}
      <div className='absolute h-full w-full'>
        <div className="sticky z-50 top-0">
          <AnimatePresence mode='sync'>
              {/* LOADING */}
              { action ? <Loading variantAnimate="swipe-top" className="w-full top-2 absolute" key='loading'/> : '' }
              {/* NOTIFICATION */}
              { notification.length > 0 ? notification.map((item,index)=>{
                return <Notification key={`notification-${index}`} className='mb-2 sticky top-0 w-32' index={index} {...item}/>;
              }) : '' } 
          </AnimatePresence>
        </div>
      </div>

      {/* Background */}
      <CircleDecoration className="h-32 w-32 absolute -bottom-16 -right-5" />

      <div className="w-full h-full relative py-6 px-5">
        {/* Header */}
        <img src='/public/assets/svg/auth-ilus-1.svg' className='mx-auto mb-6 h-60' />
        <h1 className="font-bold font-sans text-2xl text-blue-400 mb-2">SIGN IN</h1>
        <p className="font-normal font-sans text-blue-dark-300 mb-8 text-sm mr-2">Masukkan data anda untuk masuk ke dalam aplikasi.</p>

        {/* Form */}
        <form onSubmit={handleSubmit(formSubmit)} action='/' method='POST' className="w-full h-fit mb-8">
          <Input formState={formState} register={regisrator.email} className='mb-6' placeholder='Email' />
          <InputPassword  formState={formState} register={regisrator.password} className="mb-8" placeholder='Password'/>
          <Button className='w-52 mx-auto block' value='MASUK' type='submit' />
        </form>

        {/* Footer */}
        <p className="block text-center font-normal font-sans text-blue-dark-300 text-1sm mb-8">Belum punya akun ? <Link to='/register' className="text-blue-400">Register Sekarang</Link></p>
      </div>

    </motion.div>
  );
}


