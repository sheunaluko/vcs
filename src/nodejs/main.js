//Sun Mar 10 17:20:01 PDT 2019

// load vcs 
var vcs      = require("./vcs.js") 

// load built in commands 
var builtins = require("./commands/index.js")

// load builtins.minimal commands 
var minimals = require("./commands/minimal/index.js") 

// load csi 
var csi      = require("./core_server_interface.js") 

let dev = false

// add built in commands to vcs core
if (!dev) { 
    
    vcs.core.command_lib.add_command_module(builtins) 
    vcs.core.command_lib.add_command_module(minimals) 
    
    // start vcs wss ,ui ws and core 
    vcs.wss.start() 
    vcs.uis.start()  
    vcs.core.start()

    // start csi (for external commands over websockets) 
    csi.start_server() 
} 

if (dev) {
    vcs.util.make_diff_server(vcs.params.sync_port) 
    vcs.uis.start()  
}

// export file 
module.exports = {vcs , csi } 
