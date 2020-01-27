//Sun Mar 10 17:20:01 PDT 2019
//Thu Jan 23 22:24:31 PST 2020  

//USAGE:: simply start repl then do | var vcs = require("./vcs_cli.js") 

 /* 
       WORKFLOW 
       
       vcs_cli.js 
         1) first calls configurator.js to obtain the configuration OBJECT 
         2) VALIDATES configuration object against the passed in parameters  
	 3) Aborts if mismatch, logs stuff, INITS VCS PROGRAM 
       
       main.js: 
          1) should package arguments then simply pass them to require("vcs_cli").init(args) 
       
	  
	CHAIN OF STARTUP FILES = main > vcs_cli > configurator > process_config 
	  
    */ 

const log = require('./logger.js').get_logger("cli")
var PARAMS = require("./vcs_params.js").params  //actually vcs params 

exports.vcs = null 
exports.init = async function(params={}) { 
    
    
    
    //configure the node process 
    //if configuration dir not created will initiate the appropriate workflow 
    //return val is unimportant as process should be configured directly  
    //it is passed below to reconcile just so it can be printed upon an error
    let config = await require("./configurator.js").init_config()  
    
    //set the params 
    Object.keys(params).map(k=>{
	log.i(`Setting param: ${k} =\t ${params[k]}`)
	PARAMS[k] = params[k]
    })
    
    //reconcile the params and the process configuration 
    //will ABORT the process if there is an ERROR     
    reconcile({config,params : PARAMS}) 
    

    log.i("Proceeding with program initialization\n\n") 
    
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
    console.log(PARAMS) 
    console.log("\n") 
    vcs.initialize() 
    console.log("\n -- \n") 
    
    //assign the export at the end here 
    exports.vcs = vcs 
   
}

function reconcile({config,params}) { 
    log.i("Reconciling parameters and configuration")      
    var inconsistencies = [] 
    
    //determine capabilities 
    let db_ready = (process.env.VCS_DB_PASS && process.env.VCS_DB_USER &&  process.env.VCS_DB_HOST) 
    
    let python_ready  = (process.env.VCS_PYTHON_BINARY && process.env.VCS_PYENV_DIR && 
			 process.env.VCS_PYENV_LIBS_INSTALLED )
	
    //check database
    if ( params.db_enabled && !db_ready ) { 
	inconsistencies.push("Database is enabled but config file does not contain necessary information (ip,user,pass):")
	inconsistencies.push(JSON.stringify(config.db_config)) 
    }

    //check python env 
    if ( params.autostart_python && !python_ready ) { 
	inconsistencies.push("Autostart python is enabled but installation is incomplete:")
	inconsistencies.push(JSON.stringify(config.python_config)) 
    }
    
   //check csi  
    if ( params.autostart_python && !params.csi_enabled ) { 
	inconsistencies.push("Autostart python REQUIRES that csi_enabled == true !")
    }    
    
    
    //report 
    if (inconsistencies.length ) { 
	log.i("ERROR: Detected inconsistencies")
	inconsistencies.map(inc=>{log.i(inc)})
	process.exit(1) 
    } else { log.i("Parameter and configuration reconciliation completed successfully\n\n") } 
}


