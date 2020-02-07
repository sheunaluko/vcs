const {types}    = require("./types.js") 
const {ArrayOperation} = require("./array_operation.js") 
let vcs = require(process.env.VCS_DEV_LOC)  //get vcs 

class LastOperation extends ArrayOperation { 

    constructor() { 
	let id = "last_operation"  
	let fn = function(result) { 
	    return result[result.length - 1 ] 
	}
	super({id,fn})
    }

}

module.exports = LastOperation 
