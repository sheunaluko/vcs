import * as speech from "./speech2.js" 
import * as tts from "./tts.js" 
import {provide} from "../vcs_hub"
import * as mic from "./mic"
import * as util from "./utils.js" 

//import the hyperloop client 
import {Client} from "../../external/hyperloop_web_client.js" 



async function hyperloop_connect(port = 9011, host="localhost", id="sattsys.vcs_client") { 
    var hyperloop = new Client({port, host, id} )
    window.vcs.hyperloop = hyperloop 
    await hyperloop.connect()  

    window.vcs.hyperloop_call = async function(args,log=false) { 
        let result =  await window.vcs.hyperloop.call(args) 
        if (log) {console.log(result) }  
        window.vcs.hyperloop.last_result = result
        return result
    }
}






speech.connect_ws() 

function init_speech() { 
    speech.start_recognition() 
    speech.start_audio_trigger() 
}

function stop_speech() { 
    //speech.close_ws() 
    speech.stop_recognition() 
    speech.stop_audio_trigger() 
}

function send_text(t) {
    speech.trigger_text(t) 
}

//provide the init_speech function 
provide({id :"speech.init" , func : function(args) { 
    init_speech() 
}})  

provide({id :"speech.stop" , func : function(args) { 
    stop_speech() 
}})  



let exports = {speech,tts, init_speech ,  send_text, mic, util,hyperloop_connect}  

if (! window.vcs ) { 
    window.vcs = exports 
} else { 
    Object.assign(window.vcs,exports ) 
}
