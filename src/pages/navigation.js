import { AnimatePresence, motion } from "framer-motion";
import React, {useContext} from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Icon } from "../components/Components";
import { AppStatus } from "../hooks/App";
import { useAppController } from "../hooks_utils/AppUtils";
import { useConfirmerController } from "../hooks_utils/ConfirmerUtils";
import { Iconsax, TimingMotions, AnimateMotions } from "../utils";

export function NavigationBar(){
    const location = useLocation();
    const location_path = location.pathname.split('/')[1];
    const navigate = useNavigate();

    const AppController = useAppController();
    const ConfirmerController = useConfirmerController();

    async function redirectTo(url,content = undefined){
        // get if current app navigate status let the user to redirect
        let navigate_status = AppController.getNavigateStatus();
        let canRedirect = false;

        if(content == undefined){
            content = {
                title:'Konfirmasi',
                message:'Apakah anda yakin ingin pindah halaman?',
            }
        }

        switch(navigate_status){
            case AppStatus.navigate.validate:
                canRedirect = await ConfirmerController.confirm(content);
                break;
            case AppStatus.navigate.initial:
                canRedirect = true;
                break;
            default:
                canRedirect = false;  
                break;              
        }

        if(canRedirect)
            navigate(url,{replace:true});
    }
    async function confirmLogout(){
        var result = await ConfirmerController.confirm({
            title:'Logout',
            message:'Apakah anda yakin ingin keluar dari aplikasi?'
        });

        if(result) navigate('/logout',{replace:true});
    }

    return (
        <div className="w-full flex-initial h-fit px-4 py-3 bg-white relative shadow-top-nav">
            <div className="flex gap-4 justify-between mx-auto align-center h-full w-full max-w-[320px] px-3">
                <AnimatePresence mode='wait'>
                    {/* ================= HOME ====================== */}
                    <div onClick={()=>{redirectTo('/dashboard')}} key='dashboard' className='flex flex-col justify-center'>
                        
                        { location_path == 'dashboard' || location_path == '' ? 
                        <div className="h-[28px] w-[28px] px-1 py-1 rounded-full bg-blue-400 mx-auto">
                            <Icon className="h-full w-full filter-white" iconUrl={Iconsax.bold['home']}></Icon>
                        </div> : 
                        <div className="h-[28px] w-[28px] px-1 py-1 rounded-full mx-auto">
                            <Icon className="h-full w-full filter-blue-400" iconUrl={Iconsax.linear['home']}></Icon>
                        </div>}

                        <label className="text-2sm font-medium text-blue-400">Home</label>
                    </div>

                    {/* ================= JOURNALS ====================== */}
                    <div key='journals' onClick={()=>{redirectTo('/journals')}} className='flex flex-col justify-center'>
                        
                        { location_path == 'journals' ? 
                        <div className="h-[28px] w-[28px] px-1 py-1 rounded-full bg-blue-400 mx-auto">
                            <Icon className="h-full w-full filter-white" iconUrl={Iconsax.bold['archive-tick']}></Icon>
                        </div> : 
                        <div className="h-[28px] w-[28px] px-1 py-1 rounded-full mx-auto">
                            <Icon className="h-full w-full filter-blue-400" iconUrl={Iconsax.linear['archive-tick']}></Icon>
                        </div>}

                        <label className="text-2sm font-medium text-blue-400">Journals</label>
                    </div>

                    {/* ================= JOURNALS ====================== */}
                    <div key='routines' onClick={()=>{redirectTo('/routines')}} className='flex flex-col justify-center'>
                        
                        { location_path == 'routines' ? 
                        <div className="h-[28px] w-[28px] px-1 py-1 rounded-full bg-blue-400 mx-auto">
                            <Icon className="h-full w-full filter-white" iconUrl={Iconsax.bold['calendar-tick']}></Icon>
                        </div> : 
                        <div className="h-[28px] w-[28px] px-1 py-1 rounded-full mx-auto">
                            <Icon className="h-full w-full filter-blue-400" iconUrl={Iconsax.linear['calendar-tick']}></Icon>
                        </div>}

                        <label className="text-2sm font-medium text-blue-400">Routines</label>
                    </div>

                    {/* ================= LOGOUT ====================== */}
                    <div onClick={confirmLogout} className='flex flex-col justify-center'>
                        
                        { location_path == 'logout' ? 
                        <div className="h-[28px] w-[28px] px-1 py-1 rounded-full bg-blue-400 mx-auto">
                            <Icon className="h-full w-full filter-white" iconUrl={Iconsax.bold['setting-2']}></Icon>
                        </div> : 
                        <div className="h-[28px] w-[28px] px-1 py-1 rounded-full mx-auto">
                            <Icon className="h-full w-full filter-blue-400" iconUrl={Iconsax.linear['setting-2']}></Icon>
                        </div>}

                        <label className="text-2sm font-medium text-blue-400">Logout</label>
                    </div>
                </AnimatePresence>
            </div>
        </div>    
    );
}