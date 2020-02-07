const {types}    = require("./types.js") 
const {Operation} = require("./operation.js") 
let vcs = require(process.env.VCS_DEV_LOC)  //get vcs 

class ArrayOperation extends Operation { 
    
    constructor({fn,id="array_operation"}) { 
	
	let entity_id = id 
	if (!fn) { throw("Please provide fn") } 
	super({entity_id}) 
	
	this.fn = fn 
    }

    
    async run({resources,resource}) { 
	//this operation is performed on some resource 
	//it will default to retrieving the resource as an array 
	
	//defaults to only acept 1 arg 
	if (!resource) {
	    resource = resources[0] 
	} 
	
	try {  
	    
	    let type = types.array
	    let result = await resource.as( { type } ) 
	    let value = this.fn(result) 
	    
	    this.log.d(`Got value: ${value}`) 
	    return value 
	    
	} catch (e) { 
	    
	    this.catch_error(e) 
	    
	} 
	
    }
    
}


module.exports = ArrayOperation 
