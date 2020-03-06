import React, {useState}  from 'react' 
import IFrame  from 'react-iframe' 


import * as util from "../js/vcs_client/utils.js" 

export function Iframe() { 

    return ( 
        <IFrame //url="http://localhost:5050?target=http://coindesk.com"
            url="http://google.com" 
        width="100%"
        height="100%"
        display="initial"
        position="relative"/>
   )
        
}