import * as res from "./resource"
import * as types from "../types" 

/* wrapper for result after a computation has been performed */ 

interface ResultOp extends res.ResourceOp { 
    value : any 
}

export class Result extends res.Resource  { 
    
    value : any 
    
    constructor(ops : ResultOp) { 

	let entity_id = "result_resource" 
	if (!ops.entity_id) { ops.entity_id = entity_id} 
	
	super(ops) 

	this.value = ops.value 
	
	//now we determine what the type of the value is, and we set the type handler 
	let tp = types.js_type(ops.value)  
	this.type_handlers[tp] =  function() { return ops.value }

    }
    
    
}


