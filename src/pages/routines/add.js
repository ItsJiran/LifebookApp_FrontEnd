import React, { useRef } from "react";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// EDITOR JS
import EditorJS from "@editorjs/editorjs";
import EditorChecklist from "@editorjs/checklist";
import EditorHeader from "@editorjs/header";
import EditorList from "@editorjs/list";
import EditorParagraph from "@editorjs/paragraph";
import EditorDrag from "editorjs-drag-drop";

class CustomEditorParagraph extends EditorParagraph{
  validate(savedData) {
    return true;
  }
}

import { Iconsax, getLocaleTime, getLocaleDate } from "../../utils";
import { useApiService } from "../../hooks_utils/ApiUtils";

import { CircleDecoration, Container, Icon } from "../../components/Components";
import { LayerMain } from "../../components/Layers";
import { Input, Select } from "../../components/ui/Inputs";

import { useNotifierController } from "../../hooks_utils/NotifierUtils";
import { useAppService } from "../../hooks_utils/AppUtils";
import { useNavigateService } from "../../hooks_utils/NavigateUtils";

import { useForm } from "react-hook-form";

export default function RoutinesAddPage() {
  // ========================================================================================================
  // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
  // ========================================================================================================
  const formRef = useRef(null);
  const ejInstance = useRef(null);

  // -- Service And Controller
  const AppService = useAppService();
  const NotifierController = useNotifierController();

  const ApiService = useApiService();
  const NavigateService = useNavigateService();
  
  // -- Variable State
  const [action, setAction] = React.useState(false);

  // -- Dependencies
  const routines_types = ["checklist","incremental"];
  const validator = yup.object().shape({
    title: yup.string().min(6).required(),
    description: yup.string().min(6).required(),
    color: yup.string().trim().matches(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, 'Color must be in hexadecimal..').required(),
    time:yup.mixed().required('Time is required'),
  })
  const { register, watch, formState, handleSubmit, setValue, getValues, setFocus, setError } = useForm({
    resolver: yupResolver(validator),
    mode: 'onBlur' && 'onChange',
    delayError: 300,
    defaultValues: {
      title: '',
      icon:  '',
      color: '#5185E4',
      type: routines_types[0],
      description: 'Rutinitas saya..',
    },
  });
  
  const regisrator = {
    title: register('title', validator.title),
    description: register('description', validator.description),
    color: register('color', validator.color),
    type: register('type',validator.type),
    icon: register('icon',validator.icon),
  }

  // ========================================================================================================
  // ------------------------------------------- REACT EFFECT -----------------------------------------------
  // ========================================================================================================
  React.useEffect(()=>{
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
    console.log(formState);
  }, [watch]);
  

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
  const clickSubmit = async (e) => {
    formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }
  const formSubmit = async (e) => {
    if(action) return;
    toggleAction(true);


    toggleAction(false);
  }

  return (
    <>
      {/* ================== HEADER ==================== */}
      <div className="h-[40px] w-full px-3 py-2 box-border flex mt-2 justify-between">
        <div className="h-fit w-fit">
            <Icon onClick={()=>{ NavigateService.redirectBasedApp('/routines'); }} className="h-6 w-6 filter-blue-400 cursor-pointer" iconUrl={Iconsax.bold["arrow-left-2"]} />
        </div>
        
        <div className="h-fit w-fit flex gap-2 items-center">
          <Icon className="filter-blue-400 h-5 w-5" iconUrl={Iconsax.bold['calendar-tick']}/>
          <h1 className="text-blue-400 text-lg font-semibold tracking-wide">Routines</h1>
        </div>
        
        <div className="h-fit w-fit">
          <Icon onClick={ clickSubmit } className="h-6 w-6 filter-blue-400 cursor-pointer" iconUrl={Iconsax.bold["add-circle.svg"]} />
        </div>
      </div>

      {/* ================ CONTENT ================= */}

      <LayerMain id='MAIN_CONTENT' className="px-3 py-2 overflow-auto h-full flex flex-col">
        <form ref={formRef} className='h-full relative flex flex-col' encType="multipart/form-data" onSubmit={handleSubmit(formSubmit)}>

            <div className="relative flex flex-col">

                <label className="text-1sm text-blue-dark-300 mb-2 font-medium tracking-wide">Title</label>
                <Input formState={formState} register={regisrator.title} className='mb-2 h-fit py-[3px]' placeholder='Title' />

                <div className="flex justify-between gap-2 mb-3">
                    <div className="flex-1">
                        <label className="text-1sm text-blue-dark-300 block font-medium tracking-wide pb-2">Icon</label>
                        <div className="flex">
                        <Input formState={formState} type='text' register={regisrator.icon} className='mb-2 py-[3px] h-[25px]' placeholder='Icon' />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="text-1sm text-blue-dark-300 block font-medium tracking-wide pb-2">Color</label>
                        <div className="flex gap-2 items-center min-h-[40px] px-2 w-full text-sm border-b-2 border-blue-200 text-blue-dark-300">
                            <input id='color' type='color' {...regisrator.color} className='w-[25px] h-[25px]' placeholder='Description' />
                            <label htmlFor='color' onClick={ function(){ setFocus('color') } } className='text-1sm text-blue-dark-300 block font-medium'>{ getValues('color') }</label>
                        </div>
                    </div>
                </div>

                <label className="text-1sm text-blue-dark-300 mb-2 font-medium tracking-wide">Type</label>
                <Select formState={formState} register={regisrator.type} options={['checklist','increment']} className='mb-2 h-fit py-[3px]' placeholder='Type' />

                <label className="text-1sm text-blue-dark-300 block font-medium tracking-wide pb-2">Description</label>
                <Input formState={formState} type='textarea' register={regisrator.description} className='mb-2 h-fit py-[3px]' placeholder='Description' />

            </div>

        </form>
      </LayerMain>
    </>
  );
}
