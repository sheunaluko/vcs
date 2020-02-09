const {types}    = require("../types.js") 
const {Resource} = require("./resource.js") 
let vcs = require(process.env.VCS_DEV_LOC)  //get vcs 

class NumericResource extends Resource {
    
    constructor(ops){ 
	if (!ops.value) { throw("Need value") } 

	ops.value = Number(ops.value) //convert to number  !
	
	var entity_id     = `numeric_res::${ops.value}` 

	//define the type handlers 
	var type_handlers = {} 
	type_handlers[types.float] = function(){return ops.value} 
	
	// - init object 
	super({entity_id,type_handlers}) 
	this.value = ops.value
	//define default type 
	this.default_type = types.float 
    }
}


module.exports = NumericResource 

