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
import { Input } from "../../components/ui/Inputs";

import { useNotifierController } from "../../hooks_utils/NotifierUtils";
import { useAppService } from "../../hooks_utils/AppUtils";
import { useNavigateService } from "../../hooks_utils/NavigateUtils";

import { useForm } from "react-hook-form";

export default function JournalsAddPage() {
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
  const [zoom, setZoom] = React.useState(false);
  const [editorState, setEditorState] = React.useState(null);

  // -- Dependencies
  const validator = yup.object().shape({
    title: yup.string().min(6).required(),
    date: yup.date().required(),
    time:yup.mixed().required('Time is required'),
  })
  const { register, watch, formState, handleSubmit, setValue, getValues, setError } = useForm({
    resolver: yupResolver(validator),
    mode: 'onBlur' && 'onChange',
    delayError: 300,
    defaultValues: {
      title: '',
      date: getLocaleDate('yyyy-mm-dd'),
      time: getLocaleTime(),
    },
  });
  
  const regisrator = {
    title: register('title', validator.title),
    date: register('date', validator.date),
    time: register('time',validator.time),
  }

  // ========================================================================================================
  // ------------------------------------------- REACT EFFECT -----------------------------------------------
  // ========================================================================================================
  React.useEffect(()=>{
    var storage = JSON.parse(window.sessionStorage.getItem('UnsavedEditorJS__Input'));
    for (let key in storage) setValue(key, storage[key]);

    AppService.navigate.set.status( AppService.navigate.status().validate );
    AppService.navigate.set.message({
        title:'Konfirmasi',
        message:'Apakah anda yakin ingin berpindah halaman? data yang anda buat tidak akan tersimpan..'
    });

    if (ejInstance.current === null) initEditor();

    return () => {
      ejInstance?.current?.destroy();
      ejInstance.current = null;
    };
  },[]);
  React.useEffect(()=>{
    if(Object.keys(formState.errors).length > 0 && zoom) { 
      setZoom((zoom)=>false);
      if(zoom) AppService.navbar.set.status( AppService.navbar.status().show );
      else     AppService.navbar.set.status( AppService.navbar.status().hidden );
    }
  },[formState.errors]);
  React.useEffect(() => {
    watch((data) => {
      window.sessionStorage.setItem('UnsavedEditorJS__Input', JSON.stringify(watch(data)));
    });
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

    // adding editor_json value
    e.editor_json = JSON.stringify( await editorState.save() );
    
    // reformating date to iso format
    e.date = e.date.getFullYear() + '-' + ( e.date.getMonth() + 1 ) + '-' + e.date.getDate();
    console.log(e.date);

    // Use Try And Catch So If There's an Error on the App Can Still Be Run
    try{
      const fetch = await ApiService.fetchAuth({
        slug:'journals',
        data:e,
        method:'post',
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })

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

        window.sessionStorage.removeItem('UnsavedEditorJS__Input');
        window.sessionStorage.removeItem('UnsavedEditorJS__Blocks');

        return NavigateService.redirect('/journals');
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
  const initEditor = () => {
    const editor = new EditorJS({
       holder: 'editorjs',
       onReady: () => {
         ejInstance.current = editor;
         new EditorDrag(editor);
       },
       onChange: async () => {
         let content = await editor.saver.save();
         window.sessionStorage.setItem('UnsavedEditorJS__Blocks',JSON.stringify(content));
       },
       placeholder:'Write here..!!',
       tools:{
            header:{
                class:EditorHeader,
                inlineToolbar:true,
            },
            list:{
                class:EditorList,
                inlineToolbar:true,
            },
            checklist:{
                class:EditorChecklist,
                inlineToolbar:true
            },
            break_paragraph : {
              class:CustomEditorParagraph,
              inlineToolbar:false,
            },
            paragraph:{
                class:CustomEditorParagraph,
                inlineToolbar:true
            },
       },
       defaultBlock: 'break_paragraph',
       autofocus: true,
       data: window.sessionStorage.getItem('UnsavedEditorJS__Blocks') !== null ? JSON.parse( window.sessionStorage.getItem('UnsavedEditorJS__Blocks') ) : {},
     });
     setEditorState(editor);
   };

   const onZoom = ()=>{
    setZoom( zoom => !zoom );
    if(zoom) AppService.navbar.set.status( AppService.navbar.status().show );
    else     AppService.navbar.set.status( AppService.navbar.status().hidden );
   }

  return (
    <>
      {/* ================== HEADER ==================== */}
      <div className="h-[40px] w-full px-3 py-2 box-border flex mt-2 justify-between">
        <div className="h-fit w-fit">
            <Icon onClick={()=>{ NavigateService.redirectBasedApp('/journals'); }} className="h-6 w-6 filter-blue-400 cursor-pointer" iconUrl={Iconsax.bold["arrow-left-2"]} />
        </div>
        
        <div className="h-fit w-fit flex gap-2 items-center">
          <Icon className="filter-blue-400 h-5 w-5" iconUrl={Iconsax.bold['archive-tick']}/>
          <h1 className="text-blue-400 text-lg font-semibold tracking-wide">Journals</h1>
        </div>
        
        <div className="h-fit w-fit">
        <Icon onClick={ clickSubmit } className="h-6 w-6 filter-blue-400 cursor-pointer" iconUrl={Iconsax.bold["add-circle.svg"]} />
        </div>
      </div>

      {/* ================ CONTENT ================= */}

      <LayerMain id='MAIN_CONTENT' className="px-3 py-2 overflow-auto h-full flex flex-col">
        <form ref={formRef} className='h-full relative flex flex-col' encType="multipart/form-data" onSubmit={handleSubmit(formSubmit)}>


            <div className="relative flex flex-col overflow-hidden" style={ !zoom ? {} : {display:'none'} }>
                <label className="text-1sm text-blue-dark-300 mb-2 font-medium tracking-wide">Title</label>
                <Input formState={formState} register={regisrator.title} className='mb-2 h-fit py-[3px]' placeholder='Title' />
                <div className="flex justify-between gap-2 mb-3">
                    <div className="flex-1">
                    <label className="text-1sm text-blue-dark-300 font-medium tracking-wide">Date</label>
                    <Input formState={formState} register={regisrator.date} type='date' className='h-fit py-[3px]' placeholder='Date' />
                    </div>
                    <div className="flex-1">
                    <label className="text-1sm text-blue-dark-300 font-medium tracking-wide">Hour</label>
                    {/* <Input formState={formState} register={regisrator.time} type='time' className='h-fit py-[3px]' placeholder='Time' /> */}
                    </div>
                </div>

                <CircleDecoration className="absolute -bottom-16 left-0 h-32 w-32 bg-cover" variant="blue"/>
                <label className="text-1sm text-blue-dark-300 block font-medium tracking-wide border-b-2 pb-2 border-blue-200">Note</label>
            </div>

            <label style={ zoom ? {} : {display:'none'} } className="text-1sm text-blue-dark-300 block font-medium tracking-wide border-b-2 pb-2 border-blue-200">Note</label>

            {/* EditorJS */}
            <div id='editorjs' className="px-2 py-2 flex-1 relative z-[3] overflow-y-auto text-sm custom-editor"></div>

            {/* Refresh Button */}
            <Container className="absolute px-1 py-1 bottom-4 z-[4] right-2 h-fit w-fit shadow border-b-2  border-blue-300 cover-pointer">
              <Icon onClick={onZoom} className="h-8 filter-blue-400 w-8" iconUrl={ !zoom ? Iconsax.bold['command.svg'] : Iconsax.bold['command-square.svg']}/> 
            </Container>  

        </form>
      </LayerMain>
    </>
  );
}
