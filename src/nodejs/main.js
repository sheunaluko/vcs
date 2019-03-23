//Sun Mar 10 17:20:01 PDT 2019

// load vcs 
var vcs      = require("./vcs.js") 

// load built in commands 
var builtins = require("./commands/index.js")

// add built in commands to vcs core
vcs.core.command_lib.add_command_module(builtins) 

// and start vcs wss and core 
vcs.wss.start() ; vcs.core.start()


module.exports = vcs 
