/* 
   Mon Jan 27 09:33:53 PST 2020
   my (Sheun Aluko)  implementation of diff sync server and client 
 */ 

const WebSocket   = require('ws');


/* Some params */
var default_socksync_port = 9004 


/* 
   define the state transition function, used by both the server and client 
   for updating the state with the new data  
*/

function do_state_transition({state={}, data}) { 
    /* 
       used to just be Object.assign(state,data) , but that only does SHALLOW COPIES 
       we can do better than that though, by utilizing recursion

       basic idea: 
       1) loop through vals of data update
       2) if the val IS a dict, then we must recurse 
       3) if not we just return it 
    */
    Object.keys(data).map( k=> { 
	//check if its a dictionary 
	if (data[k].constructor == Object ) { 
	    //it is, so we recurse 
	    //note that new arguments are subset of prior arguments 
	    state[k] = do_state_transition({state: state[k], data : data[k]})
	} else { 
	    //not, so we set the property 
	    state[k] = data[k]
	}
    })
    
    return state 
    
    /* 
       An interesting sidenote: the default argument state={} is necessary, 
       because some of the recursive calls will pass a null state value 
       when the data update is creating new recursive fields
     */
}



/* First I will define the client (since the server actually uses it too)  */
class Client { 
    
    /* 
       Required params are: 
         - subscribe_id  (id of the subscription to connect on) 
	 - on_update (callback for when data has been updated) 
     */
    constructor(ops={}) { 
	
	if (!ops.subscribe_id) { throw("Please provide subscribe_id") } 
	if (!ops.on_update) { throw("Please provide on_update callback") } 	

	this.log = require("./logger.js").get_logger("csync_"+ops.subscribe_id)
	this.subscribe_id =  ops.subscribe_id 
	this.socksync_port = ops.port || default_socksync_port
	this.socksync_host = ops.host || "localhost"
	this.connection_url = `ws://${this.socksync_host}:${this.socksync_port}`
	this.ws = null 
	
	
	//the client will have to keep track of its state 
	this.state = {} 
	this.on_update = ops.on_update  //and will trigger on_update after changes have been made 
	
	
	this.connect() 
	
	 //registration promise will be set in connect and can be awaited for better async 
	var fullfill_registration = null 
	this.registration_promise = new Promise((resolve,reject) => { 
	    fullfill_registration = resolve 
	})
	this.fullfill_registration = fullfill_registration //get copy so we can resolve later 
	
    }
    
    await_registration() { 
	return this.registration_promise 
    }
    
    connect() { 
	
	//will connect to the socksync server using the member var port 
	let url = this.connection_url 
	this.log.d("Attempting connection to url: " + url)
	var ws = new WebSocket(url) 
	
	//now we set the callbacks 
	ws.on('open' , (function open() { 
	    this.log.d("Connection successful") 
	    //assign the ws instance 
	    this.ws = ws 
	    //send a registration message now via the (my) protocol 
	    this.register() 
	}).bind(this))

	ws.on('message' , (function message(_msg) { 
	    
	    let msg = JSON.parse(_msg)
	    switch(msg.type) { 
		
	    case "update" : 
		let data = msg.data
		this.log.d("Received data update: \n" + JSON.stringify(data)) 
		//will need to apply the data update 
		this.log.d("Apply update to the state, which is currently: ") 
		this.log.d(this.state) 
		this.state = do_state_transition({state : this.state, data}) 
		this.log.d("Now this.state is: ") ; this.log.d(this.state) 
		this.log.d("Calling on update callback now with this.state") 
		this.on_update(this.state) 
		this.log.d("Done") 
		break 
		
	    case "registered" : 
		//registration has been acknowledged 
		//resolve the registration promise 
		this.log.d("Received registration acknowledgement") 
		this.fullfill_registration() 
		break

		
	    default : 
		this.log.d("Unrecognized message type:") 
		this.log.d(message) 
	    }	    
	    
	}).bind(this))

	ws.on('close' , (function close() { 
	    this.log.d("The ws connection was closed") 
	}).bind(this))
	
	
    }
    
    send(msg) { 
	if (!this.ws) {throw("ws is undefined")} 
	this.ws.send(JSON.stringify(msg)) 
    }
    
    register() { 
	let msg = { 
	    type : 'register', 
	    subscribe_id : this.subscribe_id 
	}
	this.send(msg) 
	this.log.d("Sent register message:\n" + JSON.stringify(msg)) 
    }
    
    update(data) { 
	let msg = { 
	    type : 'update', 
	    data 
	}
	this.send(msg) 
	this.log.d("Send update message:\n" + JSON.stringify(data)) 
    }
    
    
    
    
    
}


/* Then define the server */ 
class Server { 
    
    /* 
       Required params are: 
         - 
	 - 
     */
    
