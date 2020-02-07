const {Resolver} = require("./resolver.js")

var log = console.log

class Parser { 
    
    constructor() { 
	/* params */ 
	this.splitter = " " 
	this.pipe     = " and " 
	
	this.action_tree = []  //action tree is EITHER [ OP , ENT ] OR [ OP ] OR  [ ENT ] 
	
	//I think it makes sense to resolve the objects from left to right , 
	//then to actually run them from right to left... 
	//lets see If I can just resolve from left to right 
	
	this.entity_array = [] 
	this.resolver  = new Resolver() 
    }
    
    /* parsing occurs starting from the left to right and will be done recursively? */ 
    /* assumes initial call will be text_to_array({text : blah}) */ 
    text_to_array({text,tokens,entity_array}){ 
	
	console.log("Call with args") 
	console.log(JSON.stringify({ 
	    text, tokens, entity_array 
	}))
	    
	
	
	if (!tokens) { 
	    //this is the initial run
	    tokens = text.split(this.splitter)  
	    this.entity_array  = [] 
	}
	
	//base case 
	if (tokens.length < 1) { 
	    this.entity_array = entity_array 
	    return entity_array
	} 

	//loop from left to right until we find a match 
	for (var i=1;i<tokens.length+1;i++) { 
	    
	    //console.log(`i=${i}`)

	    let to_try  = tokens.slice(0,i).join(this.splitter) 
	    
	    log("tokens: ") 
	    log(tokens) 
	    log(`[${i}]trying ${to_try}`) 	    
	    let entity  = this.resolver.resolve({text : to_try}) 
	    
	    log("Got result") 
	    log(entity) 
	    
	    if (entity) { 
		
		log("Found match!") 
		
		//found a match, so we add it to the resolution array
		if (!entity_array) { 
		    entity_array = [entity]
		} else {
		    entity_array.push(entity) 
		}
		
		//and then we recurse on the rest 
		let rest  = tokens.slice(i) 
		return this.text_to_array( { tokens : rest, entity_array }) 
		
	    } else {
		
		//no match was found, so we 
		
	    }
		
	}
	
    } 
    
    /*   
       parse 	 
     */ 
    parse(text) { 
	let computations = text.split(this.pipe) 
	return computations.map(c=> this.text_to_array({text: c}))
    }
    
}


module.exports = Parser 
