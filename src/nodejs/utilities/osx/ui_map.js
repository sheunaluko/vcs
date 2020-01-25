var util   = require("@sheunaluko/node_utils") 
var log    = require("../../logger.js").get_logger("osx_ui")

var map  = { 
    
    press_enter : function() { 
	return hs(
	    "hs.eventtap.event.newKeyEvent({}, 'return', true):post();" +   
	    "hs.eventtap.event.newKeyEvent({}, 'return', false):post()" 
	) 
    }, 
    
    type_chars  : function(chars) { 
	return hs("hs.eventtap.keyStrokes('" + chars + "')")
    }, 
    

    
} 

function hs(stuff) { 
    //hammerspoon calling syntax 
    let cmd =  "hs -c \"" + stuff + "\""
    log.i("Executing: " + cmd)
    return util.execute(cmd)
} 

module.exports =  {map} 


