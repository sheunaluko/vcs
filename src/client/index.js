import * as speech from "./speech.js" 
import * as tts from "./tts.js" 



speech.connect_ws() 
speech.start_recognition() 
speech.start_audio_trigger() 



window.vcs = {speech,tts} 
