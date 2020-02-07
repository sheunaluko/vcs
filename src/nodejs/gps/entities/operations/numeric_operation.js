const {types}    = require("../types.js") 
const {Operation} = require("./operation.js") 

class NumericOperation extends Operation { 
    
    constructor({fn,id="numeric_operation"}) { 
	
	let entity_id = id 
	if (!fn) { throw("Please provide fn") } 
	super({entity_id}) 
	
	this.fn = fn 
    }

    
    async run({resources,resource}) { 
	//this operation is performed on some resource 
	//it will default to retrieving the resource as types.float
	
	//defaults to only acept 1 arg 
	if (!resource) {
	    resource = resources[0] 
	} 
	
	try {  
	    
	    let type = types.float 
	    
	    this.log("Requesting float type") 
	    let result = await resource.as( { type } ) 
	    let value = this.fn(result) 
	    
	    this.log.d(`Got value: ${value}`) 
	    return value 
	    
	} catch (e) { 
	    
	    this.catch_error(e) 
	    
	} 
	
    }
    
}


module.exports = NumericOperation 
