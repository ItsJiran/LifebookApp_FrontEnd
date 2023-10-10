import { AnimatePresence, motion } from "framer-motion";
import React, {useContext} from "react";
import { useLocation } from "react-router-dom";
import { Icon } from "../components/Components";
import { useAppService } from "../hooks_utils/AppUtils";

import { useNavigateService } from "../hooks_utils/NavigateUtils";
import { Iconsax } from "../utils";

export function NavigationBar(){
    const location = useLocation();
    const location_path = location.pathname.split('/')[1];

    const NavigateService = useNavigateService();
    const AppService = useAppService();

    const confirm_logout_message = { title:'Logout', message:'Apakah anda yakin ingin keluar dari aplikasi?' };
    const confirm_redirect_message = { title:'Konfirmasi', message:'Apakah anda yakin ingin pindah halaman?' };

    let AppNavbarClass = '';
    if( AppService.navbar.get.status() == AppService.navbar.status().show ) AppNavbarClass = 'bottom-[0px] shadow-top-nav';
    else                                                                    AppNavbarClass = 'shadow-0';

    return (
        <div style={{transition:'0.4s'}} className={"w-full flex-initial h-fit px-4 py-3 bg-white absolute transition -bottom-[70px]" + ' ' + AppNavbarClass}>
            <div className="flex gap-4 justify-between mx-auto align-center h-full w-full max-w-[320px] px-3">
                <AnimatePresence mode='wait'>
                    {/* ================= HOME ====================== */}
                    <div onClick={()=>{NavigateService.redirectBasedApp('/dashboard',true,confirm_redirect_message)}} key='dashboard' className='flex flex-col justify-center cursor-pointer'>
                        
                        { location_path == 'dashboard' || location_path == '' || location_path == 'materials' ? 
                        <div className="h-[28px] w-[28px] px-1 py-1 rounded-full bg-blue-400 mx-auto">
                            <Icon className="h-full w-full filter-white" iconUrl={Iconsax.bold['home']}></Icon>
                        </div> : 
                        <div className="h-[28px] w-[28px] px-1 py-1 rounded-full mx-auto">
                            <Icon className="h-full w-full filter-blue-400" iconUrl={Iconsax.linear['home']}></Icon>
                        </div>}

                        <label className="text-2sm font-medium text-blue-400">Home</label>
                    </div>

                    {/* ================= JOURNALS ====================== */}
                    <div key='journals' onClick={()=>{NavigateService.redirectBasedApp('/journals',true,confirm_redirect_message)}} className='flex flex-col justify-center cursor-pointer'>
                        
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
                    <div key='routines' onClick={()=>{NavigateService.redirectBasedApp('/routines',true,confirm_redirect_message)}} className='flex flex-col justify-center cursor-pointer'>
                        
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
                    <div onClick={ ()=>{NavigateService.redirectConfirm('/logout',confirm_logout_message) }} className='flex flex-col justify-center cursor-pointer'>
                        
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