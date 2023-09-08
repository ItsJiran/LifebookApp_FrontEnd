import React, { useEffect } from "react";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

import { CircleDecoration } from "../components/Decoration";
import { Input, InputPassword } from "../components/inputs/Inputs";
import { Button } from "../components/buttons/Buttons";
import { Motions, Iconsax, Animate } from "../utils";

export default function RegisterPage() {
    // ========================================================================================================
    // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
    // ========================================================================================================
    const validator = yup.object().shape({
        username:yup.string().min(6,'The minimum length is 6..').required(),
        email:yup.string().email('Email is not valid').required(),
        password:yup.string().min(6,'The minimum length is 6..').required(),
        repassword:yup.string().min(6,'The minimum length is 6..').oneOf([yup.ref('password'), null], 'Passwords must match').required(),
    });
    const { register, watch, formState, handleSubmit, setValue, getValues } = useForm({
        criteriaMode:'all',
        resolver:yupResolver(validator),
        mode:'onBlur' && 'onChange',
        delayError:300,
        defaultValues:{
            username:'',
            email:'',
            password:'',
            repassword:'',
        },
    });
    const regisrator = {
        username   : register('username',validator.username),
        email      : register('email',validator.email),
        password   : register('password',validator.password),
        repassword : register('repassword',validator.repassword),
    }

    // ========================================================================================================
    // ------------------------------------------- REACT EFFECT -----------------------------------------------
    // ========================================================================================================
    React.useEffect(() => {
        var storage = JSON.parse(window.sessionStorage.getItem('inputsRegister'));
        for(let key in storage) setValue(key, storage[key]);
    }, []);

    React.useEffect(() => {
        watch((data)=>{
            window.sessionStorage.setItem('inputsRegister', JSON.stringify(watch(data)));
        });
    },[watch]);

    // ========================================================================================================
    // -------------------------------------------- FUNCTIONS -------------------------------------------------
    // ========================================================================================================
    function formSubmit(e) {
        window.sessionStorage.clear('inputsLogin');
        window.sessionStorage.clear('inputsRegister');
    }

    // ========================================================================================================
    // ---------------------------------------------- RENDER --------------------------------------------------
    // ========================================================================================================
    return (
        <motion.div className="container z-10 py-6 px-5 box-border relative mx-auto overflow-hidden min-h-screen bg-white w-full flex flex-col justify-center"
            initial={[Motions['swipe-left'].out, Motions.fade.out]}
            animate={[Motions['swipe-left'].in, Motions.fade.in]}
            exit={[Motions['swipe-left'].out, Motions.fade.out]}
            transition={{ ease: [0.08, 0.65, 0.53, 0.96], duration: 0.5 }}
        >
            {/* Background */}
            <div className="absolute -z-1 h-full w-full top-0 left-0">
                <CircleDecoration className="h-32 w-32 absolute -bottom-16 -right-5"/>
            </div>

            {/* Header */}
            <Link to={'/login'} style={{ backgroundImage: 'Url(' + Iconsax.bold['arrow-left-2'] + ')' }} 
            className={'mb-2 h-7 w-7 py-2 cursor-pointer px-2 relative box-border filter-blue-400 bg-cover ' + Animate['hover-big']}/>
            <img src='/public/assets/svg/auth-ilus-2.svg' className='mx-auto -mb-8 h-60' />
            <h1 className="font-bold font-sans text-2xl text-blue-400 mb-2">SIGN UP</h1>
            <p className="font-normal font-sans text-blue-dark-300 mb-8 text-sm mr-2">Masukkan data anda untuk masuk ke dalam aplikasi.</p>

            {/* Form */}
            <form autoComplete="off" onSubmit={handleSubmit(formSubmit)} action='/' method='POST' className="w-full h-fit mb-8">

                <Input formState={formState} register={regisrator.username} 
                       className='mb-6' placeholder='Username'/>
                <Input formState={formState} register={regisrator.email}
                       className='mb-6' placeholder='Email' />
                       
                <InputPassword formState={formState} register={regisrator.password}  
                               className="mb-6" placeholder='Password' type='password' />
                <InputPassword formState={formState} register={regisrator.repassword}  
                                className="mb-10" placeholder='Re-Password' type='password' />
                                
                <Button className='w-52 mx-auto block' value='DAFTAR' type='submit' />
            </form>

            <p className="block mx-auto font-normal font-sans text-blue-dark-300 text-1sm mb-8">Sudah punya akun ? <Link to='/login' className="text-blue-400">Login Sekarang</Link></p>

        </motion.div>
    );
}


