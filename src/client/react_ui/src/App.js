import React from "react";
import Home from "./components/Home.js";
import CmdsContainer from "./components/CmdsContainer.js";
import ChatBox from "./components/ChatBox.js";
import Mosaic from "./components/mosaic_integration.js";

import {AppToaster} from "./components/Toaster.js" 
import {NavBar} from "./components/NavBar" 


import "./App.css" ; 

import {provide} from  "./js/vcs_hub"

import * as mosaic from "./components/mosaic_integration.js" 

if (! window.vcs ) { 
  window.vcs = {mosaic} 
} else { 
  Object.assign(window.vcs, {mosaic} ) 
}


/* 
SET UP SOME GLOBAL STATE 
*/
 

class App extends React.PureComponent {

  render() {

    //will export the TOAST functionality 
    provide({id  : "ui.toast" , func : (function(args){

      this.showToast(args) 

    }).bind(this) })

    return (
      <div className="App"> 
        <NavBar/> 
        <Mosaic/>                 
      </div>
    );
  }

  showToast = ({message}) => {
      AppToaster.show({ message });
  }

}


function oldCore() {
  return (
    <div>
      <CmdsContainer />
      <ChatBox />
    </div>
  );
}

export default App;
