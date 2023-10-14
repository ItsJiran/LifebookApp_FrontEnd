import { useState } from "react";

// ----------------
//     ASSETS
// ----------------
const assets = '/public/assets/';
const iconsax = '/public/library/iconsax/';
export const FilePath = {
    'assets':'/public/assets/',
    'iconsax':{
        'linear':iconsax + 'linear/',
        'outline':iconsax + 'outline/',
        'bold':iconsax + 'bold/',
    },
}

// -----------------------------
//    DATE AND TIME FORMATTER
// -----------------------------
export const MonthTable = [
    'January',
    'February',
    'March',
    'April',
    'Mei',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'Desember',   
]
export const ShortMonthTable = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Des",
]
export const DayTable = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
]
export const ShortDayTable = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
]

export const DecodeDateTime = (raw_date_time,split) => {
    // expected raw_date : yyyy-mm-dd T hh:mm:ss
    var split = raw_date_time.split(split);
    return {
        date:FormatDate(split[0]),
        time:FormatTime(split[1]),
    }
} 
export const FormatDate = (raw_date) => {
    // expected raw_date : yyyy-mm-dd
    var split = raw_date.split('-');
    return {
        year:split[0],
        month:split[1],
        day:split[2],
    }
}
export const FormatTime = (raw_time) => {
    // expected raw_time : hh:mm:ss
    var split = raw_time.split(':');
    return {
        hour:split[0],
        minute:split[1],
        second:split[2],
    }
}
export const getMonthName = (index,isSort=false)=>{
    if(isSort) return ShortMonthTable[index-1];
    else       return MonthTable[index-1];
}
export const getDayName = (index, isSort=false)=>{
    if(isSort) return ShortDayTable[index-1];
    else       return DayTable[index-1];
}
export const getLocaleDate = (format)=>{
    let date = new Date().toLocaleDateString();

    // expected raw_date : mm/dd/yyyy
    var split = date.split('/');
    var obj = {
        year:split[2],
        month:split[0],
        day:split[1],
    }

    if(obj.month < 10) obj.month = '0' + obj.month;
    if(obj.day < 10) obj.day = '0' + obj.day;    

    return format.replaceAll('yyyy',obj.year).replaceAll('dd',obj.day).replaceAll('mm',obj.month);
}
export const getLocaleTime = ()=>{
    let date = new Date();

    let current_hour = date.getHours();
    let current_minutes = date.getMinutes();
  
    if(current_hour < 10) current_hour = '0' + current_hour;
    if(current_minutes < 10) current_minutes = '0' + current_minutes;

    return current_hour + ':' + current_minutes;
}

// ----------------
//    ANIMATION
// ----------------
export const Motions = {
    'swipe-top':{
        'in':{y:'0%'},
        'out':{y:'-100%'},        
    },
    'swipe-bottom':{
        'in':{y:'0%'},
        'out':{y:'100%'},        
    },
    'swipe-right':{
        'in':{x:'0%'},
        'out':{x:'100%'},
    },
    'swipe-left':{
        'in':{x:'0%'},
        'out':{x:'-100%'},
    },
    'fade':{
        'in':{opacity:1},
        'out':{opacity:0},
    }
}
export const AnimateMotions = {
    'fade-in':{
        'initial':[Motions['fade'].out],
        'animate':[Motions['fade'].in],
        'exit':[Motions['fade'].out],
    },
    'swipe-top-fade-in':{
        'initial':[Motions['swipe-top'].out,Motions['fade'].out],
        'animate':[Motions['swipe-top'].in,Motions['fade'].in],
        'exit':[Motions['swipe-top'].out,Motions['fade'].out],
    },
    'swipe-bottom-fade-in':{
        'initial':[Motions['swipe-bottom'].out,Motions['fade'].out],
        'animate':[Motions['swipe-bottom'].in,Motions['fade'].in],
        'exit':[Motions['swipe-bottom'].out,Motions['fade'].out],
    },
    'swipe-left-fade-in':{
        'initial':[Motions['swipe-left'].out,Motions['fade'].out],
        'animate':[Motions['swipe-left'].in,Motions['fade'].in],
        'exit':[Motions['swipe-left'].out,Motions['fade'].out],
    },
    'swipe-right-fade-in':{
        'initial':[Motions['swipe-right'].out,Motions['fade'].out],
        'animate':[Motions['swipe-right'].in,Motions['fade'].in],
        'exit':[Motions['swipe-right'].out,Motions['fade'].out],
    },
}
export const AnimateStyle = {
    'hover-ping':`before:h-full before:w-full :hover:before:w-full :hover:before:h-full before:rounded-full before:transition before:duration-500 before:content-[''] before:opacity-0 
    hover:before:opacity-100 before:top-0 before:mx-auto hover:animate-pulse hover:delay-500 before:bg-blue-400 before:py-3 before:px-3 before:left-0 before:absolute 
    transition ease-in before:animate-ping duration-100`,

};
export const TimingMotions = {
    'ease-0.2':{'transition':{ ease: [0.08, 0.65, 0.53, 0.96], duration: 0.2}},
    'ease-0.4':{'transition':{ ease: [0.08, 0.65, 0.53, 0.96], duration: 0.4}},
    'ease-0.5':{'transition':{ ease: [0.08, 0.65, 0.53, 0.96], duration: 0.5}},
    'ease-1':{'transition':{ ease: [0.08, 0.65, 0.53, 0.96], duration: 1}},
}

// ----------------
//     ICONSAX
// ----------------
const IconsaxSrc = {
    'home':'home.svg',
    'archive-tick':'archive-tick.svg',
    'calendar-tick':'calendar-tick.svg',
    'setting-2':'setting-2.svg',
    'eye':'eye.svg',
    'info-circle':'info-circle.svg',
    'close-circle':'close-circle.svg',
    'arrow-up-1':'arrow-up-1.svg',
    'arrow-up-2':'arrow-up-2.svg',
    'arrow-up-3':'arrow-up-3.svg',
    'arrow-left-1':'arrow-left-1.svg',
    'arrow-left-2':'arrow-left-2.svg',
    'arrow-left-3':'arrow-left-3.svg',
};
class IconsaxType{
    constructor (type,iconset) {
        this.type = type;
        this.iconset = iconset;
        return new Proxy(this, this);
    }
    get (target, prop) {
        if(!this.iconset[prop]) return FilePath.iconsax[this.type] + prop;
        return FilePath.iconsax[this.type] + this.iconset[prop];
    }
}
export const Iconsax = {
    'linear':new IconsaxType('linear',IconsaxSrc),
    'outline':new IconsaxType('outline',IconsaxSrc),
    'bold':new IconsaxType('bold',IconsaxSrc),
}
