//Fri Jul 26 18:36:38 PDT 2019
let vcs = require(process.env.VCS_DEV_LOC)
let ir  = require("./deps/interpreter_rules.js") 

let id = "interpreter"

class interpreter extends vcs.base_command { 
    constructor(config) { 
	var initial_state = { 'items' : [] } 
	super({id, initial_state})
    }
    //all commands have a static method returning their info (used for initialization)
    static get_info() { 
	return {
	    id    : id , 
	    rules : [ "?(start|launch) interpreter" ],
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
	    let {out , result }  = this.parse(text)
	    switch (out) { 
	    case 'emit' : 
		this.emit(result.toString()) 
		break; 
	    default : 
		this.log.i("Got result: ") 
		this.log.i(result) 
	    }
	}
	//input channel has been closed 
	this.finish({result : "OK" } )
    } 
    
    //define interpreter parsing function here     
    parse(text) { 
	return rule_matcher(text)
    } 

}
module.exports = interpreter 


function rule_matcher(text) { 
    let out = 'emit'     
    let result = ir.handle_text(text)    
    return {out,result}     
} 

function speller(text) { 
    let out = 'emit' 
    let word = iu.nato_parser(text) 
    this.log.i(word) 
    let result = "you spelled: " + word 
    return {out,result} 
} 
