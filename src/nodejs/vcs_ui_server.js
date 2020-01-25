//Sat Jun 29 12:27:02 PDT 2019
//web socket ui server for vcs

const WebSocket   = require('ws');
var   params      = require("./vcs_params.js").params
var   utils       = require("@sheunaluko/node_utils") 
const log         = require("./logger.js").get_logger("vcs_ui_server")


var port  = params.ui_port 

exports.start = function() { 
    
    if (! params.ui_server_enabled) { 
	log.i("ui server  disabled, will not launch") 
	return 
    }
	
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
	log.i("No UI connected (won't init)")
	return 
    }  
    
    // if here then we are connected, so will send a message to the ui client 
    let type = "command_initialization" 
    exports.client.send(JSON.stringify({type,id}))
    log.i("Notified UI of command launch: " + id ) 

}




exports.command_finished = function(id) { 

    if (exports.client == null) { 
	log.i("No UI connected (won't send finish)")
	return 
    }  
    
    // if here then we are connected, so will send a message to the ui client 
    let type = "command_finish" 
    exports.client.send(JSON.stringify({type,id}))
    log.i("Notified UI of command finish: " + id ) 
}
