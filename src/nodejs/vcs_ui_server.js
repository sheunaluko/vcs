//Sat Jun 29 12:27:02 PDT 2019
//web socket ui server for vcs

const WebSocket   = require('ws');
var   params      = require("./vcs_params.js").params
var   vcs         = require("./vcs.js") 
var   utils       = require("./node_utils.js") 
const log         = require("./logger.js").get_logger("vcs_ui_server")


var port  = params.ui_port 

exports.start = function() { 
    
	
    const wss = new WebSocket.Server({ port: port });
    exports.client = null 
    
    wss.on('connection', function connection(ws) {
	log.i("Received ws connection.")

	
	ws.on('message', function incoming(message_string) {
	    
	})
	
	exports.client = ws 	
	
    })

    log.i("Websocket ui server waiting for connection on port: " + port ) 
}



exports.command_launched = function(id) { 

    if (exports.client == null) { 
	log.i("No UI connected, will ignore command launch") 
	return 
    }  
    
    // if here then we are connected, so will send a message to the ui client 
    let type = "command_initialization" 
    exports.client.send(JSON.stringify({type,id}))
    log.i("Notified UI of command launch: " + id ) 

}

