//Sun Mar  3 10:54:37 PST 2019
//web socket server for vcs

const WebSocket   = require('ws');
var   vcs_core    = require("./vcs_core.js") 
var   tts         = require("./tts.js") 
var   output      = require("./main_output.js") 
const log         = require("./logger.js").get_logger("vcs_server")




exports.start = function() { 
    
    var port  = 9001
    const wss = new WebSocket.Server({ port: port });
    var client = null 
    
    wss.on('connection', function connection(ws) {
	log.i("Received ws connection.")
	exports.client = ws 
	output.ws = ws
	tts.ws    = ws
	
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


