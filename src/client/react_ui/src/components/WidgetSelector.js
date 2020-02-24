import React from "react";

import { Classes, Icon, Intent, ITreeNode, Position, Tooltip, Tree } from "@blueprintjs/core";


import {WIDGETS} from "./WidgetSelectorManifest.js"
import {widget_dictionary} from "./WidgetDictionary.js"  

export class WidgetSelector extends React.Component {
     
     state  = { nodes: WIDGETS };

     render() {
        return (
                <Tree
                    contents={this.state.nodes}
                    onNodeClick={this.handleNodeClick}
                    onNodeCollapse={this.handleNodeCollapse}
                    onNodeExpand={this.handleNodeExpand}
                    className={Classes.ELEVATION_2}
                />
        );
    }

    handleNodeClick = (nodeData, _nodePath , e ) => {
        const originallySelected = nodeData.isSelected;
        if (!e.shiftKey) {
            this.forEachNode(this.state.nodes, n => (n.isSelected = false));
        }
        nodeData.isSelected = originallySelected == null ? true : !originallySelected;
        this.setState(this.state); 

        let windowId = this.props.windowId 

        console.log("GOT CLICK from window id: " + windowId ) 
        var {widget_id, label } = nodeData ; //this gets the id of the element to render  

        var widget = widget_dictionary[widget_id].element //gets the actual element 
        var widget_title = widget_dictionary[widget_id].title 
        //need to actually look up the 
        console.log(nodeData)
        window.vcs.store.dispatch({type:"ADD_WIDGET" , payload : {
            id : windowId,  
            title : widget_title , // label ,  (modified - bug check ? )
            element  : widget , 
         }})
        
         /* 
            OK cool, so the window should update now. 
            Notice that the window gets originally created it has a random unique windowID 
            which it generates. The initial subscription will yield null so it by default renders 
            the WidgetSelector (and passed the windowID prop to the widgetSelector) 

            When a selection is made this prop is accessed and the above dispatch will fill 
            the appropiate information in the store so that the window will re render 
            (assuming that everything works as intended of course ;)  
         */
    };

    handleNodeCollapse = (nodeData ) => {
        nodeData.isExpanded = false;
        this.setState(this.state);
    };

    handleNodeExpand = (nodeData ) => {
        nodeData.isExpanded = true;
        this.setState(this.state);
    };

    forEachNode(nodes , callback ) {
        if (nodes == null) {
            return;
        }

        for (const node of nodes) {
            callback(node);
            this.forEachNode(node.childNodes, callback);
        }
    }
}
