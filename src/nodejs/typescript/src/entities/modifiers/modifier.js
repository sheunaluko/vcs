
const {Entity} = require("./entity.js") 
const {types}  = require("./types.js") 

class Modifier extends Entity { 
    
    constructor(ops) { 
	super(ops) 
	
	this.type = types.modifier 
	this.direction = ops.direction || "right" //default direction of modification 
    }
    
}


module.exports = { 
    Modifier , 
}
