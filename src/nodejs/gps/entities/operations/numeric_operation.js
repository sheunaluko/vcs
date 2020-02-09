const {types,js_type}    = require("../types.js") 
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
	    
	    
	    this.log.d("Requesting float type") 
	    let result = await resource.as( { type } ) 
	    
	    this.log.d("Got resource as: ") 	     
	    this.log.d(result) 
	    
	    let res_type = js_type(result)	    
	    this.log.d(`Type of result = ${res_type}`) 
	    
	    this.log.d("Running fn:") 	     	    
	    let value = this.fn(result) 
	    
	    this.log.d(`Got value: ${value}`) 
	    return value 
	    
	} catch (e) { 
	    
	    this.catch_error(e) 

	} 
	
    }
    
}


module.exports = NumericOperation 
