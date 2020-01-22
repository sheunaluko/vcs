import * as mic from "./mic.js" 
import * as util from "./utils.js" 
import * as tts from "./tts.js"

// params 
let event_thresh = 5 //signal must double 

// -  
export function start(cb) { 
    var last_rms = 0.001 
    let f = function(buf) { 
	let rms = util.rms(buf) 
	if ( last_rms != 0 && ( rms  / last_rms ) > event_thresh && !tts.is_speaking() ) { 
	    cb() 
	}
	last_rms = rms 
    }
    mic.connect(f) 
}


