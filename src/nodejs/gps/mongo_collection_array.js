
const {types}    = require("./types.js") 
const {Resource} = require("./resource.js") 

class MongoCollectionArray extends Resource {
    
    constructor(ops){ 
	
	super({}) 
	
	
	
	//define the type handlers 
	this.type_handlers = { 
	    types.array : this.as_array 
	}
    }
    
    
    as({type}) {
	let fn = this.type_handlers[type] ; 
	if (fn) { return fn } else { return null } 
    }
    
    async as_array() {
	
    }
    
    
}
