const {Entity} = require("../entity.js") 
const {types, js_type}  = require("../types.js") 

class Resource extends Entity { 
    constructor(ops) { 
	super(ops) 
	
	this.type = types.resource 
	this.type_handlers = ops.type_handlers || {} 
    }
    
    supported_types() { 
	return new Set(Object.keys(this.type_handlers))
    }
    
    
    async as({type}) { 
	
	this.log.d("Request to resolve resource to type: " + type ) 
	
	let fn = this.type_handlers[type] ; 
	
	this.log.d("Available type handler keys! ") 
	this.log.d(Object.keys(this.type_handlers))
	
	if (fn) {
	    try { 
		var result = await (fn.bind(this))() 
		//here we should actually coerce the type 
		//in case the provided function failed 
		switch (type ) { 
		case types.string : 
		    this.log.d("Want string") 		    
		    if (! result.constructor == String ) { 
			this.log.d("Coercing to string") 
			result = String(result) 
		    }
		    
		    break 
		case types.float : 
		    this.log.d("Want float") 	
	    	    console.log(result.constructor) 
		    
		    process.debug = result 

		    if (! (result.constructor == Number) ) { 
			this.log.d("Coercing to float") 
			result = Number(result) 
		    } else { 
			this.log.d("Not coercing: ") 	     
			this.log.d(`Because Type of result = ${js_type(result)}`) 
		    }
		    break 
		    
		case types.array : 
		    this.log.d("Want array") 		    		    
		    if (! result.constructor == Array ) { 
			this.log.d("Coercing to Array") 
			result = [result] 
		    }
		    break 
		    
		default : 
		    this.log.d("Want unknown") 		    		    
		    this.log.d("Not performing any type conversions") 
		    break 
		}
		
		//this.log.d("Got result as: ") 	     
		this.log.d("Suppressing result (entities > resource.js)")
		//this.log.d(result) 
		this.log.d(`Type of result = ${js_type(result)}`) 

		return result 
		
		
	    } catch (e) { 
		this.catch_error(e) 
		throw(e) 
	    }
	} else { 
	    
	    throw("Unavailable type!") 
	}
    }    
  
}


module.exports = { 
    Resource 
}
