import React, { useEffect } from "react";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

import CircleDecoration from "../components/CircleDecoration";
import { Input, InputPassword } from "../components/inputs/Inputs";
import { Button } from "../components/buttons/Buttons";
import { Motions } from "../utils";

export default function LoginPage() {
  // ========================================================================================================
  // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
  // ========================================================================================================
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
      console.log('submit')

      window.sessionStorage.clear('inputsLogin');
      window.sessionStorage.clear('inputsRegister');
  }


  // ========================================================================================================
  // ---------------------------------------------- RENDER --------------------------------------------------
  // ========================================================================================================
  return (
    <motion.div className="container z-10 py-6 px-5 box-border relative mx-auto overflow-hidden min-h-screen bg-white w-full flex flex-col justify-center"
      initial={Motions['swipe-right'].out}
      animate={Motions['swipe-right'].in}
      exit={Motions['swipe-right'].out}
      transition={{ ease: [0.08, 0.65, 0.53, 0.96], duration: 0.5 }}
    >

      {/* Background */}
      <div className="absolute -z-1 h-full w-full top-0 left-0">
        <CircleDecoration className="absolute -bottom-16 -right-5" />
      </div>

      {/* Header */}
      <img src='/public/assets/svg/auth-ilus-1.svg' className='mx-auto mb-6 h-60' />
      <h1 className="font-bold font-sans text-2xl text-blue-400 mb-2">SIGN IN</h1>
      <p className="font-normal font-sans text-blue-dark-300 mb-8 text-sm mr-2">Masukkan data anda untuk masuk ke dalam aplikasi.</p>

      {/* Form */}
      <form onSubmit={handleSubmit(formSubmit)} action='/' method='POST' className="w-full h-fit mb-8">
        <Input formState={formState} register={regisrator.email} 
               className='mb-6' placeholder='Email' />
        <InputPassword  formState={formState} register={regisrator.password} 
                        className="mb-8" placeholder='Password'/>
        <Button className='w-52 mx-auto block' value='MASUK' type='submit' />
      </form>

      {/* Footer */}
      <p className="block mx-auto font-normal font-sans text-blue-dark-300 text-1sm mb-8">Belum punya akun ? <Link to='/register' className="text-blue-400">Register Sekarang</Link></p>

    </motion.div>
  );
}


