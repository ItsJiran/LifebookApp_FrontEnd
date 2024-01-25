import React, { useRef } from "react";
import * as yup from 'yup';
import { AxiosError } from "axios";
import { yupResolver } from '@hookform/resolvers/yup';
import { AnimatePresence, motion } from "framer-motion";

import { Iconsax, TimingMotions, AnimateMotions, filterColor, filterAccurate, getLocaleTime, getLocaleDate, FilePath } from "../../utils";
import { useApiService } from "../../hooks_utils/ApiUtils";

import { CircleDecoration, Container, Icon } from "../../components/Components";
import { LayerMain } from "../../components/Layers";
import { Input, Select } from "../../components/ui/Inputs";

import { useNotifierController } from "../../hooks_utils/NotifierUtils";
import { useAppService } from "../../hooks_utils/AppUtils";
import { useNavigateService } from "../../hooks_utils/NavigateUtils";
import { useChoicerController } from "../../hooks_utils/ChoicerUtils";

import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

export default function RoutinesEditPage() {
  // ========================================================================================================
  // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
  // ========================================================================================================
  const formRef = useRef(null);
  const params = useParams();

  // -- Service And Controller
  const AppService = useAppService();
  const NotifierController = useNotifierController();
  const ChoicerController = useChoicerController();

  const ApiService = useApiService();
  const NavigateService = useNavigateService();
  
  // -- Variable State
  const [action, setAction] = React.useState(false);
  
  const [icon,setIcon] = React.useState('default.svg');
  const [color,setColor] = React.useState('#5185E4');
  const [filterColorHtml, setFilterColor] = React.useState( filterColor(color) );

  const period_keys = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  const [period_vals, setPeriodVals] = React.useState([true,false,false,false,false,false,false]);

  const [ApiIcons, setApiIcons] = React.useState({
    loading:false,
    error:false,
    data:[],
  });

  // -- Dependencies
  const [informState, setInformState] = React.useState({
    loading:false,
    error:false,
    data:{},
  });

  const routines_types = ["checklist","incremental"];
  const [type, setType] = React.useState(routines_types[0]);
  const [max, setMax] = React.useState(1);

  const validator = yup.object().shape({
    title: yup.string().min(6).required(),
    description: yup.string().min(6).max(60).required(),    
  })
  const { register, watch, formState, handleSubmit, setValue, getValues, setFocus, setError } = useForm({
    resolver: yupResolver(validator),
    mode: 'onBlur' && 'onChange',
    delayError: 300,
    defaultValues: {
      title: '',        
      type: routines_types[0],
      description: 'Rutinitas saya..',
    },
  });
  
  const regisrator = {
    title: register('title', validator.title),
    description: register('description', validator.description),  
    type: register('type',validator.type),    
  }

  // For Choicer
  const elmChoices = (     
    <>

        {
          !ApiIcons.loading && ApiIcons.data.length > 0 && !ApiIcons.error ?
            <div className="grid-cols-3 grid gap-5 max-h-56 overflow-auto">
              {ApiIcons.data.map((data)=>{                           
                return (
                  <motion.div key={data.id} {...{...AnimateMotions['fade-in'],...TimingMotions['ease-0.5']}} className="bg-white w-full cursor-pointer rounded-md h-full border-blue-200 h-fit flex px-2 py-2 gap-2">
                    <div className="flex-col w-full gap-2 rounded-md text-center" onClick={()=>{ ChoicerController.action(['choice',data.title]) }}>
                      <Icon style={{'filter':filterColorHtml}} className="h-[30px] mx-auto w-[30px]" iconUrl={FilePath.icons.routines + data.title}/>
                      <label className="text-1sm mt-5">{data.title}</label>
                    </div>
                  </motion.div>              
                ); })
              }
            </div>
          : ''
        }

        { ApiIcons.loading ?  
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
          !ApiIcons.loading && ApiIcons.error ? 
            <>
              <motion.div key='error-fetch' {...{...AnimateMotions['fade-in'],...TimingMotions['ease-0.5']}} className="flex flex-col items-center text-center w-fit mx-auto h-fit flex px-2 py-2 text-1sm text-blue-dark-200 tracking-wide">
                <h2 className="font-semibold">Terjadi Kesalahan</h2>
                <p className="mb-2">Klik tombol dibawah ini untuk mencoba lagi</p>
                <div className="h-fit w-fit px-1 py-1 bg-blue-400 rounded-full"><Icon onClick={ ChoicerController.action(['retry']) } className="h-4 w-4 filter-white hover:filter-blue-dark-300" iconUrl={Iconsax.bold['refresh.svg']}/>
                </div>
              </motion.div>
            </>
          : ''
        }


    </> )

  // ========================================================================================================
  // ------------------------------------------- REACT EFFECT -----------------------------------------------
  // ========================================================================================================
  React.useEffect(()=>{
    fetchInformation();
    fetchIcons();

    AppService.navigate.set.status( AppService.navigate.status().validate );
    AppService.navigate.set.message({
        title:'Konfirmasi',
        message:'Apakah anda yakin ingin berpindah halaman?'
    });

    return () => {

    };
  },[]);
  React.useEffect(()=>{

  },[formState.errors]);
  React.useEffect(() => {    
    setType(getValues('type'));    
  }, [watch('type')]);

  // ========================================================================================================
  // -------------------------------------------- FUNCTIONS -------------------------------------------------
  // ========================================================================================================
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

        setColor(data.color);
        setFilterColor(data.filter_color);
        setType(data.type);

        setMax(data.max_val);
        setIcon(data.icon);

        setValue('title',data.title);
        setValue('description',data.description);
        setValue('type', data.type);
        
        let values = [];
        
        for( let key of period_keys ){
          
          if(data.period[key]) values.push(true);
          else                 values.push(false);
        }

        setPeriodVals(values);
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

  function toggleAction(action) {
    setAction(action);
    
    if(action) AppService.navigate.set.status( AppService.navigate.status().fixed );
    else       AppService.navigate.set.status( AppService.navigate.status().validate );

    if(!action) AppService.navbar.set.status( AppService.navbar.status().show );
    else        AppService.navbar.set.status( AppService.navbar.status().hidden );

    NotifierController.toggleLoading(action);
  }
  const clickSubmit = async (e) => {    
    formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }
  const formSubmit = async (e) => {
    if(action) return;
    toggleAction(true);

    let period_obj = {};

    for( let index in period_keys ){
      period_obj[period_keys[index]] = period_vals[index];
    }

    let data = {
      ...e,
      icon:icon,
      color:color,
      filterColor:filterColorHtml,
      periodObj:period_obj,      
    };

    if(e.type == 'incremental') data.max = max;
    else                        data.max = 1;
  
    try{
      var fetch = await ApiService.fetchAuth({slug:'routine/'+params.id,data:data,method:'put'});

      // Generate Notification Title And Message
      var title = ApiService.generateApiTitle(fetch);
      var msg = ApiService.generateApiMessage(fetch);      
      
      // --- Handling Success
      if(fetch.status >= 200 && fetch.status < 300){
        NotifierController.addNotification({
          title:title,
          message:msg,
          type:'Success',
        })

        toggleAction(false);
        return NavigateService.redirect('/routines/view/'+params.id);
      }

      // --- Handle Client Request Failed
      else if (fetch.status !== 200){
        if(ApiService.isAxiosError(fetch)) console.error(fetch);

        NotifierController.addNotification({
          title:title,
          message:msg,
          type:'Error',
        });

        // Set Error Form
        if(fetch.status >= 400 && fetch.response.data.errors){
          for(var key in fetch.response.data.errors){
            var error = fetch.response.data.errors[key];
            if(Array.isArray(error)) setError(key,{message:error[0]});
            else                     setError(key,{message:error});
          }
        }

      }
      
    } catch (e) {
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

  const fetchIcons = async () => {    
    try{
      var fetch = await ApiService.fetchAuth({slug:'routines/icons',method:'get'});

      // Generate Notification Title And Message
      var title = ApiService.generateApiTitle(fetch);
      var msg = ApiService.generateApiMessage(fetch);

      // --- Handling Success
      if(fetch.status >= 200 && fetch.status < 300){
        setApiIcons({loading:false, error:false, data:fetch.response.data });  
      }

      // --- Handle Client Request Failed
      else if (fetch.status !== 200 || fetch instanceof Axios){
        if(fetch instanceof AxiosError) console.error(fetch);

        NotifierController.addNotification({
          title:title,
          message:msg,
          type:'Error',
        });

        setApiIcons({loading:false, error:true, data:[]});  
      }

    } catch (e) {
      setApiIcons({loading:false, error:true, data:[]});
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
    const [result,data] = await ChoicerController.show(elmChoices);    
    if(result == 'choice') return setIcon(data);
  }

  const refresh = async () => {    
    await fetchInformation();
  }

  return (
    <>
      {/* ================== HEADER ==================== */}
      <div className="h-[40px] w-full px-3 py-2 box-border flex mt-2 justify-between">
        <div className="h-fit w-fit">
            <Icon onClick={()=>{ NavigateService.redirectBasedApp('/routines/view/'+params.id); }} className="h-6 w-6 filter-blue-400 cursor-pointer" iconUrl={Iconsax.bold["arrow-left-2"]} />
        </div>
        
        <div className="h-fit w-fit flex gap-2 items-center">
          <Icon className="filter-blue-400 h-5 w-5" iconUrl={Iconsax.bold['calendar-tick']}/>
          <h1 className="text-blue-400 text-lg font-semibold tracking-wide">Routines</h1>
        </div>
        
        <div className="h-fit w-fit">
        { !informState.loading && !informState.error ? <>
          <Icon onClick={ clickSubmit } className="h-6 w-6 filter-blue-400 cursor-pointer" iconUrl={Iconsax.bold["tick-circle.svg"]} />
          </> : <></> }
        </div>
      </div>

      {/* ================ CONTENT ================= */}

      <LayerMain id='MAIN_CONTENT' className="px-3 py-2 overflow-auto h-full flex flex-col">
        { informState.loading ? <>
        
        </> : <></> }
        { !informState.loading && !informState.error ? <>
          <form ref={formRef} className='h-full relative flex flex-col' encType="multipart/form-data" onSubmit={handleSubmit(formSubmit)}>

<div className="relative flex flex-col">

    <div className="w-min overflow-hidden mx-auto my-5 rounded-full px-4 py-4 aspect-square relative">
      <div style={{'backgroundColor':color}} className="absolute top-0 left-0 h-full w-full opacity-20"></div>
      <Icon style={{'filter':filterColorHtml}}  className="h-32 w-32 relative cursor-pointer" iconUrl={ FilePath.icons.routines + icon } />                              
    </div>

    <label className="text-1sm text-blue-dark-300 mb-2 font-medium tracking-wide">Title</label>
    <Input formState={formState} register={regisrator.title} className='mb-2 h-fit py-[3px]' placeholder='Title' />

    <div className="flex justify-between gap-2 mb-3">
        <div className="flex-1">
            <label className="text-1sm text-blue-dark-300 block font-medium tracking-wide pb-2">Icon</label>
            <div onClick={onClickMaterial} className="flex cursor-pointer gap-2 items-center min-h-[40px] px-2 w-full text-sm border-b-2 border-blue-200 text-blue-dark-300">                            
                <Icon style={{'filter':filterColorHtml}} className="h-6 w-6 cursor-pointer" iconUrl={ FilePath.icons.routines + icon } />                            
                <label className='text-1sm cursor-pointer text-blue-dark-300 block font-medium'>{ icon }</label>
            </div>
        </div>
        <div className="flex-1">
            <label className="text-1sm text-blue-dark-300 block font-medium tracking-wide pb-2">Color</label>
            <div className="flex gap-2 items-center min-h-[40px] px-2 w-full text-sm border-b-2 border-blue-200 text-blue-dark-300">
                <input id='color' type='color' onChange={(val)=>{ setColor(val.target.value); setFilterColor( filterColor(val.target.value)) }} value={color} className='w-[25px] h-[25px]' placeholder='Description' />
                <label htmlFor='color' onClick={ function(){ setFocus('color') } } className='text-1sm text-blue-dark-300 block font-medium'>{ color }</label>
            </div>
        </div>
    </div>

    <label className="text-1sm text-blue-dark-300 mb-2 font-medium tracking-wide">Type</label>
    <Select formState={formState} register={regisrator.type} options={routines_types} className='mb-2 :focus:outline-0 border-collapse h-fit py-[3px]' placeholder='Type' />

    {
      type == 'incremental' ? <div className="flex-col gap-2">                    
        <div className="relative flex justify-between items-center">
          <div className="absolute border-b-2 w-full border-blue-200 border-dashed top-2/4" style={{transform:'translateY(-50%)'}}></div>
          <div className="relative gap-2 flex text-center px-2 py-2 font-semibold text-sm bg-white text-blue-400"><label className="text-1sm">min</label><h3>0</h3></div>                                          
          <div className="relative gap-2 flex text-center px-2 py-2 font-semibold text-sm bg-white text-blue-400"><h3>{max}</h3><label className="text-1sm">max</label></div>
        </div>
        <div className="flex gap-2 w-min mx-auto">                   
          <Icon onClick={ ()=>{ if(max > 1) setMax(max - 1) } } className="h-5 w-5 filter-red-400 cursor-pointer" iconUrl={ Iconsax.bold['minus-circle.svg'] } />                            
          <Icon onClick={ ()=>{ setMax(max + 1) } } className="h-5 w-5 filter-blue-400 cursor-pointer" iconUrl={ Iconsax.bold['add.svg'] } />                                            
        </div>
      </div> : <></> 
    }

    <label className="text-1sm text-blue-dark-300 mb-2 font-medium border-b-2 py-2 border-blue-200 tracking-wide">Period</label>
    <div className="flex mt-2 mb-6 gap-3 justify-between mx-5">

      {
        period_keys.map((val,key)=>{
          let vals = period_vals;                      
          
          if(vals[key]) {
            return <div onClick={()=>{ setPeriodVals(period_vals.map((c,i)=>{ return i == key && period_vals.filter( (e)=>{ if(e) {return e} }).length > 1 ? false : c ; }) ) }} className="relative rounded-full min-w-[35px] aspect-square font-semibold text-1sm bg-blue-400 text-white">                          
                <label className="absolute mx-auto justify-center cursor-pointer items-center h-full w-full flex top-0 left-0">{val[0].toUpperCase() + val[1]}</label>                          
            </div>
          } else {
            return <div onClick={()=>{ setPeriodVals(period_vals.map((c,i)=>{ return i == key ? true : c ; }) ) }} className="relative rounded-full min-w-[35px] aspect-square font-semibold text-1sm text-blue-400">                          
                <label className="absolute mx-auto justify-center cursor-pointer items-center h-full w-full flex top-0 left-0">{val[0].toUpperCase() + val[1]}</label>                          
            </div>
          }

        })
      }

    </div>

    <label className="text-1sm text-blue-dark-300 block font-medium tracking-wide pb-2">Description</label>
    <Input formState={formState} type='textarea' register={regisrator.description} className='mb-2 h-fit py-[3px]' placeholder='Description' />

</div>

</form>
        </> : <></> }
        { !informState.loading && informState.error ? <>
          <div className="flex flex-col items-center text-center w-fit mx-auto h-fit flex px-2 py-2 text-1sm text-blue-dark-200 tracking-wide">
            <h2 className="font-semibold">Terjadi Kesalahan</h2>
            <p className="mb-2">Klik tombol dibawah ini untuk mencoba lagi</p>
            <div className="h-fit w-fit px-1 py-1 bg-blue-400 rounded-full"><Icon onClick={refresh} className="h-4 w-4 filter-white hover:filter-blue-dark-300" iconUrl={Iconsax.bold['refresh-2.svg']}/>
            </div>
          </div>        
        </> : <></> }      
      </LayerMain>
    </>
  );
}
