//Sat Jun 29 17:22:50 PDT 2019

var util = require("./node_utils.js") 
var params = require("./vcs_params.js").params 
var   log     = require("./logger.js")

//Manages state for the vcs platform

var ids = 0 
function unique_id() { 
    return ids++ 
} 

//Commands can register state with the vcs_state file 
var command_states = {} 

async function create_state(owner) { //owner is reference to the command that owns the state
    
    let url = "ws://localhost:" + params.sync_port 

    var {client, state}  = await util.make_diff_sync_client(url, owner.instance_id) 
	
    // console.log("vcs_state") 
    // console.log(state) 
    // console.log(client) 
    

    /* 
       Should be a simply and nice API for modifying the state
       Fields must exist to be updated ! 
    */
    
    class tmp { 
	
	constructor() { 
	    this.owner = owner 
	    this.listeners = {} 
	    this.value = state 
	    this.log   = log.get_logger(owner.instance_id+"_state")
	    this.client = client 
	}
	
	update(path, fn) { 
	    var tmp = state  ; 
	    for (var i =0 ; i< path.length - 1 ; i ++ ) { 
		tmp = tmp[path[i]]
	    }
	    // make the change here 
	    let new_val = fn(tmp[util.last(path)]) 
	    tmp[util.last(path)] = new_val 
	    
	    // and run any appropriate listener 
	    this.run_listener(path, new_val) 
	    
	    // and then notify 
	    client.sync() 
	    
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
	    this.log.i(state)
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
    return new_state
} 

module.exports  = { unique_id , command_states, create_state } 


