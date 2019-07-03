//Sun Mar  3 10:46:33 PST 2019
const channel = require("./channel.js");
var   log     = require("./logger.js").get_logger("vcs_core") 
var command_stack = require("./command_stack.js") 
var command_library   = require("./command_library.js") 
let R          = require("./ramda.js") 
let params     = require("./vcs_params.js").params
let tts        = require("./tts.js")
let out        = require("./main_output.js")
let aliases    = require("./aliases.js") 
let utils      = require("./node_utils.js") 

var input = new channel.channel()  //define the input channel 
var stack = new command_stack() //create a command stack 
var command_lib   = new command_library() 
var emissions  = new channel.channel() 



var vcs_core_active = true 

function start() { 
    input_loop() 
    emissions_loop() 
    aliases.load_aliases() // load aliases from db 
    utils.make_diff_server(params.sync_port)  //start the sync server (used for exposing command state to external actors like UI, etc ) 
}

//vcs_core will loop on inputs to the channel 
async function input_loop() { 
    log.i("Starting input loop.") 
    vcs_core_active = true 
    while (vcs_core_active) { 
	let message = await input.shift() //read from channel 
	log.d("Got message " + message) 
	handle_message(message) 
    }
} 

async function emissions_loop() { 
    log.i("Starting emissions loop")
    while ( emission = await emissions.shift() ) { 
	let {id,data} = emission 
	log.d("Emission:: " + id + " ::" + data)
	switch (params.emit_mode) { 
	case 'default' : 
	    log.d("Sending emission via main output.")
	    out.send(data)
	    break 
	    
	default : 
	    log.d("Emit mode not matched")
	}
	
    }
}

//connect the stack sink with the output
stack.set_sink(out.command_result)

function stop() { vcsc_core_active = false ; log.i("Stopped")  } 

//core message handler 
async function handle_message(msg) { 
    //msg should be string 
    msg = msg.trim().toLowerCase() //normalize all string inputs in this way
    
    
    log.d("Handling msg: " + msg ) 
    
    if (stack.empty() ) { 
	//no commands on the stack 
	log.d("Command stack empty, searching for matching rule") 
	msg = aliases.translate(msg)   //apply the appropriate alias if it exists 
	/* TO THINK ABOUT : 
	   SHould the alias be applied ONLY WHEN SEARCHING FOR COMMAND TO RUN ?
	*/ 
	
	if (info = command_lib.find_command(msg)) { 
	    log.d("Found matching command: " + info.command_info.id + ", dispatching...")
	    initialize_dispatch(info)
	} else { 
	    log.d("No command was found: ignoring.") 
	    out.unrecognized_input()
	}
	
    } else { 
	log.d("Routing message to command: " + stack.current().instance_id ) 
	//send the message to the command 
	stack.current().input.push(msg) 
    } 
    
} 

async function initialize_dispatch(args) { 
    let id = "dispatch_builder"
    let module  = "builtins" 
    let command_info = {id,module}
    let call_info = {args,command_info}
    initialize_command(call_info) 
}

async function initialize_command(call_info) { 
    let { args, command_info } = call_info
    let {id, module } = command_info 
    log.d("Initializing command: " + id) 
    
    /* check if the cmd has all its vars satisfied */ 
    var missing ;
    if (! R.isEmpty(  missing = command_lib.get_missing_vars(call_info) ) ) { 
	/* if it doesnt... */ 
	log.d("Command is missing vars: " + JSON.stringify(missing)) 
	log.d("Calling dispatch builder with current arguments...") 
	let argument_dictionary = args 
	let command_info        = {id, module } 
	initialize_dispatch({command_info, argument_dictionary})
	/* END EXECUTION HERE */
	return 
    }

    /* if it does we keep going... */ 
    //instantiate the command and pass optional config, then give it the args
    let command = command_lib.get_command(command_info) 
    let cmd = new command({}) ; cmd.args = args || {} 

    //figure out what the sink channel will be -> 
    //if there is a command on the stack now then its input channel will be the sink
    //if not the the command_stack.sink will be the sink 

    var sink  = null 
    if (stack.empty()) {
	sink = stack.sink 
    } else { 
	log.d("Will be assigning sink from current stack: " + stack.current().instance_id)
	sink = stack.current().input
    }
    //let sink = stack.empty() ? stack.sink : stack.current().input    

    //now we connect the cmds sink channel with the sink 
    cmd.sink.connect(sink) 
    //and connect the cmds output channel with vcs core's emissions channel 
    cmd.output.connect(emissions)
    //push the cmd onto the stack 
    stack.push(cmd) 
    //and run the command asynchronously , catching any errors: 
    try { 
	log.i("Running cmd: " + cmd.instance_id ) 
	await cmd.run() 
	log.i("Done running cmd: " + cmd.instance_id) 
    } catch (e) { 
	cmd.log.i("Caught error: " + e )
    }
    //note, there is no need to wait for command to run.. when it is finished it will
    //automatically call this.finish({}) which will pop it from the stack, etc..
    
}



//module exports  
module.exports = {input, start, stop, command_lib, stack, emissions, initialize_command } 




