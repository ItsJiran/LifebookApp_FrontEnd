import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import hot_component from "./hot_component.js";

import App from './src/app.js';
import './src/style.css';

const container = document.getElementById('root');
const dom = ReactDOM.createRoot(container);

function InitializeRender(){
  dom.render(
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  );  
}

InitializeRender();

if(module.hot){
  for( let component_url of hot_component ){
    module.hot.accept(component_url,()=>{InitializeRender()});
  }
  module.hot.accept('./src/app.js',()=>{
    InitializeRender();
  });
  module.hot.accept('./src/utils.js',()=>{
    InitializeRender();
  });
  module.hot.accept('./src/style.css',()=>{
    InitializeRender();
  });
} 

