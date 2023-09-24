import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import Main from "./src/Main.js";
import './src/style.css';

const container = document.getElementById('root');
const dom = ReactDOM.createRoot(container);

function InitializeRender(){
  dom.render(
      <Main/>
  );  
}

InitializeRender();
