import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Icon } from "../components/Components";
import { useConfirmerController } from "../hooks_utils/ConfirmerUtils";
import { Iconsax, TimingMotions, AnimateMotions } from "../utils";

export function NavigationBar(){
    const location = useLocation();
    const location_path = location.pathname.split('/')[1];
    const navigate = useNavigate();

    const ConfirmerController = useConfirmerController();

    async function confirmLogout(){
        var result = await ConfirmerController.confirm({content:{
            title:'Logout',
            message:'Apakah anda yakin ingin keluar dari aplikasi?'
        }});

        if(result) navigate('/logout',{replace:true});
    }

    return (
        <div className="w-full h-fit px-4 py-3 bg-white relative shadow-top-nav">
            <div className="flex gap-4 justify-between mx-auto align-center h-full w-full max-w-[320px] px-3">
                <AnimatePresence mode='wait'>
                    {/* ================= HOME ====================== */}
                    <Link key='dashboard' to='/dashboard' className='flex flex-col justify-center'>
                        
                        { location_path == 'dashboard' || location_path == '' ? 
                        <div className="h-[28px] w-[28px] px-1 py-1 rounded-full bg-blue-400 mx-auto">
                            <Icon className="h-full w-full filter-white" iconUrl={Iconsax.bold['home']}></Icon>
                        </div> : 
                        <div className="h-[28px] w-[28px] px-1 py-1 rounded-full mx-auto">
                            <Icon className="h-full w-full filter-blue-400" iconUrl={Iconsax.linear['home']}></Icon>
                        </div>}

                        <label className="text-2sm font-medium text-blue-400">Home</label>
                    </Link>

                    {/* ================= JOURNALS ====================== */}
                    <Link key='journals' to='/journals' className='flex flex-col justify-center'>
                        
                        { location_path == 'journals' ? 
                        <div className="h-[28px] w-[28px] px-1 py-1 rounded-full bg-blue-400 mx-auto">
                            <Icon className="h-full w-full filter-white" iconUrl={Iconsax.bold['archive-tick']}></Icon>
                        </div> : 
                        <div className="h-[28px] w-[28px] px-1 py-1 rounded-full mx-auto">
                            <Icon className="h-full w-full filter-blue-400" iconUrl={Iconsax.linear['archive-tick']}></Icon>
                        </div>}

                        <label className="text-2sm font-medium text-blue-400">Journals</label>
                    </Link>

                    {/* ================= JOURNALS ====================== */}
                    <Link key='routines' to='/routines' className='flex flex-col justify-center'>
                        
                        { location_path == 'routines' ? 
                        <div className="h-[28px] w-[28px] px-1 py-1 rounded-full bg-blue-400 mx-auto">
                            <Icon className="h-full w-full filter-white" iconUrl={Iconsax.bold['calendar-tick']}></Icon>
                        </div> : 
                        <div className="h-[28px] w-[28px] px-1 py-1 rounded-full mx-auto">
                            <Icon className="h-full w-full filter-blue-400" iconUrl={Iconsax.linear['calendar-tick']}></Icon>
                        </div>}

                        <label className="text-2sm font-medium text-blue-400">Routines</label>
                    </Link>

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