
//Thu Mar 28 18:50:56 PDT 2019
//common server side module output 


// !! Note that the vcs_ws_server file imports this and then assigns the websocket object 



const log         = require("./logger.js").get_logger("main_output")
var params = require("./vcs_params.js").params 

//note exports.broadcast is set by vcs_ws_server file (circular dep) 

exports.send = function(text) { 
    let type = 'output'
    let msg  = {text, type }
    log.d("Sending:: " + text + "\n\n")
    exports.emit_to_clients(msg) 
}

exports.unrecognized_input = function() { 

    let type = 'unrecognized_input'
    log.d("Sending:: " + type)
    exports.emit_to_clients({type}) 
    //exports.emit_to_clients(params.feedback_indicator + "unrecognized")
}

exports.command_result = function(result) { 
    let type = 'command_result'
    let msg  = {type,result}
    log.d("Sending result:: " + result + "\n\n")
    exports.emit_to_clients(msg)
    
}
