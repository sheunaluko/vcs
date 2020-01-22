


var log  = (x) => console.log("[js_sound] ~  " + x ) 
var logger = function(m) { 
    return ()=>log(m) 
}

export var sounds = { 
    "success" : logger("success")  , 
    "continue" :  logger("continue") , 
    "unrecognized" : logger("unrecognized") , 
    "error" : logger("error") , 
    "ready" : logger("ready") 
}
