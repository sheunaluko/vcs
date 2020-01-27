const log         = require("./logger.js").get_logger("csi")
const WebSocket   = require('ws')
let core          = require("./vcs_core.js")
var base_command  = require("./base_command.js").base_command
const channel     = require("./channel.js")
var params        = require("./vcs_params.js").params

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
function make_external_command({command_info,client_id,ws}) {  

    //dynamically create the command class here 
    class external_command extends base_command { 
	
	constructor(config) {
 	    super({id :  command_info['id']})
	    this.command_info = command_info  //store the info within the command 
	}
	
	static get_info() { 
	    return command_info 
	}
	//loop read from the external receive channel and emit 
	async listen(receive) { 
	    this.log.i("Starting listen loop")
	    while (true) { 
		let msg = await receive.shift() //read from the receive channel 
		switch(msg['type']) { 
		    
		case 'emit' : 
		    this.emit(msg['data'] )
		    break
		    
		case 'feedback' : 
		    this.feedback(msg['data'] )
		    break
		    
		    
		case 'finish' : 
		    this.finish(msg['data'])
		    break 

		case 'call_command' : 
		    this.log.i("Calling command")
		    this.launch_command(msg['data']) 
		    break 
		    
		default : 
		    this.log.i("Unrecognized msg type in listen loop:")
		    this.log.i(msg)
		    break 
		}
	    }
	}
	
	// define the relay function 
	relay(data) { 
	    //append id and instance id
	    data.id = this.cmd_id.split(".").slice(1).join(".")  //get rid of module name
	    data.instance_id = this.instance_id 
	    ws.send(JSON.stringify(data)) // send it 
	}
	
	async run() { 
	    let id = this.command_info['id']
	    
	    this.log.i("Running external command: " + id )
	    
	    //make a new channel 
	    let receive = new channel.channel()
	    
	    //update the global clients structure 
	    let instance_id = this.instance_id
	    add_client_command_channel({client_id,receive,instance_id})

	    
	    //start the async input loop
	    this.listen(receive)
	    
	    //notify external interface that the command has been loaded 
	    let args  = this.args 
	    var call_info = {instance_id,args } 
	    //external interface does not know about the MODULE PREFIX added to ID 
	    call_info.id = id.split(".").slice(1).join(".")  
	    
	    let type = 'init_command' 
	    this.relay({type, call_info}) 
	    this.log.i("Sent info to external client")
	    
	    //loop read from input channel 
	    this.log.i("Starting input channel loop and relay")
	    var text 
	    while(true) { 
		this.log.i("(csi) Waiting for input:")
		//text = await this.get_input()
		text = await this.input.shift()  //to relay ABORTS 
		this.log.i("(csi) Relaying received msg to external client: " + text)
		//now we will forward the text to the external cmd 
		this.relay({type: 'text' , data: text})
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
var client_map = {}
var clients = {}  //stores data about the csi clients as well as their command instances
var client_id  //init var
function add_client_command_channel({client_id,instance_id,receive}) {
    clients[client_id][instance_id] = receive 
    log.i("Added new client receive channel for: " + client_id + " > " + instance_id ) 
}

var debug_messages = false 
var debug = [] 

function start_server() { 
    
    if (!params.csi_enabled) { 
	log.i("csi disabled, will not launch") 
	return 
    }
    
    var port  = params.csi_port 
    const wss = new WebSocket.Server({ port: port });
    
    wss.on('connection', function connection(ws,req) {
	let ip = req.connection.remoteAddress ;
	log.i("Received ws connection from ip: " + ip) 
	
	debug.push({req, con : req.connection, ws})
	
	//ensure only localhost can connect!  
	//can update in the future to provide a whitelist 
	if (ip != "::1") { 
	    log.i("Terminating ws connection from ip: " + ip + " !" ) 	    
	    let msg = {type : 'ERROR' , data : "You cannot connect, sorry!"}
	    ws.send(JSON.stringify(msg))
	    ws.close() 
	    return 
	}
	
	
	log.i("Allowing ws connection from ip: " + ip) 
	
	ws.on('message', function incoming(message_string) {
	    message = JSON.parse(message_string) 
	    
	    console.log("\n\n")
	    log.i("-- Received WS Message -- ")
	    console.log(message)
	    if (debug_messages) { 
		debug.push(message)
		return 
	    } 
	    
	    switch(message.type) { 
		
	    case "register" : 
		let id = message.id
		log.i("Received registration from: " + id) 
		//ws.send("received registration from: " + id) 
		let ws_addr = ws._socket.remoteAddress
		clients[id] = {ws, ws_addr}
		client_map[ws_addr] = id 
		
		//after receiving registration we will send the client the current 
		//process and parameter configuration 
		//it should have keys params and process 
		let msg =  { 
		    type : 'config' , 
		    process : process.env , 
		    params  : params  
		}
		//send it 
		ws.send(JSON.stringify(msg)) 
		log.i("Sent configuration parameters (including process.env) to client") 
		break 
	
	    case "create_command" : 
		client_id = client_map[ws._socket.remoteAddress] || "external_client"
		handle_create_command({message,ws,client_id})
		break
		
	    default : 
		client_id = client_map[ws._socket.remoteAddress] || "external_client"
		let instance_id = message.command_info.instance_id
		log.i("Received default message from client id: " + client_id + "\n -> for instance_id: " + instance_id)
 		log.i("Passing msg to appropriate 'receive' channel")
		//must get appropriate receive channel to forward to 
		let receive   = clients[client_id][instance_id]
		receive.push(message)
	    }
	    
	})
    })

    log.i("CSI server waiting for connection on port: " + port ) 
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
    var {message, ws,client_id} = opts 
    let {command_info} = message 
    
    //incorporate client info into the command id 
    command_info.id = client_id + "." + command_info.id 
    
    log.i("Received 'create_command' from: " + client_id) 
    
    //now create the command 
    let cmd = make_external_command({client_id,command_info,ws}) 
    
    debug.push(cmd) 
    //return 
    //the above is a reference to a custom made class 
    //now we have to load it 
    core.command_lib.add_command_to_module(cmd,client_id)
}

/*
  Exports 
*/   
module.exports = {start_server, clients, debug } 
