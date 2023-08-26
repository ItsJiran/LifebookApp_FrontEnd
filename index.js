
import React from 'react'
import  { createRoot }  from 'react-dom/client';
import App from './src/app.js'

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App/>);

if(module.hot){
  module.hot.accept('./src/app.js',()=>{
    root.render(<App/>);
  });
} 

