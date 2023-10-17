import React, { useState,useRef } from "react";
import { useLocation, Route, Routes, useMatches, Link, useParams, useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";
import { CustomDate, getDayName, getMonthName, Iconsax, TimingMotions, AnimateMotions, FilePath } from "../../utils";

import { CircleDecoration, Container, Icon, Loading } from "../../components/Components";
import { LayerMain, LayerOverlay } from "../../components/Layers";

import { useNotifierController } from "../../hooks_utils/NotifierUtils";
import { useAppService } from "../../hooks_utils/AppUtils";

import { useApiService } from "../../hooks_utils/ApiUtils";
import { DatePicker } from "../../components/ui/Date";

export default function JournalsDate() {
  // ========================================================================================================
  // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
  // ========================================================================================================
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const AppService = useAppService();
  const ApiService = useApiService();

  const NotifierController = useNotifierController();

  let tmpDate = undefined;
  try{
    if(params.year && params.month) tmpDate = new CustomDate( new Date(params.year, params.month - 1, params.day) );
    else                            tmpDate = new CustomDate();
  } catch(e) {
    console.error(e);
    tmpDate = new CustomDate();
  }
  
  const [selectDate,setSelectDate] = useState( false );
  const [queryDate,setQueryDate] = useState( tmpDate );
  const [pageState, setPageState] = useState({
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
    initialize();
  },[]);

  // ========================================================================================================
  // -------------------------------------------- FUNCTIONS -------------------------------------------------
  // ========================================================================================================
  const initialize = async () => {
    await fetchMaterials();
  }
  const fetchMaterials = async () => {

  }

  const handleDayClick = ()=>{

  }


  return (
    <>
      {/* ================== HEADER ==================== */}
      <div className="h-[40px] w-full px-3 py-2 box-border flex mt-2 justify-between">
        <div className="h-fit w-fit">
          
        </div>
        
        <div className="h-fit w-fit flex gap-2 items-center">
          <Icon className="filter-blue-400 h-5 w-5" iconUrl={Iconsax.bold['archive-tick']}/>
          <h1 className="text-blue-400 text-lg font-semibold tracking-wide">Journals</h1>
        </div>
        
        <div className="h-fit w-fit">
          <Icon onClick={async ()=>{navigate('/journals/add',{replace:true})}} className="h-6 w-6 filter-blue-400 hover:filter-blue-dark-300" iconUrl={Iconsax.bold['add-circle.svg']}/>
        </div>
      </div>

      {/* ================ CONTENT ================= */}
      <LayerMain id='MAIN_CONTENT' className="py-2 relative overflow-auto h-full flex flex-col">

          <div id='MATERIALS_JOURNAL_HEADER' className="mx-3 h-fit flex justify-between mb-4 relative border-b-[2px] border-blue-light-100 items-center">
            {/* Table Tab */}
            <div className="flex relative gap-2">          
              <Link to={'/journals'} replace className="relative text-sm pb-2 font-semibold text-center px-1 text-blue-dark-200 tracking-wider block w-fit">
                See All            
              </Link>

              <Link to={'/journals/date'} replace className=" relative text-sm pb-2 font-semibold text-center px-1 text-blue-dark-400 tracking-wider block w-fit">
                By Date
                <div className="absolute h-full w-full border-b-[2.5px] border-blue-400 -bottom-[2.3px] left-0"></div>
              </Link>
            </div>
            {/* Button Tab */}
            <div className="">
              

            </div>
          </div>        

          {/* ---------- DATE PICKER ------------- */}
          <div onClick={ ()=>{setSelectDate(true)} } className="bg-blue-400 relative overflow-auto px-5 py-3 flex items-center justify-between">
            <CircleDecoration className="h-32 w-32 bg-cover absolute -top-20 -left-14" variant="white"/>
            <div className="flex h-fit items-center gap-3">
              <div className="px-3 py-3 bg-white aspect-square rounded-full flex flex-col text-center">
                <label className="cursor-pointer font-bold text-blue-400 leading-3 text-lg">{queryDate.current.day.date}</label>
                <label className="cursor-pointer font-semibold text-blue-400 relative top-[4px] leading-3 text-1sm">{ getMonthName(queryDate.current.month, true) }</label>
              </div>
              <div className="h-fit relative top-[2px] rounded-full mr-2 flex flex-col">
                <label className="cursor-pointer font-semibold text-white leading-3 text-1sm relative top-[2px] tracking-wide">Year {queryDate.current.year}</label>
                <label className="cursor-pointer font-bold text-white text-md tracking-wide">{ getDayName(queryDate.current.day.num) }</label>
              </div>
              <div className="h-fit w-fit px-1 py-1 bg-white rounded-full">
                <Icon className="h-3 w-3 filter-blue-400" iconUrl={Iconsax.bold['arrow-down.svg']} />
              </div>
            </div>
          </div>


          <div className="w-full flex-1 overflow-auto h-fit">
            <div id='MATERIALS_JOURNAL_CONTAINER' className="w-full flex flex-1 flex-col gap-3">
              <AnimatePresence mode='wait'>

                {/* ================================================= */}
                {/* ============= DISPLAY SKELETON DATA ============= */}
                {/* ================================================= */}
                { pageState.loading ?  
                  <> 
                    <motion.div key='loading-1' {...{...AnimateMotions['fade-in'],...TimingMotions['ease-0.5']}} className="bg-white w-full rounded-md border-b-2 border-blue-200 h-fit flex px-2 py-2 gap-2">
                        <div className="bg-blue-200 animate-pulse h-[30px] w-[30px] rounded-md"></div>
                        <div className="flex-grow flex flex-col py-2 gap-2">
                          <div className="rounded-md animate-pulse bg-blue-200 h-[5px] w-[80%]"></div>
                          <div className="rounded-md animate-pulse bg-blue-200 h-[5px] w-[30%]"></div>
                        </div>
                    </motion.div>

                    <motion.div key='loading-2' {...{...AnimateMotions['fade-in'],...TimingMotions['ease-0.5']}} className="bg-white w-full rounded-md border-b-2 border-blue-200 h-fit flex px-2 py-2 gap-2">
                        <div className="bg-blue-200 animate-pulse h-[30px] w-[30px] rounded-md"></div>
                        <div className="flex-grow flex flex-col py-2 gap-2">
                          <div className="rounded-md animate-pulse bg-blue-200 h-[5px] w-[80%]"></div>
                          <div className="rounded-md animate-pulse bg-blue-200 h-[5px] w-[30%]"></div>
                        </div>
                    </motion.div>

                    <motion.div key='loading-3' {...{...AnimateMotions['fade-in'],...TimingMotions['ease-0.5']}} className="bg-white w-full rounded-md border-b-2 border-blue-200 h-fit flex px-2 py-2 gap-2">
                        <div className="bg-blue-200 animate-pulse h-[30px] w-[30px] rounded-md"></div>
                        <div className="flex-grow flex flex-col py-2 gap-2">
                          <div className="rounded-md animate-pulse bg-blue-200 h-[5px] w-[80%]"></div>
                          <div className="rounded-md animate-pulse bg-blue-200 h-[5px] w-[30%]"></div>
                        </div>
                    </motion.div>
                  </>
                : '' }

                { 
                  !pageState.loading && pageState.data.length == 0 && !pageState.error.status ? 
                    <>
                      <motion.div key='no-content' {...{...AnimateMotions['fade-in'],...TimingMotions['ease-0.5']}} className="flex mt-2 flex-col items-center text-center w-fit mx-auto h-fit flex px-2 py-2 text-1sm text-blue-dark-200 tracking-wide">
                        <img src={ FilePath.assets + 'svg/document.svg' } className='w-44 mb-2 mt-2 bg-contain bg-no-repeat'/>
                        <h2 className="font-semibold">Tidak Ditemukan</h2>
                        <p className="mb-2">Klik tambah untuk membuat materi jurnal</p>
                        <Icon onClick={()=>{navigate('/journals/add',{replace:true})}} className="h-7 w-7 filter-blue-400 hover:filter-blue-dark-300" iconUrl={Iconsax.bold['add-circle.svg']}/>
                      </motion.div>
                    </>
                  : ''
                }

              </AnimatePresence>
            </div>
          </div>

          {/* Refresh Button */}
          <Container className="absolute px-1 py-1 bottom-4 right-2 h-fit w-fit border-b-2 border-blue-300 cover-pointer">
            {
              !pageState.loading ?
              <Icon onClick={fetchMaterials} className="h-8 filter-blue-400 w-8" iconUrl={Iconsax.bold['refresh-2.svg']}/> 
              :
              <Loading className="h-5 w-5 mx-1 my-1 filter-blue-400"/>
            }
          </Container>  

      </LayerMain>
      


      {/* ================ DATE PICKER HIDDEN ================= */}
      <AnimatePresence mode='wait'>
        { selectDate ? 
          <LayerOverlay className='h-full w-full flex justify-center items-center'>
            <motion.div animate={{...AnimateMotions['fade-in'], ...TimingMotions['ease-0.5']}} onClick={ ()=>{setSelectDate(false)} } className="cursor-pointer absolute w-full h-full top-0 left-0 bg-black-400 opacity-40"/>
            <DatePicker animate={{...AnimateMotions['swipe-bottom-fade-in'], ...TimingMotions['ease-0.5']}} onDayClick={(dateObj)=>{ setQueryDate(dateObj); setSelectDate(false);  }} inputDate={queryDate} setInputDate={setQueryDate}/>
          </LayerOverlay> : <></> }
      </AnimatePresence>

    </>
  );
}
