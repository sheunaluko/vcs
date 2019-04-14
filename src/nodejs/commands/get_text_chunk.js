//Thu Mar 28 17:17:12 PDT 2019
let vcs = require("../vcs.js")
let id = "get_text_chunk"

class get_text_chunk extends vcs.base_command { 
    
    constructor(config) { 
	super({id})
	
	//initialize the container for text chunks
	this.chunks = [] 
    }
    
    //all commands have a static method returning their info (used for initialization)
    static get_info() { 
	return {
	    id    : id , 
	    rules : [ "get text chunk"],
	    vars     : null 
	}
    } 
    
    //all commands must implement the async run method
    async run() { 
	//loop read from the input channel 
	while(true ) {
	    if (this.input_counter == 1) {
		let msg = this.args.init_msg || "Ready for text" 
		this.emit(msg) 
	    } else { 
		let msg = this.args.continue_msg || "OK"
		this.emit(msg) 
	    }

	    let text = await this.input.shift() 
	    if (text == undefined || text == "finished") { break }
	    this.chunks.push(text) 
	}
	//input channel has been closed 
	this.finish({result : this.chunks.join(this.args.joiner || "\n")})
    } 
    

}

module.exports = get_text_chunk
  
