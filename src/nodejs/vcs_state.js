//Sun Mar 10 12:43:54 PDT 2019

//Manages all persistent state for the vcs platform 

var ids = 0 
function unique_id() { 
    return ids++ 
} 


//Commands can register state with the vcs_state file 
var command_states = {} 
function create_state(id) { 
    var new_state = {} 
    command_states[id] =  new_state 
    return new_state 
} 

module.exports  = { unique_id , command_states, create_state } 
