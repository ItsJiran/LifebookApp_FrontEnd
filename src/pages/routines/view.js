import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Iconsax, getLocaleTime, getLocaleDate, CustomDate, FilePath } from "../../utils";
import { useApiService } from "../../hooks_utils/ApiUtils";

import { CircleDecoration, Container, Icon, Loading } from "../../components/Components";
import { LayerMain } from "../../components/Layers";
import { Input } from "../../components/ui/Inputs";
import { RoutineDatePicker } from "../../components/ui/Date";

import { useNotifierController } from "../../hooks_utils/NotifierUtils";
import { useAppService } from "../../hooks_utils/AppUtils";
import { useNavigateService } from "../../hooks_utils/NavigateUtils";

import { useChoicerController } from "../../hooks_utils/ChoicerUtils";
import { useForm } from "react-hook-form";


export default function JournalsAddPage() {
  // ========================================================================================================
  // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
  // ========================================================================================================  
  const params = useParams();

  // -- Service And Controller
  const AppService = useAppService();
  const NotifierController = useNotifierController();
  const ChoicerController = useChoicerController();

  const ApiService = useApiService();
  const NavigateService = useNavigateService();
  
  // -- Variable State  
  const [action, setAction] = React.useState(false);
  const [tool, setTool] = React.useState('Select');
  const [queryDate,setQueryDate] = React.useState( new CustomDate() );

  const period_keys = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

  const [informState, setInformState] = React.useState({
    loading:false,
    error:false,
    data:{},
  });
  const [logState, setLogState] = React.useState({
    loading:false,
    error:false,
    data:{},
  });

  // For Choicer
  const elmChoices = ( 
    <>
      {
        informState.data.type == 'incremental' ? <>
          <div onClick={ ()=>{ ChoicerController.action('Plus') } } className="w-full px-2 py-2 flex align-center items-center">
              <Icon className="filter-blue-dark-300 h-6 w-6 mr-3 cursor-pointer" iconUrl={Iconsax.bold['add.svg']}/>
              <label className="text-blue-dark-300 text-sm font-semibold tracking-wide leading-4 cursor-pointer">Add</label>
          </div>

          <div onClick={ ()=>{ ChoicerController.action('Minus') } } className="w-full px-2 py-2 flex align-center items-center">
              <Icon className="filter-blue-dark-300 h-6 w-6 mr-3 cursor-pointer" iconUrl={Iconsax.bold['minus.svg']}/>
              <label className="text-blue-dark-300 text-sm font-semibold tracking-wide leading-4 cursor-pointer">Minus</label>
          </div>   

          <div className="w-full my-2 border-b-[1.5px] top-0 h-[60%] border-blue-300 left-0"></div>
        </> : <></>
      }

      <div onClick={ ()=>{ ChoicerController.action('Select') } } className="w-full px-2 py-2 flex align-center items-center">
          <Icon className="filter-blue-dark-300 h-6 w-6 mr-3 cursor-pointer" iconUrl={Iconsax.bold['mouse-1.svg']}/>
          <label className="text-blue-dark-300 text-sm font-semibold tracking-wide leading-4 cursor-pointer">Select</label>
      </div>

      <div onClick={ ()=>{ ChoicerController.action('Done') } } className="w-full px-2 py-2 flex align-center items-center">
          <Icon className="filter-blue-400 h-6 w-6 mr-3 cursor-pointer" iconUrl={Iconsax.bold['tick-square.svg']}/>
          <label className="text-blue-dark-300 text-sm font-semibold tracking-wide leading-4 cursor-pointer">Add Done</label>
      </div>

      <div onClick={ ()=>{ ChoicerController.action('Remove') } } className="w-full px-2 py-2 flex align-center items-center">
          <Icon className="filter-red-400 h-6 w-6 mr-3 cursor-pointer" iconUrl={Iconsax.bold['close-square.svg']}/>
          <label className="text-blue-dark-300 text-sm font-semibold tracking-wide leading-4 cursor-pointer">Add Remove</label>
      </div>
  </> )

  // ========================================================================================================
  // ------------------------------------------- REACT EFFECT -----------------------------------------------
  // ========================================================================================================
  React.useEffect(()=>{
    fetchInformation();
    fetchLog();

    AppService.navigate.set.status( AppService.navigate.status().validate );
    AppService.navigate.set.message({
        title:'Konfirmasi',
        message:'Apakah anda yakin ingin berpindah halaman?'
    });
  },[]);

  // ========================================================================================================
  // -------------------------------------------- FUNCTIONS -------------------------------------------------
  // ========================================================================================================
  function toggleAction(action) {
    setAction(action);
    
    if(action) AppService.navigate.set.status( AppService.navigate.status().fixed );
    else       AppService.navigate.set.status( AppService.navigate.status().validate );

    if(!action) AppService.navbar.set.status( AppService.navbar.status().show );
    else        AppService.navbar.set.status( AppService.navbar.status().hidden );

    NotifierController.toggleLoading(action);
  }

  const fetchLog = async (insert = undefined) => {
    if (logState.loading) return;    

    setLogState((prev)=>({...logState, loading:true}));
    
    if(insert == undefined) insert = queryDate;

    try{      
      var month = parseInt(insert.current.month) + 1;
      let date_params = '/' + insert.current.year + '/' + month;
      
      const fetch = await ApiService.fetchAuth({ slug: 'routine/query/' + params.id + date_params, method: 'get'});

      // Generate Notification Title And Message
      var title = ApiService.generateApiTitle(fetch);
      var msg = ApiService.generateApiMessage(fetch);

      // --- Handle Error Network
      if (fetch.code == 'ERR_NETWORK') {
          setLogState((prev) => ({ ...prev, loading:false, error: true }));
          toggleAction(false);
          return;
      }

      // --- Handling Success
      if (fetch.status >= 200 && fetch.status < 300) {
        let data = fetch.response.data;            
        setLogState((prev) => ({ ...prev, error: false, data: data }));
      }

      // --- Handle Client Request Failed      
      if (fetch.status > 400) {
        if (ApiService.isAxiosError(fetch)) console.error(fetch);
        toggleAction(false);        
        setLogState((prev) => ({ ...prev, error: true, data: {} }));        
    }

      toggleAction(false);        
      setLogState((prev)=>({ ...prev, loading:false}));
    } catch(e) {
      if (e instanceof Error || ApiService.isReturnError(e)) {
        console.error('ERROR_INSTANCE', e);
        if (e.isNotifier) {
            NotifierController.addNotification({
                title: e.title ? e.title : 'Terjadi Kesalahan Sistem',
                message: e.message ? e.message : 'Terjadi kesalahan pada sistem yang sedang berjalan..',
                type: 'Error',
            })
        }
      } else {
          console.error(e);
      }
      
      setLogState((prev) => ({ ...prev, loading:false, error: true, data: {} }));        
    }
  }

  const fetchInformation = async () => {
    if (informState.loading) return;    

    setInformState({...informState, loading:true});
    
    try{
      const fetch = await ApiService.fetchAuth({ slug: 'routine/info/' + params.id, method: 'get'});

      // Generate Notification Title And Message
      var title = ApiService.generateApiTitle(fetch);
      var msg = ApiService.generateApiMessage(fetch);

      // --- Handle Error Network
      if (fetch.code == 'ERR_NETWORK') {
          setInformState((prev) => ({ ...prev, loading:false, error: true }));
          toggleAction(false);
          return;
      }

      // --- Handling Success
      if (fetch.status >= 200 && fetch.status < 300) {
        let data = fetch.response.data;
        setInformState((prev) => ({ ...prev, error: false, data: data }));
      }

      // --- Handle Client Request Failed      
      if (fetch.status > 400) {
        if (ApiService.isAxiosError(fetch)) console.error(fetch);

        NotifierController.addNotification({
            title: title,
            message: msg,
            type: 'Error',
        });

        toggleAction(false);        
        return NavigateService.redirect('/routines');
    }

      toggleAction(false);        
      setInformState((prev)=>({ ...prev, loading:false}));
    } catch(e) {
      if (e instanceof Error || ApiService.isReturnError(e)) {
        console.error('ERROR_INSTANCE', e);
        if (e.isNotifier) {
            NotifierController.addNotification({
                title: e.title ? e.title : 'Terjadi Kesalahan Sistem',
                message: e.message ? e.message : 'Terjadi kesalahan pada sistem yang sedang berjalan..',
                type: 'Error',
            })
        }
      } else {
          console.error(e);
      }

      setInformState({...informState, loading:false});
    }
  }

  async function onClickTool(id){
    const result = await ChoicerController.show(elmChoices);
    return setTool((prev)=>result);
  }

  async function onDayClick(dateObj){
    if(tool == 'Select') return;
    if(action) return;
    toggleAction(true);

    try{
      let fetch = undefined;
      let date_params = '/' + dateObj.current.year + '/' + parseInt(dateObj.current.month + 1) + '/' + dateObj.current.day.date;
      
      if(tool == 'Plus')
        fetch = await ApiService.fetchAuth({ slug: 'routine/plus/' + params.id + date_params, method: 'put'});
      else if (tool == 'Minus')
        fetch = await ApiService.fetchAuth({ slug: 'routine/minus/' + params.id + date_params, method: 'put'});
      else if (tool == 'Done')
        fetch = await ApiService.fetchAuth({ slug: 'routine/done/' + params.id + date_params, method: 'put'});
      else if (tool == 'Remove')
        fetch = await ApiService.fetchAuth({ slug: 'routine/remove/' + params.id + date_params, method: 'put'});

      // Generate Notification Title And Message
      var title = ApiService.generateApiTitle(fetch);
      var msg = ApiService.generateApiMessage(fetch);      

      // --- Handling Success
      if (fetch.status >= 200 && fetch.status < 300) {
        let data = fetch.response.data;
        let new_data = logState.data;

        if(data.new_data !== undefined && data.new_data !== 'removed'){
          new_data[data.new_data.date] = data.new_data;
        } else if (data.new_data == 'removed') {
          let month = (dateObj.current.month).toString().length == 1 ? '0' + (dateObj.current.month + 1) : (dateObj.current.month + 1) ;
          let day = (dateObj.current.day.date).toString().length == 1 ? '0' + (dateObj.current.day.date) : (dateObj.current.day.date) ;
          let date_str = dateObj.current.year + '-' + month + '-'  + day;

          delete new_data[date_str];
        }
        
        setLogState((prev) => ({ ...prev, error: false, data: new_data}));                
      }

      // --- Handle Client Request Failed      
      else if (fetch.status !== 200) {
        if (ApiService.isAxiosError(fetch)) console.error(fetch);

        NotifierController.addNotification({
            title: title,
            message: msg,
            type: 'Error',
        });
      }

    } catch(e) {
      if (e instanceof Error || ApiService.isReturnError(e)) {
        console.error('ERROR_INSTANCE', e);
        if (e.isNotifier) {
            NotifierController.addNotification({
                title: e.title ? e.title : 'Terjadi Kesalahan Sistem',
                message: e.message ? e.message : 'Terjadi kesalahan pada sistem yang sedang berjalan..',
                type: 'Error',
            })
        }
      } else {
          console.error(e);
      }
    }

    toggleAction(false);
  }

  const refresh = async () => {    
    await fetchInformation();
    await fetchLog();
  }

  return (
    <>
      {/* ================== HEADER ==================== */}
      <div className="bg-blue-400 rounded-b-[30px] pt-2 relative">
        <div className="h-[40px] w-full px-3 pt-2 box-border flex justify-between">
          <div className="h-fit w-fit">
              <Icon onClick={()=>{ NavigateService.redirectBasedApp('/routines'); }} className="h-6 w-6 filter-white cursor-pointer" iconUrl={Iconsax.bold["arrow-left-2"]} />
          </div>
          
          <div className="h-fit w-fit flex gap-2 items-center">
            <Icon className="filter-white h-5 w-5" iconUrl={Iconsax.bold['archive-tick']}/>
            <h1 className="text-white text-lg font-semibold tracking-wide">Routines</h1>
          </div>
          
          <div className="h-fit w-fit">
            <Icon onClick={ ()=>{ NavigateService.redirectBasedApp('/routines/edit/'+params.id); } } className="h-6 w-6 filter-white cursor-pointer" iconUrl={Iconsax.bold["edit.svg"]} />
          </div>
        </div>
        <div>

        <RoutineDatePicker refresh={refresh} action={action} fetchLog={fetchLog} informState={informState} logState={logState} onDayClick={onDayClick} inputDate={queryDate} setInputDate={setQueryDate}/>

        </div>
      </div>

      {/* ================ CONTENT ================= */}

      <LayerMain id='MAIN_CONTENT' className="px-3 py-2 relative h-full flex flex-col">

        { !informState.loading && informState.error ? <>

          <div className="flex flex-col items-center text-center w-fit mx-auto h-fit flex px-2 py-2 text-1sm text-blue-dark-200 tracking-wide">
            <h2 className="font-semibold">Terjadi Kesalahan</h2>
            <p className="mb-2">Klik tombol dibawah ini untuk mencoba lagi</p>
            <div className="h-fit w-fit px-1 py-1 bg-blue-400 rounded-full"><Icon onClick={refresh} className="h-4 w-4 filter-white hover:filter-blue-dark-300" iconUrl={Iconsax.bold['refresh-2.svg']}/>
            </div>
          </div>            

        </> : <></> }

        { !informState.loading && !informState.error ? <>

        <div className="flex items-center mx-2 my-4 gap-6">
          <div className="w-min overflow-hidden rounded-full px-4 py-4 aspect-square relative">
            <div style={{'backgroundColor':informState.data.color}} className="absolute top-0 left-0 h-full w-full opacity-20"></div>
            <Icon style={{'filter':informState.data.filter_color}}  className="h-[55px] w-[55px] relative cursor-pointer" iconUrl={ FilePath.icons.routines + informState.data.icon } />                              
          </div>
          <div className="flex-col flex-1 gap-2 align-middle">
              <h2 className="filter-blue-dark-300 text-md font-semibold"> { informState.data.title } </h2>
              <p className="filter-blue-dark-400 text-sm font-regular"> { informState.data.description } </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute w-full border-b-[1.5px] top-0 h-[60%] border-blue-300 left-0"></div>
          <label className="text-1sm text-blue-dark-300 mb-2 font-semibold px-2 bg-white tracking-wide relative">Type</label>
        </div>

        <div className="flex gap-1 mb-2 px-2 py-2 items-center">

          { informState.data.type == 'checklist' ?
            <Icon className="h-[25px] w-[25px] filter-blue-400 relative cursor-pointer" 
            iconUrl={ Iconsax.bold['tick-square.svg'] } />
          : 
            <Icon className="h-[25px] w-[25px] filter-blue-400 relative cursor-pointer" 
            iconUrl={ Iconsax.bold['activity.svg'] } />
          }
          
          <p className="text-sm text-blue-dark-300 font-regular px-2 bg-white tracking-wide relative">  
            {informState.data.type}
          </p>
        </div>

        <div className="relative">
          <div className="absolute w-full border-b-[1.5px] top-0 h-[60%] border-blue-300 left-0"></div>
          <label className="text-1sm text-blue-dark-300 mb-2 font-semibold px-2 bg-white tracking-wide relative">Values</label>
        </div>        
        {
          <div className="flex-col gap-2 mb-2">                    
            <div className="relative flex justify-between items-center">
              <div className="absolute border-b-2 w-full border-blue-200 border-dashed top-2/4" style={{transform:'translateY(-50%)'}}></div>
              <div className="relative gap-2 flex text-center px-2 py-2 font-semibold text-sm bg-white text-blue-400"><label className="text-1sm">min</label><h3>0</h3></div>                                          
              <div className="relative gap-2 flex text-center px-2 py-2 font-semibold text-sm bg-white text-blue-400"><h3>{informState.data.max_val}</h3><label className="text-1sm">max</label></div>
            </div>
          </div>
        }

        <div className="relative">
          <div className="absolute w-full border-b-[1.5px] top-0 h-[60%] border-blue-300 left-0"></div>
          <label className="text-1sm text-blue-dark-300 mb-2 font-semibold px-2 bg-white tracking-wide relative">Period</label>
        </div>        
        <div className="flex mt-2 mb-6 gap-3 justify-between mx-5">
          {
            informState.data.period !== undefined ?
              period_keys.map((val,key)=>{
                let vals = informState.data.period;                              

                if(vals[val]) {
                  return <div className="relative rounded-full min-w-[35px] aspect-square font-semibold text-1sm bg-blue-400 text-white">                          
                      <label className="absolute mx-auto justify-center cursor-pointer items-center h-full w-full flex top-0 left-0">{val[0].toUpperCase() + val[1]}</label>                          
                  </div>
                } else {
                  return <div className="relative rounded-full min-w-[35px] aspect-square font-semibold text-1sm text-blue-400">                          
                      <label className="absolute mx-auto justify-center cursor-pointer items-center h-full w-full flex top-0 left-0">{val[0].toUpperCase() + val[1]}</label>                          
                  </div>
                }

              }) 
              : <></>
          }
        </div>

        </> : <></> }

      </LayerMain>

        {/* Refresh Button */}
        <div className="flex flex-row-reverse bottom-4 mr-2 sticky">
          <div className="flex flex-col gap-4 w-fit">
            <Container className="shadow px-1 py-1 h-fit w-fit border-b-2 border-blue-300 cover-pointer">        
                {               
                  tool == 'Plus' ? <Icon onClick={onClickTool} className="filter-blue-dark-300 h-8 w-8 cursor-pointer" iconUrl={Iconsax.bold['add.svg']}/> : <></>
                }
                {               
                  tool == 'Minus' ? <Icon onClick={onClickTool} className="filter-blue-dark-300 h-8 w-8 cursor-pointer" iconUrl={Iconsax.bold['minus.svg']}/> : <></>                
                }
                {               
                  tool == 'Select' ? <Icon onClick={onClickTool} className="filter-blue-dark-300 h-8 w-8 cursor-pointer" iconUrl={Iconsax.bold['mouse-1.svg']}/> : <></>
                }
                {               
                  tool == 'Done' ? <Icon onClick={onClickTool} className="filter-blue-400 h-8 w-8 cursor-pointer" iconUrl={Iconsax.bold['tick-square.svg']}/> : <></>
                }
                {               
                  tool == 'Remove' ? <Icon onClick={onClickTool} className="filter-red-400 h-8 w-8 cursor-pointer" iconUrl={Iconsax.bold['close-square.svg']}/> : <></>                                
                }
            </Container> 

            <Container className="shadow px-1 py-1  h-fit w-fit border-b-2 border-blue-300 cover-pointer">        
              { !informState.loading ?
                <Icon onClick={refresh} className="h-8 filter-blue-400 w-8" iconUrl={Iconsax.bold['refresh-2.svg']}/> 
                :
                <Loading className="h-5 w-5 mx-1 my-1 filter-blue-400"/>          }
            </Container> 
          </div>
        </div>

    </>
  );
}
