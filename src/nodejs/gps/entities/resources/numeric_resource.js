const {types}    = require("../types.js") 
const {Resource} = require("./resource.js") 
let vcs = require(process.env.VCS_DEV_LOC)  //get vcs 

class NumericResource extends Resource {
    
    constructor(ops){ 
	if (!ops.value) { throw("Need value") } 

	var entity_id     = `Numeric::${ops.value}` 
	    
	// - init object 
	super({entity_id}) 
	
	this.value = ops.value
	
	//define the type handlers 
	this.type_handlers = {} 
	this.type_handlers[types.float] = function(){return ops.value} 
	
	//define default type 
	this.default_type = types.float 
    }
}


module.exports = NumericResource 

