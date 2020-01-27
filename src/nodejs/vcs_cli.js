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
exports.init = async function(params) { 
    
    //get the configuration object 
    //if not created will initiate the appropriate workflow 
    let config = await require("./configurator.js").init_config()  

    //the config has some environment variables that need to be set 
    var env_to_set = { 
	'vcs_db_pass' : config.db_config.pass,
	'vcs_db_user' : config.db_config.user, 
	'vcs_db_host' : config.db_config.ip, 
    }

    /* then we loop through and set them, while also notify if debug */ 
    log.i("Congiguring process")
    var to_hide = new Set(["vcs_db_pass"])     
    Object.keys(env_to_set).map(k => {
	if (to_hide.has(k))  {
	    log.i(`Setting process.env['${k}'] =\t${"***"}`)   	    
	} else {
	    log.i(`Setting process.env['${k}'] =\t${env_to_set[k]}`)
	}
	process.env[k] = env_to_set[k] 
    })

    
    //set the params 
    Object.keys(params).map(k=>{
	log.i(`Setting param: ${k} =\t ${params[k]}`)
	PARAMS[k] = params[k]
    })
    
    //reconcile the params and the config object
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
    let db_ready = (config.db_config.ip && config.db_config.user && config.db_config.pass) 
    
    let python_ready  = (config.python_config.binary && config.python_config.env_dir && 
			 (config.python_config.libs_installed == true ) ) 
	
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
    
    
    //report 
    if (inconsistencies.length ) { 
	log.i("ERROR: Detected inconsistencies")
	inconsistencies.map(inc=>{log.i(inc)})
	process.exit(1) 
    } else { log.i("Parameter and configuration reconciliation completed successfully\n\n") } 
}


