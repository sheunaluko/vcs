import React from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";


/* 
    Here we import the UIS , or define them too :) 
*/ 
 
import CmdsContainer from "./CmdsContainer.js" 
import {Inspector} from "./Inspector.js" 


export var widget_dictionary = { 
    "command_stack" : {
        element :  <CmdsContainer /> ,   
        title  : "Command Stack" 
    } , 
    "inspector"   : { 
        element : <Inspector />   , 
        title : "Inspector"
    }, 
    "log" : { 
        element : <h1> Pending implementation</h1>  , 
        title: "Log Widget"
    }, 
    "display" : { 
        element : <h1> Pending implementation</h1>  , 
        title: "Display Widget"
    }, 


}
