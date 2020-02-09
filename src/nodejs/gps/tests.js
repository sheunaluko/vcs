

//load the env 
require("./gps_dev") 
//load the entities 
const Parser          = require("./parser.js") 
const {generate_computation, do_computations} = require("./computation.js")
const ii              = require("./interpreter_interface.js") 



var tests = { 

    // - 
    
    "1" : function() { 
	
    } , 
    "2" : function() { 
	
    } , 
    "3" : function () { 
	
    } , 
    "4" : function () { 
	
    } 
} 






function iparse(txt) { 
    return ii.parse(txt) 
}


function parse_to_entities(txt) { 
    let parser = new Parser();     
    return parser.parse(txt) 
}

function txt_to_computations(txt){
    return parse_to_entities(txt).map(generate_computation)
}

var pparse = txt_to_computations //alias 


function txt_compute(txt) { return do_computations(txt_to_computations(txt)) }

function compute(x) { 
    if (x.constructor == Array) { 
	return do_computations(x) 
    } else { 
	return txt_compute(x) 
    }
}


module.exports = { 
    tests , 
    iparse , 
    parse  : pparse, 
    pparse, 
    generate_computation , 
    parse_to_entities, 
    txt_to_computations, 
    txt_compute, 
    compute, 
    do_computations , 
}
