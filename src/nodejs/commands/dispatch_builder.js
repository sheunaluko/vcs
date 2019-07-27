//Sun Mar 10 13:23:14 PDT 2019
var vcs = require("../vcs.js") 
let R = vcs.R   ;
let id = "dispatch_builder" 


/* helpers */ 
let clib = vcs.core.command_lib

class dispatch_builder extends vcs.base_command { 
    
    constructor(config) { 
	super( {id } ) 
    } 
    
    static get_info() { 
	return { 
	    id : id, 
	    vars : {"regex_info" : {default_value : null} , 
		    "match_info" : {default_value : null} , 
		    "command_info" : {default_value : false} }
	} 
    }

    /* all commands must implement an async run method 
       automagically have access to arguments in this.args */
    async run() { 
	//vcs.debug = [ this.args, this ] // for debug 
	
	this.log.i("Dispatch builder activated with args:")
	this.log.i(JSON.stringify(this.args))

	/* de structure and assign args */
	let {regex_info,match_info} = this.args 
	//this.argument_dictionary = this.args.argument_dictionary || {}   //PATCHED 5/3/19
	this.argument_dictionary =  {} 	
	this.command_info = this.args.command_info
	this.command = clib.get_command(this.command_info) 
	this.vars    = this.command.get_info().vars 
	this.filter  = this.command.get_info().filter 

	
	/* First step is to register the vars that are already matched */ 
	this.log.i("Building argument dictionary:") 
	var k = null 
	var v = null 
	let order = regex_info.order
	for (var i = 0 ; i < order.length ; i ++ ) { 
	    k = order[i] 
	    v = match_info[1+i]
	    this.log.i("Adding k,v pair: " + k + "," + v)
	    this.argument_dictionary[k] = v 
	} 
	this.log.i("Done.")

	// ----------------------------- > 
	/* ok here we go with the main loop */ 
	let missing_vars = null 
	while (!R.isEmpty ( missing_vars = clib.get_missing_vars(this.current_call_info() ))) {
	    this.log.i("Found missing vars: " + JSON.stringify(missing_vars))
	    let next_var = missing_vars.pop() 
	    let query    = this.vars[next_var].query
	    let filter   = this.filter 
	    
	    /* we will 'request' the query. IO happening behind the scenes */
	    let response = await this.request(query) 
	    /* now we apply the custom filter */ 
	    if (filter) { response = filter.filter(response) } 
	    
	    /* now we assign the value  
	       Note -- there is currently no option for guards. Either could implement this
	       or the guards could be implemented when a command is dispatched, checks itself, 
	       then emits a message warning about the specific arg in question, then dispatches 
	       again with partial arg dict via config 
	       */ 
	    this.argument_dictionary[next_var] = response 
	    /* and thats it :) */ 
	}
	
	/* at this point there are no more missing vars. We will dispatch!  */ 
	this.log.d("No missing vars left, proceeding with dispatch.")
	let args = this.get_call_args() 
	let id   = this.command_info.id
	let module   = this.command_info.module
	let command_info = {id,module}
	let call_info = {args,command_info}
	this.log.d("Calling:: " + JSON.stringify(call_info)) 
	
	/* call the command and wait for its result */ 
	let result = await this.call_command(call_info) 
	
	/* pass the cmd result to the sink */
	this.finish({result})
    }    
    
   /* get call info */
    current_call_info()  { 
	let args = this.argument_dictionary 
	let command_info = this.command_info 
	return { args, command_info } 
    }
    
    
  
    /* get call args */ 
    get_call_args() { 
	let args = this.argument_dictionary 
	let var_keys = R.keys(this.vars) 
	//for each var, we either takes its value from the argument dictionary or its default
	return R.thread_f( var_keys, 
			   R.map( v=> args[v] || this.vars[v].default_value ) , 
			   R.zipObj( var_keys  ) ) 
    } 
    
    
} 



module.exports = dispatch_builder 



    	/* 
	   GOALS 
	   [x] implement the dispatch builder logic, using vcs.debug for help
	   [x] implement: let result = await this.call_command({module,id,args}) (in base_cmd**) 
	   [x] when the above result is returned, call this.finish({result}) to pass it on
	   [x] consider the possibility of calling dispatch builder -> command ->
	         -> ANOTHER dispatch builder -> another command 
		 => ** Perhaps the way this works is that in the base_cmd implementation 
		       of this.call_command, there IS A CHECK that ALL arguments are satisfied
		       BEFORE instantiating the command, and if NOT, then a dispatch builder 
		       is initialized instead with the current args and cmd info... ?           [x] the aforementioned functionality is created in vcs.core.initialize_command and  wrapped in base
	   
	   */ 
	
