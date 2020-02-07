

const {Entity} = require("./entity.js") 
const {types}    = require("./types.js") 

class Operation extends Entity { 
    constructor(ops) { 
	super(ops) 
	
	this.type = types.operation 
    }
    
}


module.exports = { 
    Operation 
}
