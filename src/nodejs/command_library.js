//Sun Mar 10 15:14:58 PDT 2019
let rule_parser = require("./rule_parser.js") 
let log = require("./logger.js").get_logger("command_lib")
let R   = require("./ramda.js")

class command_lib { 
    
    constructor() { 
	this.lib = {} 
	this.regex_dict = [ ] //actually an array 
    }

    // commented  June 16, 2019 to upgrade to array based bundles (see below) 
    // add_command_module(mod) { 
    // 	let {module, bundle} = mod 
    // 	this.lib[module] = bundle  
    // 	let commands = Object.keys(bundle) 
    // 	for (var i=0; i<commands.length;i++) { 
    // 	    let command = bundle[commands[i]]
    // 	    this.add_command_to_module(command,module) 
    // 	}
    // }

    // updated for array based bundles 
    add_command_module(mod) { 
    	let {module, bundle} = mod 
    	for (var i=0; i<bundle.length;i++) { 
    	    let command = bundle[i] 
    	    this.add_command_to_module(command,module) 
    	}
    }

    add_command_to_module(cmd,module) { 
	let {id, rules, vars } = cmd.get_info() 
	
	var num = 0 
	if (rules) { 
	    let regexes = rules.map(rule_parser.parse_rule).flat() 
	    for (var r=0;r<regexes.length;r++) { 
		this.regex_dict.push( [ regexes[r] , { module, id } ] ) 
	    }
	    num = regexes.length 
	    
	}
	
	if (! this.lib[module] ) { 
	    this.lib[module] = {} 
	}
	
	this.lib[module][id] = cmd 

	log.d("From module [" + module + "], added cmd [" + id + "] - (" + num + " regxs)")	
	
    }
    
    /* searches through the regex dict for a match */
    find_command(msg) { 
	for (var r=0;r<this.regex_dict.length;r++) { 
	    let regex_info =  this.regex_dict[r][0]
	    let regex = regex_info.regex 
	    let match_info = msg.match(regex) 
	    if (match_info) { 
		log.d("Found regex match:")
		log.d(regex)
		let command_info = this.regex_dict[r][1]
		//return all the necessary information 
		return {regex_info, match_info, command_info } 
	    }
	}
	//at this point there was no match 
	return null 
    }

    
    get_command(command_info) {
	let {module,id} = command_info 
	//throw "Unable to find command " + module + " || " + id 
	return this.lib[module][id]
    }
    
      
    /* get missing vars */
    get_missing_vars(call_info) {
	let {command_info,args} = call_info 
	let {module,id} = command_info 
	
	let cmd = this.lib[module][id]
	if (! cmd ) { throw ("MISSING COMMAND!")  } 
	
	let vars  = cmd.get_info().vars
	
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
				  R.map(x=> [args[x],x]) , 
				  R.reject( R.first ) , 
				  R.map(R.second) ) 
	log.d("Missing vars: " + JSON.stringify(missing)) 
	return missing //note this is an array of the missing vars or [] 
    }

    
    
}
		    
module.exports = command_lib





