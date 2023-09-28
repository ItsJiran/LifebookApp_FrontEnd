import React, { useState } from "react";
import { useLocation, Route, Routes, useMatches, Link } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";
import { Iconsax, TimingMotions, AnimateMotions, DecodeDateTime, getMonthName, useForceUpdate } from "../utils";
import { fetchApi } from "../utils/ApiUtils";

import { CircleDecoration, Icon } from "../components/Components";
import { LayerMain } from "../components/Layers";

import { useNotifierController } from "../hooks_utils/NotifierUtils";
import { useAuthController } from "../hooks_utils/AuthUtils";
import { useAppController } from "../hooks_utils/AppUtils";

export default function IndexPage() {
  // ========================================================================================================
  // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
  // ========================================================================================================
  const location = useLocation();

  const AppController = useAppController()
  const NotifierController = useNotifierController();
  const AuthController = useAuthController();

  const [ApiMaterials, setApiMaterials] = useState({
    loading:false,
    error:{
      status:false,
      data:undefined,
    },
    data:[],
  });

  // ========================================================================================================
  // ------------------------------------------- REACT EFFECT -----------------------------------------------
  // ========================================================================================================
  React.useEffect(()=>{
    fetchMaterials();
  },[]);


  // ========================================================================================================
  // -------------------------------------------- FUNCTIONS -------------------------------------------------
  // ========================================================================================================
  const click = async () => {
    const test = [...ApiMaterials.data];
    
    let newdata = {...ApiMaterials.data[0]};
    newdata.id = test.length + 1;

    test.push(newdata);
    setApiMaterials({...ApiMaterials, data:test})
  }
  const fetchMaterials = async () => {
    setApiMaterials({
      loading:true,
      error:{
        status:false,
        data:undefined,
      },
      data:[],
    });
    
    const jwt = AuthController.getJWT();

    const config = {
      method:'get',
      slug:'materials',
      headers:{
        Authorization:'Bearer ' + jwt.token,
      }
    }

    const fetch = await fetchApi(config);
    const response = fetch.response;

    if(fetch.status == 200){   
      setApiMaterials({
        error:{
          status:false,
          data:undefined,
        },
        data:fetch.response.data,
        loading:false,
      });      
  
    } else if (fetch.status >= 400){
      setApiMaterials({
        error:{
          status:true,
          data:fetch.response.data,
        },
        data:[],
        loading:false,
      });
    }
  }

  return (
    <>
      {/* ================== HEADER ==================== */}
      <div className="h-[40px] w-full px-2 py-2 box-border flex mt-2 justify-between">
        <div className="h-fit w-fit">
          
        </div>
        
        <div className="h-fit w-fit flex gap-2 items-center">
          <Icon className="filter-blue-400 h-5 w-5" iconUrl={Iconsax.bold['home']}/>
          <h1 className="text-blue-400 text-lg font-semibold tracking-wide">Home</h1>
        </div>
        
        <div className="h-fit w-fit">

        </div>
      </div>

      {/* ================ CONTENT ================= */}
      <LayerMain id='MAIN_CONTENT' className="px-3 py-2 overflow-auto h-full flex flex-col">
        <div id='WELCOME_HERO' className="h-fit w-full px-4 py-4 rounded-md min-h-[120px] bg-blue-400 relative mb-3">

          <CircleDecoration className="left-3 top-0 h-5 w-5 absolute" variant="white"/>
          <img src='./public/assets/img/index-illus-1.png' className="absolute right-0 h-full w-[180px] top-0"/>

          <label className="text-white text-2sm block font-semibold">Selamat Datang Di</label>
          <h1 className="text-white text-xl font-bold mr-[70px] mb-3 leading-6 relative">My Own Life Book Digital</h1>

        </div>

        <div id='MATERIALS_JOURNAL_HEADER' className="w-full h-fit flex justify-between mb-4 pt-2 relative border-b-[2px] border-blue-light-100">
            {/* Table Tab */}
            <div className="flex pb-[10px] relative">
              <label className="text-sm font-semibold text-center px-1 text-blue-dark-400 tracking-wider block w-fit">
                See Materials
                <div className="absolute h-full w-full border-b-[2.5px] border-blue-400 -bottom-[2.3px] left-0"></div>
              </label>
            </div>
            {/* Button Tab */}
            <div className="">
              
             {  AuthController.getUser().role == 'admin' ?
                <Icon onClick={()=>{}} className="h-6 w-6 filter-blue-400 hover:filter-blue-dark-300" iconUrl={Iconsax.bold['add-circle.svg']}/>
                : <></>
             } 

            </div>
          </div>

        <div id='MATERIALS_JOURNAL' className="w-full flex-1 overflow-auto h-fit">

          {/* MATERIALS */}
          <div id='MATERIALS_JOURNAL_CONTAINER' className="w-full flex flex-1 flex-col gap-3">
              <AnimatePresence mode='wait'>
                {/* ============= LAZY LOADING ============= */}
                { ApiMaterials.loading ?  
                  <>
                    <motion.div key='loading-1' {...{...AnimateMotions['fade-in'],...TimingMotions['ease-0.5']}} className="bg-white w-full rounded-md border-b-2 border-blue-200 h-fit flex px-2 py-2 gap-2">
                      <div className="bg-blue-200 animate-pulse h-[30px] w-[30px] rounded-md"></div>
                      <div className="flex-grow flex flex-col py-2 gap-2">
                        <div className="rounded-md animate-pulse bg-blue-200 h-[5px] w-[80%]"></div>
                        <div className="rounded-md animate-pulse bg-blue-200 h-[5px] w-[30%]"></div>
                      </div>
                    </motion.div>
                  </>
                : '' }
                {/* ============= FETCH DATA ============= */}
                {
                  !ApiMaterials.loading && ApiMaterials.data.length > 0 ?
                    <>
                      {ApiMaterials.data.map((data)=>{ 
                        const dateTime = DecodeDateTime(data.created_at);               
                        return <motion.div key={data.id} {...{...AnimateMotions['fade-in'],...TimingMotions['ease-0.5']}} className="bg-white w-full rounded-md border-b-2 border-blue-200 h-fit flex px-2 py-2 gap-2">
                          <Link className="h-[30px] w-[30px] rounded-md">
                            <Icon className="h-full w-full filter-blue-400" iconUrl={Iconsax.bold['book-square.svg']}/>
                          </Link>
                          <div className="flex-grow flex flex-col pt-1 pb-1">
                            <Link className="w-full h-fit mb-[2px]" replace><h2 className="text-1sm text-blue-dark-300 font-semibold tracking-wide">{data.title}</h2></Link>
                            <div className="text-2sm text-blue-dark-100 tracking-wide flex gap-1 font-medium">
                              <div className="flex gap-1 align-center items-center">
                                <Icon className="w-[13px] h-[13px] filter-blue-dark-100" iconUrl={Iconsax.bold['clock.svg']}/>
                                <label> { dateTime.date.day + ' ' + getMonthName(dateTime.date.month,true) + ' ' + dateTime.date.year} </label>
                              </div>
                              |
                              <label> { dateTime.time.hour + ':' + dateTime.time.minute} </label>
                            </div>
                          </div>
                        </motion.div>;
                      })}
                    </>
                  : ''
                }
                {
                  !ApiMaterials.loading && ApiMaterials.data.length == 0 && !ApiMaterials.error.status ? 
                    <>
                      <motion.div key='no-content' {...{...AnimateMotions['fade-in'],...TimingMotions['ease-0.5']}} className="flex flex-col items-center text-center w-fit mx-auto h-fit flex px-2 py-2 text-1sm text-blue-dark-200 tracking-wide">
                        <h2 className="font-semibold">Tidak Ditemukan</h2>
                        <p className="mb-2">Klik tambah untuk membuat materi jurnal</p>
                        <Icon onClick={()=>{fetchMaterials}} className="h-7 w-7 filter-blue-400 hover:filter-blue-dark-300" iconUrl={Iconsax.bold['add-circle.svg']}/>
                      </motion.div>
                    </>
                  : ''
                }
                {/* ============= ERROR FETCH DATA ============= */}
                {
                  !ApiMaterials.loading && ApiMaterials.error.status ? 
                    <>
                      <motion.div key='error-fetch' {...{...AnimateMotions['fade-in'],...TimingMotions['ease-0.5']}} className="flex flex-col items-center text-center w-fit mx-auto h-fit flex px-2 py-2 text-1sm text-blue-dark-200 tracking-wide">
                        <h2 className="font-semibold">Terjadi Kesalahan</h2>
                        <p className="mb-2">Klik tambah dibawah ini untuk mencoba lagi</p>
                        <div className="h-fit w-fit px-1 py-1 bg-blue-400 rounded-full"><Icon onClick={fetchMaterials} className="h-4 w-4 filter-white hover:filter-blue-dark-300" iconUrl={Iconsax.bold['refresh.svg']}/>
                        </div>
                      </motion.div>
                    </>
                  : ''
                }

            </AnimatePresence>
          </div>
        </div>
      </LayerMain>
    </>
  );
}
