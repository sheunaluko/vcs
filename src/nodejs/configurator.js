/* 
   Fri Jan 24 08:00:15 PST 2020   
   This program (file) is responsible for validating the environment
   that vcs will be running in 
   
   It checks the config directory $HOME/.vcs/ 
   
   If that does not exist then it prompts the user to create it before running 
   
   Main configuration revolves around 
   1) VCS DB Credentials 
   2) VCS File Locations 
   3) VCS Python Interface 
*/   


const log  = require("./logger.js").get_logger("envconf")
var params = require("./vcs_params.js").params 
const fs   = require("fs") 
const readline = require('readline');

// get home dir  
let home = process.env.HOME; if (!home) {
    log("VCS requires that the $HOME environment variable is set in order to create a config directory in $HOME/.vcs\nPlease set this before proceeding") 
    log("Only configuration settings for database access, python environment recognition, etc will be written. VCS will never exfiltrate any of your data") 
    process.exit()
}

// set the config dir 
let delim = params.os.file_delimiter
let config_dir = home + delim + ".vcs/" 


async function init_config() { 

    // check if the configuration directory exists 
    if (fs.existsSync(config_dir)) { 
	log("Reading from configuration directory ~/.vcs") 
	let configuration = do_config() 
    } else { 
	log("Could not detect configuration directory ~/.vcs") 
	//launch creation workflow 
	if (await create_configuration()) { 
	    //creation was successful 
	    let configuration = do_config() 
	} else { 
	    //creation failed for some reason 
	    log("Aborting vcs launch. Goodbye.") 
	}
    }
    
    // at this point the 'configuration' object should contain critical config information 
    // note that this file is imported by main.js / vcs_cli.js and run prior to program initialization 
    // they can validate the configuration object against the passed in launch parameters  
    return configuration 
    
}


async function create_configuration() { 
    /* Create the configuration directory ? ?   */
    let ans = (await prompt(`Would you like to create the configuration directory at ${config_dir}?`)).toLowerCase() 
    switch (ans) { 
    case 'yes' : 
	continue 
	break 
	
    case 'y' : 
	continue 
	break 
	
    case 'no' :
	return false 
	break 
	
    case  'n' : 
	return false 
	break 
	
    default : 
	log("Please enter yes|y or no|n") 
	return (await create_configuration()) 
    }
    
    /* Create the configuration directory  */    
    log(`Creating ${config_dir}`)  
    fs.mkdirSync(config_dir) 
    
    /* Now we need to prompt the user for specific configurations */ 
    
    /* 
       things that currently need to be configured: 
       
       Loaded environment var:	[vcs_db_pass]	-> [Opensesame92!]
       Loaded environment var:	[vcs_db_user]	-> [oluwa]
       Loaded environment var:	[vcs_db_host]	-> [34.83.133.74]
       
       PYTHON ENVIRONMENT        
       
       FOR the following: 
       
       Loaded environment var:	[VCS_DEV_LOC]	-> [/Users/oluwa/dev/vcs/src/nodejs/vcs.js]
       Loaded environment var:	[VCS_DEV_DIR]	-> [/Users/oluwa/dev/vcs/src/nodejs/]
       
       Can actually write these paths to process.env during program initialization. 
       
       CAN HAVE A PROCESS_CONFIG FILE which modifies process.env appropriately  
       
       THen take union (main.js and cli.js) > entry.js 
       and have entry.js first require the PROCESS_CONFIG FILE , then the CONFIGURATOR 
       
       main.js should package arguments then simply pass them to require("vcs_cli")(args) 
       
       vcs_cli should FIRST call entry.js | all of config happens and a configuration object is returned 
       vcs_cli VALIDATES configuration object against the passed in parameters  
       
       Then it launches vcs and exports it 
       
       */ 
    
    
    
    
    // would you like to configure a backend DATABASE 
    
    // would you like to configure the python environment to allow development and deployment of python commands? 
    

    
}


																				
																									
																									






//https://stackoverflow.com/questions/18193953/waiting-for-user-to-enter-input-in-node-js
function prompt(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

