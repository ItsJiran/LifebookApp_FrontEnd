import React, { useState } from "react";
import { useLocation, Route, Routes, useMatches, Link, useNavigate } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";
import { Iconsax, AnimateMotions, TimingMotions, FilePath, FormatDate, FormatTime, FormatDataAscending, getMonthName, getDayName } from "../../utils";

import { CircleDecoration, Container, Icon, Loading } from "../../components/Components";
import { LayerMain } from "../../components/Layers";

import { useNotifierController } from "../../hooks_utils/NotifierUtils";
import { useAuthController } from "../../hooks_utils/AuthUtils";
import { useAppService } from "../../hooks_utils/AppUtils";

import { useApiService } from "../../hooks_utils/ApiUtils";
import { useChoicerController } from "../../hooks_utils/ChoicerUtils";

export default function JournalsPage() {
  // ========================================================================================================
  // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
  // ========================================================================================================
  const location = useLocation();
  const navigate = useNavigate();

  // -- Service And Controller
  const AppService = useAppService();
  const ApiService = useApiService();

  // -- Variable And State
  const NotifierController = useNotifierController();
  const ChoicerController = useChoicerController();

  const [query,setQuery] = useState('');
  const [fromQuery,setFromQuery] = useState(false);
  const [pageState, setPageState] = useState({
    loading:false,
    error:{
      status:false,
      data:undefined,
    },
    data:[],
  });

  const elmChoices = ( 
    <>
        <div onClick={ ()=>{ ChoicerController.action('View') } } className="w-full px-2 py-2 flex align-center items-center">
            <Icon className="filter-blue-dark-300 h-6 w-6 mr-3 cursor-pointer" iconUrl={Iconsax.bold['edit.svg']}/>
            <label className="text-blue-dark-300 text-sm font-semibold tracking-wide leading-4 cursor-pointer">View Journal</label>
        </div>

        <div onClick={ ()=>{ ChoicerController.action('Delete') } } className="w-full px-2 py-2 flex align-center items-center">
            <Icon className="filter-red-400 h-6 w-6 mr-3 cursor-pointer" iconUrl={Iconsax.bold['trash.svg']}/>
            <label className="text-red-400 text-sm font-semibold tracking-wide leading-4 cursor-pointer">Delete Journal</label>
        </div>
    </> )

  const deleteElmChoices = ( 
    <div key='choicer' className="absolute top-0 h-full left-0 w-full overflow-y-hidden">
      <div className="sticky h-full top-0 items-center flex z-50 justify-center">
      
          <motion.div animate={{...AnimateMotions['fade-in'], ...TimingMotions['ease-0.5']}} onClick={ChoicerController.hide} className="absolute w-full h-full top-0 left-0 bg-black-400 opacity-40"></motion.div>
          
          <Container animate={{...AnimateMotions['swipe-bottom-fade-in'], ...TimingMotions['ease-0.5']}} className="px-4 py-4 pb-6 absolute w-full mx-6 -bottom-2 flex flex-col">
            <div onClick={ ()=>{ ChoicerController.action('Yes') } } className="w-full px-2 py-2 flex align-center items-center">
                <Icon className="filter-blue-dark-300 h-6 w-6 mr-3 cursor-pointer" iconUrl={Iconsax.bold['verify.svg']}/>
                <label className="text-blue-dark-300 text-sm font-semibold tracking-wide leading-4 cursor-pointer">Konfirmasi</label>
            </div>
            <div onClick={ ()=>{ ChoicerController.action('No') } } className="w-full px-2 py-2 flex align-center items-center">
                <Icon className="filter-red-400 h-6 w-6 mr-3 cursor-pointer" iconUrl={Iconsax.bold['close-square.svg']}/>
                <label className="text-red-400 text-sm font-semibold tracking-wide leading-4 cursor-pointer">Batal</label>
            </div>
          </Container>

        </div>
      </div> )
  const loadingDeleteElmChoices = ( 
    <div key='choicer' className="absolute top-0 h-full left-0 w-full overflow-y-hidden">
      <div className="sticky h-full top-0 items-center flex z-50 justify-center">
      
          <motion.div animate={{...AnimateMotions['fade-in'], ...TimingMotions['ease-0.5']}} className="absolute w-full h-full top-0 left-0 bg-black-400 opacity-40"></motion.div>
          
          <Container animate={{...AnimateMotions['swipe-bottom-fade-in'], ...TimingMotions['ease-0.5']}} className="px-4 py-4 pb-6 absolute w-full mx-6 -bottom-2 flex flex-col">
              <Loading className="h-6 w-6 px-2 filter-blue-400 py-2 mx-auto"/>
          </Container>

        </div>
      </div> )
  const retryDeleteElmChoices = (title,message) => {
    return ( 
      <>

          <h2 className="text-base my-2 mb-2 font-bold text-center leading-3 tracking-wider text-blue-dark-300">{title}</h2>
          <p className="text-sm text-center leading-3 tracking-wider text-blue-dark-300 mb-2">{message}</p>

          <div className="w-full my-2 border-b-[1px] border-blue-dark-300"></div>          

          <div onClick={ ()=>{ ChoicerController.action('Retry') } } className="w-full px-2 py-2 flex align-center items-center">
              <Icon className="filter-blue-dark-300 h-6 w-6 mr-3 cursor-pointer" iconUrl={Iconsax.bold['refresh-2.svg']}/>
              <label className="text-blue-dark-300 text-sm font-semibold tracking-wide leading-4 cursor-pointer">Retry</label>
          </div>
  
          <div onClick={ ()=>{ ChoicerController.action('Cancel') } } className="w-full px-2 py-2 flex align-center items-center">
              <Icon className="filter-red-400 h-6 w-6 mr-3 cursor-pointer" iconUrl={Iconsax.bold['close-square.svg']}/>
              <label className="text-red-400 text-sm font-semibold tracking-wide leading-4 cursor-pointer">Cancel</label>
          </div>
      </> )
  } 

  // ========================================================================================================
  // ------------------------------------------- REACT EFFECT -----------------------------------------------
  // ========================================================================================================
  React.useEffect(()=>{

    // Get session storage query
    var local_query = window.sessionStorage.getItem('journalSearch');
    if(local_query && typeof local_query === 'string') setQuery(local_query);

    // fetchJournals
    fetchJournals();

  },[]);

  // ========================================================================================================
  // -------------------------------------------- FUNCTIONS -------------------------------------------------
  // ========================================================================================================
  const fetchJournals = async (s_query) => {
    setPageState( (prev) => ({...prev,loading:true}) );
    if(pageState.loading) return console.log('on loading');

    try{

      // === Download Script Files
      let fetch = undefined; 

      if(s_query) setFromQuery(true);

      if(s_query) fetch = await ApiService.fetchAuth({ slug:'journals' + '?q=' + s_query });
      else        fetch = await ApiService.fetchAuth({ slug:'journals' });

      if(fetch.status >= 200 && fetch.status < 300){

        let data = FormatDataAscending(fetch.response.data);

        setPageState( (prev) => ({...prev,
          error:{
            status:false,
            data:undefined,
          },
          data:data,
        }) );

      } else if(fetch.status >= 400 || ApiService.isReturnError(fetch)) {
        throw fetch;                
      }

    } catch(e){
      console.error(e);
      setPageState( (prev)=>({...prev,
        error:{ 
          status:true,
          data:e,
        },
        data:[],
      }));
    }

    setPageState( (prev) => ({...prev,loading:false}) );
  }
  const deleteJournal = async (id)=>{

  }

  // Of COURSE THIS SHIT WILL BE REWRITTEN FOR NOW ITS A TECHNICAL DEBT BUT THAT'S OKAY
  // 15 OCT 2023 - G
  const renderData = ()=>{

    var elm = [];

    // sort asc month year days
    var new_year = Object.keys(pageState.data).sort( (a,b)=>{ if(a<b) return 1; else return -1; } );

    // YEAR
    for( let year of new_year ){

      elm.push( (
        <div className="text-center mt-2">
          <label className="text-sm font-bold text-blue-400">  YEAR {year} </label>
        </div>
      ) )

      var new_months =  Object.keys(pageState.data[year]).sort( (a,b)=>{ if(a<b) return 1; else return -1; } );
      for(let months of new_months){

        elm.push( (
          <div className="mx-3 mb-1 mt-1 gap-3 relative flex items-center">
            <label className="text-base font-bold text-blue-400">  { getMonthName(months - 1) } </label>
            <div className="flex-1 border-b-[2.5px] border-blue-200"></div>
          </div>
        ) )

        var new_days = Object.keys(pageState.data[year][months]).sort( (a,b)=>{ if(a<b) return 1; else return -1; } );
        for(let days of new_days){
          
          for(let day of pageState.data[year][months][days]){
            elm.push( (
              <div className="bg-white mx-3 shadow rounded-md border-b-2 border-blue-200 h-fit flex px-2 py-2 gap-2">
    
                <div className="flex-grow flex flex-col pt-1 pb-1">
                  <div className="w-full h-fit mb-[2px] flex" onClick={()=>{ handleClickJournal(day.id) }}>
                    <h2 className="text-1sm flex-1  text-blue-dark-300 font-semibold tracking-wide">{day.title}</h2>
                    <div onClick={()=>{handleClickJournal(day.id)}} className="px-2">
                      <Icon  className="h-[18px] w-[4px] flex-initial filter-blue-400 bg-cover" iconUrl={FilePath.assets + 'svg/dots-menu.svg'}/>
                    </div>
                  </div>
    
                  <div className="text-2sm text-blue-dark-100 tracking-wide flex gap-1 font-medium">
                    <div className="flex gap-1 align-center items-center">
                      <Icon className="w-[13px] h-[13px] filter-blue-dark-100" iconUrl={Iconsax.bold['clock.svg']}/>
                      <label> { day.extract_date.day + ' ' + getDayName( new Date(day.extract_date.year, day.extract_date.month - 1, day.extract_date.day).getDay(),true)} </label>
                    </div>
                    |
                    <label> { day.extract_time.hour + ':' + day.extract_time.minute} </label>
                  </div>
                </div> 
    
              </div>
            ));
          }
        } 
      }
    }

    return (  
      elm.map( (e)=>{
        return e;
      } )
    )
  }

  // --- input
  const handleSearchChange = (e)=>{
    setQuery(e.target.value);
    window.sessionStorage.setItem('journalSearch',e.target.value);
  }
  const handleSearch = async()=>{
    await fetchJournals(query);
  }
  const handleRefresh = async()=>{
    if(fromQuery) fetchJournals(query);
    else          fetchJournals();
  }
  const handleClickJournal = async (id)=>{
    const result = await ChoicerController.show(elmChoices);

    if(result == 'Delete'){
      const confirm_delete =     await ChoicerController.showCustom(deleteElmChoices);

      if(confirm_delete == 'Yes') ChoicerController.showCustom(loadingDeleteElmChoices);
      else                        return ChoicerController.hide();

      while(true){
        try{

            fetch = await ApiService.fetchAuth({slug:'journal/'+id,method:'delete'})

            var title = ApiService.generateApiTitle(fetch);
            var msg = ApiService.generateApiMessage(fetch);

            if(fetch.status >= 200 && fetch.status < 300){
              NotifierController.addNotification({
                title:title,
                message:msg,
                type:'Success',
              });
              handleRefresh();
              return ChoicerController.hide();
            } else if(fetch.status >= 400 || ApiService.isReturnError(fetch)) {
              throw fetch;                
            } else {
              throw fetch;
            }
      
          } catch(e){
            console.error(e);
            let retry = await ChoicerController.show(retryDeleteElmChoices(title, msg));
            if(retry == 'Retry') continue;
            else                 return;
          }
      }
    }
  }
  const refresh = async()=>{
    await fetchJournals();
  }


  return (
    <>
      {/* ================== HEADER ==================== */}
      <div className="h-[40px] w-full px-3 py-2 box-border flex mt-2 justify-between">
        <div className="h-fit w-fit">
          
        </div>
        
        <div className="h-fit w-fit flex gap-2 items-center">
          <Icon className="filter-blue-400 h-5 w-5" iconUrl={Iconsax.bold['archive-tick']}/>
          <h1 className="text-blue-400 text-lg font-semibold tracking-wide">Journals</h1>
        </div>
        
        <div className="h-fit w-fit">
          <Icon onClick={async ()=>{navigate('/journals/add',{replace:true})}} className="h-6 w-6 filter-blue-400 hover:filter-blue-dark-300" iconUrl={Iconsax.bold['add-circle.svg']}/>
        </div>
      </div>

      {/* ================ CONTENT ================= */}
      <LayerMain id='MAIN_CONTENT' className="py-2 relative overflow-auto h-full flex flex-col">

          <div id='MATERIALS_JOURNAL_HEADER' className="mx-3 h-fit flex justify-between mb-4 relative border-b-[2px] border-blue-light-100 items-center">
            {/* ------------ Table Tab ------------- */}
            <div className="flex relative gap-2">          
              <Link to={'/journals'} replace className="relative text-sm pb-2 font-semibold text-center px-1 text-blue-dark-400 tracking-wider block w-fit">
                See All
                <div className="absolute h-full w-full border-b-[2.5px] border-blue-400 -bottom-[2.3px] left-0"></div>
              </Link>

              <Link to={'/journals/date'} replace className="text-sm pb-2 font-semibold text-center px-1 text-blue-dark-200 tracking-wider block w-fit">
                By Date
              </Link>
            </div>
            {/* Button Tab */}
            <div className="">
              

            </div>
          </div>   

          {/* ---------- SEARCH BAR ------------- */}
          <div className="bg-blue-400 mb-3 relative overflow-auto px-5 py-5 flex items-center justify-between gap-2">
            <CircleDecoration className="h-32 w-32 bg-cover absolute -top-20 -left-14" variant="white"/>
            <input name='search' onChange={handleSearchChange} onSubmit={handleSearch} value={query} className="px-2 py-2 w-full bg-white text-sm text-blue-dark-400 rounded-md border-b-2 border-blue-300 outline-none" placeholder="Search Here.."/>
            <Icon onClick={handleSearch} className="h-8 filter-white w-8" iconUrl={Iconsax.bold['search-normal-1.svg']}/>
          </div>

          <div className="w-full flex-1 overflow-auto h-fit">
            <div id='MATERIALS_JOURNAL_CONTAINER' className="w-full flex flex-1 flex-col gap-3">
              <AnimatePresence mode='wait'>

                {/* ================================================= */}
                {/* ============= DISPLAY SKELETON DATA ============= */}
                {/* ================================================= */}
                { pageState.loading ?  
                  <div className="px-3 py-3 flex flex-col gap-3"> 
                    <motion.div key='loading-1' {...{...AnimateMotions['fade-in'],...TimingMotions['ease-0.5']}} className="bg-white w-full rounded-md border-b-2 border-blue-200 h-fit flex px-2 py-2 gap-2">
                        <div className="bg-blue-200 animate-pulse h-[30px] w-[30px] rounded-md"></div>
                        <div className="flex-grow flex flex-col py-2 gap-2">
                          <div className="rounded-md animate-pulse bg-blue-200 h-[5px] w-[80%]"></div>
                          <div className="rounded-md animate-pulse bg-blue-200 h-[5px] w-[30%]"></div>
                        </div>
                    </motion.div>

                    <motion.div key='loading-2' {...{...AnimateMotions['fade-in'],...TimingMotions['ease-0.5']}} className="bg-white w-full rounded-md border-b-2 border-blue-200 h-fit flex px-2 py-2 gap-2">
                        <div className="bg-blue-200 animate-pulse h-[30px] w-[30px] rounded-md"></div>
                        <div className="flex-grow flex flex-col py-2 gap-2">
                          <div className="rounded-md animate-pulse bg-blue-200 h-[5px] w-[80%]"></div>
                          <div className="rounded-md animate-pulse bg-blue-200 h-[5px] w-[30%]"></div>
                        </div>
                    </motion.div>

                    <motion.div key='loading-3' {...{...AnimateMotions['fade-in'],...TimingMotions['ease-0.5']}} className="bg-white w-full rounded-md border-b-2 border-blue-200 h-fit flex px-2 py-2 gap-2">
                        <div className="bg-blue-200 animate-pulse h-[30px] w-[30px] rounded-md"></div>
                        <div className="flex-grow flex flex-col py-2 gap-2">
                          <div className="rounded-md animate-pulse bg-blue-200 h-[5px] w-[80%]"></div>
                          <div className="rounded-md animate-pulse bg-blue-200 h-[5px] w-[30%]"></div>
                        </div>
                    </motion.div>
                  </div>
                : '' }

                { 
                  !pageState.loading && Object.entries(pageState.data).length > 0 && !pageState.error.status ? 
                    <>
                      { renderData() }
                    </>
                  : ''
                }

                { 
                  !pageState.loading && Object.entries(pageState.data).length == 0 && !pageState.error.status ? 
                    <>
                      <motion.div key='no-content' {...{...AnimateMotions['fade-in'],...TimingMotions['ease-0.5']}} className="flex mt-2 flex-col items-center text-center w-fit mx-auto h-fit flex px-2 py-2 text-1sm text-blue-dark-200 tracking-wide">
                        <img src={ FilePath.assets + 'svg/document.svg' } className='w-44 mb-2 mt-2 bg-contain bg-no-repeat'/>
                        <h2 className="font-semibold">Tidak Ditemukan</h2>
                        <p className="mb-2">Klik tambah untuk membuat materi jurnal</p>
                        <Icon onClick={()=>{navigate('/journals/add',{replace:true})}} className="h-7 w-7 filter-blue-400 hover:filter-blue-dark-300" iconUrl={Iconsax.bold['add-circle.svg']}/>
                      </motion.div>
                    </>
                  : ''
                }

                {
                    !pageState.loading && pageState.error.status ? 
                      <>
                        <motion.div key='error-fetch' {...{...AnimateMotions['fade-in'],...TimingMotions['ease-0.5']}} className="flex flex-col items-center text-center w-fit mx-auto h-fit flex px-2 py-2 text-1sm text-blue-dark-200 tracking-wide">
                          <h2 className="font-semibold">Terjadi Kesalahan</h2>
                          <p className="mb-2">Klik tambah dibawah ini untuk mencoba lagi</p>
                          <div className="h-fit w-fit px-1 py-1 bg-blue-400 rounded-full"><Icon onClick={ handleRefresh } className="h-4 w-4 filter-white hover:filter-blue-dark-300" iconUrl={Iconsax.bold['refresh.svg']}/>
                          </div>
                        </motion.div>
                      </>
                    : ''
                  }

              </AnimatePresence>
            </div>
          </div>

          {/* Refresh Button */}
          <Container className="absolute shadow px-1 py-1 bottom-4 right-2 h-fit w-fit border-b-2 border-blue-300 cover-pointer">
            {
              !pageState.loading ?
              <Icon onClick={refresh} className="h-8 filter-blue-400 w-8" iconUrl={Iconsax.bold['refresh-2.svg']}/> 
              :
              <Loading className="h-5 w-5 mx-1 my-1 filter-blue-400"/>
            }
          </Container>  

      </LayerMain>
    </>
  );
}
