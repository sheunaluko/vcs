//Sun Mar 10 15:19:44 PDT 2019

// M A I N - E X T E R N A L - I N T E R F A C E  

let info = require("./vcs_info.js")
let base_command = require("./base_command.js").base_command
let core = require("./vcs_core.js")
let util = require("@sheunaluko/node_utils")
let filters = require("./filters.js") 
let state  = require("./vcs_state.js")
let wss = require("./vcs_ws_server.js")
let uis = require("./vcs_ui_server.js")
let R   = require("./ramda.js")
let command_library = require("./command_library.js")
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
var add_command_modules = function(ms) { Object.keys(ms).map( mk=> add_command_module(ms[mk])) } //called in main.js 


    

/* main interface from parameters in main.js to actual program configuration */
var initialize  = function() { 
        
    if (params.db_enabled)          { aliases.load_aliases() }  // load aliases from db 
    if (params.csi_enabled)         { csi.start_server()     }  // start csi 
    if (params.ui_server_enabled)   { uis.start()            }  // start ui server 
    
    //start the sync server (used for exposing command state to external actors like UI, etc )     
    if (params.diff_server_enabled) { util.make_diff_server(params.sync_port) } 
    
    //start the vcs web socket server (listens for incoming TEXT INPUT MESSAGES FOR PROCESSING) 
    wss.start();
    
    //start vcs core 
    core.start();
    
    //start python subprocess if appropriate 
    if (params.autostart_python)   { 
	var {process_reference, promise}  = require("./python_launcher.js").launch() 
	//export the result 
	exports.python_process = { reference : process_reference , 
				   promise   } 
    }
    
    //start ui subprocess if appropriate 
    if (params.autostart_ui_client)   { 
	var {process_reference, promise}  = require("./ui_launcher.js").launch() 
	//export the result 
	exports.ui_client_process = { reference : process_reference , 
				      promise   } 
    }

    
}




module.exports = { info ,base_command , core, util, filters, state , wss, uis ,debug , db , R ,
		   command_library, params, out , aliases, csi, add_command_module, add_command_modules, 
		   initialize, ui_map, ui_maps } 
		 




