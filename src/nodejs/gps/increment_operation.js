const {types}    = require("./types.js") 
const {NumericOperation} = require("./numeric_operation.js") 
let vcs = require(process.env.VCS_DEV_LOC)  //get vcs 

class IncrementOperation extends NumericOperation { 

    constructor() { 
	let id = "numeric_operation"  
	let fn = function(result) { 
	    return result[result.length - 1 ] 
	}
	super({id,fn})
    }

}

module.exports = LastOperation 
