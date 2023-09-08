import React from "react";
import { useLocation, Route, Routes, useMatches } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

export default function IndexPage() {
  const location = useLocation();

  return (
    <>
      <Routes>
        <Route path="journals" element={<h1>journals</h1>} />
        <Route path="me" element={<h1>'esa'</h1>} />
      </Routes>
    </>
  );
}
