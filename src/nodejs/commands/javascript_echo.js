//Sun Jun 30 00:03:19 PDT 2019
let vcs = require("../vcs.js")
let id = "javascript_echo"

class javascript_echo extends vcs.base_command { 
    
    constructor(config) { 
	
	var initial_state = { 'items' : [{time : new Date().toISOString(),
					  text : "Echo command initialized"}] } 

	super({id, initial_state})

    }
    
    //all commands have a static method returning their info (used for initialization)
    static get_info() { 
	return {
	    id    : id , 
	    rules : [ "javascript echo"],
	    vars     : null 
	}
    } 
    
    //all commands must implement the async run method
    async run() { 
	this.feedback("continue")	
	//loop read from the input channel 
	while(true ) {
	    
	    let text = await this.get_input() 
	    if (text == undefined || text == "finished") { break }
	    
	    this.emit("You said " + text ) 
	    
	    //update the command state 
	    this.update_state(['items'], function(items) {
		var time = new Date().toISOString()  
		items.push({time, text })
		return items 
	    })

	}
	//input channel has been closed 
	this.finish({result : "OK" } )
    } 
    

}

module.exports = javascript_echo 
  
