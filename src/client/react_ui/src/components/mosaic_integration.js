import React, {useState} from "react";
import {useSelector,useDispatch} from "react-redux" ; 
import { Mosaic, MosaicWindow } from "react-mosaic-component";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import { Classes, HTMLSelect } from '@blueprintjs/core';


import "./mosaic.css";

import { WidgetSelector } from "./WidgetSelector.js";
import {MosaicWindowWrapper} from "./MosaicWindowWrapper.js"

/* 
export var ELEMENT_MAP = {
  a: <div>Left Window</div>,
  b: <div>Top Right Window</div>,
  c: <div>Bottom Right Window</div>,
  new: <WidgetSelector />
};

export var TITLE_MAP = {
  a: "Left Window",
  b: "Top Right Window",
  c: "Bottom Right Window",
  new: "New Window"
}; 



export var get_dispatch = function(id,title) {
  
    //create element 
  var element =  <WidgetSelector />;

    //dispatch widget info to  redux store 
  var payload = { 
      id, 
      element, 
      title, 
  }

  return {type: "ADD_WIDGET", payload } 
};



*/ 

const specs = {
  "a" : {
    direction: "row",
    first: "command_stack",
    second: {
  direction : "column", 
      first: "iframe",
      second: "ss_inspector" 
    }
  }, 
  "b" : {
    direction: "row",
    first: "command_stack",
    second: "ss_inspector" , 

  } , 
  "c" : {
    direction: "row",
    first: "map_gl",
    second: "ss_inspector" , 

  } , 
  "d" : {
    first : "map_gl"

  } , 
  
}

function Windows() {

  return (

    <div id="mosaic">
      <Mosaic
        //className="mosaic-blueprint-theme bp3-dark"
        renderTile={function(id, path) {
            return <MosaicWindowWrapper id={id} path={path} /> 
        }}
        initialValue={specs.d}
      />
    </div>
  );
}


//export default MyMosaic;
export default Windows;
