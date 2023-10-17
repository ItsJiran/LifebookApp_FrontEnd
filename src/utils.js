import { useState } from "react";
import { date } from "yup";

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
export class CustomDate{

    constructor( date = new Date() )   {
        this.set(date);
    }

    serialize(){
        return {
            current : this.current,
            last : this.last,
            prev : this.prev,
        };
    }
    static unserialize(object){
        return new CustomDate( new Date(object.current.year, object.current.month, object.current.day) );
    }

    set(date){
        if (date instanceof Date == false) throw new Error('date should be instance of Date');
        this._initializeCurrent(date);
        this._initializeNext();
        this._initializePrev();
    }
    nextMonth(isMock = false,day){
        if(isMock) return new CustomDate( new Date(this.current.year, this.current.month + 1,1) );
        else       this.set( new Date(this.current.year, this.current.month + 1, 1) );
    }
    prevMonth(isMock = false,day){
        if(isMock) return new CustomDate( new Date(this.current.year, this.current.month - 1, this.prev.last.date) );
        else       this.set( new Date(this.current.year, this.current.month - 1, 1) );
    }

    // PRIVATE
    _initializeCurrent(date){
        var tmp = ExtractDateObj(date);

        this.current = {
            day : tmp.day,
            year : tmp.year,
            month : tmp.month,
        }
        this.start = tmp.start;
        this.last = tmp.last;

        
        if(this.current.month == new Date().getMonth() && this.current.year == new Date().getFullYear() && this.current.day.date == new Date().getDate()){
            this.current.isToday = true;
        } else {
            this.current.isToday = false;
        }
    }
    _initializePrev(){
        var tmp = ExtractDateObj( new Date(this.current.year, this.current.month - 1) );
        this.prev  = tmp;
    }
    _initializeNext(){
        var tmp = ExtractDateObj( new Date(this.current.year, this.current.month + 1) );
        this.next  = tmp;
    }
}
export const ExtractDateObj = (dateObj)=>{
    if (dateObj instanceof Date == false) throw new Error('dateObj should be instance of Date');

    var tmp = {
        day:{
            num:dateObj.getDay(),
            date:dateObj.getDate(),
        },
        month:dateObj.getMonth(),
        year:dateObj.getFullYear(),

    }

    tmp.start = {
        num:new Date(tmp.year, tmp.month, 1).getDay(),
        date:new Date(tmp.year, tmp.month, 1).getDate(),
    }

    tmp.last = {
        num:new Date(tmp.year, tmp.month + 1, 0).getDay(),
        date:new Date(tmp.year, tmp.month + 1, 0).getDate(),
    }

    return tmp;

}
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
    if(isSort) return ShortMonthTable[index];
    else       return MonthTable[index];
}
export const getDayName = (index, isSort=false)=>{
    if(isSort) return ShortDayTable[index];
    else       return DayTable[index];
}
export const getLocaleDate = (format)=>{
    let date = new Date();

    // expected format date yyyy-mm-dd
    let split = date.toISOString().split('T')[0].split('-');

    var obj = {
        year:split[0],
        month:split[1],
        day:split[2],
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

// useful for post 
export const FormatDataAscending = (data)=>{
    if(data == {}) return {};

    // separate with the same years
    var tmp_arr = {};

    // let assumption that data year will be yyyy-mm-dd
    // and assumption that month will not be an index so it start from 1
    for(let datum of data){
      var extract_date = FormatDate(datum.date);
      var extract_time = FormatTime(datum.time);

      if( !tmp_arr[extract_date.year] ) tmp_arr[extract_date.year] = {};

      if( !tmp_arr[extract_date.year][extract_date.month] ) tmp_arr[extract_date.year][extract_date.month] = {};

      if( !tmp_arr[extract_date.year][extract_date.month][extract_date.day] ) tmp_arr[extract_date.year][extract_date.month][extract_date.day] = [];

      datum.extract_date = extract_date;
      datum.extract_time = extract_time;
      tmp_arr[extract_date.year][extract_date.month][extract_date.day].push(datum);
    }

    // sort year asc

    // Sorting again for the day
    for(let by_year of Object.keys(tmp_arr)){

      for(let by_month of Object.keys(tmp_arr[by_year])){

        for(let by_days of Object.keys( tmp_arr[by_year][by_month]) ){

          var tmp = tmp_arr[by_year][by_month][by_days];

          for(let i = 0; i < tmp.length; i++){

            if(tmp[i+1] !== undefined){
              if( parseInt( FormatTime(tmp[i].time).hour ) < parseInt( FormatTime(tmp[i+1].time).hour ) ){
                var n = tmp[i];
                tmp[i] = tmp[i+1];
                tmp[i+1] = n;
              } else if( parseInt( FormatTime(tmp[i].time).hour ) == parseInt( FormatTime(tmp[i+1].time).hour ) && 
                         parseInt( FormatTime(tmp[i].time).minute ) < parseInt( FormatTime(tmp[i+1].time).minute ) ){
                var n = tmp[i];
                tmp[i] = tmp[i+1];
                tmp[i+1] = n;
              }

            }
        
            if(tmp[i-1] !== undefined){
              if( parseInt( FormatTime(tmp[i].time).hour ) > parseInt( FormatTime(tmp[i-1].time).hour ) ){
                var n = tmp[i];
                tmp[i] = tmp[i-1];
                tmp[i-1] = n;
                i=0;   
              } else if( parseInt( FormatTime(tmp[i].time).hour ) == parseInt( FormatTime(tmp[i-1].time).hour ) && 
                         parseInt( FormatTime(tmp[i].time).minute ) > parseInt( FormatTime(tmp[i-1].time).minute ) ){
                var n = tmp[i];
                tmp[i] = tmp[i-1];
                tmp[i-1] = n;
                i=0;   
              }
        
            }
        
          }

        }

      } 

    } 

    // sort asc month year days
    // var new_year = Object.keys(tmp_arr).sort( (a,b)=>{ if(a<b) return 1; else return -1; } );
    // var new_data = [];
  
    // for( let year of new_year ){

    //   var new_months =  Object.keys(tmp_arr[year]).sort( (a,b)=>{ if(a<b) return 1; else return -1; } );

    //   for(let months of new_months){

    //     var new_days = Object.keys(tmp_arr[year][months]).sort( (a,b)=>{ if(a<b) return 1; else return -1; } );
        
    //     for(let days of new_days){
          
    //       for(let day of tmp_arr[year][months][days]){
    //         new_data.push(day);
    //       }

    //     }
        
    //   }

    // }

    return tmp_arr;
  }

