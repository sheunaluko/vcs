/* 
  Sun Mar  3 10:54:37 PST 2019
  web socket server for vcs  
  
  This file is sort of an adapter -- it creates a websocet server 
  Upon a connection , it gives the connection to the OUTPUT file 
  and whenever it receives a message it forwards the message to vcs_core
  
 */ 

const WebSocket   = require('ws');
var   params      = require("./vcs_params.js").params
var   vcs_core    = require("./vcs_core.js") 
var   tts         = require("./tts.js") 
var   output      = require("./main_output.js") 
const log         = require("./logger.js").get_logger("vcs_text_server")



exports.start = function() { 
    
    var port  = params.text_port 
    const wss = new WebSocket.Server({ port: port });
    var client = null 
    
    wss.on('connection', function connection(ws) {
	log.i("Received ws connection.")
	exports.client = ws 
	output.ws = ws
	tts.ws    = ws
	
	//send the client the current params 
	ws.send(JSON.stringify( { type : "params" , 
				  data : params } ) ) 
	
	//send ackowledgement of load 
	ws.send(JSON.stringify( { type : "output" , 
				  text : params.feedback_indicator + "continue" } ) ) 
	
	
	ws.on('message', function incoming(message_string) {
	    message = JSON.parse(message_string) 
	    
	    switch(message.type) { 
		
	    case "vcs_text" : 
		let text = message.text 
		//will pass on the text 
		vcs_core.input.push(text) 
		log.d("Got text: " + text )
		break 
		
	    default : 
		log.d("Unrecognized message type:") 
		log.d(message) 
	    }
	})
    })

    log.i("Websocket server waiting for connection on port: " + port ) 

 
}


