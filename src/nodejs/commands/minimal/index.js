let vcs = require("../../vcs.js") 

/* 
   Sun Jun 16 20:23:26 PDT 2019
   
   This file Defines minimal commands: 
     - have rules for triggering 
     - run a single function with arguments 
   
   After the array defining the commands, there 
   is a simple transformer which wraps the commands 
   into a base_command instance, then creates the 
   builtins.minimal module for export 
     
*/ 


let commands = [ 
    
    { id : "are you there" , 
      rules : [ "are you ?(there|listening|here)" , 
		"hello"  ] , 
      fn : (args) => { 
	  return "yes" 
      }
    }, 
    
    { id : "request time" , 
      rules : [ "what time is it ?(please)" , 
		"?(please) tell me the time ?(please)" , 
		"what's the time", 
		"time ?(please)" ]  , 
      fn : (args) => { 
	  let d = new Date() 
	  return (d.getHours() % 12) + ":" + ( d.getMinutes() ) 
      }
    }, 
    
    { query : "am i a loser" , 
      response : "some people may think so, but I dont since you spent so much time making me and I appreciate existing" 
    } , 
    
    { query : "how are you" , 
      response : [ "pretty good" , 
		   "fantastic" , 
		   "been better", 
		   "ask me in 5 minutes", 
		   "well lets just say today was a bit rough", 
		   "my bits are a little disorganized at the moment but im grateful to have sufficient battery life",
		   "come on, you know computers dont have emotions" , 
		   "you should know you made me", 
		   "why do you care" , 
		   "why dont you write a program to find out smart ass" 
		 ] } , 
    
    { query : "do you love me", 
      response : [ "of course i do", 
		   "let me think about that", 
		   "I will love you forever baby" , 
		   "computers do not have the capacity for emotion"] } , 
	  
	  
    
    
		  
	
] 


/* END COMMAND DEFINITIONS HERE */  
/* ---------------------------- */ 

/* define function for transforming minimal command into full command
   See module.exports.bundle below for how its used 
 */ 
function transform_minimal(min) { 
    var {id, rules, fn, vars , query, response  } = min 
    
    if (query && response ) { 
	id = query 
	rules  = [ query ] 
	
	if (typeof(response) == 'object') { 
	    //an array  (return rand nth) 
	    fn = ()=> { return response[Math.floor(Math.random() * response.length)] }
	} else { 
	    //assume a string 
	    fn = () => { return response }
	}
    }
    
    /* dynamically create the cmd class */
    class cmd extends vcs.base_command { 
	constructor(config) {
	    super({id}) 
	}
	
	static get_info() { 
	    return { 
		id , rules , vars 
	    }
	}
	
	async run() { 
	    this.log.i("Running minimal command") 
	    this.emit( fn() ) 
	    this.finish( { result : vcs.params.escape_indicator + "quiet" } ) 
	}
    }
    
    /* return the class */ 
    return cmd 
}
   
/* and finally will create the bundle buy mapping the transform accross the cmds */ 
module.exports = { 
    module : "builins.minimal"  , 
    bundle : commands.map(transform_minimal) 
}
