import React, { useRef } from "react";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Iconsax, getLocaleTime, getLocaleDate } from "../../utils";
import { useApiService } from "../../hooks_utils/ApiUtils";

import { Icon } from "../../components/Components";
import { LayerMain } from "../../components/Layers";
import { Input } from "../../components/ui/Inputs";

import { useNotifierController } from "../../hooks_utils/NotifierUtils";
import { useAppService } from "../../hooks_utils/AppUtils";
import { useNavigateService } from "../../hooks_utils/NavigateUtils";

import { useForm } from "react-hook-form";

export default function MaterialsAddPage() {
  // ========================================================================================================
  // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
  // ========================================================================================================
  const formRef = useRef(null);

  // -- Service And Controller
  const AppService = useAppService();
  const NotifierController = useNotifierController();

  const ApiService = useApiService();
  const NavigateService = useNavigateService();
  
  // -- Variable State
  const [action, setAction] = React.useState(false);

  // -- Dependencies
  const validator = yup.object().shape({
    title: yup.string().min(6).required(),
    date: yup.date().required(),
    time:yup.mixed().required('Time is required'),
    files:yup.mixed().required('File is required'), 
  })
  const { register, watch, formState, handleSubmit, setValue, getValues, setError } = useForm({
    resolver: yupResolver(validator),
    mode: 'onBlur' && 'onChange',
    delayError: 300,
    defaultValues: {
      title: '',
      date: getLocaleDate('yyyy-mm-dd'),
      time: getLocaleTime(),
      files: '',
    },
  });
  const regisrator = {
    title: register('title', validator.title),
    date: register('date', validator.date),
    time: register('time',validator.time),
    files: register('files', validator.files),
  }

  // ========================================================================================================
  // ------------------------------------------- REACT EFFECT -----------------------------------------------
  // ========================================================================================================
  React.useEffect(()=>{
    AppService.navigate.set.status( AppService.navigate.status().validate );
    AppService.navigate.set.message({
        title:'Konfirmasi',
        message:'Apakah anda yakin ingin berpindah halaman? data yang anda buat tidak akan tersimpan..'
    });
    
  },[])

  // ========================================================================================================
  // -------------------------------------------- FUNCTIONS -------------------------------------------------
  // ========================================================================================================
  function toggleAction(action) {
    setAction(action);
    
    if(action) AppService.navigate.set.status( AppService.navigate.status().fixed );
    else       AppService.navigate.set.status( AppService.navigate.status().initial );

    NotifierController.toggleLoading(action);
  }
  const formSubmit = async (e) => {
    if(action) return;
    toggleAction(true);

    // Use Try And Catch So If There's an Error on the App Can Still Be Run
    try{
      const fetch = await ApiService.fetchAuth({
        slug:'material',
        data:e,
        method:'post',
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })

      // Generate Notification Title And Message
      var title = ApiService.generateApiTitle(fetch);
      var msg = ApiService.generateApiMessage(fetch,(e)=>{
        console.log(e);
        if(e.status == 422) return e.response.message;
      });

      // --- Handling Success
      if(fetch.status == 200){
        NotifierController.addNotification({
          title:title,
          message:msg,
          type:'Success',
        })

        toggleAction(false);
        NavigateService.redirect('/');
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
  

  return (
    <>
      {/* ================== HEADER ==================== */}
      <div className="h-[40px] w-full px-3 py-2 box-border flex mt-2 justify-between">
        <div className="h-fit w-fit">
            <Icon onClick={()=>{ NavigateService.redirectBasedApp('/dashboard'); }} className="h-6 w-6 filter-blue-400 cursor-pointer" iconUrl={Iconsax.bold["arrow-left-2"]} />
        </div>
        
        <div className="h-fit w-fit flex gap-2 items-center">
          <Icon className="filter-blue-400 h-5 w-5" iconUrl={Iconsax.bold['home']}/>
          <h1 className="text-blue-400 text-lg font-semibold tracking-wide">Home</h1>
        </div>
        
        <div className="h-fit w-fit">
        <Icon onClick={()=>{ formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })) }} className="h-6 w-6 filter-blue-400 cursor-pointer" iconUrl={Iconsax.bold["add-circle.svg"]} />
        </div>
      </div>

      {/* ================ CONTENT ================= */}
      <LayerMain id='MAIN_CONTENT' className="px-3 py-2 overflow-auto h-full flex flex-col">
        <form ref={formRef} encType="multipart/form-data" onSubmit={handleSubmit(formSubmit)}>
          <label className="text-1sm text-blue-dark-300 mb-4 font-medium tracking-wide">Title</label>
          <Input formState={formState} register={regisrator.title} className='mb-6 h-fit' placeholder='Title' />
          <div className="flex justify-between gap-2">
            <div className="flex-1">
              <label className="text-1sm text-blue-dark-300 mb-4 font-medium tracking-wide">Date</label>
              <Input formState={formState} register={regisrator.date} type='date' className='mb-6 h-fit' placeholder='Date' />
            </div>
            <div className="flex-1">
              <label className="text-1sm text-blue-dark-300 mb-4 font-medium tracking-wide">Hour</label>
              <Input formState={formState} register={regisrator.time} type='time' className='mb-6 h-fit' placeholder='Time' />
            </div>
          </div>
          <label className="text-1sm text-blue-dark-300 mb-4 font-medium tracking-wide">File</label>
          <Input formState={formState} register={regisrator.files} type='file' className='mb-6 h-fit' placeholder='File' />
        </form>
      </LayerMain>
    </>
  );
}
