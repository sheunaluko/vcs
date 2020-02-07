const {Entity} = require("../entity.js") 
const {types}  = require("../types.js") 

class Resource extends Entity { 
    constructor(ops) { 
	super(ops) 
	
	this.type = types.resource 
	this.type_handlers = {} 
    }
    
    supported_types() { 
	return new Set(Object.keys(this.type_handlers))
    }
    
    async as({type}) { 
	let fn = this.type_handlers[type] ; 
	if (fn) {
	    try { 
		let result = await (fn.bind(this))() 
		return result 
	    } catch (e) { 
		this.catch_error(e) 
	    }
	} else { return null } 
    }    
  
}


module.exports = { 
    Resource 
}
