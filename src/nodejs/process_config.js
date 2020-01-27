/* 
   Sat Jan 25 17:32:00 PST 2020
   This file is reponsible for any configuration of the node process
   Prior to program launch 
   
   NOTE: THIS FILE IS ONLY CALLED BY CONFIGURATOR.JS 
 */ 

var path = require('path');
const log  = require("./logger.js").get_logger("process_conf")
const os   = require("os") 

/* first we detect the location of the file, to then infer the location of the the vcs installation  */ 
var dir  = path.dirname(__filename); 
log.i("Running in dir: " + dir ) 


/* then we define the process environment vars we want to define */ 
var env_to_set = { 
    'VCS_DEV_DIR' : dir , 
    'VCS_DEV_LOC' : path.join(dir,"vcs.js" )  , 
    'VCS_PYTHON_DIR' : path.resolve(path.join(dir,"../python")) , 
    'VCS_UI_CLIENT_DIR' : path.resolve(path.join(dir,"../client/react_ui/")) , 
    'VCS_PYTHON_REQ' : path.resolve(path.join(dir,"../python/requirements.txt")) ,     
    'VCS_OS_PLATFORM'  : os.platform() , 
}

/* then we loop through and set them, while also notify if debug */ 
function main({verbose}) { 
    log.i("Congiguring process") 
    Object.keys(env_to_set).map(k => { 
	let val = env_to_set[k]  
	verbose ? log.i(`Setting process.env['${k}'] =\t${val}`)  : null     
	process.env[k] = val
    })
}


module.exports = { 
    main 
}





