
const {types} = require("./types.js") 
const log = require("../logger.js").get_logger("ccgen") 

/*
  An Computation consits of  
  Action 
  Argument 
  
  An action consists of an operation with any associate modifiers 
  An arugument consists of a Resource with any associated modifiers 
  
  await Argument.resolve() will be responsible for applying modifiers and returning modifier 
  same for action 
  
*/

class Action { 
    constructor({operation,modifiers}) { 
	this.operation = operation
	this.modifiers = modifiers || [] 
	this.type = types.action 
    }
    
    resolve() {
    }

}

class Argument { 
    constructor({resources,modifiers}) { 
	this.resources = resources
	this.modifiers = modifiers || []
	this.type = types.argument  	
    }
    
    resolve() {
    }
}



class Computation { 
    constructor({action , argument}={}) { 
	this.action = action
	this.argument = argument  
    }
    
    run() {
	
    }
}




function generate_computation(entity_array) { 
    
    log.d("Generating computation from entity array") 

    //init the computation 
    var computation = new Computation() 
    
    var curr_computation = null 
    var last_computation = null 
    
    var curr_unit = null 
    var last_unit = null 
    
    var curr_ent = null //"current entity" 
    var last_ent = null // 
    
    var pending_modifiers = null 
    
    while(entity_array.length) {
	
	curr_ent = entity_array.shift() 
	
	//two key switches (1 - is curr_unit init) (2 - what is type of curr_unit) 
	
	if (curr_unit == null) {
	    
	    log.d("Curr unit NOT inited") 

	    switch (curr_ent.type) { 
		
	    case types.resource : 
		var resources = [curr_ent]
		var modifiers  = pending_modifiers || null 
		computation.argument = new Argument({resources,modifiers})
		log.d("Set curr_unit to Argument") 
		curr_unit = computation.argument 
		break 
		
	    case types.operation : 
		var operation = curr_ent 
		var modifiers  = pending_modifiers || null 
		computation.action = new Action({operation,modifiers})
		log.d("Set curr_unit to Action ") 
		curr_unit = computation.action 		 
		break 
		
	    case types.modifier : 
		pending_modifiers = [curr_ent]
		log.d("Set pending modifiers") 
		break 
		
	    }
	    
	    //remove any pending modifier 
	    pending_modifiers = null 
	    
	} else { 
	    
	    log.d("Curr unit inited") 	    
	    
	    //lets check what type of unit is being edited 
	    if (curr_unit.type == types.action) { 
		
		log.d("Editing an action") 
		//ok so we are currently editing an action 
		switch (curr_ent.type) {
		// FOUND RESOURCE 
		case types.resource : 
		    //and came across a resource 
		    //we can assume this is the argument for the aforementioned action 
		    var resources = [curr_ent] 
		    var modifiers  = pending_modifiers || null 		    
		    computation.argument  = new Argument({resources,modifiers})
		    log.d("Set curr_unit to Argument") 
		    curr_unit = computation.argument 		    
		    break 
		// FOUND OP		    
		case types.operation : 
		    //and came across an operation 		    
		    //SHOULD NOT HAVE TWO OPERATIONS IN A ROW (for now!) 
		    throw("Got two ops in a row") 
		    break 
		// FOUND MOD 		    
		case types.modifier : 
		    //and came across a modifier 	
		    //check which way it modifies 
		    switch (curr_ent.direction) { 
		    case "right" : 
			pending_modifiers = [curr_ent]
			log.d("Set pending modifiers")
			break 
		    case "left" : 
			//in this case we append it to the modifiers of the curr_unit 
			log.d("Appending modifier") 
			curr_unit.modifiers.append(curr_ent)
			break 
		    default : 
			throw("unrecognized modifier direction") 
			break
		    }
		    break 
		}
		
	    } 
	    
	    else if (curr_unit.type == types.argument ) {

		log.d("Editing an argument") 		
		//ok so we are currently editing an argument  		
		
		switch (curr_ent.type) {
		// FOUND RESOURCE 		    
		case types.resource : 
		    //and came across a resource 
		    //so we concat the resource to the argument 
		    log.d("concating resource") 
		    curr_unit.resources.append(curr_ent) 
		    if (pending_modifiers) { 
			curr_unit.modifiers.concat(pending_modifiers)
			log.d("Concated pending modifiers")
		    }
		    break 
		// FOUND OP
		case types.operation : 
		    //and came across an operation 		    
		    //so we .... 
		    throw("cannnot have operation after resource") 
		    break 
		// FOUND MOD
		case types.modifier : 
		    //and came across a modifier 
		    //check which way it modifies
		    switch (curr_ent.direction) { 
		    case "right" : 
			pending_modifiers = [curr_ent]
			log.d("Set pending modifiers") 		    
			break 
		    case "left" : 
			//in this case we append it to the modifiers of the curr_unit 
			log.d("Appending modifier") 
			curr_unit.modifiers.append(curr_ent)
			break 
		    default : 
			throw("unrecognized modifier direction") 
		    }
		    break 
		}
		
	    } 
	    
	    else { 
		throw("Unrecongized current unit") 
	    }
	    
	    //remove any pending modifier 
	    pending_modifiers = null 
	}	    
	
	last_ent = curr_ent  
	
    }

    //reverse the comp chain and return it 
    return computation
    
}


module.exports = { 
    Action, 
    Argument, 
    Computation, 
    generate_computation 
}
