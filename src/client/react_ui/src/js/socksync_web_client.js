/* 
   Tue Jan 28 10:33:56 PST 2020
   my (Sheun Aluko)  implementation of diff sync browser client 
 */ 


/* Some params */
var default_socksync_port = 9004 


/* 
   define the state transition function, used by both the server and client 
   for updating the state with the new data  
*/

export function do_state_transition({state={}, data}) { 
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


//define logger (to replace the nodejs logger) 
var logger = { info : console.log, debug  : console.log } 
function get_logger(name) { 
    let l = function(t,m) { 
	let spacer = t =='info' ? " " : "" 
	let header = "[" + name + "] \t\t ~ " 	
	
	if (typeof(m) == 'string' ) { 
	    logger[t](header + m)   //adds header if string
	}
	else { 
	    logger[t](header)       //if not prints header first 
	    logger[t](JSON.stringify(m))
	}
    }
    let i = function(m) { l("info",m) } 
    let d = function(m) { l("debug", m) } 
    return { i, d } 
} 




/* First I will define the client (since the server actually uses it too)  */
export class Client { 
    
    /* 
       Required params are: 
         - subscribe_id  (id of the subscription to connect on) 
	 - on_update (callback for when data has been updated) 
     */
    constructor(ops={}) { 
	
	if (!ops.subscribe_id) { throw("Please provide subscribe_id") } 
	if (!ops.on_update) { throw("Please provide on_update callback") } 	

	this.log = get_logger("csync_"+ops.subscribe_id)
	this.subscribe_id =  ops.subscribe_id 
	this.socksync_port = ops.port || default_socksync_port
	this.socksync_host = ops.host || "localhost"
	this.connection_url = `ws://${this.socksync_host}:${this.socksync_port}`
	this.ws = null 
	
	
	//the client will have to keep track of its state 
	this.state = {} 
	this.on_update = ops.on_update  //and will trigger on_update after changes have been made 
	
	this.connect() 
	
    }
    
    
    connect() { 
	
	//will connect to the socksync server using the member var port 
	let url = this.connection_url 
	this.log.d("Attempting connection to url: " + url)
	var ws = new WebSocket(url) 
	
	//now we set the callbacks 
	ws.onopen = (function open() { 
	    this.log.d("Connection successful") 
	    //assign the ws instance 
	    this.ws = ws 
	    //send a registration message now via the (my) protocol 
	    this.register() 
	}).bind(this) 

	ws.onmessage = (function message(_msg) { 
	    
	    this.log.d("Got message: " )
	    this.log.d(_msg.data) 
	    
	    let msg = JSON.parse(_msg.data)
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
		
	    default : 
		this.log.d("Unrecognized message type:") 
		this.log.d(message) 
	    }	    
	    
	}).bind(this) 

	ws.onclose = (function close() { 
	    this.log.d("The ws connection was closed") 
	}).bind(this) 
	
	
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


