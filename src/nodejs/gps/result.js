
const {Resource} = require("./resource.js") 
const {types}    = require("./types.js")


/* wrapper for result after a computation has been performed */ 
class Result extends Resource  { 
    constructor(ops) { 

	let entity_id = "result_resource" 
	if (!ops.entity_id) { ops.entity_id = entity_id} 
	
	super(ops) 
	
	if (!ops.value) { throw("value reqd when creating result entity") }
	this.value = ops.value 
	
	//now we determine what the type of the value is, and we set the type handler 
	let type = types.js_type(ops.value) 
	this.type_handlers[type] = async function() { return ops.value }
    }
}


module.exports = { 
    Result 
}
