import React, { Children } from "react";
import { motion } from "framer-motion";

export function LayerMain({id='',animate={},className='',children}){
    return (<motion.div {...animate} id={id} className={'box-border w-full h-full relative' + ' ' + className}>{children}</motion.div>)
}

export function LayerOverlayWrapper({id='',className='',children}){
    return (<div id={id} className={"w-full h-0 sticky" + ' ' + className}>{children}</div>)
}   

export function LayerOverlay({id='',className='',children}){
    return (<div id={id} className={"absolute left-0 top-0" + ' ' + className}>{children}</div>)
}   

export function LayerBackground({id='',className='',children}){
    return (<div id={id} className={'w-full h-full absolute overflow-hidden' + ' ' + className}>{children}</div>)
}
