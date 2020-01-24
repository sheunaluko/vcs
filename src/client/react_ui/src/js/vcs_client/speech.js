import * as ad from "./audio_detector.js" 
import {get_logger} from "./utils.js" 
import * as tts from "./tts.js" 
import {sounds} from "./sounds.js" 


let log = get_logger("speech") 

/* params  */ 
let ws_port = 9001
export var send_text = null 
var shutting_down = false 

export var vcs_params = {} // should get set by vcs server 
let feedback_indicator = "::@" 

// MOVE INTO HANDLER FILE ------------------------------ 

//feedback handler 
function handle_feedback(text) { 
    switch (text) {
    case 'success' :
	sounds.success() 
	break 
    case 'continue' : 
	sounds.continue() 
	break 
    case 'unrecognized' : 
	sounds.unrecognized() 
	break 
    case 'error' : 
	sounds.error() 
	break
    case 'ready-for-input' :
	sounds['ready-for-input']()
	break
    case 'shutdown' : 
	window.location = "https://github.com/sheunaluko/vcs" 
    default : 
	log.i("Unrecognized feedback text") 
    }
}

// message output handler 
function handle_text(text) { 
    log.i("handling text: " + text) 
    // check the first part
    if (text.slice(0,3) == feedback_indicator) { 
	log.i("Got feedback:") 
	handle_feedback(text.slice(3))
    } else { 
	log.i("Got regular message") 
	tts.speak(text)
    }
}

// ----------------------------------------	

/* create websocket for relaying speech info */
export function connect_ws() { 

    log.i("Connecting ws on port number: " + ws_port) 
    var ws = new WebSocket("ws://localhost:"+ws_port) 
    ws.addEventListener('open' , ()=> log.i("WS connection opened") ) 
    ws.onclose = function () { 
	log.i("Websocket disconnected! attempting reconnect")
	setTimeout(connect_ws , 500) 
    }
    

    

    ws.addEventListener('message', (m)=> {
	let msg = JSON.parse(m.data) 
	log.d("Got ws msg:") ;
	log.d(msg)
	switch ( msg.type) { 
	case  'output' : 
	    handle_text(msg.text)

	    break 
	case 'unrecognized_input' : 
	    //tts.speak("what")
	    sounds.unrecognized() 
	    break 
	    
	case 'params' : 
	    log.i("Received params") 
	    vcs_params = msg.data 
	    log.i("Params updated") 
	    break
	    
	case 'command_result'   : 
	    log.d("Got command result:")
	    console.log(msg.result) 
	    
	    //check the result  
	    if (msg.result == vcs_params.escape_indicator + "quiet") { 
		log.i("Command suppressed output") 
	    } else { 
		sounds.success() 
	    } 
	    break
	    
	default : 
	    tts.speak("Received unrecognized message type " + msg.type + " from vcs server")
	} 
    }) 
    send_text = function (text) { 
	let type = 'vcs_text' 
	ws.send(JSON.stringify({ type, text }) ) 
    } 
}
    
/* Create recognition object */ 
var recognition = new window.webkitSpeechRecognition();
recognition.continuous = true
recognition.interimResults = false
recognition.onstart = function() {
    log.i("Recognition starting") 
}
    
recognition.onsoundstart = function() {
    //log.d("Sound started.")
}

recognition.onresult = function(event) { 
    log.d(event) 
    let text = event.results[event.resultIndex][0].transcript
    log.d("Got recognition result: " + text)     
    send_text(text) 
}
recognition.onerror = function(event) { 
    log.d("Recognition error:")
    log.d(event) 
}
recognition.onend = function() {  
    log.i("Recognition ended")
    is_started = false 
} 

var is_started = false 
export function start_recognition() {
    if (!is_started) {
	log.d("Starting recognition.") 
	recognition.start() 
	is_started = true 
    } 
}

export function stop_recognition() { 
    recognition.abort()    
    is_started = false 
}


export function trigger_text(t) {
    send_text(t) 
}

/* interface to tts */ 
async function speak(text) { 
    
}


/* trigger recognition when audio is detected */ 
export function start_audio_trigger() { 
    ad.start(start_recognition) 
}



