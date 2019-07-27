//Sun Jun 30 00:03:19 PDT 2019
let vcs = require("../vcs.js")
let id = "continuous_timer"

class continuous_timer extends vcs.base_command { 
    
    constructor(config) { 
	
	var initial_state = { 'items' : [] } 
	super({id, initial_state})

    }
    
    //all commands have a static method returning their info (used for initialization)
    static get_info() { 
	return {
	    id    : id , 
	    rules : [ "?(start) continuous timer"],
	    vars     : null 
	}
    } 
    
    //all commands must implement the async run method
    async run() { 
	this.emit("Starting continuous timer") 

	var timer = setInterval( (function(){this.emit("15 minutes have elapsed")}).bind(this) , 1000*60*15)

	//loop read from the input channel
	while(true ) {
	    
	    let text = await this.get_input() 
	    if (text == undefined || text == "finished") { break }
	    
	}
	//input channel has been closed
	clearInterval(timer)
	this.emit("Stopping timer") 
	this.finish({result : "OK" } )
    } 
    

}

module.exports = continuous_timer
  
