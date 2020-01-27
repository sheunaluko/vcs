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


exports.old_clients = [ ] //array of disconnect clients 
exports.clients = [ ]  //array of all (current) clients 
exports.last_active_client  = null //keep track of last active 

// see below for how broadcast is handled 

exports.start = function() { 
    
    var port  = params.text_port 
    const wss = new WebSocket.Server({ port: port });
    
    wss.on('connection', function connection(ws) {

	exports.clients.push( ws ) 
	
	log.i(`Received ws connection (Number now connected = ${exports.clients.length})`)	
	
	output.emit_to_clients = exports.emit_to_clients
	tts.emit_to_clients    = exports.emit_to_clients
	
	//send the client the current params 
	ws.send(JSON.stringify( { type : "params" , 
				  data : params } ) ) 
	
	//send ackowledgement of load 
	ws.send(JSON.stringify( { type : "output" , 
				  text : params.feedback_indicator + "continue" } ) ) 
	
	
	ws.on('message', function incoming(message_string) {
	    
	    exports.last_active_client = ws //set last active client 
	    
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
	
	ws.on('close' , function () { 
	    //remove ws from clients object  
	    exports.clients = exports.clients.filter( c => c != ws )
	    //add to old clients 
	    exports.old_clients.push(ws) 
	    //notify 
	    log.i(`A ws text client disconnected. There are ${exports.clients.length} remaining`) 
	})
	
    })

    log.i("Websocket server waiting for connection on port: " + port ) 

 
}


// we define the broadcast rules here 
let broadcast_mode = null 

exports.broadcast = function(msg) { 
    // will send message to all clients 
    log.i(`Broadcasting message to ${exports.clients.length} client(s)`) 
    exports.clients.map( c=> c.send(JSON.stringify(msg)) ) 
}

exports.send_to_last_active = function(msg) {
    log.i("Broadcasting message to last active client") 
    exports.last_active_client.send(JSON.stringify(msg)) 
}

//main emission function which implements broadcast rule selection 
exports.emit_to_clients = function(msg) { 
    switch (broadcast_mode) { 
    case 'full_broadcast' : 
	exports.broadcast(msg) 
	break 
    default : 
	
	
	//let last_active = (msg.type == 'output') 
	let last_active = true   
	
	if (last_active) { 
	    exports.send_to_last_active(msg) 
	} else { 
	    exports.broadcast(msg) 
	}
    }
}
