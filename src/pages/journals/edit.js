import React, { useRef } from "react";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// EDITOR JS
import EditorJS from "@editorjs/editorjs";
import EditorChecklist from "@editorjs/checklist";
import EditorHeader from "@editorjs/header";
import EditorList from "@editorjs/list";
import EditorNestedList from "@editorjs/nested-list";
import EditorParagraph from "@editorjs/paragraph";
import EditorQuote from "@editorjs/quote";
import EditorDrag from "editorjs-drag-drop";

class CustomEditorParagraph extends EditorParagraph {
    validate(savedData) {
        return true;
    }
}


import { Iconsax, getLocaleTime, getLocaleDate, ExtractDateObj, getMonthName, FormatDate, FormatTime } from "../../utils";
import { useApiService } from "../../hooks_utils/ApiUtils";

import { CircleDecoration, Container, Icon } from "../../components/Components";
import { LayerMain } from "../../components/Layers";
import { Input } from "../../components/ui/Inputs";

import { useNotifierController } from "../../hooks_utils/NotifierUtils";
import { useAppService } from "../../hooks_utils/AppUtils";
import { useNavigateService } from "../../hooks_utils/NavigateUtils";

import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

export default function JournalsEditPage() {
    // ========================================================================================================
    // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
    // ========================================================================================================
    const formRef = useRef(null);

    const params = useParams();
    const navigate = useNavigate();

    // -- Service And Controller
    const AppService = useAppService();
    const NotifierController = useNotifierController();

    const ApiService = useApiService();
    const NavigateService = useNavigateService();

    // -- Variable State
    const [action, setAction] = React.useState(false);
    const [zoom, setZoom] = React.useState(false);
    const [pageState, setPageState] = React.useState({
        error: false,
        edit: false,
        data: undefined,
        editor_data: undefined,
    });
    const [editorState, setEditorState] = React.useState(null);
    const [saveState, setSaveState] = React.useState(false);

    // -- Dependencies
    const validator = yup.object().shape({
        title: yup.string().min(6).required(),
        date: yup.date().required(),
        time: yup.mixed().required('Time is required'),
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
        time: register('time', validator.time),
    }

    // ========================================================================================================
    // ------------------------------------------- REACT EFFECT -----------------------------------------------
    // ========================================================================================================
    React.useEffect(() => {

        AppService.navigate.set.status(AppService.navigate.status().validate);
        AppService.navigate.set.message({
            title: 'Konfirmasi',
            message: 'Apakah anda yakin ingin berpindah halaman?'
        });

        // Fetching Existing Data Api
        fetchCurrentData();

    }, []);
    React.useEffect(() => {
        if (Object.keys(formState.errors).length > 0 && zoom) {
            setZoom((zoom) => false);
            if (zoom) AppService.navbar.set.status(AppService.navbar.status().show);
            else AppService.navbar.set.status(AppService.navbar.status().hidden);
        }
    }, [formState.errors]);
    React.useEffect(() => {
        if (pageState.editor_data !== undefined && editorState == null) {                    
            initEditor(pageState.editor_data);              
            console.log('initialized');
        } else if(editorState !== null) {
            if(saveState){              
                console.log('stack');
            } else {
                autosave();
            }
        }        
    }, [pageState.editor_data]);

    async function autosave(){
        await setSaveState(true);
        setTimeout( function(){ editorSubmit(false); setSaveState(false) }, 1000 )                 
    }

    // ========================================================================================================
    // -------------------------------------------- FUNCTIONS -------------------------------------------------
    // ========================================================================================================
    const fetchCurrentData = async () => {
        if (action) return;
        toggleAction(true);

        try {
            const fetch = await ApiService.fetchAuth({ slug: 'journal/' + params.id });

            // Generate Notification Title And Message
            var title = ApiService.generateApiTitle(fetch);
            var msg = ApiService.generateApiMessage(fetch);

            // --- Handle Error Network
            if (fetch.code == 'ERR_NETWORK') {
                setPageState((prev) => ({ ...prev, error: true }));
                toggleAction(false);
                return;
            }

            // --- Handling Success
            if (fetch.status >= 200 && fetch.status < 300) {
                let data = fetch.response.data;
                setPageState((prev) => ({ ...prev, error: false, data: data, editor_data: JSON.parse(data.data) }));

                setValue('title', data.title);
                setValue('time', data.time);
                setValue('date', data.date);
                
            }

            // --- Handle Client Request Failed
            else if (fetch.status !== 200) {
                if (ApiService.isAxiosError(fetch)) console.error(fetch);

                NotifierController.addNotification({
                    title: title,
                    message: msg,
                    type: 'Error',
                });

                toggleAction(false);
                return NavigateService.redirect('/journals');
            }

        } catch (e) {
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
    function toggleAction(action) {
        setAction(action);

        // if (action) AppService.navigate.set.status(AppService.navigate.status().fixed);
        // else AppService.navigate.set.status(AppService.navigate.status().validate);

        // if (!action) AppService.navbar.set.status(AppService.navbar.status().show);
        // else AppService.navbar.set.status(AppService.navbar.status().hidden);

        NotifierController.toggleLoading(action);
    }
    const toggleEditHeader = (action) => {
        setPageState((prev) => ({ ...prev, edit: action }));
    }
    const editorSubmit = async (show_notif = true) => {    

        if (action) return;
        toggleAction(true);

        let e = {};
        e.editor_json = JSON.stringify(await editorState.save());

        try {

            // reformating date to iso format
            const fetch = await ApiService.fetchAuth({ slug: 'journal/data/' + params.id, method: 'put', data: e });

            // Generate Notification Title And Message
            var title = ApiService.generateApiTitle(fetch);
            var msg = ApiService.generateApiMessage(fetch);

            // --- Handling Success
            if (fetch.status >= 200 && fetch.status < 300) {
                if(show_notif){
                    NotifierController.addNotification({
                        title: title,
                        message: msg,
                        type: 'Success',
                    });
                }
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

        } catch (e) {
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
    const clickSubmit = async (e) => {
        formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
    }
    const headerSubmit = async (e) => {
        if (action) return;
        toggleAction(true);

        try {
            // reformating date to iso format
            e.date = e.date.getFullYear() + '-' + (e.date.getMonth() + 1) + '-' + e.date.getDate();

            const fetch = await ApiService.fetchAuth({ slug: 'journal/header/' + params.id, method: 'put', data: e });

            // Generate Notification Title And Message
            var title = ApiService.generateApiTitle(fetch);
            var msg = ApiService.generateApiMessage(fetch);

            // --- Handling Success
            if (fetch.status >= 200 && fetch.status < 300) {
                NotifierController.addNotification({
                    title: title,
                    message: msg,
                    type: 'Success',
                });

                setValue('title', e.title);
                setValue('time', e.time);
                setValue('date', e.date);        

                setPageState((prev) => ({ ...prev, data: { ...prev.data, title: e.title, date: e.date, time: e.time }, edit: false }));
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

        } catch (e) {
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
    const initEditor = (data) => {
        const editor = new EditorJS({
            holder: 'editorjs',
            onReady: () => {                                
                new EditorDrag(editor);
            },
            onChange: async () => {
                let content = await editor.saver.save();
                
                setPageState((prev) => ({ ...prev, error: false, editor_data: content }));         
            
            },
            placeholder: 'Write here..!!',
            tools: {
                header: {
                    class: EditorHeader,
                    inlineToolbar: true,
                },
                list: {
                    class: EditorList,
                    inlineToolbar: true,
                },
                checklist: {
                    class: EditorChecklist,
                    inlineToolbar: true
                },
                break_paragraph: {
                    class: CustomEditorParagraph,
                    inlineToolbar: false,
                },
                paragraph: {
                    class: CustomEditorParagraph,
                    inlineToolbar: true
                },
            },
            defaultBlock: 'break_paragraph',
            autofocus: true,
            data: data,
        });
        setEditorState(editor);
    };

    const onZoom = () => {
        setZoom(zoom => !zoom);
        if (zoom) AppService.navbar.set.status(AppService.navbar.status().show);
        else AppService.navbar.set.status(AppService.navbar.status().hidden);
    }

    return (
        <>
            {/* ================== HEADER ==================== */}
            <div className="h-[40px] w-full px-3 py-2 box-border flex mt-2 justify-between">
                <div className="h-fit w-fit">
                    <Icon onClick={() => { NavigateService.redirectBasedApp('/journals'); }} className="h-6 w-6 filter-blue-400 cursor-pointer" iconUrl={Iconsax.bold["arrow-left-2"]} />
                </div>

                <div className="h-fit w-fit flex gap-2 items-center">
                    <Icon className="filter-blue-400 h-5 w-5" iconUrl={Iconsax.bold['archive-tick']} />
                    <h1 className="text-blue-400 text-lg font-semibold tracking-wide">Journals</h1>
                </div>

                <div className="h-fit w-fit">
                    <Icon onClick={editorSubmit} className="h-6 w-6 filter-blue-400 cursor-pointer" iconUrl={Iconsax.bold["save-add.svg"]} />
                </div>
            </div>

            {/* ================ CONTENT ================= */}

            {!pageState.error ?

                <LayerMain id='MAIN_CONTENT' className="relative px-3 py-2 overflow-auto h-full flex flex-col">

                    <div className="h-fit relative flex flex-col overflow-hidden" style={!zoom ? {} : { display: 'none' }}>

                        <CircleDecoration className="absolute -bottom-16 left-0 h-32 w-32 bg-cover" variant="blue" />

                        {!pageState.edit && pageState.data !== undefined ?
                            <>
                                <h1 className="text-xl font-semibold text-blue-dark-400 mt-3 tracking-wider">{pageState.data.title}</h1>
                                <div className="flex gap-2 items-center mt-2 mb-2">
                                    <Icon className="filter-blue-dark-300 h-4 w-4" iconUrl={Iconsax.bold['calendar.svg']} />
                                    <label className="text-blue-dark-300 leading-3 text-1sm">
                                        {FormatDate(pageState.data.date).day + ' ' +
                                            getMonthName(FormatDate(pageState.data.date).month - 1) + ' ' +
                                            FormatDate(pageState.data.date).year}
                                    </label>
                                </div>
                                <div className="flex gap-2 items-center mb-4">
                                    <Icon className="filter-blue-dark-300 h-4 w-4" iconUrl={Iconsax.bold['clock.svg']} />
                                    <label className="text-blue-dark-300 leading-3 text-1sm tracking-wider">
                                        {FormatTime(pageState.data.time).hour + ':' + FormatTime(pageState.data.time).minute}
                                    </label>
                                </div>

                                <Container className="absolute px-1 py-1 bottom-4 z-[4] right-2 h-fit w-fit shadow border-b-2  border-blue-300 cover-pointer">
                                    <Icon onClick={() => { toggleEditHeader(true) }} className="h-6 w-6 filter-blue-dark-400" iconUrl={Iconsax.bold['edit.svg']} />
                                </Container>
                            </>
                            : ''}

                        {pageState.edit ?
                            <form ref={formRef} className='mb-2' encType="multipart/form-data" onSubmit={handleSubmit(headerSubmit)}>
                                <div className="relative flex flex-col overflow-hidden" style={!zoom ? {} : { display: 'none' }}>
                                    <label className="text-1sm text-blue-dark-300 mb-2 font-medium tracking-wide">Title</label>
                                    <Input formState={formState} register={regisrator.title} className='mb-2 h-fit py-[3px]' placeholder='Title' />
                                    <div className="flex justify-between gap-2 mb-3">
                                        <div className="flex-1">
                                            <label className="text-1sm text-blue-dark-300 font-medium tracking-wide">Date</label>
                                            <Input formState={formState} register={regisrator.date} type='date' className='h-fit py-[3px]' placeholder='Date' />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-1sm text-blue-dark-300 font-medium tracking-wide">Hour</label>
                                            <Input formState={formState} register={regisrator.time} type='time' className='h-fit py-[3px]' placeholder='Time' />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-3 right-2 flex gap-2">
                                    <Container className="px-1 py-1 z-[4] h-fit w-fit shadow border-b-2 bg-blue-100 border-blue-300 cover-pointer">
                                        <Icon onClick={clickSubmit} className="h-6 w-6 filter-blue-400" iconUrl={Iconsax.bold['tick-circle.svg']} />
                                    </Container>
                                    <Container className="px-1 py-1 z-[4] h-fit w-fit shadow border-b-2 bg-red-100 border-blue-300 cover-pointer">
                                        <Icon onClick={() => { toggleEditHeader(false) }} className="h-6 w-6 filter-red-400" iconUrl={Iconsax.bold['close-circle.svg']} />
                                    </Container>
                                </div>
                            </form>
                            : ''}
                        <label className="text-1sm text-blue-dark-300 block font-medium tracking-wide border-b-2 pb-2 border-blue-200">Note</label>
                    </div>

                    <label style={zoom ? {} : { display: 'none' }} className="text-1sm text-blue-dark-300 block font-medium tracking-wide border-b-2 pb-2 border-blue-200">Note</label>

                    {/* EditorJS */}
                    <div id='editorjs' className="px-2 py-2 flex-1 relative z-[3] overflow-y-auto text-sm custom-editor"></div>

                    {/* Refresh Button */}
                    <Container className="absolute px-1 py-1 bottom-4 z-[4] right-2 h-fit w-fit shadow border-b-2  border-blue-300 cover-pointer">
                        <Icon onClick={onZoom} className="h-8 filter-blue-400 w-8" iconUrl={!zoom ? Iconsax.bold['command.svg'] : Iconsax.bold['command-square.svg']} />
                    </Container>

                </LayerMain>

                :

                <div className="flex flex-col items-center text-center w-fit mx-auto h-fit flex px-2 py-2 text-1sm text-blue-dark-200 tracking-wide">
                    <h2 className="font-semibold">Terjadi Kesalahan</h2>
                    <p className="mb-2">Klik dibawah ini untuk mencoba lagi</p>
                    <div className="h-fit w-fit px-1 py-1 bg-blue-400 rounded-full"><Icon onClick={fetchCurrentData} className="h-4 w-4 filter-white hover:filter-blue-dark-300" iconUrl={Iconsax.bold['refresh.svg']} />
                    </div>
                </div>

            }

        </>
    );
}
