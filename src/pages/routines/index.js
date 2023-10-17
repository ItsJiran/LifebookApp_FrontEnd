import React, { useState } from "react";
import { useLocation, Route, Routes, useMatches, Link } from "react-router-dom";

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

        </div>
      </div>

      {/* ================ CONTENT ================= */}
      <LayerMain id='MAIN_CONTENT' className="py-2 overflow-y-auto h-full overflow-x-hidden">

            <div className='h-full w-full flex flex-col justify-center items-center text-1sm text-blue-dark-300 tracking-wide gap-2'>
                <Icon iconUrl={ FilePath.assets + 'svg/construction.svg' } className="w-[300px] h-[200px]"/>
                <h2 className="text-[16px] font-bold mt-4 leading-3">Sedang Dibuat</h2>
                <p className="mb-2 text-center mx-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
            </div>

      </LayerMain>
    </>
  );
}
