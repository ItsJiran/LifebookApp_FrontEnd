import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Iconsax, Motions } from "../../utils";

// for default input class 
let CONTAINER_CLASS = `relative`;
let DEFAULT_INPUT_CLASS = `transition box-border min-h-[40px] w-full text-sm border-b-2 border-blue-200 text-blue-dark-300 
placeholder:text-blue-dark-200 normal bg-white bg-white px-2 py-3 placeholder-shown:bg-blue-100 z-0 outline-0`;
let ERROR_INPUT_CLASS = `transition box-border min-h-[40px] w-full text-sm border-b-2 border-red-200 text-red-500 
placeholder:text-red-400 normal bg-red-100 bg-red-100 px-2 py-3 placeholder-shown:bg-red-100 z-0 outline-0`

let DEFAULT_NOTIF_LABEL_CLASS = `group-hover/toggleNotifLabel:filter-white h-5 w-5 py-2 cursor-pointer px-2 box-border filter-blue-dark-200 bg-cover`;
let ERROR_NOTIF_LABEL_CLASS = `group-hover/toggleNotifLabel:filter-white h-5 w-5 py-2 cursor-pointer px-2 box-border filter-red-400 bg-cover`;

// for toggle password interactive class
let NOTIF_LABEL_CONTAINER = `flex relative h-fit w-fit`;
let DEFAULT_NOTIF_LABEL_CONTAINER = `group/toggleNotifLabel flex relative h-fit w-fit before:content-[''] before:opacity-0 hover:before:opacity-100 before:top-1/2 before:-translate-x-1/2 :group-hover:filter-white
before:h-1/2 before:w-1/2 :hover:before:w-full :hover:before:h-full before:rounded-full before:transition before:duration-500 before:bg-blue-400 before:py-3 before:px-3 before:left-1/2 before:-translate-y-1/2  before:absolute`;
let ERROR_NOTIF_LABEL_CONTAINER = `group/toggleNotifLabel flex relative h-fit w-fit before:content-[''] before:opacity-0 hover:before:opacity-100 before:top-1/2 before:-translate-x-1/2 :group-hover:filter-white
before:h-1/2 before:w-1/2 :hover:before:w-full :hover:before:h-full before:rounded-full before:transition before:duration-500 before:bg-red-400 before:py-3 before:px-3 before:left-1/2 before:-translate-y-1/2  before:absolute`;

//
let ERROR_MESSAGE_CONTAINER = `relative w-full h-fit px-4 py-3 bg-red-400 rounded-md border-b-2 border-red-500 text-sm text-white`;
let ERROR_MESSAGE_ARROW     = `absolute right-1 -top-4 h-6 w-6 filter-red-400`;

export const Input = React.forwardRef( ({ register, placeholder, type, containerClass = '', className = '', formState },ref) => {
  // ========================================================================================================
  // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
  // ========================================================================================================
  const [isFocus,setFocus] = React.useState(false);
  const Errors             = formState.errors[register.name]; 
  const isError            = Errors !== undefined;

  let inputClass = !isError ? DEFAULT_INPUT_CLASS + ' ' + className 
                            : ERROR_INPUT_CLASS   + ' ' + className ;

  function trueFocus(){
    setFocus(true);
  }
  function falseFocus(){
    setFocus(false);
  }

  let input = undefined;

  if(type == 'textarea') input = <textarea {...register} onFocus={trueFocus} onBlur={falseFocus} type={type} placeholder={placeholder} className={inputClass} />;
  else                   input = <input {...register} onFocus={trueFocus} onBlur={falseFocus} type={type} placeholder={placeholder} className={inputClass} />;
      

  // ========================================================================================================
  // ---------------------------------------------- RENDER --------------------------------------------------
  // ========================================================================================================
  return (
    <div className={CONTAINER_CLASS + ' ' + containerClass}>
      {input}

      {/* NOTIF LABEL */}
      <div className="absolute gap-1.5 box-border h-[46px] top-0 right-0 w-fit px-2 items-center content-center flex flex-row-reverse">
        { isError ? <div className={NOTIF_LABEL_CONTAINER}> <label className={ERROR_NOTIF_LABEL_CLASS} style={{backgroundImage:'Url(' + Iconsax.bold['info-circle'] + ')'}} /> </div> : '' }
      </div>
      
      {/* NOTIF MESSAGE LABEL */}
      <div className="absolute top-[50px] z-10 w-full h-fit">
        <AnimatePresence mode='wait'>
          { 
            isError && isFocus ? 
              <motion.div className="w-full h-fit px-4 py-3 bg-red-400 rounded-md border-b-2 border-red-500 text-1sm text-white"
                key='error-message'
                initial={{opacity:0, y:'-5'}}
                animate={{opacity:1, y:'0'}}
                exit={{opacity:0, y:'-5'}}
                transition={{ ease: [0.08, 0.65, 0.53, 0.96], duration: 0.5 }}
              > 
                <div className={ERROR_MESSAGE_ARROW} style={{backgroundImage:'Url(' + Iconsax.bold['arrow-up-1'] + ')'}} /> 
                { Errors.message }
              </motion.div>
            : ''
          }
        </AnimatePresence>
      </div>
    </div>
  );    
})

