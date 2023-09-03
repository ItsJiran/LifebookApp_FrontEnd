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

export const Motions = {
    'swipe-right':{
        'in':{x:'0%'},
        'out':{x:'-100%'},
    },
    'swipe-left':{
        'in':{x:'0%'},
        'out':{x:'100%'},
    },
    'fade':{
        'in':{opacity:1},
        'out':{opacity:0},
    }
}

export const Animate = {
    'hover-big':`before:h-full before:w-full :hover:before:w-full :hover:before:h-full before:rounded-full before:transition before:duration-500 before:content-[''] before:opacity-0 
    hover:before:opacity-100 before:top-0 before:mx-auto hover:animate-pulse hover:delay-500 before:bg-blue-400 before:py-3 before:px-3 before:left-0 before:absolute 
    transition ease-in before:animate-ping duration-100`,
};

const IconsaxSrc = {
    'eye':'eye.svg',
    'info-circle':'info-circle.svg',
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

export function isInputValid(name,formState){

}
export function isInputError(name,formState){
    if(formState.errors[name] !== undefined) return formState.errors[name];
    return 0;
}