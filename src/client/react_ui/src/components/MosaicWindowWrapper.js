import React, {useState} from "react";
import {useSelector,useDispatch} from "react-redux" ; 
import { Mosaic, MosaicWindow } from "react-mosaic-component";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import "./mosaic.css";

import { WidgetSelector } from "./WidgetSelector.js"; 
import {widget_dictionary} from "./WidgetDictionary.js"  ; 

function get_new_node_id() { 
    var id = "mosaic_node_" + new Date().getTime();
    console.log(id)
    return id
}

/* 
 This architecture was interesting to figure out :)  
 The key was to wrap the MosiacWindows so they each subscribe to 
 Their own own, and to have a default case when the ID is not 
 defined (which enables create new nodes without pre updating the store) 

 Also, another solution was to move the selector from the root of 
 the mosaic window component into the leaves so that the whole thing 
 is not re-rendered whenever ELEMENT_MAP or TITLE_MAP change 
*/ 

export function MosaicWindowWrapper(props) { 

    var element = useSelector(state=>state.ELEMENT_MAP[props.id]) 
    var title = useSelector(state=>state.TITLE_MAP[props.id])     


    if (! element) { 

        //case 1 : it is in widget_dictionary 
        if (widget_dictionary[props.id] ) { 
          element = widget_dictionary[props.id].element
          title   = widget_dictionary[props.id].title 
          
        } else { 

          //case 2: default case  
          element = <WidgetSelector windowId={props.id} /> 
          title = "Select UI" 
        }

    }
                
    return ( 
  <MosaicWindow
    path={props.path}
    createNode={get_new_node_id}
    title={title}
  >
    {element}
  </MosaicWindow> 
    )

}