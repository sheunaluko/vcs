import * as speech from "./speech2.js" 
import * as tts from "./tts.js" 
import {provide} from "../vcs_hub"
import * as mic from "./mic"
import * as util from "./utils.js" 



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


if (! window.vcs ) { 
    window.vcs = {speech,tts, init_speech ,  send_text, mic, util} 
} else { 
    Object.assign(window.vcs, {speech,tts, init_speech ,  send_text, mic, util}  )
}
