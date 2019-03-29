//Sun Mar 10 11:44:54 PDT 2019
const channel = require("./channel.js");
var   state   = require("./vcs_state.js")  
var   log     = require("./logger.js") 
var   core    = require("./vcs_core.js") 
var   R       = require("./ramda.js")

var debug  = null 

class base_command { 
 
    constructor(opts) { 
	let {id} = opts
	
	this.cmd_id = id 
	this.instance_id  =  this.cmd_id + "_" + state.unique_id() //assing unique instance id 
	this.log = log.get_logger(this.instance_id)   //assign logger 
	this.state = state.create_state(this.instance_id)  //create cmd state 
	
	this.run_command = core.run_command //allow the command to call others 
	
	this.input  = new channel.channel() //the input which the command will listen on 
	//vcs_core will route speech information into this channel when appropriate 
	
	//we also will give the channel a reference of the command, so that it can modify the 
	//command object when necessary 
	this.input.set_command(this) 
	this.input_counter = 0 //the input channel will increment this each time it gets input
	
	this.output = new channel.channel()  //channel for the command to do IO (eg. tts,print)
	
	//channel that will be written to when the command is finished
	this.sink   = new channel.channel() 
	
    } 
    
    /* methods ----------------------------------------  */
    
    finish(opts) {
	let {result , error } = opts 

	//can we clean up the commands state here 
	this.log.d("Cleaning up command state") 
	delete(state.command_states[this.instance_id])
	
	//and then we have to pop the stack 
	this.log.d("Removing command from stack")
	core.stack.pop()
	
	//and then wrte write the result to the sink channel 
	this.log.d("Writing result to sink channel") 
	this.sink.push(result) 
	
    }
    
    emit(data) { 
	this.log.d("Emit> " + data) 
	let id = this.instance_id 
	this.output.push({id, data }) 
    }
    
    async request(arg) { 
	this.log.d("Request> " +arg) 
	this.emit(arg) 
	let res = await this.input.shift() 
	this.log.d("Got> " + res ) 
	return res
    }
    

    //interface to vcs_core
    async call_command(call_info) { 
	core.initialize_command(call_info)  //this will add command to the stack 
	//now we listen on the input channel for when the above command returns 
	let result = await this.input.shift() 
	//and then return that result 
	return result
	
    } 
    
    
    
    /* get missing vars */
    get_missing_vars(dict) {
	
	let vars = this.constructor.get_info().vars
	
	
	//if no vars then return 
	if (! vars ) { return []  } 
	//use ramda.js custom library :) 
	let required_vars = R.thread_f( vars , 
					R.filter(R.propEq("default_value", false)) , 
					R.keys ) 
	//if there are no required vars then return 
	if (R.isEmpty(required_vars)) { return [] } 
	//there are required vars, so we check if each of them is satisfied 
	let missing = R.thread_f( required_vars , 
				  R.map(x=> [dict[x],x]) , 
				  R.reject( R.first ) , 
				  R.map(R.second) ) 
	this.log.d("Missing vars: " + JSON.stringify(missing)) 
	return missing //note this is an array of the missing vars or [] 
    }
    
   
    
    
}



module.exports = { base_command }
