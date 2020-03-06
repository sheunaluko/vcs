
import React, {useState}  from 'react' 

import * as util from "../js/vcs_client/utils.js" 
import * as socksync from "../js/socksync_web_client.js" 
import { ObjectInspector  } from "react-inspector"; 


var log = util.get_logger("ss_insp") 


function make_client(ops) {  

    let {port,host,subscribe_i,on_update} = ops 
    
    var client = new socksync.Client(ops) 

} 

/* 
 TO DO -- have blueprint form 
 then evalaute it and connect to the thing ... 
 then render an inspector element 
*/ 


function ConfigurationUI() {
    return    <h1>Choose something! </h1>
}

function InspectionUI() { 
    return  <h1>You chose </h1>
    
}

export function SSInspector() { 



    var [state, update_state]  = useState({}) 
    var [configuring, update_configuring]  = useState(true) 

   
    if (configuring ) { 
        return <ConfigurationUI/>
    } else { 
        return <InspectionUI/> 
    }
    
        


}