//Sat Jun 29 17:22:50 PDT 2019

var util = require("./node_utils.js") 
var params = require("./vcs_params.js").params 
   

//Manages state for the vcs platform

var ids = 0 
function unique_id() { 
    return ids++ 
} 

//Commands can register state with the vcs_state file 
var command_states = {} 

async function create_state(id) { 
    
    let url = "ws://localhost:" + params.sync_port 

    var {client, state}  = await util.make_diff_sync_client(url, id) 
	
    // console.log("vcs_state") 
    // console.log(state) 
    // console.log(client) 
    

    /* 
       Should be a simply and nice API for modifying the state
       Fields must exist to be updated ! 
    */
    
    function update_state(path, fn) { 
	var tmp = state  ; 
	for (var i =0 ; i< path.length - 1 ; i ++ ) { 
	    tmp = tmp[path[i]]
	}
	// make the change here 
	tmp[util.last(path)] = fn(tmp[util.last(path)]) 
	// and then notify 
	client.sync() 
    }
    
    function set_initial_state(initial_state) { 
	var fields = Object.keys(initial_state)
	for (var i = 0 ; i < fields.length ; i ++ ) {
	    let path = [fields[i]]
	    let fn = function() {return initial_state[fields[i]]}
	    update_state(path,fn)
	}
	
	console.log("Set initial state:")
	console.log(state)
    }
    
    command_states[id] =  state 
    
    return {state, update_state, set_initial_state } 
} 


module.exports  = { unique_id , command_states, create_state } 


