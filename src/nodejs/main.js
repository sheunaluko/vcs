//Sun Mar 10 17:20:01 PDT 2019

// load vcs 
var vcs      = require("./vcs.js") 

// load built in commands 
var builtins = require("./commands/index.js")

// load csi 
var csi      = require("./core_server_interface.js") 

// add built in commands to vcs core
vcs.core.command_lib.add_command_module(builtins) 

// start vcs wss and core 
vcs.wss.start() ; vcs.core.start()

// start csi (for external commands over websockets) 
csi.start_server() 

// export file 
module.exports = {vcs , csi } 
