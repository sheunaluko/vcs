
//DEFINES THE WIDGETS THAT CAN BE SELECTED  
import React from "react";
import { Classes, Icon, Intent, ITreeNode, Position, Tooltip, Tree } from "@blueprintjs/core";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import {widget_dictionary}  from "./WidgetDictionary.js"



var widgets_info = { 

    "commands" :  { 
        tooltip : "Interfaces for Command Inspection" , 
        text     : "Command Visualization" , 
        children : [ 
            {id : "command_stack" } ,
        ]
    }  , 
    "user_interaction" : {
        tooltip : "Various tools for user interaction" , 
        text : "User Interaction" , 
        children : [ 
           {id : "terminal" } 
        ]
    },
    "debugging" : { 
        tooltip : "Tools for debugging" , 
        text : "Debugger UI Tools"  , 
        children :[ 
            {id :"inspector" } , 
            {id : "log"}
        ]

    }

}

var curr_id = 0 
function gen_id(){ 
    return "id_" + (curr_id ++ ) 
}

function build_widgets(widgets_info) { 
    var folder_keys = Object.keys(widgets_info) 
    var to_return = [] 

    folder_keys.map(function(k) {

        var info = widgets_info[k] 
        var obj = { 
            id : gen_id()  , 
            hasCaret : true, 
            isExpanded : true, 
            icon : "folder-close" , 
            label : (
                <Tooltip content={info.tooltip} position={Position.RIGHT}>
                    {info.text} 
                </Tooltip>
            ), 
            childNodes : info.children.map( function(c) { 
                return { 
                    id : gen_id() , 
                    icon : "cube-add" , 
                    label : widget_dictionary[c.id].title , 
                    widget_id : c.id , 
                }
            }
                
            ) , 
        }

        to_return.push(obj) 
        
    })

    return to_return 
}

export var WIDGETS = build_widgets(widgets_info) 




/* 
FOR REFERENCE:  (from documentation)
*/


/* tslint:disable:object-literal-sort-keys so childNodes can come last */
const INITIAL_STATE  = [
    {
        id: 0,
        hasCaret: true,
        icon: "folder-close",
        label: "Folder 0",
    },
    {
        id: 1,
        icon: "folder-close",
        isExpanded: true,
        label: (
            <Tooltip content="I'm a folder <3" position={Position.RIGHT}>
                Folder 1
            </Tooltip>
        ),
        childNodes: [
            {
                id: 2,
                icon: "document",
                label: "Item 0",
                secondaryLabel: (
                    <Tooltip content="An eye!">
                        <Icon icon="eye-open" />
                    </Tooltip>
                ),
            },
            {
                id: 3,
                icon: <Icon icon="tag" intent={Intent.PRIMARY} className={Classes.TREE_NODE_ICON} />,
                label: "Organic meditation gluten-free, sriracha VHS drinking vinegar beard man.",
            },
            {
                id: 4,
                hasCaret: true,
                icon: "folder-close",
                label: (
                    <Tooltip content="foo" position={Position.RIGHT}>
                        Folder 2
                    </Tooltip>
                ),
                childNodes: [
                    { id: 5, label: "No-Icon Item" },
                    { id: 6, icon: "tag", label: "Item 1" },
                    {
                        id: 7,
                        hasCaret: true,
                        icon: "folder-close",
                        label: "Folder 3",
                        childNodes: [
                            { id: 8, icon: "document", label: "Item 0" },
                            { id: 9, icon: "tag", label: "Item 1" },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        hasCaret: true,
        icon: "folder-close",
        label: "Super secret files",
        disabled: true,
    },
];