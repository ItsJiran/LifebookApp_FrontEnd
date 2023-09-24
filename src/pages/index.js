import React from "react";
import { useLocation, Route, Routes, useMatches, Link } from "react-router-dom";

import { AnimatePresence } from "framer-motion";
import { Iconsax } from "../utils";

import { Icon } from "../components/Components";
import { LayerMain } from "../components/Layers";

export default function IndexPage() {
  const location = useLocation();

  return (
    <>
      {/* ================== HEADER ==================== */}
      <div className="h-[40px] w-full px-2 py-2 box-border flex mt-2 justify-between">
        <div>
          
        </div>
        
        <div className="h-fit w-fit flex gap-2 items-center">
          <Icon className="filter-blue-400 h-5 w-5" iconUrl={Iconsax.bold['home']}/>
          <h1 className="text-blue-400 text-lg font-semibold tracking-wide">Home</h1>
        </div>
        
        <div>

        </div>
      </div>

      {/* ================ CONTENT ================= */}
      <LayerMain id='MAIN-CONTENT' className="px-2 py-2 overflow-auto">
        
      </LayerMain>
    </>
  );
}
