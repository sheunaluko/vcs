//Sun Mar 10 13:23:14 PDT 2019
let vcs = require("../vcs.js")
let aliases = require("../aliases.js") 
let id = "reload_alias"

class cmd extends vcs.base_command { 
    
    constructor(config) { 
	super({id})
    }
    
    //all commands have a static method returning their info (used for initialization)
    static get_info() { 
	return {
	    id    : id , 
	    rules : [ "reload alias ?(file)", 
		      "reload aliases ?(file)" ],
	    vars     : null 
	}
    } 

	//all commands must implement the async run method
    async run() { 
	let result = await aliases.load_aliases()
	this.finish({result : "OK"}) 
    } 
    
    
}

module.exports = cmd 
  

