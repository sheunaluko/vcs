//Sun Mar  3 14:50:48 PST 2019
const R = require("./ramda.js") 


// must support queries of this kind => 
let r1 =  "remind me to [[message-on-alarm]] in [[minutes-till-alarm]] minutes ?(from now|please)"  

let var_regex = /\[\[(.+?)\]\]/
let opt_regex = /\?\((.+?)\)/   //optional includes empty string
let OR_regex = /@or\((.+?)\)/    //OR       does not include empty string 

function process_vars(rule,order) { 
    let result = rule.match(var_regex)
    if (result) { 
	order.push(result[1])
	return process_vars(rule.replace(var_regex,"(.+?)"),order)
    } 
    else {
	return {regex : "^" + rule + "$", order : order} 
    }
}

function process_optionals(rule) { 
    let matches = rule.match(opt_regex) 
    //console.log(matches)
    if (matches) { 
	let optionals = matches[1].split("|").concat([""])  //add the empty string as well 
	return R.flatten( optionals.map( function(opt) { 
	    let next = rule.replace(opt_regex, opt)
	    //console.log(next)
	    //replace the optional in recursive fashion
	    return process_optionals(next)
	}))
    } else { 
	//normalize the spaces between tokens and trim 
	//necessary because of the way optionals are processed
	// for example with "foo ?(blah) bar" you end up with => "foo  bar" | "foo blah bar"
	return [rule.replace(/\s+/g, " ").trim()]  
    }
}

function process_ORs(rule) { 
    let matches = rule.match(OR_regex) 
    //console.log(matches)
    if (matches) { 
	let ORS = matches[1].split("|")
	return R.flatten( ORS.map( function(OR) { 
	    let next = rule.replace(OR_regex, OR)
	    return process_ORs(next)
	}))
    } else { 
	//normalize the spaces between tokens and trim 
	// for example with "foo ?(blah) bar" you end up with => "foo  bar" | "foo blah bar"
	return [rule.replace(/\s+/g, " ").trim()]  
    }
}


function parse_rule(rule) { 
    return process_optionals(rule).map(process_ORs).flat().map(x=>process_vars(x,[]))
}

module.exports  = { var_regex, opt_regex, r1, process_optionals, process_vars, parse_rule } 


/* 
   TO UNDERSTAND USAGE: 
   
   parse_rule(r1)  PRODUCES THE FOLLOWING: 
   
   [ { regex: '^remind me to (.+?) in (.+?) minutes from now$',
       order: [ 'message-on-alarm', 'minutes-till-alarm' ] },
     { regex: '^remind me to (.+?) in (.+?) minutes please$',
       order: [ 'message-on-alarm', 'minutes-till-alarm' ] },
     { regex: '^remind me to (.+?) in (.+?) minutes$',
       order: [ 'message-on-alarm', 'minutes-till-alarm' ] } ] 
       
*/
