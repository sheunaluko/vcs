import React from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";


/* 
    Here we import the UIS , or define them too :) 
*/ 


import CmdsContainer from "./CmdsContainer.js" 
import {Inspector} from "./Inspector.js" 
import {TerminalWidget}  from "./TerminalWidget2.js"
import {Globe} from "./Globe.js" 
import { SSInspector } from "./SocksyncInspector.js";
import {Iframe } from "./IframeWidget" 
import {MapGl} from "./MapGl"
import {GlobeGl} from "./GlobeGl"

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

    "terminal" : { 
        element : <TerminalWidget /> , 
        title: "Console Interface" 
    } , 
    
    "globe" : { 
	element : <Globe /> , 
	title: "Earth" , 
    } , 

    "ss_inspector":{  
        element : <SSInspector/> , 
        title : "Socksync Inspector" 
    } ,   

    "iframe" : { 
        element : <Iframe/> , 
        title : "Iframe" 
    } , 

    "map_gl" : { 
        element : <MapGl/> , 
        title :"MapGl" 
    }, 

    "globe.gl" : { 
        element : <GlobeGl/>, 
        title : "GlobeGl"
    }



    



}


