//Sun Mar 10 17:20:01 PDT 2019
//Thu Jan 23 22:24:31 PST 2020  

//to use simply start repl then do | var vcs = require("./vcs_cli.js") 

const log = require('./logger.js').get_logger("init")
var params = require("./vcs_params.js").params 


// load vcs  (will load the updated params now) 
var vcs      = require("./vcs.js") 

// load command modules
var cmd_parser = require("./utilities/command_parser.js")
let {modules,ui} = cmd_parser.parse_command_dir()
// add command modules 
vcs.add_command_modules(modules) 


// migrate the ui files  and start file watcher 
cmd_parser.migrate_ui_files() 
if (true) { 
    var watcher = cmd_parser.watch_command_dir() 
}


//start vcs 
console.log("\n") 
log.i("Will initialize vcs core with the following parameters:") 
console.log(params) 
console.log("\n") 
vcs.initialize() 
console.log("\n -- \n") 


// export file 
module.exports = vcs 
