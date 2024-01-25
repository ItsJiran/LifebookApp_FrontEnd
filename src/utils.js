import { useState } from "react";
import { date } from "yup";

// ----------------
//     ASSETS
// ----------------
const assets = '/public/assets/';
const iconsax = '/public/library/iconsax/';

const routines_icon = '/public/routines_icon/';

export const FilePath = {
    'assets':'/public/assets/',
    'iconsax':{
        'linear':iconsax + 'linear/',
        'outline':iconsax + 'outline/',
        'bold':iconsax + 'bold/',
    },
    'icons':{
        routines:routines_icon,
    }
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

// =============================
// GENERATE FILTER COLOR BY HEX
// =============================

class Color {
    constructor(r, g, b) {
      this.set(r, g, b);
    }
    
    toString() {
      return `rgb(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)})`;
    }
  
    set(r, g, b) {
      this.r = this.clamp(r);
      this.g = this.clamp(g);
      this.b = this.clamp(b);
    }
  
    hueRotate(angle = 0) {
      angle = angle / 180 * Math.PI;
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);
  
      this.multiply([
        0.213 + cos * 0.787 - sin * 0.213,
        0.715 - cos * 0.715 - sin * 0.715,
        0.072 - cos * 0.072 + sin * 0.928,
        0.213 - cos * 0.213 + sin * 0.143,
        0.715 + cos * 0.285 + sin * 0.140,
        0.072 - cos * 0.072 - sin * 0.283,
        0.213 - cos * 0.213 - sin * 0.787,
        0.715 - cos * 0.715 + sin * 0.715,
        0.072 + cos * 0.928 + sin * 0.072,
      ]);
    }
  
    grayscale(value = 1) {
      this.multiply([
        0.2126 + 0.7874 * (1 - value),
        0.7152 - 0.7152 * (1 - value),
        0.0722 - 0.0722 * (1 - value),
        0.2126 - 0.2126 * (1 - value),
        0.7152 + 0.2848 * (1 - value),
        0.0722 - 0.0722 * (1 - value),
        0.2126 - 0.2126 * (1 - value),
        0.7152 - 0.7152 * (1 - value),
        0.0722 + 0.9278 * (1 - value),
      ]);
    }
  
    sepia(value = 1) {
      this.multiply([
        0.393 + 0.607 * (1 - value),
        0.769 - 0.769 * (1 - value),
        0.189 - 0.189 * (1 - value),
        0.349 - 0.349 * (1 - value),
        0.686 + 0.314 * (1 - value),
        0.168 - 0.168 * (1 - value),
        0.272 - 0.272 * (1 - value),
        0.534 - 0.534 * (1 - value),
        0.131 + 0.869 * (1 - value),
      ]);
    }
  
    saturate(value = 1) {
      this.multiply([
        0.213 + 0.787 * value,
        0.715 - 0.715 * value,
        0.072 - 0.072 * value,
        0.213 - 0.213 * value,
        0.715 + 0.285 * value,
        0.072 - 0.072 * value,
        0.213 - 0.213 * value,
        0.715 - 0.715 * value,
        0.072 + 0.928 * value,
      ]);
    }
  
    multiply(matrix) {
      const newR = this.clamp(this.r * matrix[0] + this.g * matrix[1] + this.b * matrix[2]);
      const newG = this.clamp(this.r * matrix[3] + this.g * matrix[4] + this.b * matrix[5]);
      const newB = this.clamp(this.r * matrix[6] + this.g * matrix[7] + this.b * matrix[8]);
      this.r = newR;
      this.g = newG;
      this.b = newB;
    }
  
    brightness(value = 1) {
      this.linear(value);
    }
    contrast(value = 1) {
      this.linear(value, -(0.5 * value) + 0.5);
    }
  
    linear(slope = 1, intercept = 0) {
      this.r = this.clamp(this.r * slope + intercept * 255);
      this.g = this.clamp(this.g * slope + intercept * 255);
      this.b = this.clamp(this.b * slope + intercept * 255);
    }
  
    invert(value = 1) {
      this.r = this.clamp((value + this.r / 255 * (1 - 2 * value)) * 255);
      this.g = this.clamp((value + this.g / 255 * (1 - 2 * value)) * 255);
      this.b = this.clamp((value + this.b / 255 * (1 - 2 * value)) * 255);
    }
  
    hsl() {
      // Code taken from https://stackoverflow.com/a/9493060/2688027, licensed under CC BY-SA.
      const r = this.r / 255;
      const g = this.g / 255;
      const b = this.b / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
  
      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
  
          case g:
            h = (b - r) / d + 2;
            break;
  
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }
  
      return {
        h: h * 100,
        s: s * 100,
        l: l * 100,
      };
    }
  
    clamp(value) {
      if (value > 255) {
        value = 255;
      } else if (value < 0) {
        value = 0;
      }
      return value;
    }
  }
  
  class Solver {
    constructor(target, baseColor) {
      this.target = target;
      this.targetHSL = target.hsl();
      this.reusedColor = new Color(0, 0, 0);
    }
  
    solve() {
      const result = this.solveNarrow(this.solveWide());
      return {
        values: result.values,
        loss: result.loss,
        filter: this.css(result.values),
      };
    }
  
    solveWide() {
      const A = 5;
      const c = 15;
      const a = [60, 180, 18000, 600, 1.2, 1.2];
  
      let best = { loss: Infinity };
      for (let i = 0; best.loss > 25 && i < 3; i++) {
        const initial = [50, 20, 3750, 50, 100, 100];
        const result = this.spsa(A, a, c, initial, 1000);
        if (result.loss < best.loss) {
          best = result;
        }
      }
      return best;
    }
  
    solveNarrow(wide) {
      const A = wide.loss;
      const c = 2;
      const A1 = A + 1;
      const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
      return this.spsa(A, a, c, wide.values, 500);
    }
  
    spsa(A, a, c, values, iters) {
      const alpha = 1;
      const gamma = 0.16666666666666666;
  
      let best = null;
      let bestLoss = Infinity;
      const deltas = new Array(6);
      const highArgs = new Array(6);
      const lowArgs = new Array(6);
  
      for (let k = 0; k < iters; k++) {
        const ck = c / Math.pow(k + 1, gamma);
        for (let i = 0; i < 6; i++) {
          deltas[i] = Math.random() > 0.5 ? 1 : -1;
          highArgs[i] = values[i] + ck * deltas[i];
          lowArgs[i] = values[i] - ck * deltas[i];
        }
  
        const lossDiff = this.loss(highArgs) - this.loss(lowArgs);
        for (let i = 0; i < 6; i++) {
          const g = lossDiff / (2 * ck) * deltas[i];
          const ak = a[i] / Math.pow(A + k + 1, alpha);
          values[i] = fix(values[i] - ak * g, i);
        }
  
        const loss = this.loss(values);
        if (loss < bestLoss) {
          best = values.slice(0);
          bestLoss = loss;
        }
      }
      return { values: best, loss: bestLoss };
  
      function fix(value, idx) {
        let max = 100;
        if (idx === 2 /* saturate */) {
          max = 7500;
        } else if (idx === 4 /* brightness */ || idx === 5 /* contrast */) {
          max = 200;
        }
  
        if (idx === 3 /* hue-rotate */) {
          if (value > max) {
            value %= max;
          } else if (value < 0) {
            value = max + value % max;
          }
        } else if (value < 0) {
          value = 0;
        } else if (value > max) {
          value = max;
        }
        return value;
      }
    }
  
    loss(filters) {
      // Argument is array of percentages.
      const color = this.reusedColor;
      color.set(0, 0, 0);
  
      color.invert(filters[0] / 100);
      color.sepia(filters[1] / 100);
      color.saturate(filters[2] / 100);
      color.hueRotate(filters[3] * 3.6);
      color.brightness(filters[4] / 100);
      color.contrast(filters[5] / 100);
  
      const colorHSL = color.hsl();
      return (
        Math.abs(color.r - this.target.r) +
        Math.abs(color.g - this.target.g) +
        Math.abs(color.b - this.target.b) +
        Math.abs(colorHSL.h - this.targetHSL.h) +
        Math.abs(colorHSL.s - this.targetHSL.s) +
        Math.abs(colorHSL.l - this.targetHSL.l)
      );
    }
  
    css(filters) {
      function fmt(idx, multiplier = 1) {
        return Math.round(filters[idx] * multiplier);
      }
      return `invert(${fmt(0)}%) sepia(${fmt(1)}%) saturate(${fmt(2)}%) hue-rotate(${fmt(3, 3.6)}deg) brightness(${fmt(4)}%) contrast(${fmt(5)}%)`;
    }
  }
  
  function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });
  
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
      : null;
  }

  export function filterColor(val){
    const rgb = hexToRgb(val);
    if (rgb.length !== 3) {
      alert('Invalid format!');
      return;
    }
    
    var color = new Color(rgb[0], rgb[1], rgb[2]);
    var solver = new Solver(color);
    var result = solver.solve();

    return result.filter;
  }

  export function filterAccurate(val){
    const rgb = hexToRgb(val);
    if (rgb.length !== 3) {
      alert('Invalid format!');
      return;
    }
    
    while(true){
        var color = new Color(rgb[0], rgb[1], rgb[2]);
        var solver = new Solver(color);
        var result = solver.solve();
    
        if(result.loss <= 5)  break;
    }

    return result.filter;
  }