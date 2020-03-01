
//Thu Mar 28 18:50:56 PDT 2019
//common server side module output 


// !! Note that the vcs_ws_server file imports this and then assigns the websocket object 



const log  = require("./logger.js").get_logger("main_output")
var params = require("./vcs_params.js").params 

//note exports.broadcast is set by vcs_ws_server file (circular dep) 

exports.send = function(msg) {  
    let {type,payload,id} = msg 
    log.d(`Sending message of type: ${type} from id ${id}`)
    log.d("The payload looks like: " )
    log.d(payload)
    exports.emit_to_clients(msg)  
}

exports.unrecognized_input = function() { 
    let type = 'unrecognized_input'
    log.d("Sending:: " + type)
    exports.emit_to_clients({type}) 
}

exports.command_result = function(msg) {   
    let {payload,id} = msg 
    msg.type = "command_result" 
    log.d("Got command result from id " + id ) 
    log.d("Payload looks like: ") 
    log.d(payload) 
    log.d("Sending it") 
    exports.emit_to_clients(msg) 
    
}


//fix python PARAM PAYLOAD instead of data 