import React, { useState } from "react";
import { AxiosError } from "axios";
import { useLocation, Route, Routes, useMatches, Link, useNavigate } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";
import { FilePath, Iconsax, AnimateMotions, TimingMotions } from "../../utils";

import { CircleDecoration, Icon, Container, Loading } from "../../components/Components";
import { LayerMain } from "../../components/Layers";

import { useAuthController } from "../../hooks_utils/AuthUtils";
import { useNotifierController } from "../../hooks_utils/NotifierUtils";
import { useChoicerController } from "../../hooks_utils/ChoicerUtils";
import { useAppService } from "../../hooks_utils/AppUtils";
import { useApiService } from "../../hooks_utils/ApiUtils";

export default function RoutinesPage() {
  // ========================================================================================================
  // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
  // ========================================================================================================
  const location = useLocation();
  const navigate = useNavigate();

  // -- Service And Controller
  const AppService = useAppService();
  const ApiService = useApiService();

  // -- Variable And State
  const ChoicerController = useChoicerController();
  const NotifierController = useNotifierController();

  const [pageState, setPageState] = useState({
    loading:false,
    error:false,
    data:[],
  });

  const elmChoices = ( 
    <>
        <div onClick={ ()=>{ ChoicerController.action('View') } } className="w-full px-2 py-2 flex align-center items-center">
            <Icon className="filter-blue-dark-300 h-6 w-6 mr-3 cursor-pointer" iconUrl={Iconsax.bold['edit.svg']}/>
            <label className="text-blue-dark-300 text-sm font-semibold tracking-wide leading-4 cursor-pointer">View Routines</label>
        </div>

        <div onClick={ ()=>{ ChoicerController.action('Delete') } } className="w-full px-2 py-2 flex align-center items-center">
            <Icon className="filter-red-400 h-6 w-6 mr-3 cursor-pointer" iconUrl={Iconsax.bold['trash.svg']}/>
            <label className="text-red-400 text-sm font-semibold tracking-wide leading-4 cursor-pointer">Delete Routines</label>
        </div>
    </> )

  const deleteElmChoices = ( 
    <div key='choicer' className="absolute top-0 h-full left-0 w-full overflow-y-hidden">
      <div className="sticky h-full top-0 items-center flex z-50 justify-center">
      
          <motion.div animate={{...AnimateMotions['fade-in'], ...TimingMotions['ease-0.5']}} onClick={ChoicerController.hide} className="absolute w-full h-full top-0 left-0 bg-black-400 opacity-40"></motion.div>
          
          <Container animate={{...AnimateMotions['swipe-bottom-fade-in'], ...TimingMotions['ease-0.5']}} className="px-4 py-4 pb-6 absolute w-full mx-6 -bottom-2 flex flex-col">
            <div onClick={ ()=>{ ChoicerController.action('Yes') } } className="w-full px-2 py-2 flex align-center items-center">
                <Icon className="filter-blue-dark-300 h-6 w-6 mr-3 cursor-pointer" iconUrl={Iconsax.bold['verify.svg']}/>
                <label className="text-blue-dark-300 text-sm font-semibold tracking-wide leading-4 cursor-pointer">Konfirmasi</label>
            </div>
            <div onClick={ ()=>{ ChoicerController.action('No') } } className="w-full px-2 py-2 flex align-center items-center">
                <Icon className="filter-red-400 h-6 w-6 mr-3 cursor-pointer" iconUrl={Iconsax.bold['close-square.svg']}/>
                <label className="text-red-400 text-sm font-semibold tracking-wide leading-4 cursor-pointer">Batal</label>
            </div>
          </Container>

        </div>
      </div> )
  const loadingDeleteElmChoices = ( 
    <div key='choicer' className="absolute top-0 h-full left-0 w-full overflow-y-hidden">
      <div className="sticky h-full top-0 items-center flex z-50 justify-center">
      
          <motion.div animate={{...AnimateMotions['fade-in'], ...TimingMotions['ease-0.5']}} className="absolute w-full h-full top-0 left-0 bg-black-400 opacity-40"></motion.div>
          
          <Container animate={{...AnimateMotions['swipe-bottom-fade-in'], ...TimingMotions['ease-0.5']}} className="px-4 py-4 pb-6 absolute w-full mx-6 -bottom-2 flex flex-col">
              <Loading className="h-6 w-6 px-2 filter-blue-400 py-2 mx-auto"/>
          </Container>

        </div>
      </div> )
  const retryDeleteElmChoices = (title,message) => {
    return ( 
      <>
          <h2 className="text-base my-2 mb-2 font-bold text-center leading-3 tracking-wider text-blue-dark-300">{title}</h2>
          <p className="text-sm text-center leading-3 tracking-wider text-blue-dark-300 mb-2">{message}</p>

          <div className="w-full my-2 border-b-[1px] border-blue-dark-300"></div>          

          <div onClick={ ()=>{ ChoicerController.action('Retry') } } className="w-full px-2 py-2 flex align-center items-center">
              <Icon className="filter-blue-dark-300 h-6 w-6 mr-3 cursor-pointer" iconUrl={Iconsax.bold['refresh-2.svg']}/>
              <label className="text-blue-dark-300 text-sm font-semibold tracking-wide leading-4 cursor-pointer">Retry</label>
          </div>
  
          <div onClick={ ()=>{ ChoicerController.action('Cancel') } } className="w-full px-2 py-2 flex align-center items-center">
              <Icon className="filter-red-400 h-6 w-6 mr-3 cursor-pointer" iconUrl={Iconsax.bold['close-square.svg']}/>
              <label className="text-red-400 text-sm font-semibold tracking-wide leading-4 cursor-pointer">Cancel</label>
          </div>
      </> )
  } 

  // ========================================================================================================
  // ------------------------------------------- REACT EFFECT -----------------------------------------------
  // ========================================================================================================
  React.useEffect(()=>{

    AppService.navigate.set.status( AppService.navigate.status().initial );
    fetchRoutines();

  },[]);

  const refresh = async()=>{
    await fetchRoutines();
  }

  // ========================================================================================================
  // -------------------------------------------- FUNCTIONS -------------------------------------------------
  // ========================================================================================================
  const onClickRoutines = async (id) => {
    const result = await ChoicerController.show(elmChoices);

    if(result == 'Delete'){
      const confirm_delete = await ChoicerController.showCustom(deleteElmChoices);

      if(confirm_delete == 'Yes') ChoicerController.showCustom(loadingDeleteElmChoices);
      else                        return ChoicerController.hide();

      while(true){
        try{

            fetch = await ApiService.fetchAuth({slug:'routine/'+id,method:'delete'})

            var title = ApiService.generateApiTitle(fetch);
            var msg = ApiService.generateApiMessage(fetch);

            if(fetch.status >= 200 && fetch.status < 300){
              NotifierController.addNotification({
                title:title,
                message:msg,
                type:'Success',
              });
              refresh();
              return ChoicerController.hide();
            } else if(fetch.status >= 400 || ApiService.isReturnError(fetch)) {
              throw fetch;                
            } else {
              throw fetch;
            }
      
          } catch(e){
            console.error(e);
            let retry = await ChoicerController.show(retryDeleteElmChoices(title, msg));
            if(retry == 'Retry') continue;
            else                 return;
          }
      }
    }

    if(result == 'View'){
      ChoicerController.hide();
      return navigate('/routines/view/'+id,{replace:true});
    } 

  }
  const fetchRoutines = async () => {
      setPageState({...pageState,loading:true});

    // Use Try And Catch
    try{
      var fetch = await ApiService.fetchAuth({slug:'routines',method:'get'});

      // Generate Notification Title And Message
      var title = ApiService.generateApiTitle(fetch);
      var msg = ApiService.generateApiMessage(fetch);

      // -- Handling Success
      if(fetch.status >= 200 && fetch.status < 300){        
        setPageState({loading:false, error:false, data:fetch.response.data });          
      }

      // --- Handle Client Request Failed
      else if (fetch.status !== 200 || fetch instanceof Axios){
        if(fetch instanceof AxiosError) console.error(fetch);

        NotifierController.addNotification({
          title:title,
          message:msg,
          type:'Error',
        });

        setPageState({loading:false, error:true, data:[]});  
      }

    } catch (e) {
      setPageState({loading:false, error:true, data:[]});
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

  return (
    <>
      {/* ================== HEADER ==================== */}
      <div className="h-[40px] w-full px-2 py-2 box-border flex mt-2 justify-between">
        <div className="h-fit w-fit">
          
        </div>
        
        <div className="h-fit w-fit flex gap-2 items-center">
          <Icon className="filter-blue-400 h-5 w-5" iconUrl={Iconsax.bold['calendar-tick']}/>
          <h1 className="text-blue-400 text-lg font-semibold tracking-wide">Routines</h1>
        </div>
        
        <div className="h-fit w-fit">
          <Icon onClick={async ()=>{navigate('/routines/add',{replace:true})}} className="h-6 w-6 filter-blue-400 hover:filter-blue-dark-300" iconUrl={Iconsax.bold['add-circle.svg']}/>
        </div>
      </div>

      {/* ================ CONTENT ================= */}
      <LayerMain id='MAIN_CONTENT' className="py-2 relative overflow-y-auto h-full overflow-x-hidden">

          <div id='MATERIALS_JOURNAL_HEADER' className="mx-3 h-fit flex justify-between mb-4 relative border-b-[2px] border-blue-light-100 items-center">
            {/* ------------ Table Tab ------------- */}
            <div className="flex relative gap-2">          
              <Link to={'/routines'} replace className="relative text-sm pb-2 font-semibold text-center px-1 text-blue-dark-400 tracking-wider block w-fit">
                Overview
                <div className="absolute h-full w-full border-b-[2.5px] border-blue-400 -bottom-[2.3px] left-0"></div>
              </Link>

              {/* <Link to={'/routines/today'} replace className="text-sm pb-2 font-semibold text-center px-1 text-blue-dark-200 tracking-wider block w-fit">
                Today
              </Link> */}
            </div>
          </div>

            <div className="w-full px-3 flex-1 overflow-auto h-fit">
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

                    {/* ============================================== */}
                    {/* ============= DISPLAY FETCH DATA ============= */}
                    {/* ============================================== */}
                    {
                      !pageState.loading && pageState.data.length > 0 && !pageState.error ?
                        <>
                          {pageState.data.map((data)=>{ 
                          
                            return (
                              <motion.div key={data.id} {...{...AnimateMotions['fade-in'],...TimingMotions['ease-0.5']}} className="shadow bg-white w-full items-center rounded-md border-b-2 border-blue-200 h-fit flex px-2 py-2 gap-2">
                                <div className="px-1 py-1 rounded-full relative overflow-hidden"  onClick={()=>{ onClickRoutines(data.id) }}>
                                  <div style={{'backgroundColor':data.color}} className="absolute top-0 left-0 h-full w-full opacity-20"></div>
                                  <Icon className="h-[30px] w-[30px]" style={{'filter':data.filter_color}}  iconUrl={ FilePath.icons.routines + data.icon_title }/>
                                </div>
    
                                <div className="flex-grow ml-1 flex flex-col pt-1 pb-1">
                                  <div className="w-full h-fit mb-[2px] flex justify-between" onClick={()=>{ onClickRoutines(data.id) }}>                                  
                                    <h2 className="text-sm text-blue-dark-200 font-medium tracking-wide">{data.title}</h2>
                                    <div onClick={()=>{onClickRoutines(data.id)}} className="px-2">
                                      <Icon  className="h-[18px] w-[4px] flex-initial filter-blue-400 bg-cover" iconUrl={FilePath.assets + 'svg/dots-menu.svg'}/>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ); })
                          }
                        </>
                      : ''
                    }
                    {
                      !pageState.loading && pageState.data.length == 0 && !pageState.error ? 
                        <>
                          <motion.div key='no-content' {...{...AnimateMotions['fade-in'],...TimingMotions['ease-0.5']}} className="flex flex-col items-center text-center w-fit mx-auto h-fit flex px-2 py-2 text-1sm text-blue-dark-200 tracking-wide">
                            <h2 className="font-semibold">Tidak Ditemukan</h2>
                            <p className="mb-2">Klik tambah untuk membuat rutinitas</p>
                            <Icon onClick={()=>{navigate('/routines/add',{replace:true})}} className="h-7 w-7 filter-blue-400 hover:filter-blue-dark-300" iconUrl={Iconsax.bold['add-circle.svg']}/>
                          </motion.div>
                        </>
                      : ''
                    }

                    {/* ============================================ */}
                    {/* ============= ERROR FETCH DATA ============= */}
                    {/* ============================================ */}
                    {
                      !pageState.loading && pageState.error ? 
                        <>
                          <motion.div key='error-fetch' {...{...AnimateMotions['fade-in'],...TimingMotions['ease-0.5']}} className="flex flex-col items-center text-center w-fit mx-auto h-fit flex px-2 py-2 text-1sm text-blue-dark-200 tracking-wide">
                            <h2 className="font-semibold">Terjadi Kesalahan</h2>
                            <p className="mb-2">Klik tombol dibawah ini untuk mencoba lagi</p>
                            <div className="h-fit w-fit px-1 py-1 bg-blue-400 rounded-full"><Icon onClick={fetchRoutines} className="h-4 w-4 filter-white hover:filter-blue-dark-300" iconUrl={Iconsax.bold['refresh.svg']}/>
                            </div>
                          </motion.div>
                        </>
                      : ''
                    }

                </AnimatePresence>

              </div>
              
            </div>       

            {/* Refresh Button */}
            <Container className="absolute shadow px-1 py-1 bottom-4 right-2 h-fit w-fit border-b-2 border-blue-300 cover-pointer">
              {
                !pageState.loading ?
                <Icon onClick={refresh} className="h-8 filter-blue-400 w-8" iconUrl={Iconsax.bold['refresh-2.svg']}/> 
                :
                <Loading className="h-5 w-5 mx-1 my-1 filter-blue-400"/>
              }
            </Container>  

      </LayerMain>
    </>
  );
}
