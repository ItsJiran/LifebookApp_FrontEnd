import React from "react";
import { FilePath, Iconsax } from "../../utils";

export function Button({value='',type='',className=''}){
    let defaultClass = `box-border hover:bg-blue-dark-200 hover:border-blue-dark-400 transition duration-100 text-lg border-b-2 
    border-blue-dark-200 bg-blue-400 px-10 rounded-md py-2 h-12 font-bold text-white font-sans `;
    return (
        <button className={defaultClass +  ' '  + className} type={type} value={value}>{value}</button>
    );
}