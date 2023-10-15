import React, { useState } from "react";
import { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";
import { Iconsax, TimingMotions, AnimateMotions, DecodeDateTime, getMonthName, useForceUpdate } from "../utils";
import { fetchApi, fetchAuthWrap, useApiService } from "../hooks_utils/ApiUtils";

import { CircleDecoration, Icon } from "../components/Components";
import { LayerMain } from "../components/Layers";

import { useNotifierController } from "../hooks_utils/NotifierUtils";
import { useAuthController } from "../hooks_utils/AuthUtils";
import { useAppService } from "../hooks_utils/AppUtils";

import { useChoicerController } from "../hooks_utils/ChoicerUtils";

export default function IndexPage() {
  // ========================================================================================================
  // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
  // ========================================================================================================
  const location = useLocation();
  const navigate = useNavigate();

  // -- Service And Controller
  const NotifierController = useNotifierController();
  const AuthController = useAuthController();
  const ChoicerController = useChoicerController();
  
  const AppService = useAppService();
  const ApiService = useApiService();

  // -- Variable And State
  const [ApiMaterials, setApiMaterials] = useState({
    loading:false,
    error:false,
    data:[],
  });

  // For Choicer
  const elmChoices = ( 
    <>
        <div onClick={ ()=>{ ChoicerController.action('Same Tab') } } className="w-full px-2 py-2 flex align-center items-center">
            <Icon className="filter-blue-dark-300 h-6 w-6 mr-3 cursor-pointer" iconUrl={Iconsax.bold['eye.svg']}/>
            <label className="text-blue-dark-300 text-sm font-semibold tracking-wide leading-4 cursor-pointer">View Material</label>
        </div>

        <div onClick={ ()=>{ ChoicerController.action('New Tab') } } className="w-full px-2 py-2 flex align-center items-center">
            <Icon className="filter-blue-dark-300 h-6 w-6 mr-3 cursor-pointer" iconUrl={Iconsax.bold['copy.svg']}/>
            <label className="text-blue-dark-300 text-sm font-semibold tracking-wide leading-4 cursor-pointer">View On New Tab</label>
        </div>
    </> )

  // ========================================================================================================
  // ------------------------------------------- REACT EFFECT -----------------------------------------------
  // ========================================================================================================
  React.useEffect(()=>{
    document.title = 'LifebookApp';
    fetchMaterials();
  },[]);

  // ========================================================================================================
  // -------------------------------------------- FUNCTIONS -------------------------------------------------
  // ========================================================================================================
  const fetchMaterials = async () => {
    setApiMaterials({...ApiMaterials,loading:true});

    // Use Try And Catch So If There's an Error on the App Can Still Be Run
    try{
      var fetch = await ApiService.fetchAuth({slug:'materials',method:'get'});

      // Generate Notification Title And Message
      var title = ApiService.generateApiTitle(fetch);
      var msg = ApiService.generateApiMessage(fetch);

      // --- Handling Success
      if(fetch.status == 200){
        setApiMaterials({loading:false, error:false, data:fetch.response.data });  
      }

      // --- Handle Client Request Failed
      else if (fetch.status !== 200 || fetch instanceof Axios){
        if(fetch instanceof AxiosError) console.error(fetch);

        NotifierController.addNotification({
          title:title,
          message:msg,
          type:'Error',
        });

        setApiMaterials({loading:false, error:true, data:[]});  
      }

    } catch (e) {
      setApiMaterials({loading:false, error:true, data:[]});
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
  }
  async function onClickMaterial(id){
    const result = await ChoicerController.show(elmChoices);

    if(result == 'Same Tab')
      return navigate('/materials/view/'+id,{replace:true});

    else if(result == 'New Tab')
      return window.open('/standalone/materials/view/'+id, '_blank');
  }

  return (
    <>
      {/* ================== HEADER ==================== */}
      <div className="h-[40px] w-full px-3 py-2 box-border flex mt-2 justify-between">
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
          <img src='/public/assets/img/index-illus-1.png' className="absolute right-0 h-full w-[180px] top-0"/>

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
                <Icon onClick={async ()=>{navigate('/materials/add',{replace:true})}} className="h-6 w-6 filter-blue-400 hover:filter-blue-dark-300" iconUrl={Iconsax.bold['add-circle.svg']}/>
                : <></>
             } 

            </div>
          </div>

        <div id='MATERIALS_JOURNAL' className="w-full flex-1 overflow-auto h-fit">

          <div id='MATERIALS_JOURNAL_CONTAINER' className="w-full flex flex-1 flex-col gap-3">
              <AnimatePresence mode='wait'>

                {/* ================================================= */}
                {/* ============= DISPLAY SKELETON DATA ============= */}
                {/* ================================================= */}
                { ApiMaterials.loading ?  
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

                {/* ============================================== */}
                {/* ============= DISPLAY FETCH DATA ============= */}
                {/* ============================================== */}
                {
                  !ApiMaterials.loading && ApiMaterials.data.length > 0 && !ApiMaterials.error ?
                    <>
                      {ApiMaterials.data.map((data)=>{ 
                        const dateTime = DecodeDateTime(data.date,' ');                      

                        console.log(dateTime);

                        return (

                        <motion.div key={data.id} {...{...AnimateMotions['fade-in'],...TimingMotions['ease-0.5']}} className="bg-white w-full rounded-md border-b-2 border-blue-200 h-fit flex px-2 py-2 gap-2">
                          <div className="h-[30px] w-[30px] rounded-md" onClick={()=>{ onClickMaterial(data.id) }}>
                            <Icon className="h-full w-full filter-blue-400" iconUrl={Iconsax.bold['book-square.svg']}/>
                          </div>

                          <div className="flex-grow flex flex-col pt-1 pb-1">
                            <div className="w-fit h-fit mb-[2px]" onClick={()=>{ onClickMaterial(data.id) }}>
                              <h2 className="text-1sm text-blue-dark-300 font-semibold tracking-wide">{data.title}</h2>
                            </div>

                            <div className="text-2sm text-blue-dark-100 tracking-wide flex gap-1 font-medium">
                              <div className="flex gap-1 align-center items-center">
                                <Icon className="w-[13px] h-[13px] filter-blue-dark-100" iconUrl={Iconsax.bold['clock.svg']}/>
                                <label> { dateTime.date.day + ' ' + getMonthName(dateTime.date.month-1,true) + ' ' + dateTime.date.year} </label>
                              </div>
                              |
                              <label> { dateTime.time.hour + ':' + dateTime.time.minute} </label>
                            </div>
                          </div> 

                        </motion.div>
                        
                        ); })
                      }
                    </>
                  : ''
                }
                {
                  !ApiMaterials.loading && ApiMaterials.data.length == 0 && !ApiMaterials.error ? 
                    <>
                      <motion.div key='no-content' {...{...AnimateMotions['fade-in'],...TimingMotions['ease-0.5']}} className="flex flex-col items-center text-center w-fit mx-auto h-fit flex px-2 py-2 text-1sm text-blue-dark-200 tracking-wide">
                        <h2 className="font-semibold">Tidak Ditemukan</h2>
                        <p className="mb-2">Klik tambah untuk membuat materi jurnal</p>
                        <Icon onClick={()=>{navigate('/materials/add',{replace:true})}} className="h-7 w-7 filter-blue-400 hover:filter-blue-dark-300" iconUrl={Iconsax.bold['add-circle.svg']}/>
                      </motion.div>
                    </>
                  : ''
                }

                {/* ============================================ */}
                {/* ============= ERROR FETCH DATA ============= */}
                {/* ============================================ */}
                {
                  !ApiMaterials.loading && ApiMaterials.error ? 
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
