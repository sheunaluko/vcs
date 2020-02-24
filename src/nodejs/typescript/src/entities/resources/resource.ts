import * as entity  from "../entity"
import * as t from "../types" 


export interface ResourceOp extends entity.EntityOpts { 
    type_handlers? : any , 
}


export class Resource extends entity.Entity { 
    
	type : t.c
	
    
    constructor(ops : ResourceOp) { 
	super(ops) 
	
	this.type = t.c.resource 
	this.type_handlers = ops.type_handlers || {} 
    }
    
    supported_types() { 
	return new Set(Object.keys(this.type_handlers))
    }
    
    
    async as(tp : t.c) { 
	
	this.log.d("Request to resolve resource to type: " + tp ) 
	
	let fn = this.type_handlers[tp] ; 
	
	this.log.d("Available type handler keys! ") 
	this.log.d(Object.keys(this.type_handlers))
	
	if (fn) {
	    try { 
		var result = await (fn.bind(this))() 
		//here we should actually coerce the type 
		//in case the provided function failed 
		switch (tp ) { 
		case t.c.string : 
		    this.log.d("Want string") 		    
			if (! (result.constructor == String) ) { 
			this.log.d("Coercing to string") 
			result = String(result) 
		    }
		    
		    break 
		case t.c.float : 
		    this.log.d("Want float") 	
	    	    //console.log(result.constructor) 
		    
		    //process.debug = result 

		    if (! (result.constructor == Number) ) { 
			this.log.d("Coercing to float") 
			result = Number(result) 
		    } else { 
			this.log.d("Not coercing: ") 	     
			this.log.d(`Because Type of result = ${t.js_type(result)}`) 
		    }
		    break 
		    
		case t.c.array : 
		    this.log.d("Want array") 		    		    
			if (! (result.constructor == Array) ) { 
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
		this.log.d(`Type of result = ${t.js_type(result)}`) 

		return result 
		
		
	    } catch (e ) { 
		this.catch_error(e) 
		throw(e) 
	    }
	} else { 
	    
	    throw("Unavailable type!") 
	}
    }    
  
}

