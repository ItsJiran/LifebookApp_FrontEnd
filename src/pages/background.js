import React from "react";
import { CircleDecoration } from "../components/Components";

export function WhiteBG({className='',style={}}){
    return (
        <div className={"h-full w-full bg-white absolute top-0 left-0" + ' ' + className} style={style}>
            <CircleDecoration className="h-32 w-32 absolute -bottom-12 -right-10" variant="blue"/>
        </div>
    )    
}
export function LightBlueBG({className='',style={}}){
    return (
        <div className={"h-full w-full bg-blue-100 absolute top-0 left-0" + ' ' + className} style={style}>
            <CircleDecoration className="h-32 w-32 absolute -bottom-12 -right-10" variant="blue"/>
        </div>
    )
}
export function JournalsBG(){
    return (
        <>
        </>
    )
}