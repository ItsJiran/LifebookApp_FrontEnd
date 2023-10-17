import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Iconsax, AnimateMotions, TimingMotions } from "../utils";

export function Icon({type='',iconUrl='',className='',onClick}){
    let icon = { backgroundImage: 'Url(' + iconUrl + ')' };
    return ( <div onClick={onClick} style={icon} className={className + ' ' + 'bg-cover'}></div> );
}

export function CircleDecoration({className='',variant='blue'}){
    if(variant == 'blue') return ( <div className={className} style={{backgroundImage:`Url('/public/assets/svg/circle-blue.svg')`}}/> );
    else                  return ( <div className={className} style={{backgroundImage:`Url('/public/assets/svg/circle-white.svg')`}}/> );
}

export function Loading({onClick,className='',animate={}}){
    return (
        <motion.div onClick={onClick} {...animate} className={`bg-cover animate-spin delay-200 transition ease-in bg-no-repeat` + ' ' + className} style={{backgroundImage:`Url('/public/assets/svg/loading-2.svg')`}}/>
    );
}
export function LoadingContainer({onClick, className='',children, animate={}}){
    return (
        <motion.div {...animate} onClick={onClick} className={`rounded-full h-fit w-fit box-content bg-white px-1 py-1 border-b-2 border-blue-300` + ' ' + className}>
            {children}
        </motion.div>
    )
}

export function Notification({title='',message='', className='',type='Success',animate={},onClose}){
    let containerClass = `relative border-b-2 px-5 py-4 overflow-hidden items-center flex rounded-md gap-2`;

    if(type == 'Error')   var typeClass = `bg-red-400 border-red-500`;
    if(type == 'Success') var typeClass = `bg-blue-400 border-blue-dark-300`;

    return ( 
        <div className={className}>
            <motion.div {...animate} className={containerClass + ' ' + typeClass}>
                <CircleDecoration variant='white' className="h-28 w-28 absolute -bottom-16 right-0" />
                <div className="grow text-white">
                    <h3 className="font-bold font-sans text-sm">{title}</h3>
                    <p className="text-1sm">{message}</p>
                </div>
                <label onClick={onClose} className="flex-none cursor-pointer shrink-0 filter-white h-6 w-6 block shrink" style={{backgroundImage:'Url(' + Iconsax.linear['close-circle'] + ')'}} />
            </motion.div>
        </div>
    )
}

export function Container({children,variant='white',className='',animate={}}){
    let variantClass = '';

    if(variant == 'white') variantClass = 'bg-white'
    if(variant == 'white-bordered') variantClass = 'border-b-2 border-blue-300'

    return (
        <motion.div {...animate} className={className + ' ' + variantClass + ' ' + 'rounded-md'}>
            {children}
        </motion.div>
    )
}