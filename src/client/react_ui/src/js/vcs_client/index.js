import * as speech from "./speech.js" 
import * as tts from "./tts.js" 


/* 
 Note the sound library is externally compiled by cljs_compile
 (https://github.com/sheunaluko/cljs_compile) 
 */


speech.connect_ws() 

function init_speech() { 

    speech.start_recognition() 
    speech.start_audio_trigger() 
}

function send_text(t) {
    speech.trigger_text(t) 
}



window.vcs = {speech,tts, init_speech ,  send_text}
