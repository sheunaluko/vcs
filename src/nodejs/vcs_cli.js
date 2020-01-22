
//Sun Mar 10 17:20:01 PDT 2019

/* Parse command line args ------------------------------  */ 

const log = require('./logger.js').get_logger("init")


// load vcs  (will load the updated params now) 
var vcs      = require("./vcs.js") 


// load command modules
var cmd_parser = require("./utilities/command_parser.js")
let {modules,ui} = cmd_parser.parse_command_dir()

// migrate the ui files 
cmd_parser.migrate_ui_files() 
// also start the file watcher 
if (true) { 
    var watcher = cmd_parser.watch_command_dir() 
}



// load csi 
var csi      = require("./core_server_interface.js") 

let dev = false 

// add built in commands to vcs core
if (!dev) { 
    
    // add command modules 
    for ( mod of Object.keys(modules) ) { 
	vcs.core.command_lib.add_command_module(modules[mod])	
    }
    
    // start vcs wss ,ui ws and core 
    vcs.wss.start() 
    vcs.uis.start()  
    vcs.core.start()
    // start csi (for external commands over websockets) 
    // csi.start_server() 
} 

if (false) {
    vcs.util.make_diff_server(vcs.params.sync_port) 
    vcs.uis.start()  
}

// export file 
module.exports = {vcs , csi , watcher } 
