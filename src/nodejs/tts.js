//Sun Mar  3 16:27:51 PST 2019
//common server side module for tts 

exports.speak = function(text) { 
    let type = 'speak'
    let msg  = {text, type }
    exports.ws.send(JSON.stringify(msg)) 
}

