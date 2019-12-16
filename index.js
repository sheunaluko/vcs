/* 
   Index file for exporting vcs_core as npm package. 
   @copyright Sheun Aluko 2019-20120 , oluwa@stanford.edu | alukosheun@gmail.com 
*/

const log = require('./src/nodejs/logger.js').get_logger("init") 

var express = require('express')
var path = require('path');



// server export
var server = function(opts) { 
    
    log.i("Initializing vcs server") 
    var params = require('./src/nodejs/vcs_params.js').params 

    // the provided opts object gets merged into the vcs parameters 
    for (var k in opts) { 
	log.i("Setting vcs_core param " + k + " to " + opts[k])
	params[k] = opts[k]
    }
    
    // requires 

    var builtins = require("./src/nodejs/commands/builtins.js")
    
    var vcs = require("./src/nodejs/vcs.js") ;  

    log.i("Detected operating system: " + params.os) 
    vcs.add_command_module(builtins) 
    
    // and return the instance 
    return vcs 

}

var base_command = require("./src/nodejs/base_command.js").base_command

class client_wrapper { 
     
    constructor(opts)  { 
	var { port = 8000 } = opts 


	this.port = port 
	this.app = express() 	
    } 

    start() { 
	
	let port = this.port 
	this.app.use(express.static(path.join(__dirname, 'src/client')))
	this.app.listen(port, () => log.i("*** Vcs client initialized. Navigate to http://localhost:" + port + " to connect *** "))
	
    }  

}

var client = function(opts) { 
    return new client_wrapper(opts) 
} 

module.exports = { 
    server, 
    client , 
    base_command , 
    
}
