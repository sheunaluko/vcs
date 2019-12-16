//Sun Mar 10 13:23:14 PDT 2019
var fs = require('fs');


let vcs = require(process.env.VCS_DEV_LOC) 

let id = "append2file"


class append2file extends vcs.base_command { 
    
    constructor(config) { 
	super({id})
    }
    
    //all commands have a static method returning their info (used for initialization)
    static get_info() { 
	return {
	    id    : id , 
	    rules : [ "?(please) append to file ?([[fname]])" , 
		      "?(please) start appending to file ?([[fname]])" , 
		      "append"  ] , 
	    vars     : { "fname" : { default_value : false , 
				     query         : "What is the file name?", 
				     filter        : null } }
	}
    } 
    
    //all commands must implement the async run method
    async run() { 
	//loop read from the input channel 
	while(true ) {
	    this.feedback("continue")
	    let text = await this.get_input() 
	    if (text == undefined || text == "finished") { break }
	    this.append(text) 
	}
	//input channel has been closed 
	this.finish({result : "OK"}) 
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
  
