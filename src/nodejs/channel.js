//Sun Mar 10 13:56:25 PDT 2019
//modified channel implementation (simple wrapper which filters the channels output) 

const Channel = require(`@nodeguy/channel`);
var   filters = require("./filters.js") 

class channel { 
    
    constructor(opts) { 
	opts = opts || {} 
	this.filter = new filters.Filter(opts.filters) 
	this.channel = new Channel() 
	this.cmd_ref = opts.cmd_ref
	this.connected_sink = null
	this.type = opts.type 
	this.debug = false 
	
	var log_name 
	if (this.cmd_ref) { 
	    log_name = "chan_" + this.type + "(" + this.cmd_ref.instance_id + ")"
	} else { 
	    log_name = "chan(?)"
	}
	
	this.logger = require("./logger.js").get_logger(log_name) 
	this.log = { 'i' : function(msg) { 
	    if (this.debug) { 
		this.logger.i(msg)
		
	    }
	}}

	
	
    } 

    async push(val) { 
	this.log.i("Routing activity at push port:")
	if (this.debug) {
	    console.log(val) 
	}
	await this.channel.push(val)  //omitted await at first
	return null 
    } 
    
    async shift() { 
	let val = await this.channel.shift() 
	//filter here 
	let ret = this.filter.filter(val) 
	//update the cmd_ref if it exists 
	if (!this.cmd_ref == null ) { 
	    this.cmd_ref.input_counter += 1 
	} 
	//and return (after which the command will actually process the value) 
	return ret  
    } 
    
    close() { 
	this.channel.close() 
    } 
    
    //connect one channel to another 
    //when the source channel closes then the other is automatically closed
    connect(sink) { 
	(async function() {
	    var msg
	    while( (msg = await this.shift()) != undefined ) { 
		//channel is giving us messages 
		//will push them to the sink
		this.log.i("Relaying msg:")
		if (this.debug) { 
		    console.log(msg)
		}
		sink.push(msg) 
	    } 
	    this.log.i("Connection destroyed")
	    //if we wanted to close the sink when this channel closes we would uncomment belowa
	    //sink.close()
	}).bind(this)() 
	
	//and return the sink so we can chain channels together 
	this.connected_sink = sink
	return sink 
    }
    
} 



module.exports = {channel}
