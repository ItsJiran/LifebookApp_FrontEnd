import React from "react";
import { motion } from "framer-motion";
import { Iconsax, Motions } from "../utils";

export function CircleDecoration({className='',color='blue'}){
    if(color == 'blue') 
        return ( <div className={className} style={{backgroundImage:`Url('/public/assets/svg/circle-blue.svg')`}}/> );
    else 
        return ( <div className={className} style={{backgroundImage:`Url('/public/assets/svg/circle-white.svg')`}}/> );
}

export function Loading({className='',variantAnimate=''}){

    let animateVar = {};

    if(variantAnimate == 'swipe-top'){
        animateVar = {
            'initial':[Motions['swipe-top'].out,Motions['fade'].out],
            'animate':[Motions['swipe-top'].in,Motions['fade'].in],
            'exit':[Motions['swipe-top'].out,Motions['fade'].out],
            'transition':{ ease: [0.08, 0.65, 0.53, 0.96], duration: 0.5 }
        }
    }

    return (
        <div className={`box-content h-fit w-fit` + ' ' + className}>
            <motion.div {...animateVar} className={`rounded-full box-content bg-blue-200 border-b-2 border-blue-300 h-8 w-8`}>
                <div className={`bg-cover animate-spin delay-200 transition ease-in  bg-no-repeat h-full w-full`} style={{backgroundImage:`Url('/public/assets/svg/loading-1.svg')`}}/>
            </motion.div>
        </div>
    );
}

export function Notification({notification, index, title='', message='', className='',type='success',variantAnimate=''}){
    let containerClass = `border-b-2 px-2 py-2 text-color-white overflow-hidden`;
    if(type == 'error')   var typeClass = ``;
    if(type == 'success') var typeClass = `bg-blue-400 border-dark-blue-300`;

    if(variantAnimate == 'swipe-top'){
        animateVar = {
            'initial':[Motions['swipe-top'].out,Motions['fade'].out],
            'animate':[Motions['swipe-top'].in,Motions['fade'].in],
            'exit':[Motions['swipe-top'].out,Motions['fade'].out],
            'transition':{ ease: [0.08, 0.65, 0.53, 0.96], duration: 0.5 }
        }
    }

    return ( 
        <motion.div index={index} {...variantAnimate} className={className + ' ' + containerClass + ' ' + typeClass}>
            <div className="">
                <h3 className="">{title}</h3>
                <p className="">{message}</p>
            </div>
            <label className="filter-white h-6 w-6 block" style={{backgroundImage:'Url(' + Iconsax.linear['close-circle'] + ')'}} />
        </motion.div>
    )
}
