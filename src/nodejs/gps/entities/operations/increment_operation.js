const NumericOperation = require("./numeric_operation.js") 

class IncrementOperation extends NumericOperation { 

    constructor({value}) { 
	
	let id = "increment_operation"  
	let fn = function(val) { 
	    return val + float(value)
	}
	super({id,fn})
    }

}

module.exports = IncrementOperation 
