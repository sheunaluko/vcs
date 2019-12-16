//Sun Mar 10 15:19:44 PDT 2019

// M A I N - E X T E R N A L - I N T E R F A C E  

let info = require("./vcs_info.js")
let base_command = require("./base_command.js").base_command
let core = require("./vcs_core.js")
let util = require("./node_utils.js")
let filters = require("./filters.js") 
let state  = require("./vcs_state.js")
let wss = require("./vcs_ws_server.js")
let uis = require("./vcs_ui_server.js")
let R   = require("./ramda.js")
let command_library   = require("./command_library.js")
let out = require("./main_output.js")
let db = require("./vcs_db.js")
let aliases = require("./aliases.js")
var params  = require("./vcs_params.js").params
var csi      = require("./core_server_interface.js") 
var debug = null

//load the ui map 
let ui_map = require("./utilities/cross_platform_ui_map.js")

//load stuff for debugging 
let ui_maps = { mac : require("./utilities/osx/ui_map.js") } 


// define user friendly methods 
var add_command_module = core.command_lib.add_command_module.bind(core.command_lib)
var add_command_to_module = core.command_lib.add_command_to_module.bind(core.command_lib)
var add_command_modules = function(ms) { ms.map( m=> add_command_module(m)) }
var initialize  = function() { 
    wss.start();uis.start();core.start();csi.start_server() 
}




module.exports = { info ,base_command , core, util, filters, state , wss, uis ,debug , db , R ,
		   command_library, params, out , aliases, csi, add_command_module, initialize, 
		   ui_map, ui_maps } 
		 




