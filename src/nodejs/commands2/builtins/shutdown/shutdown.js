//Tue Aug 13 19:14:54 PDT 2019

let vcs = require(process.env.VCS_DEV_LOC)
let id = "shutdown"

class shutdown extends vcs.base_command { 
    
    constructor(config) { 
	
	var initial_state = { 'status' : "launched" } 

	super({id, initial_state})

    }
    
    //all commands have a static method returning their info (used for initialization)
    static get_info() { 
	return {
	    id    : id , 
	    rules : [ "shutdown" , "shut down" , "exit program", "goodbye"], 
	}
    } 
    
    //all commands must implement the async run method
    async run() { 

	while(true ) {
	    
	    switch (this.state.value.status) { 
	    case  "launched" : 
		this.emit("Confirm shutdown") 
		this.state.update(['status'], x=>"confirming")
		break 
		
	    case "confirming" : 
		let text = await this.get_input() 
		if (text == "yes") {
		    this.emit("Exiting Program")
		    setTimeout( (function() { this.feedback("shutdown") }).bind(this) , 1000)
		    setTimeout( function() { process.exit(1) } , 2500 )
		} else if (text == "cancel") { 
		    this.emit("Canceling program shutdown") 
		    this.state.update(['status'] , ()=>"aborting")
		    break
		} else {
		    this.emit("Please say yes to shutdown, or cancel to abort") 
		}
		
	    default: 
		break //from the loop 
	    }

	}
	//input channel has been closed 
	this.finish({payload : {result : "OK" } }) 
    } 
    

}

module.exports = shutdown
  
