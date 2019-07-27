//Fri Jul 26 19:36:36 PDT 2019

var util = require("../node_utils.js") 
var iu  = require("./interpreter_utils.js") 
var it  = require("./interpreter_targets.js") 
var mem = require("../memory.js").memory 
var rp  = require("../rule_parser.js") 
const log = require("../logger.js").get_logger("interpreter")

/* This works like this: 
   
   The rules are expanded into regexes using the rule parser 
   The regexes are matched against the text until one matches 
   If one matches, the arguments are extracted from the text 
   And then the named capture groups are parsed by the correspondeding parsers 
   Then an object is built with the capture group names as fields and the 
   parsed values as values 
   And finally the object is passed as an argument to the 'target' function 
   
 */


let rule_set = [ 
    { target : "store_variable", 
      rules  :  [ "store [[value]] @or(in|into|as) [[name]]" , 
		  "[[name]] equals [[value]]",
		  "[[name]] is equal to [[value]]" , 
		  "set [[name]] @or(to|equal to) [[value]]"] , 
      parsers:  { name : iu.nato_parser , 
		  value : iu.variable_value_parser  } } , 
    
    { target : "get_variable", 
      rules  :  [ "what is ?(the value of) [[name]]" , 
		  "output [[name]]" ] , 
      parsers:  { name : iu.nato_parser  } } 
    
]
      
//take the above rule 
function generate_runtime_rule_set(rule_set) { 
    var result = [] 
    for (obj of rule_set) { 
	let {target, rules, parsers} = obj 
	let regexes = rules.map(rp.parse_rule).flat() 	
	
	for (var r=0;r<regexes.length;r++) { 
	    result.push( { regex_info: regexes[r]  , 
			   call_info : { target, parsers } } ) 
	}
    }
    
    return result
    
}

let runtime_rule_set = generate_runtime_rule_set(rule_set) 


function build_arguments(opts) { 
    let {match_info,regex_info,parsers} = opts 
    log.i("Building argument dictionary:") 
    var dic = {} 
    var k = null 
    var v = null 
    let order = regex_info.order
    for (var i = 0 ; i < order.length ; i ++ ) { 
	k = order[i] 
	v = match_info[1+i]
	log.i("Adding k,v pair: " + k + "," + v)
	if (parsers[k]) {
	    log.i("Running parser for k: " + k) 
	    dic[k] = parsers[k](v) 
	} else { 
	    dic[k] = v 
	}
    } 
    log.i("Done.")
    return dic 
}

function search_rules(text) { 
    for (var i =0; i< runtime_rule_set.length; i ++) { 
	let {regex_info, call_info }  = runtime_rule_set[i] 
	match_info = text.match(regex_info.regex) 
	if (match_info) { 
	    //there was a match 
	    log.i("Found rule match: " +  regex_info.regex +  " for target " + call_info.target) 
	    let {parsers,target} = call_info 
	    return {match_info , regex_info, parsers , target}
	} else { 
	    // skip
	}
    }
    //if we got here there was no match 
    log.i("No rule match for text: " + text ) 
    return undefined 
} 

function build_dispatch(opts) { 
    let args  = build_arguments(opts) 
    let target = opts.target 
    return {args, target} 
}

function handle_text(txt) { 
    let opts = search_rules(txt) 
    if (!opts) { 
	log.i("Unrecognized text") 
	return 
    }
    
    let {args,target} = build_dispatch(opts) 
    
    let target_fn = it[target]
    if (!target_fn) { 
	log.i("Target fn not found: " + target) 
	return 
    } 
    
    return target_fn(args)
//    return {args,target} 
}


// keep mutation functions below ---------------------------------------- > 
    



module.exports = { 
    runtime_rule_set, 
    build_arguments, 
    generate_runtime_rule_set ,
    search_rules, 
    build_dispatch, 
    handle_text
} 
