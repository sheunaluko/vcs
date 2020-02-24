const ArrayOperation = require("./array_operation.js") 

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
