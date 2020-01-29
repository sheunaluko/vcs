//Sat Jun 29 17:22:50 PDT 2019
//updating on Tue Jan 28 13:35:51 PST 2020 to use socksync instead of diffsync 
/* 
   Key point, vcs commands use this.state.value to get the state, 
   [-] So when the socksync client gets an update message it should set this value 
   In addition,  all commands use this.state.update( [path], fn ) 
   [ ] To update their state, so this will need to be transalted to a socksync update 
   
 */ 


var util = require("@sheunaluko/node_utils") 
var params = require("./vcs_params.js").params 
var   log     = require("./logger.js")
var socksync  = require("./socksync.js") 

//Manages state for the vcs platform

var ids = 0 
function unique_id() { 
    return ids++ 
} 

//Commands can register state with the vcs_state file 
var command_states = {} 

async function create_state(owner) { //owner is reference to the command that owns the state
    

    /* 
       Should be a simply and nice API for modifying the state
       Fields must exist to be updated ! 
    */
    
    class tmp { 
	
	constructor() { 
	    this.owner = owner 
	    this.listeners = {} 
	    this.value = {} //initialize with empty object 
	    this.log   = log.get_logger(owner.instance_id+"_state")
	}
	
	async init() { 
	    //initialize the socksync client 
	    this.instance_id = owner.instance_id  //get the id 
	    this.subscribe_id = owner.instance_id  
	    let subscribe_id = this.subscribe_id  
	    let on_update = (function(data){
		this.value = data  //set the state value 
	    }).bind(this) 
	    if (params.diff_server_enabled) { 
		this.client = new socksync.Client({subscribe_id, on_update, port : params.sync_port}) 
		//we want to 'block' until the client has been registered (before any updates are attempted) 
		let t0 = new Date().getTime() 
		let _  = await this.client.await_registration() 
		let t1 = new Date().getTime() 		
		this.log.d(`State ssync client registration took ${t1 - t0} ms`) 
	    } else { this.client = null  } 
	}
	
	update(path, fn) { 
	    
	    /* 
	       note: this function simultaneously modifies the state object 
	       AND builds the { a : { b : { c : 10 }}} nested update structure 
	       that socksync uses for dispatching updates 
	     */
	    var tmp = this.value 
	    var update = {} 
	    var update_ref = update 
	    
	    //traverse the path 
	    for (var i =0 ; i< path.length - 1 ; i ++ ) { 
		tmp = tmp[path[i]] 
		
		//this part builds our update object 
		update_ref[path[i]] = {} 
		update_ref = udpate_ref[path[i]] 
	    }
	    
	    // make the change here 
	    let new_val = fn(tmp[util.last(path)]) 
	    tmp[util.last(path)] = new_val 
	    
	    // and add the leaf to our update object 
	    update_ref[util.last(path)] = new_val 
	    
	    // and run any appropriate listener 
	    this.run_listener(path, new_val) 
	    
	    // and then notify 
	    if (params.diff_server_enabled) { 
		//is enabled 
		this.log.d("Sending update message:") ; this.log.d(update) 
		this.client.update(update) 
	    } else { 
		//pass 
	    }
	    
	    this.log.i("updated path: " + path) 
	}
	
	set_initial_state(initial_state) { 
	    
	    var fields = Object.keys(initial_state)
	    for (var i = 0 ; i < fields.length ; i ++ ) {
		let path = [fields[i]]
		let fn = function() {return initial_state[fields[i]]}
		this.update(path,fn)
	    }
	    
	    this.log.i("Set initial state:")
	    this.log.i(this.value)
	}
    
	listener(path , f) { 
	    //create path if ! exist
	    if (this.listeners[path] == undefined ) { this.listeners[path] = [] } 
	    //push the function 
	    this.listeners[path].push(f)
	    this.log.i("Added listener for path: " + path) 
	}
	
	
	async run_listener(path, val) { 
	    let fns = this.listeners[path]
	    if (fns) { 
		// there are listeners 
		this.log.i("Running " + fns.length + " listener(s) for path: " + path) 
		for (var f of fns ) { f.bind(owner)(val) }
	    } 
	}
	
    }
    
    let new_state = new tmp() 
    command_states[owner.instance_id] = new_state 
    let _  = await new_state.init() 
    return new_state
} 

module.exports  = { unique_id , command_states, create_state } 


