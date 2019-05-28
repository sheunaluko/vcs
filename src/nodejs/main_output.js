//Thu Mar 28 18:50:56 PDT 2019
//common server side module output 

const log         = require("./logger.js").get_logger("main_output")
var params = require("./vcs_params.js").params 

exports.send = function(text) { 
    let type = 'output'
    let msg  = {text, type }
    log.d("Sending:: " + text + "\n\n")
    exports.ws.send(JSON.stringify(msg))
}

exports.unrecognized_input = function() { 
    exports.send( params.feedback_indicator + "unrecognized")
}

exports.command_result = function(result) { 
    let type = 'command_result'
    let msg  = {type,result}
    log.d("Sending result:: " + result + "\n\n")
    exports.ws.send(JSON.stringify(msg))
    
}
