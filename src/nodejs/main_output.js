//Thu Mar 28 18:50:56 PDT 2019
//common server side module output 

const log         = require("./logger.js").get_logger("main_output")

exports.send = function(text) { 
    let type = 'output'
    let msg  = {text, type }
    log.d("Sending:: " + text)
    exports.ws.send(JSON.stringify(msg))
}

exports.unrecognized_input = function() { 
    let type = 'unrecognized_input'
    let msg  = {type}
    log.d("Sending:: " + type)
    exports.ws.send(JSON.stringify(msg))
}

exports.command_result = function(result) { 
    let type = 'command_result'
    let msg  = {type,result}
    log.d("Sending result:: " + result)
    exports.ws.send(JSON.stringify(msg))
    
}
