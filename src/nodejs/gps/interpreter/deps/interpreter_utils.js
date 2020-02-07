//Fri Jul 26 18:41:47 PDT 2019
let nato = require("./nato.js").nato 
let util = require("@sheunaluko/node_utils")
const log = require(process.env.VCS_DEV_DIR + "/logger.js").get_logger("interpreter_utils")

function tokenized_dictionary_replacer(opts) { 
    let {text, dictionary, splitter, joiner} =  opts  
    //define the mapper function 
    let mapper = function(token) { 
	if (dictionary[token]) { 
	    return dictionary[token]
	} else { 
	    return token 
	} 
    }
    //map fn accross tokens and join them 
    return text.split(splitter).map(mapper).join(joiner) 
}

function nato_parser(text) { 
    return tokenized_dictionary_replacer(
	    {text : text, 
	     dictionary: nato  , 
	     splitter: " ", 
	     joiner: ""}
    )
}


function variable_value_parser(text) { 
    //determines the appropriate parser and dispatches it 
    if (util.has_arithmetic(text)) { 
	log.i("Value is arithmatic expression") 
	result = numerical_expression_parser(text)
    } else  { 
	log.i("Value is string")
	result = text 
    }
    return result 
}

function numerical_expression_parser(text) { 
    let result = util.safe_eval(text) 
    return result 
}

module.exports = { 
    nato,
    tokenized_dictionary_replacer, 
    nato_parser ,
    variable_value_parser ,
}

