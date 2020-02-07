

const log = require("../logger.js").get_logger("ccgen") 
const {res,types} = require("./entities/index.js") 

/*
  An Computation consits of  
  Action 
  Argument 
  
  An action consists of an operation with any associate modifiers 
  An arugument consists of a Resource with any associated modifiers 
  
  
*/

class Action { 
    constructor({operation,modifiers}) { 
	this.operation = operation
	this.modifiers = modifiers || [] 
	this.type = types.action 
    }
    
    async resolve() {
	//return NEW OPERATION 
	return this.operation 
    }

}

class Argument { 
    constructor({resources,modifiers}={}) { 
	this.resources = resources || [] 
	this.modifiers = modifiers || []
	this.type = types.argument  	
    }
    
    async resolve() {
	//return NEW RESOURCE 	
	return this.resources 
    }
}



class Computation { 
    constructor({action , argument}={}) { 
	this.action = action
	this.argument = argument   || new Argument() //create blank one 
    }
    
    async run() {
	/* this actually runs the computation */ 
	
	//NOTE -- if there is NO action associated then we just return the resource 
	var result  
	
	if (! this.action ) { 
	    log.i("No action so returning args") 
	    result =  await this.argument.resolve() 
	    
	} else { 
	    log.i("Running comp") 

	    //IF NOT THEN WE RUN 
	    let resources = await this.argument.resolve() 
	    let operation = await this.action.resolve() 
	    
	    let value = await operation.run({resources}) 
	    
	    //wrap result into an Result (resource) entity 
	    result = new res.Result( {value} )
	}
	
	
	return result 
	
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


//function for executing computation chain 
async function do_computations(computations) { 
    var result ; 
    var i  = 0 
    
    var curr_comp = computations.shift() 
    var next_comp = computations.shift() 
    
    log.d("Running computation : " + i++)     
    var curr_res  = await curr_comp.run() 
    
    //curr_res can EITHER be a RESOURCE OR an ARRAY of RESOURCES 
    
    log.d("Got result: ") 
    log.d(curr_res) 
    
    while(next_comp) { 
	
	//there is a next computation, so we append result to its arguments  
	log.d("Adding result to next computations arguments") 	
	if (curr_res.constructor == Array) { 
	    log.d("Adding array els")
	    curr_res.map((r)=> {
		next_comp.argument.resources.push(r)	    	    
	    })
	} else { 
	    log.d("Adding single el") 
	    next_comp.argument.resources.append(curr_res)	    
	}


	//now we rearrange the pointers 
	curr_comp = next_comp 
	next_comp = computations.shift() 
	
	log.d("Running computation : " + i++)     
	curr_res  = await curr_comp.run() 
    
	log.d("Got result: ") 
	log.d(curr_res) 
	
    }
    
    //curr_res will contain the final result 
    return curr_res 
}



module.exports = { 
    Action, 
    Argument, 
    Computation, 
    generate_computation , 
    do_computations , 
}
