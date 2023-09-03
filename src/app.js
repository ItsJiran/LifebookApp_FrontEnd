import React from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import IndexPage from './pages/index';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';

function App(){
  const location = useLocation();
  const [isFirstMount, setIsFirstMount] = React.useState(true);

  return (
      <div className='max-w-lg mx-auto h-screen overflow-y-auto overflow-x-hidden'>
          <AnimatePresence mode="wait" initial='false'>
              <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<IndexPage/>} />
                  <Route path="login" element={<LoginPage/>} /> 
                  <Route path="register" element={<RegisterPage/>} />
              </Routes>
          </AnimatePresence>
      </div>
  );
}

export default App;