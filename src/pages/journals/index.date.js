import React, { useState } from "react";
import { useLocation, Route, Routes, useMatches, Link } from "react-router-dom";

import { AnimatePresence } from "framer-motion";
import { FormatDate, Iconsax } from "../../utils";

import { CircleDecoration, Icon } from "../../components/Components";
import { LayerMain } from "../../components/Layers";

import { useNotifierController } from "../../hooks_utils/NotifierUtils";
import { useAuthController } from "../../hooks_utils/AuthUtils";
import { useAppService } from "../../hooks_utils/AppUtils";

import { useApiService } from "../../hooks_utils/ApiUtils";

export default function JournalsDate() {
  // ========================================================================================================
  // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
  // ========================================================================================================
  const location = useLocation();

  const AppService = useAppService();
  const ApiService = useApiService();

  const NotifierController = useNotifierController();

  const tmp_date = new Date();
  const [queryDate,setQueryDate] = useState({
    day:tmp_date.getDate(),
    day_index:tmp_date.getDay(),
    month:tmp_date.getMonth(),
    year:tmp_date.getFullYear(),
  })

  // ========================================================================================================
  // ------------------------------------------- REACT EFFECT -----------------------------------------------
  // ========================================================================================================
  React.useEffect(()=>{
    initialize();
  },[]);

  // ========================================================================================================
  // -------------------------------------------- FUNCTIONS -------------------------------------------------
  // ========================================================================================================
  const initialize = async () => {
    await fetchMaterials();
  }
  const fetchMaterials = async () => {

  }

  return (
    <>
      {/* ================== HEADER ==================== */}
      <div className="h-[40px] w-full px-2 py-2 box-border flex mt-2 justify-between">
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
      <LayerMain id='MAIN_CONTENT' className="py-2 overflow-auto h-full">

          <div id='MATERIALS_JOURNAL_HEADER' className="mx-3 h-fit flex justify-between mb-4 relative border-b-[2px] border-blue-light-100 items-center">
            {/* Table Tab */}
            <div className="flex relative gap-2">          
              <Link to={'/journals'} replace className="relative text-sm py-2 font-semibold text-center px-1 text-blue-dark-200 tracking-wider block w-fit">
                See All            
              </Link>

              <Link to={'/journals/date'} replace className=" relative text-sm py-2 font-semibold text-center px-1 text-blue-dark-400 tracking-wider block w-fit">
                By Date
                <div className="absolute h-full w-full border-b-[2.5px] border-blue-400 -bottom-[2.3px] left-0"></div>
              </Link>
            </div>
            {/* Button Tab */}
            <div className="">
              

            </div>
          </div>        

          {/* ---------- SEARCH BAR ------------- */}
          <div className="bg-blue-400 relative overflow-auto px-5 py-5 flex items-center justify-between gap-2">
            <CircleDecoration className="h-32 w-32 bg-cover absolute -top-20 -left-14" variant="white"/>

          </div>


      </LayerMain>
    </>
  );
}
