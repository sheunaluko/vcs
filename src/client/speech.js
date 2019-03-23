import * as ad from "./audio_detector.js" 
import {get_logger} from "./utils.js" 
import * as tts from "./tts.js" 

let log = get_logger("speech") 

/* params  */ 
let ws_port = 9001
var send_text = null 

/* create websocket for relaying speech info */
export function connect_ws() { 
    log.i("Connecting ws on port: " + ws_port) 
    var ws = new WebSocket("ws://localhost:"+ws_port) 
    ws.addEventListener('open' , ()=> log.i("WS connection opened") ) 
    ws.addEventListener('message', (m)=> {
	let msg = JSON.parse(m.data) 
	log.d("Got ws msg:") ;
	log.d(msg)
	if (msg.type == 'speak' ) { 
	    tts.speak(msg.text) 
	}
    }) 
    send_text = function (text) { 
	let type = 'vcs_text' 
	ws.send(JSON.stringify({ type, text }) ) 
    } 
}
    


/* Create recognition object */ 
var recognition = new webkitSpeechRecognition();
recognition.continuous = true
recognition.interimResults = false
recognition.onstart = function() {
    log.i("Recognition starting") 
}
    
recognition.onsoundstart = function() {
    //log.d("Sound started.")
}

recognition.onresult = function(event) { 
    log.d("Got recognition result") 
    log.d(event) 
    let text = event.results[event.resultIndex][0].transcript
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

/* interface to tts */ 
async function speak(text) { 
    
}


/* trigger recognition when audio is detected */ 
export function start_audio_trigger() { 
    ad.start(start_recognition) 
}



