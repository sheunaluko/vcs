
/* 
 The base should really be a mapping from strings to ENTITY types 
 (i.e. modifiers, resources, and operations) 
 */ 


const ii = require("./interpreter_interface.js") 


class Resolver { 
    
    constructor() { 

    } 
    
    resolve({text}) { 
	let val = ii.parse(text) 
	if (val) { 
	    return val 
	} else { 
	    return null 
	}
    }
    
}



module.exports =  { 
    Resolver , 
} 
    