export const Select = React.forwardRef( ({ register, placeholder, type, containerClass = '', className = '', formState, options },ref) => {
  // ========================================================================================================
  // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
  // ========================================================================================================
  const [isFocus,setFocus] = React.useState(false);
  const Errors             = formState.errors[register.name]; 
  const isError            = Errors !== undefined;

  let inputClass = !isError ? DEFAULT_INPUT_CLASS + ' ' + className 
                            : ERROR_INPUT_CLASS   + ' ' + className ;

  function trueFocus(){
    setFocus(true);
  }
  function falseFocus(){
    setFocus(false);
  }

  // ========================================================================================================
  // ---------------------------------------------- RENDER --------------------------------------------------
  // ========================================================================================================
  return (
    <div className={CONTAINER_CLASS + ' ' + containerClass}>
      <select {...register} onFocus={trueFocus} onBlur={falseFocus} type={type} placeholder={placeholder} className={inputClass}>
        {
            options.map((item,index)=>{
              return <option value={item}>{item}</option>;
            })
        }
      </select>

      {/* NOTIF LABEL */}
      <div className="absolute gap-1.5 box-border h-[46px] top-0 right-0 w-fit px-2 items-center content-center flex flex-row-reverse">
        { isError ? <div className={NOTIF_LABEL_CONTAINER}> <label className={ERROR_NOTIF_LABEL_CLASS} style={{backgroundImage:'Url(' + Iconsax.bold['info-circle'] + ')'}} /> </div> : '' }
      </div>
      
      {/* NOTIF MESSAGE LABEL */}
      <div className="absolute top-[50px] z-10 w-full h-fit">
        <AnimatePresence mode='wait'>
          { 
            isError && isFocus ? 
              <motion.div className="w-full h-fit px-4 py-3 bg-red-400 rounded-md border-b-2 border-red-500 text-1sm text-white"
                key='error-message'
                initial={{opacity:0, y:'-5'}}
                animate={{opacity:1, y:'0'}}
                exit={{opacity:0, y:'-5'}}
                transition={{ ease: [0.08, 0.65, 0.53, 0.96], duration: 0.5 }}
              > 
                <div className={ERROR_MESSAGE_ARROW} style={{backgroundImage:'Url(' + Iconsax.bold['arrow-up-1'] + ')'}} /> 
                { Errors.message }
              </motion.div>
            : ''
          }
        </AnimatePresence>
      </div>
    </div>
  );    
})

export function InputPassword({ register, placeholder, containerClass = '', className = '', formState, onClick }) {
  // ========================================================================================================
  // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
  // ========================================================================================================
  const [shownPassword, setShownPassword] = React.useState(false);
  const [isFocus,setFocus] = React.useState(false);
  const Errors             = formState.errors[register.name]; 
  const isError            = Errors !== undefined;

  let inputClass = !isError ? DEFAULT_INPUT_CLASS + ' ' + className 
                            : ERROR_INPUT_CLASS   + ' ' + className ;

  function trueFocus(){
    setFocus(true);
  }
  function falseFocus(){
    setFocus(false);
  }
  function togglePassword(e){
    setShownPassword(!shownPassword)
  }

  // ========================================================================================================
  // ---------------------------------------------- RENDER --------------------------------------------------
  // ========================================================================================================
  return (
    <div className={CONTAINER_CLASS + ' ' + containerClass}>
      <input {...register} onClick={onClick} onFocus={trueFocus} onBlur={falseFocus} type={shownPassword ? 'text' : 'password' } placeholder={placeholder} className={inputClass} />

      {/* NOTIF LABEL */}
      <div className="absolute gap-1.5 box-border h-[46px] top-0 right-0 w-fit px-2 items-center content-center flex flex-row-reverse">
      { isError ? <div className={NOTIF_LABEL_CONTAINER}> <label className={ERROR_NOTIF_LABEL_CLASS} style={{backgroundImage:'Url(' + Iconsax.bold['info-circle'] + ')'}} /> </div> : '' }
        <div className={!isError ? DEFAULT_NOTIF_LABEL_CONTAINER : ERROR_NOTIF_LABEL_CONTAINER} onClick={togglePassword}>{
          !shownPassword ? <label className={!isError ? DEFAULT_NOTIF_LABEL_CLASS : ERROR_NOTIF_LABEL_CLASS} style={{backgroundImage:'Url(' + Iconsax.bold.eye + ')'}} /> 
                         : <label className={!isError ? DEFAULT_NOTIF_LABEL_CLASS : ERROR_NOTIF_LABEL_CLASS} style={{backgroundImage:'Url(' + Iconsax.linear.eye + ')'}} />
        }</div>
      </div>

      {/* NOTIF MESSAGE LABEL */}
      <div className="absolute top-[50px] z-10 w-full h-fit">
        <AnimatePresence mode='wait'>
          { 
            isError && isFocus ? 
              <motion.div className="w-full h-fit px-4 py-3 bg-red-400 rounded-md border-b-2 border-red-500 text-sm text-white"
                key='error-message'
                initial={{opacity:0, y:'-5'}}
                animate={{opacity:1, y:'0'}}
                exit={{opacity:0, y:'-5'}}
                transition={{ ease: [0.08, 0.65, 0.53, 0.96], duration: 0.5 }}
              > 
                <div className={ERROR_MESSAGE_ARROW} style={{backgroundImage:'Url(' + Iconsax.bold['arrow-up-1'] + ')'}} /> 
                { Errors.message }
              </motion.div>
            : ''
          }
        </AnimatePresence>
      </div>
    </div>
  );
}
