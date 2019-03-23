//Sun Mar 10 13:56:25 PDT 2019
//modified channel implementation (simple wrapper which filters the channels output) 

const Channel = require(`@nodeguy/channel`);
var   filters = require("./filters.js") 

class channel { 
    
    constructor(opts) { 
	opts = opts || {} 
	this.filter = new filters.Filter(opts.filters) 
	this.channel = new Channel() 
    } 

    push(val) { 
	this.channel.push(val) 
	return null
    } 
    
    async shift() { 
	let val = await this.channel.shift() 
	//filter here 
	let ret = this.filter.filter(val) 
	//and return 
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
		sink.push(msg) 
	    } 
	    //if we wanted to close the sink when this channel closes we would uncomment belowa
	    //sink.close()
	}).bind(this)() 
	
	//and return the sink so we can chain channels together 
	return sink 
    }
    

} 



module.exports = {channel}
