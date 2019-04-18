const log         = require("./logger.js").get_logger("csi")
const WebSocket   = require('ws')
var   vcs_core    = require("./vcs_core.js") 
const channel = require("./channel.js")

/*
  
  Wed Apr 17 08:09:50 PDT 2019
  Want to add ability to write vcs commands in any programming language

  Core concept is a vcs server (core server interface) "csi" which listens for incoming JSON 
  packets which describe the desired command to be added. 
  
  After receiving the json description, csi will dynamically create a class corresponding 
  to the described command, and then load that command into the vcs command lib. 
  This dynamicically created command acts as a bridge over websockets from vcs core to the
  external command
  
  The required json parameters are as follows. 
  1) info object which contains keys:
     -- id
     -- rules (vector of rules for speech parsing)
     -- var (required vars) 

*/


/* 
 Dynamically create an 'external_command' given the info object. 
 params relay and receive are created at socket connection 
 */
function make_external_command(info,relay,receive) {  

    //dynamically create the command class here 
    class external_command extends vcs.base_command { 
	
	constructor(config) {
 	    super({info['id']})
	    this.info = info  //store the info within the command 
	}
	
	static get_info() { 
	    return info 
	}
	
	//loop read from the external receive channel and emit 
	async listen() { 
	    this.log.i("Starting listen loop")
	    while (true) { 
		let msg = await receive.shift() //read from the receive channel 
		switch(msg['type']) { 
		    
		case 'emit' : 
		    this.emit(msg['data'] )
		    break
		    
		case 'finish' : 
		    this.finish(msg['data'])
		    break 
		    
		default : 
		    this.log.i("Unrecognized msg type in listen loop:")
		    this.log.i(msg)
		    break 
		}
	    }
	}
	
	async run() { 
	    this.log.i("Running external command: " + this.info['id'])
	    
	    //start the async input loop
	    this.listen()
	    
	    //notify external interface that the command has been loaded 
	    relay({type : 'init'})
	    
	    //loop read from input channel 
	    this.log.i("Starting input channel loop and relay")
	    while(true) { 
		let text = await this.input.shift() 
		//now we will forward the text to the external cmd 
		relay({type: 'text' , data: text})
	    }
	}
    }
    //finish class definition ------------------------------ 
    return external_command
}


/* 
   A websocket connection is appropriate because csi must be able to "push" messages 
   to the remote connection. 
   
   1) First the CSI receives a websocket connection. 
   The client can send an optional "REGISTRATION" message which creates an identifier
   for itself that will be associated with any commands created over its connection
*/ 
var clients = {}

function start_server() { 
    var port  = 9002
    const wss = new WebSocket.Server({ port: port });
    
    wss.on('connection', function connection(ws) {
	log.i("Received ws connection.")
	
	//make channel here, will be passed to handle_create_command
	var receive = new channel.channel() 
	
	ws.on('message', function incoming(message_string) {
	    message = JSON.parse(message_string) 
	    
	    switch(message.type) { 
		
	    case "register" : 
		let id = message.data
		log.i("Received registration from: " + id) 
		clients[ws] = {id}
		break 
	
	    case "create_command" : 
		client_id = clients[ws] || "external_client"
		handle_create_command({message,ws,receive,client_id})
		break
		
	    default : 
		log.i("Passing msg to 'receive' channel")
		receive.push(message)
	    }
	    
	})
    })

    log.i("Websocket server waiting for connection on port: " + port ) 

}


/* 
   2) When a command creation message is received, the appropriate JSON info is parsed 
   and a command class is created using 'make_external_command'.  The required params of 
   relay and receive are created (and then passed to 'make_external_command'): 
   -- relay: This is a function that JSON.stringifies its input and then sends it 
             along websocket connection to the client, WITH builtin metadata regarding the 
	     command 
   -- receive: This is a channel that is created into which web socket messages are piped
               i.e. in the websocket on('message') handler it pipes to this channel (so 
	       it can be read later in the listen loop) 
*/ 
function handle_create_command(opts) { 
    var {message, ws, receive,client_id} = opts 
    let {info} = message 
    
    log.i("Received 'create_command' from: " + client_id) 
    
    //build the relay function 
    let relay = function(data) { 
	let metadata = info 
	let payload  = data 
	ws.send(JSON.stringify({metadata,payload}))
    } 
    
    //now create the command 
    let cmd = make_external_command(info,relay,receive) 
    
    //the above is a reference to a custom made class 
    //now we have to load it 
    
}
