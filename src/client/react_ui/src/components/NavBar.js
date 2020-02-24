
import * as React from "react";

import {
    Alignment,
    Button,
    Classes,
    H5,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Switch,
    ProgressBar, 

} from "@blueprintjs/core"; 

import {AudioProgress} from "./AudioProgress"
import {call} from "../js/vcs_hub" 

var icons = [ "power" , "headset" , "vertical-bar-chart-asc" ] 

export function NavBar() { 

    var audio_on = false  
    let toggle_audio = function() { 
        var id = null  
        var ui_msg = null 
        if (audio_on) { 
            id = "speech.stop"
            ui_msg = "Stopped Listening"
        } else { 
            id = "speech.init"
            ui_msg = "Started Listening"            
        }

        call({id, args : null}) 
        call({id : "ui.toast" , args : {message : ui_msg }})

        //dont forget to toggle ! 
        audio_on = !audio_on                
    }

return (
    <Navbar className={Classes.DARK}>
                    <NavbarGroup align={Alignment.LEFT} >  
                        <NavbarHeading>VCS</NavbarHeading>
                        <NavbarDivider />
                        <Button
                         className={Classes.MINIMAL} 
                         onClick={function() { 
                            toggle_audio() 
                         }}
                         icon={icons[1]} 
                         text=" " />
                        
                    </NavbarGroup>

                    <NavbarGroup align={Alignment.CENTER}  > 
                    <AudioProgress/>
                    </NavbarGroup>

                    

                </Navbar>
);
} 

