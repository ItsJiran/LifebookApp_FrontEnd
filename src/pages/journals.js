import React, { useState } from "react";
import { useLocation, Route, Routes, useMatches, Link } from "react-router-dom";

import { AnimatePresence } from "framer-motion";
import { Iconsax } from "../utils";
import { fetchApi } from "../hooks_utils/ApiUtils";

import { CircleDecoration, Icon } from "../components/Components";
import { LayerMain } from "../components/Layers";

import { useNotifierController } from "../hooks_utils/NotifierUtils";
import { useAuthController } from "../hooks_utils/AuthUtils";
import { useAppService } from "../hooks_utils/AppUtils";

export default function JournalsPage() {
  // ========================================================================================================
  // ---------------------------------------- STATE AND VARIABLES -------------------------------------------
  // ========================================================================================================
  const location = useLocation();

  const AppService = useAppService()
  const NotifierController = useNotifierController();
  const AuthController = useAuthController();

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

        </div>
      </div>

      {/* ================ CONTENT ================= */}
      <LayerMain id='MAIN_CONTENT' className="px-3 py-2 overflow-auto h-full">

      </LayerMain>
    </>
  );
}
