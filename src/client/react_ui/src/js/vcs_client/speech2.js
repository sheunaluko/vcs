/*
 modifying to use the bundled text client 
 Sat Feb 29 11:41:33 PST 2020
*/

import * as ad from "./audio_detector.js" 
import {get_logger} from "./utils.js" 
import * as tts from "./tts.js" 

//grab the text client module from compiled typescript folder 
import * as vcs_tc from "../../ts/dist/vcs_text_client"  

var sounds = window.sounds.core.sounds  //cljs compiled and added to page 

var log = get_logger("speech") 

/* params && vars */ 
let port = 9001 
let host = "localhost"  
export var tc   = null  //handle to text client object 

export function connect_ws() { 
    log.i("Connecting ws..")
    tc =  new vcs_tc.VCS_TEXT_CLIENT({port,host,on_msg,id:"spch"})  //see below 
    tc.connect()  
} 

export function close_ws() { 
    log.i("Closing ws") 
    if (tc) { tc.close() } 
}

export var send_text = function(text) { 
    if (tc) {tc.send({text,type:"vcs_text"})}  else { 
        throw(Error("Not connected")) 
     }  
}

export var vcs_params = {} // will get set by a  ws message 



/* 
IMPLEMENTATION DETAILS BELOW --> 
*/ 

//feedback handler 
function handle_feedback({payload}) { 
    switch (payload) {
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
    break 
    default : 
	log.i("Unrecognized feedback text") 
    }
}

// message output handler 
function handle_text({payload}) { 
    log.i("handling text: " + payload) 
	tts.speak(payload) 
}

//define message handler   
let response_dict = { 
    "text"  : handle_text , 
    "feedback" :  handle_feedback , 
    "unrecognized_input" : ()=>sounds.unrecognized()  , 
    "params" : function(params) { 
        log.i("Received params") 
        vcs_params = params
        log.i("Params updated") 
    } , 
    "command_result" : function({payload,id}) { 
        log.d("Got command result:")
        log.d(payload) 
        //check the result  
        if(payload.quiet) { 
            log.i("Command suppressed output") 
        } else { 
        sounds.success()                 
        }
    } , 
}

function on_msg(msg) {   
    // msg = { type : string , data : string | number | bool | obj }  
	log.d("Got ws msg:") ;
    log.d(msg) 

    let handler = response_dict[msg.type]  
    if (! handler ) { 
        tts.speak("Received unrecognized message type " + msg.type + " from vcs server")
    } else { 
        handler(msg)       
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



/* trigger recognition when audio is detected */ 
export function start_audio_trigger() { 
	ad.start(start_recognition) 
	
	//when audio is detected then recognition is started  
}

export function stop_audio_trigger() { 
	ad.stop() 
}



