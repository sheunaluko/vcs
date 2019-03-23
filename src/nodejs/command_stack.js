//Sun Mar 10 12:58:50 PDT 2019
//command stack class implementation 
var state = require("./vcs_state.js") 
var channel = require("./channel.js") 

class command_stack { 
    
    constructor() { 
	this.log  = require("./logger.js").get_logger("stack_" + state.unique_id())
	this.stack  = [] 
	this.sink = new channel.channel() 
	this.on_sink = function(i) { 
	    this.log.i("Sink:")
	    this.log.i(i)
	}
	
	//start the sink loop (catches the last result handles it) !
	this.sink_loop() 
	

    }
    
    /* methods */ 
    
    push(cmd) { 
	this.stack.push(cmd)
	this.log.d("Pushed cmd: " + cmd.instance_id)
    }
    pop () { 
	let cmd = this.stack.pop()
	this.log.d("Popped cmd: " + cmd.instance_id)
    }	
    
    on_sink(f) { 
	this.on_sink = f
    }
    
    empty() { 
	return  (this.stack.length == 0 ) 
    }
    
    current() { 
	return this.stack.slice(-1)[0] 
    } 
    
    async sink_loop() { 
	let msg  ; 
	while (msg = await this.sink.shift() ) { 
	    this.on_sink(msg)    
	}
    }
    
    
    
}

module.exports = command_stack
