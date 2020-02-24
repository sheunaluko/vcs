import * as speech from "./speech.js" 
import * as tts from "./tts.js" 
import {provide} from "../vcs_hub"
import * as mic from "./mic"

/* 
 Note the sound library is externally compiled by cljs_compile
 (https://github.com/sheunaluko/cljs_compile) 
 */


speech.connect_ws() 

function init_speech() { 

    speech.start_recognition() 
    speech.start_audio_trigger() 
}

function stop_speech() { 
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
    window.vcs = {speech,tts, init_speech ,  send_text, mic} 
} else { 
    Object.assign(window.vcs, {speech,tts, init_speech ,  send_text, mic}  )
}
