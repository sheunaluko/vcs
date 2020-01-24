//Sun Mar  3 16:27:51 PST 2019
//common server side module for tts 


//note exports.broadcast is set by vcs_ws_server file (circular dep)  


exports.speak = function(text) { 
    let type = 'speak'
    let msg  = {text, type }
    exports.broadcast(msg) 
}

