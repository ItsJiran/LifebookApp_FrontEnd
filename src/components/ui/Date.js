import React, { useState } from "react";
import { date } from "yup";
import { motion, AnimatePresence } from "framer-motion";

import { TimingMotions, AnimateMotions, CustomDate, ExtractDateObj, getDayName, getMonthName, Iconsax, ShortDayTable } from "../../utils";
import { CircleDecoration, Icon } from "../Components";

// InputDate must be a dateObj
export function DatePicker({className='',inputDate=undefined,setInputDate=undefined,onDayClick,customShadowDay,customDay,animate={}}){
    
    if(inputDate instanceof CustomDate == false && inputDate) throw Error('Should be instanceof CustomDate');
    if(inputDate && !setInputDate)                            throw Error('Should have setInputDate');

    const [tmpInputDate,setTmpInputDate] = useState(new CustomDate());
    const [currentDate,setCurrentDate] = useState( inputDate ? inputDate : new CustomDate() );

    const targetDate = currentDate;
    const targetSetDate = setCurrentDate;

    // ============== FUNCTIONS ================
    const renderDays = ()=>{
        var ReactElm = [];

        // NOTES HOW MUCH IS A LENGTH NOT INDEX SO NEED TO BE -1
        // Determine how much prev days should be rendered Sunday - Monday, if resultl was 7 that's mean print all prev day
        var howMuchPrev = 0;
        if(targetDate.start.num == 0) howMuchPrev = 7;
        else                          howMuchPrev = targetDate.start.num;                    

        for(let i = howMuchPrev - 1; i >= 0; i-- ){
            var prev = targetDate.prev;
            ReactElm.push( renderShadowDay( new CustomDate( new Date(prev.year, prev.month, prev.last.date - i) ) ) );
        }

        // Render Days
        for(let i = 1; i <= targetDate.last.date; i++){
            ReactElm.push( renderDay( new CustomDate( new Date(targetDate.current.year, targetDate.current.month, i) ) ) );
        }

        // Determine how much prev days should be rendered
        var howMuchNext = 0;
        if(targetDate.last.num == 6) howMuchNext = 7;
        else                         howMuchNext = 7 - targetDate.last.num;

        for(let i = 0; i < howMuchNext - 1; i++ ){
            var next = targetDate.next;
            ReactElm.push( renderShadowDay( new CustomDate( new Date(next.year, next.month, next.start.date + i) ) ) );
        }
        
        return ReactElm;
    }
    const renderDay = (dateObj) => {
        if(customDay){
            return customDay( dateObj );
        } else {
            if(inputDate){
                return ( 
                    <>
                        {
                            dateObj.current.day.date == inputDate.current.day.date && dateObj.current.year == inputDate.current.year && dateObj.current.month == inputDate.current.month ? 
                            <div className="flex items-center justify-center" onClick={()=>{ clickEvent(dateObj) }} >
                                <label className="relative rounded-full cursor-pointer bg-white flex justify-center items-center h-[30px] w-[30px] leading-none bg-white text-blue-400 text-sm font-semibold"> 
                                    {dateObj.current.day.date} 
                                    { 
                                        dateObj.current.isToday ? <Icon iconUrl={Iconsax.bold['medal-star.svg']} className="absolute h-4 w-4 filter-yellow -bottom-2" /> : ''
                                    }
                                    
                                </label> 
                            </div>
                            :
                            <div className="flex items-center justify-center" onClick={()=>{ clickEvent(dateObj) }} >
                                <label className="relative rounded-full cursor-pointer flex justify-center items-center h-[30px] w-[30px] leading-none text-white text-sm font-semibold"> 
                                    {dateObj.current.day.date} 
                                    { 
                                        dateObj.current.isToday ? <Icon iconUrl={Iconsax.bold['medal-star.svg']} className="absolute h-4 w-4 filter-yellow -bottom-2" /> : ''
                                    }
                                    
                                </label> 
                            </div>
                        }    
                    </>
                 );
            } else {
                return ( 
                    <>
                        {
                            dateObj.current.day.date == tmpInputDate.current.day.date && dateObj.current.year == tmpInputDate.current.year && dateObj.current.month == tmpInputDate.current.month ? 
                            <div className="flex items-center justify-center" onClick={()=>{ clickEvent(dateObj) }} >
                                <label className="relative rounded-full cursor-pointer bg-white flex justify-center items-center h-[30px] w-[30px] leading-none bg-white text-blue-400 text-sm font-semibold"> 
                                    {dateObj.current.day.date} 
                                    { 
                                        dateObj.current.isToday ? <Icon iconUrl={Iconsax.bold['medal-star.svg']} className="absolute h-4 w-4 filter-yellow -bottom-2" /> : ''
                                    }
                                    
                                </label> 
                            </div>
                            :
                            <div className="flex items-center justify-center" onClick={()=>{ clickEvent(dateObj) }} >
                                <label className="relative rounded-full cursor-pointer flex justify-center items-center h-[30px] w-[30px] leading-none text-white text-sm font-semibold"> 
                                    {dateObj.current.day.date} 
                                    { 
                                        dateObj.current.isToday ? <Icon iconUrl={Iconsax.bold['medal-star.svg']} className="absolute h-4 w-4 filter-yellow -bottom-2" /> : ''
                                    }
                                    
                                </label> 
                            </div>
                        }    
                    </>
                 );
            }
        }        
    }
    const renderShadowDay = (dateObj)=>{
        if(customShadowDay){
            return customShadowDay( dateObj );
        } else {
            if(inputDate){
                return ( 
                    <>
                        {
                            dateObj.current.day.date == inputDate.current.day.date && dateObj.current.year == inputDate.current.year && dateObj.current.month == inputDate.current.month ? 
                            <div className="flex items-center justify-center" onClick={()=>{ clickEvent(dateObj) }} >
                                <label className="rounded-full relative cursor-pointer bg-white flex justify-center items-center h-[30px] w-[30px] leading-none bg-white opacity-[50%] text-blue-400 text-sm font-semibold"> 
                                    {dateObj.current.day.date} 
                                    { 
                                        dateObj.current.isToday ? <Icon iconUrl={Iconsax.bold['medal-star.svg']} className="absolute h-4 w-4 filter-yellow -bottom-2" /> : ''
                                    }
                                    
                                </label>                     
                            </div>
                            :
                            <div className="flex items-center justify-center" onClick={()=>{ clickEvent(dateObj) }} >
                                <label className="relative rounded-full cursor-pointer flex justify-center items-center h-[30px] w-[30px] leading-none text-white opacity-[50%] text-sm font-semibold"> 
                                    {dateObj.current.day.date} 
                                    { 
                                        dateObj.current.isToday ? <Icon iconUrl={Iconsax.bold['medal-star.svg']} className="absolute h-4 w-4 filter-yellow -bottom-2" /> : ''
                                    }
                                    
                                </label>                                 
                            </div>
                        }    
                    </>
                 );
            } else {
                return ( 
                    <>
                        {
                            dateObj.current.day.date == tmpInputDate.current.day.date && dateObj.current.year == tmpInputDate.current.year && dateObj.current.month == tmpInputDate.current.month ? 
                            <div className="flex items-center justify-center" onClick={()=>{ clickEvent(dateObj) }} >
                                <label className="relative rounded-full cursor-pointer bg-white flex justify-center items-center h-[30px] w-[30px] leading-none bg-white opacity-[50%] text-blue-400 text-sm font-semibold"> 
                                    {dateObj.current.day.date} 
                                    { 
                                        dateObj.current.isToday ? <Icon iconUrl={Iconsax.bold['medal-star.svg']} className="absolute h-4 w-4 filter-yellow -bottom-2" /> : ''
                                    }
                                    
                                </label> 
                            </div>
                            :
                            <div className="flex items-center justify-center" onClick={()=>{ clickEvent(dateObj) }} >
                                <label className="rounde-full cursor-pointer flex justify-center items-center h-[30px] w-[30px] leading-none text-white opacity-[50%] text-sm font-semibold"> 
                                    {dateObj.current.day.date} 
                                    { 
                                        dateObj.current.isToday ? <Icon iconUrl={Iconsax.bold['medal-star.svg']} className="absolute h-4 w-4 filter-yellow -bottom-2" /> : ''
                                    }
                                    
                                </label> 
                            </div>
                        }    
                    </>
                 );
            }
        }             
    }

    const clickEvent = (dateObj)=>{       
        if(onDayClick)        onDayClick(dateObj);
        else if(setInputDate) setInputDate(dateObj);
        else                  setTmpInputDate(dateObj);
    }
    const next = ()=>{
        if(targetSetDate) targetSetDate( targetDate.nextMonth(true) );
        else             console.error('Error next');
    }
    const prev = ()=>{
        if(targetSetDate) targetSetDate( targetDate.prevMonth(true) );
        else              console.error('Error next');
    }

    return (
        <motion.div animate={{...animate}} className={"bg-blue-400 mx-3 rounded-md px-4 py-4 relative border-b-2 border-blue-500" + ' ' + className}>

            <CircleDecoration variant="white" className="absolute bottom-0 right-0 h-20 w-20"/>

            {/* HEADER */}
            <div className="flex items-center justify-between gap-2 mb-2">
                
                <Icon onClick={prev} className="h-6 w-6 filter-white cursor-pointer" iconUrl={Iconsax.bold['arrow-left-2.svg']}/>

                <div className="w-fit flex flex-col text-center">
                    <label className="text-xl text-white font-bold leading-4"> { getMonthName(targetDate.current.month) } </label>
                    <label className="text-2sm text-white font-bold"> { targetDate.current.year } </label>
                </div>

                <Icon onClick={next} className="h-6 w-6 filter-white cursor-pointer" iconUrl={Iconsax.bold['arrow-right.svg']}/>
                
            </div> 

            {/* DAY LABEL */}
            <div className="grid grid-cols-7 gap-3 mb-3">
                {
                    ShortDayTable.map( (e,index)=>{
                        return <label key={index} className="uppercase text-1sm text-center text-white font-bold">{e}</label>
                    } )
                }
            </div>

            {/* DAY LABEL */}
            <div className="grid grid-cols-7 gap-3"> { renderDays().map((e)=>{return e}) } </div>

        </motion.div>
    )
    
}