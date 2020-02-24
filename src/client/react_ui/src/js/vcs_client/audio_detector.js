import * as mic from "./mic.js" 
import * as util from "./utils.js" 
import * as tts from "./tts.js"
import {publish} from "../vcs_hub.js" //used for global comms 

// params 
let event_thresh = 5 //this is a RATIO of current/last buffer RMS  

// -  
export function start(cb) { 
    var last_rms = 0.001 
    let f = function(buf) { 
		let rms = util.rms(buf) 
		if ( last_rms != 0 && ( rms  / last_rms ) > event_thresh && !tts.is_speaking() ) { 
			cb() 
		}
		last_rms = rms 

		//so the above will handle triggering the audio detection 
		//callback (which is recognition.start) 

		//however, in addition to this I want to get a handle 
		//to the RMS value so I can render it in the UI 

		publish({ id : "audio.rms"  , data : rms}) 
	} 
	mic.connect(f) 
	
}


export function stop() { 
	//have to do a simple thing -- 
	mic.disconnect() 
	publish({ id : "audio.rms"  , data : 0}) 

}

