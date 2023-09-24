import React from "react";
import { AnimateStyle } from "../../utils";

export function Button({children,className='',variant='blue',onClick}){
    let defaultClass = `box-border hover:bg-blue-dark-200 hover:border-blue-dark-400 transition duration-100 border-b-2 
    px-4 py-1 rounded-md font-bold text-white font-sans cursor-pointer select-none`;

    let variantClass = '';

    if(variant == 'blue') variantClass = 'border-blue-dark-200 bg-blue-400 hover:bg-blue-dark-200 hover:border-blue-dark-400';
    if(variant == 'blue-pressed') variantClass = 'border-black-400 bg-black-200 hover:bg-black-200 hover:border-black-400'; 
    if(variant == 'red') variantClass = 'border-red-500 bg-red-400 hover:bg-red-500 hover:border-red-400';
    if(variant == 'red-pressed') variantClass = 'border-black-400 bg-black-200 hover:bg-black-200 hover:border-black-400'; 

    return (
        <button onClick={onClick} className={defaultClass +  ' ' + variantClass + ' ' + className}>
            {children}
        </button>
    );
}

export function NavbarButton({children, className='', variant='non-active', target}){
    let defaultClass = ``;
    let variantClass = ``;

    return (
        <Link to={target} className={className}>
            {children}
        </Link>
    )
}
