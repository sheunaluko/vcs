//Fri May  3 17:37:22 PDT 2019
let vcs = require("../vcs.js")
let id = "new_alias"

class append2file extends vcs.base_command { 
    
    constructor(config) { 
	super({id})
    }
    
    //all commands have a static method returning their info (used for initialization)
    static get_info() { 
	return {
	    id    : id , 
	    rules : [ "?(create|make) ?(new) alias ?(please)", 
		    ],
	    vars     : { "input" : { default_value : false , 
				     query         : "What is the input?", 
				     filter        : null } , 
			 "output" : { default_value : false , 
				     query         : "What is the output?", 
				      filter        : null }} 			 
	}
    } 
    
    //all commands must implement the async run method
    async run() { 
	//loop read from the input channel 
	while(true ) {
	    
	}
	//input channel has been closed 
	this.finish({payload : {result : "OK"}}) 
    } 
    
    //convenice function for appending (used above) 
    append(text) { 
	let fname = vcs.info.resource_dir + this.args.fname
	this.log.i("Appending the following to file: " + fname) 
	this.log.i(text) 
	fs.appendFileSync(fname, text + "\n") 
    }
    
}


module.exports = append2file 
  
