import React from "react";
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
import { useAuthService } from "../hooks_utils/AuthUtils";
import { useApiService } from "../hooks_utils/ApiUtils";

export default function RegisterPage() {
    // ========================================================================================================
    // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
    // ========================================================================================================
    const [action, setAction] = React.useState(false);
    const NotifierController = useNotifierController();
    
    const AuthService = useAuthService();
    const ApiService = useApiService();

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

        // Use Try And Catch So If There's an Error on the App Can Still Be Run
        try{
            const fetch = await ApiService.fetchApi({slug:'register',method:'post',data:credentials});    

            // Generate Notification Title And Message
            var title = ApiService.generateApiTitle(fetch);
            var msg = ApiService.generateApiMessage(fetch);

            // ---  Handle Success
            if(fetch.status == 200){
                // from the backend will return fetch.response.data = {user:etc,jwt:etc};
                AuthService.setAuthStatus(AuthService.authStatus().VALID, fetch.response.data)

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
                if(ApiService.isAxiosError(fetch)) console.error(fetch);

                NotifierController.addNotification({
                title:title,
                message:msg,
                type:'Error',
                });

                if(fetch.response && fetch.response.data.errors !== undefined){
                    for(let key in fetch.response.data.errors){
                        setError(key,{message:fetch.response.data.errors[key]});
                    }
                }
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
