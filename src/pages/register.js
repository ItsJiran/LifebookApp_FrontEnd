import React, { useEffect } from "react";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import { LayerMain, OverlayWrapper, LayerOverlay } from "../components/Layers";
import { Icon, Loading, LoadingContainer } from "../components/Components";
import { Input, InputPassword } from "../components/ui/Inputs";
import { Button } from "../components/ui/Buttons";

import { Iconsax, AnimateStyle, AnimateMotions, TimingMotions } from "../utils";
import { useNotifierController } from "../hooks_utils/NotifierUtils";
import { useAuthController, useAuthService } from "../hooks_utils/AuthUtils";

export default function RegisterPage() {
    // ========================================================================================================
    // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
    // ========================================================================================================
    const [action, setAction] = React.useState(false);
    const NotifierController = useNotifierController();
    const AuthController = useAuthController();
    const AuthService = useAuthService();

    const validator = yup.object().shape({
        name: yup.string().min(6, "The minimum length is 6..").required(),
        email: yup.string().email("Email is not valid").required(),
        password: yup.string().min(6, "The minimum length is 6..").required(),
        repassword: yup
            .string()
            .min(6, "The minimum length is 6..")
            .oneOf([yup.ref("password"), null], "Passwords must match")
            .required(),
    });
    const { register, watch, formState, handleSubmit, setValue, setError, getValues } =
        useForm({
            criteriaMode: "all",
            resolver: yupResolver(validator),
            mode: "onBlur" && "onChange",
            delayError: 300,
            defaultValues: {
                username: "",
                email: "",
                password: "",
                repassword: "",
            },
        });
    const regisrator = {
        name: register("name", validator.name),
        email: register("email", validator.email),
        password: register("password", validator.password),
        repassword: register("repassword", validator.repassword),
    };

    // ========================================================================================================
    // ------------------------------------------- REACT EFFECT -----------------------------------------------
    // ========================================================================================================
    React.useEffect(() => {
        var storage = JSON.parse(window.sessionStorage.getItem("inputsRegister"));
        for (let key in storage) setValue(key, storage[key]);
    }, []);

    React.useEffect(() => {
        watch((data) => {
            window.sessionStorage.setItem(
                "inputsRegister",
                JSON.stringify(watch(data))
            );
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
        else return console.error("Register Form Already Submitted !!");

        const result = await AuthService.authGatewayRegister(credentials, true);
        
        if(result.status == 200){
            window.sessionStorage.removeItem('inputsLogin');
            window.sessionStorage.removeItem('inputsRegister');
        }

        if(result.response.data.errors !== undefined){
            for(let key in result.response.data.errors){
                setError(key,{message:result.response.data.errors[key]});
            }
        }

        toggleAction(false);
    }

    // ========================================================================================================
    // ---------------------------------------------- RENDER --------------------------------------------------
    // ========================================================================================================
    return (

        <LayerMain animate={{ ...AnimateMotions["swipe-right-fade-in"], ...TimingMotions["ease-0.5"], }} className="py-6 px-5">
            <Link to={"/login"} className={"block mb-2 h-fit w-fit py-2 cursor-pointer px-2 relative box-border"}>
                <Icon className={"h-7 w-7 filter-blue-400" + " " + AnimateStyle["hover-ping"]} iconUrl={Iconsax.bold["arrow-left-2"]} />
            </Link>

            {/* Header */}
            <img src="/public/assets/svg/auth-ilus-2.svg" className="mx-auto -mb-8 h-60 pointer-events-none select-none" />
            <h1 className="font-bold font-sans text-2xl text-blue-400 mb-2">SIGN UP</h1>
            <p className="font-normal font-sans text-blue-dark-300 mb-8 text-sm mr-2"> Masukkan data anda untuk masuk ke dalam aplikasi.</p>

            {/* Form */}
            <form onSubmit={handleSubmit(formSubmit)} action='/' method='POST' className="w-full h-fit mb-8">
                <Input formState={formState} register={regisrator.name} className="mb-6" placeholder="Name" />
                <Input formState={formState} register={regisrator.email} className="mb-6" placeholder="Email" />
                <InputPassword formState={formState} register={regisrator.password} className="mb-6" placeholder="Password" type="password" />
                <InputPassword formState={formState} register={regisrator.repassword} className="mb-10" placeholder="Re-Password" type="password" />
                <Button className='w-52 py-2 text-lg mx-auto block' type='submit' variant={action ? 'blue-pressed' : 'blue'} >
                    {action ? <Loading className="h-6 w-6 filter-black-100 mx-auto" /> : <p className="cursor-pointer">DAFTAR</p>}
                </Button>
            </form>

            <p className="block text-center font-normal font-sans text-blue-dark-300 text-sm mb-8">
                Sudah punya akun ?{" "}
                <Link to="/login" className="text-blue-400">
                    Login Sekarang
                </Link>
            </p>
        </LayerMain>
    );
}
