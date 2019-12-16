//load the parames 
var params = require("../vcs_params.js").params 
var log    = require("../logger.js").get_logger("ui_map")



//determine which ui map to export based on the operating system (which is in the params) 
var _map = null 

switch (params.os) {
case 'darwin' : 
    _map = require("./osx/ui_map.js").map 
    log.i("Using macosx ui map") 
    break 
    
//will add support for WINDOWS AND LINUX AS WELL    
    
default : 
    log.i("Operating system not yet supported (thats OK).") 
    break 
}



module.exports = _map 
