import * as speech from "./speech.js" 
import * as tts from "./tts.js" 
import {sounds} from "./sounds.js" 


speech.connect_ws() 

function init_speech() { 

    speech.start_recognition() 
    speech.start_audio_trigger() 
}

function send_text(t) {
    speech.trigger_text(t) 
}



window.vcs = {speech,tts, sounds, init_speech ,  send_text}
