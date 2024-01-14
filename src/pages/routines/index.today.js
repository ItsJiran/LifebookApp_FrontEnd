import React, { useState } from "react";
import { useLocation, Route, Routes, useMatches, Link, useNavigate } from "react-router-dom";

import { AnimatePresence } from "framer-motion";
import { FilePath, Iconsax } from "../../utils";

import { CircleDecoration, Icon } from "../../components/Components";
import { LayerMain } from "../../components/Layers";

import { useNotifierController } from "../../hooks_utils/NotifierUtils";
import { useAuthController } from "../../hooks_utils/AuthUtils";
import { useAppService } from "../../hooks_utils/AppUtils";

import { useApiService } from "../../hooks_utils/ApiUtils";

export default function RoutinesPage() {
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

  const [pageState, setPageState] = useState({
    loading:false,
    error:{
      status:false,
      data:undefined,
    },
    data:[],
  });

  // ========================================================================================================
  // ------------------------------------------- REACT EFFECT -----------------------------------------------
  // ========================================================================================================
  React.useEffect(()=>{

  },[]);

  // ========================================================================================================
  // -------------------------------------------- FUNCTIONS -------------------------------------------------
  // ========================================================================================================


  return (
    <>
      {/* ================== HEADER ==================== */}
      <div className="h-[40px] w-full px-2 py-2 box-border flex mt-2 justify-between">
        <div className="h-fit w-fit">
          
        </div>
        
        <div className="h-fit w-fit flex gap-2 items-center">
          <Icon className="filter-blue-400 h-5 w-5" iconUrl={Iconsax.bold['calendar-tick']}/>
          <h1 className="text-blue-400 text-lg font-semibold tracking-wide">Routines</h1>
        </div>
        
        <div className="h-fit w-fit">
          <Icon onClick={async ()=>{navigate('/journals/add',{replace:true})}} className="h-6 w-6 filter-blue-400 hover:filter-blue-dark-300" iconUrl={Iconsax.bold['add-circle.svg']}/>
        </div>
      </div>

      {/* ================ CONTENT ================= */}
      <LayerMain id='MAIN_CONTENT' className="py-2 overflow-y-auto h-full overflow-x-hidden">

          <div id='MATERIALS_JOURNAL_HEADER' className="mx-3 h-fit flex justify-between mb-4 relative border-b-[2px] border-blue-light-100 items-center">
            {/* ------------ Table Tab ------------- */}
            <div className="flex relative gap-2">          
              <Link to={'/routines'} replace className="relative text-sm pb-2 font-semibold text-center px-1 text-blue-dark-200 tracking-wider block w-fit">
                Overview              
              </Link>

              <Link to={'/routines/today'} replace className="relative text-sm pb-2 font-semibold text-center px-1 text-blue-dark-400 tracking-wider block w-fit">
                Today
                <div className="absolute h-full w-full border-b-[2.5px] border-blue-400 -bottom-[2.3px] left-0"></div>
              </Link>
            </div>
          </div>

      </LayerMain>
    </>
  );
}
