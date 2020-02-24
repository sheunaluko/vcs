import * as res from "./resource"
import * as t from "../types" 



export class NumericResource extends res.Resource {
    
    constructor(ops : t.p.ValueOp){ 
	
	ops.value = Number(ops.value) //convert to number  !
	
	var entity_id     = `numeric_res::${ops.value}` 

	//define the type handlers 
	var type_handlers  : any  = {} 
	type_handlers[t.c.float] = function(){return ops.value} 
	
	// - init object 
	super({entity_id,type_handlers}) 
	this.value = ops.value
	//define default type 
	this.default_type = t.c.float 
    }
}