    constructor(ops={}) { 
	
	this.port = ops.port || default_socksync_port  //assign port
	this.log = require("./logger.js").get_logger("ssync")  //assign logger 
	this.wss = null  //init server ref 
	
	//init client data structures 
	this.clients_by_id = {} 
	this.data_by_id    = {}  
    }
    
    
    add_client_with_id({client,id}){ 
	this.log.d(`Adding client  with id (${id}) to instance`)
	if (this.clients_by_id[id] && Object.keys(this.clients_by_id[id]).length) {
	    //clients already exists with this id 
	    this.clients_by_id[id].push(client) 
	    //since clients already exist for this ID, we will 
	    //send the new client a copy of the current data 
	    //if it exists 
	    let data = this.data_by_id[id] 
	    if (data) {
		let msg  = { 
		    'type' : 'update', 
		    data ,
		}
		client.send(JSON.stringify(msg))
		this.log.d("Sent new client copy of current data from id: " + id ) 
	    } 
	    //if data does not exist then dont send any message (will be sent on first update) 
	} else { 
	    //no clients have registered yet with this id 
	    this.clients_by_id[id] = [] 
	    this.clients_by_id[id].push(client) 		    
	}
	this.log.d("Done adding client") 
    }
    
    
    initialize() { 
	//create the wss
	let port = this.port 
	var wss = new WebSocket.Server({ port}) 
	
	//create the callbacks now 
	wss.on('connection',(function connection(ws) {
	    //cannot really do anything until we know what the subscribe id is 
	    this.log.d("A client connected from ip " + ws._socket.remoteAddress) 
	    
	    
	    ws.on('message', (function incoming(message_string) {
		
		var msg = JSON.parse(message_string) 
		
		switch(msg.type) { 
		    
		case "register" : 
		    var id = msg.subscribe_id 
		    this.log.d("Got register for: " + id )
		    //will update the ws object itself 
		    ws.socksync_subscribe_id = id 
		    this.log.d("Modified the ws instance: " + id )		
		    this.log.d("Now its id is: " + ws.socksync_subscribe_id)
		    this.log.d("Also adding to object") 
		    this.add_client_with_id({client : ws, id}) //this call also handles updating the client if data exists
		    
		    //will send the client an acknowledgement 
		    ws.send(JSON.stringify({ type : "registered" }) ) 
		    this.log.d("Sent client registered message") 
		    break 

		case "update" : 
		    var data = msg.data
		    var id   = ws.socksync_subscribe_id  
		    if (!id ) { 
			this.log.d("Ignoring update from unregistered client") 
		    } else { 
			this.log.d("Got update for id: " + id)
		    }
		    
		    this.handle_update({id,data})
		    break 
		    
		default : 
		    this.log.d("Unrecognized message type:") 
		    this.log.d(msg) 
		}
	    }).bind(this)) 
	    
	    
	    ws.on('close' , (function close() {
		this.handle_close({ws}) ; 
	    }).bind(this)) 

	}).bind(this)) 
	// - end callbacks 
	
		
	
	this.log.d("wss listening on port: " + port) 
	 
    }
    
    
    /* handle a data update from a client */ 
    handle_update({id, data}) { 
	

	this.log.d("Handling update for id: " + id + " with data:\n" + JSON.stringify(data))

	
	//first we will make sure data exists 
	if (!this.data_by_id[id]) {
	    this.log.d("init data for " + id) 
	    this.data_by_id[id] = {} 
	}
	
	//then we update the server's copy of the data  *see end of function for note* 
	this.data_by_id[id] = do_state_transition({state: this.data_by_id[id],data})
	
	this.log.d("After update, the server now has data: ") 
	this.log.d(this.data_by_id[id]) 
	
	//now we broadcast the update to all clients 
	let clients = this.clients_by_id[id] 
	
	this.log.d(`Broadcasting update to ${clients.length} client(s)`) 
	
	let msg =  {
	    'type' : 'update' , 
	    'data' : data 
 	}
	
	this.send_msg_to_clients({clients, msg}) 
	

	//** NOTE ** 
	//Decided not to have the server instantiate its own clients to keep track of state, 
	//mainly because 1) state transition logic is simple and 2) simply async issues 
	
    }
    
    send_msg_to_clients({clients,msg}) { 
	clients.map(c=>{
	    c.send(JSON.stringify(msg)) 
	})
    }
    
    
    /* handle a close event from a cient ws */ 
    handle_close({ws}) { 
	let id = ws.socksync_subscribe_id
	
	//main thing to do is to remove the websocket client from the list 
	//so we dont try to send to it 
	
	
	if (!this.clients_by_id[id]) {
	    //interesting... if a client connects then disconnects before it registers, 
	    //than ws.socksync_subscribe_id is undefined and problems ensue... 
	    //this if clause prevents that 
	    this.log.d(`Ignoring disconnect from client id: ${id}`) 
	    return 
	}
	
	try {
	    this.clients_by_id[id] = this.clients_by_id[id].filter(c => c != ws )
	} catch(e) {
	    this.log.d("Error with client disconnect") 
	    this.log.d(e) 
	}
	
	//that should have done it 
	//notify 
	this.log.d(`A ws  client disconnected from id ${id}. There are ${this.clients_by_id[id].length} remaining`) 
	//DONE 
    }

}


module.exports = { 
    Client, 
    Server  , 
    do_state_transition , 
}
    


