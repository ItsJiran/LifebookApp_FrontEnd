import React, { useContext, useState } from "react";

import { LayerBackground, LayerMain, LayerOverlay, LayerOverlayWrapper } from "../components/Layers";
import { motion, AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation, Outlet } from "react-router-dom";

import { Button } from "../components/ui/Buttons";
import { Notification, Container } from "../components/Components";

import { LoadingContainer, Loading } from "../components/Components";
import { NotifierAction, NotifierContext } from "../hooks/Notifier";
import { AnimateMotions, TimingMotions } from "../utils";
import { ConfirmerContext, triggerConfirm, useConfirmer } from "../hooks/Confirmer";
import { useNotifierController } from "../hooks_utils/NotifierUtils";
import { useConfirmerController } from "../hooks_utils/NavigateUtils";
import { useChoicerController } from "../hooks_utils/ChoicerUtils";


export function RootLayouts({ children }) {

    const [notifier] = useContext(NotifierContext);
    const ConfirmerController = useConfirmerController();
    const NotifierController = useNotifierController();
    const ChoicerController = useChoicerController();

    return (

        <div className="relative max-w-lg mx-auto h-full overflow-y-auto overflow-x-hidden">

            <AnimatePresence mode='wait'>
                {/* CONFIRMATION POP OVER */}
                { ConfirmerController.confirmState.show ? 
                    <div key='confirm' className="absolute top-0 h-full left-0 w-full">
                        <div className="sticky h-full top-0 items-center flex z-50 justify-center">
                        
                            <motion.div animate={{...AnimateMotions['fade-in'], ...TimingMotions['ease-0.5']}} onClick={ConfirmerController.confirmCancel} className="absolute w-full h-full top-0 left-0 bg-black-400 opacity-40"></motion.div>
                            
                            <Container animate={{...AnimateMotions['swipe-top-fade-in'], ...TimingMotions['ease-0.4']}} className="px-4 py-4 relative w-full mx-6">
                                <label className="block text-center font-semibold mb-2 text-lg text-blue-dark-400">{ConfirmerController.confirmState.content.title}</label>
                                <p className="block text-1sm mb-6 text-blue-dark-400">{ConfirmerController.confirmState.content.message}</p>
                                <div className="flex gap-2 items-center">
                                    <Button onClick={ConfirmerController.confirmVerified} className="flex-auto px-4 py-1 h-fit regular text-sm" variant="blue">Konfirmasi</Button>
                                    <Button onClick={ConfirmerController.confirmCancel} className="flex-auto px-4 py-1 h-fit regular text-sm" variant="red">Batal</Button>
                                </div>
                            </Container>
                            
                        </div>
                    </div> 
                : '' }
                {/* CHOICER POP OVER */}
                {
                    ChoicerController.state.show ? 
                        <div key='choicer' className="absolute top-0 h-full left-0 w-full overflow-y-hidden">
                            <div className="sticky h-full top-0 items-center flex z-50 justify-center">
                            
                                <motion.div animate={{...AnimateMotions['fade-in'], ...TimingMotions['ease-0.5']}} onClick={ChoicerController.hide} className="absolute w-full h-full top-0 left-0 bg-black-400 opacity-40"></motion.div>
                                
                                <Container animate={{...AnimateMotions['swipe-bottom-fade-in'], ...TimingMotions['ease-0.5']}} className="px-4 py-4 pb-6 absolute w-full mx-6 -bottom-2 flex flex-col">
                                    { ChoicerController.state.elm }
                                </Container>
                                
                            </div>
                        </div> 
                    : ''
                }
            </AnimatePresence>

            {/* FOR EVERY NOTIFICATION, POPUP AND TOAST */}
            <LayerOverlayWrapper id='root-layer-overlay' className="z-[1] top-0">
                <AnimatePresence mode='wait'>
                    {/* LOADING */}
                    { notifier.loading ? 
                        <div key='loading' className="absolute w-fit top-10 h-full left-[50%] -translate-x-[50%]">
                            <div className="sticky top-0 items-center flex z-[51] justify-center">
                                <LoadingContainer key='test' animate={{...AnimateMotions['swipe-top-fade-in'], ...TimingMotions['ease-0.5']}} className='mx-auto sticky top-0'>
                                    <Loading className="h-6 w-6 filter-blue-400"/> 
                                </LoadingContainer>
                            </div>
                        </div>
                    : '' }
                </AnimatePresence>

                {/* NOTIFICATION POP OVER */}
                <div className="absolute top-4 h-full left-0 w-full">
                    <div className="sticky mx-auto overflow-y-auto w-fit z-50 top-4">
                        <AnimatePresence mode='sync'>
                            {
                                notifier.notification.length > 0 ? notifier.notification.map((item, index) => { if(index >= notifier.notification.length - 3)
                                    return <Notification onClose={() => { NotifierController.removeNotification({id:item.id}) }} key={item.id} animate={{ ...AnimateMotions['swipe-top-fade-in'], ...TimingMotions['ease-0.5'] }} className='mb-2 top-0 box-border max-w-[400px] w-[90vw] relative' {...item.content} />;
                                }) : ''
                            }
                            
                        </AnimatePresence>

                        { notifier.notification.length >= notifier.notification.length - 3 && notifier.notification.length > 3 ? 
                            <LoadingContainer key='notifier-more' className="mx-auto shadow bg-blue-100"> <label className="text-blue-dark-300 text-sm font-semibold text-center block h-fit w-5 h-5">{notifier.notification.length-3}</label> </LoadingContainer> : '' }
                    </div>
                </div>

            </LayerOverlayWrapper>

            <Outlet/>
        </div>

    )
}