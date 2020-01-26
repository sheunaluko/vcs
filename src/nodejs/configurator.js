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


const log  = require("./logger.js").get_logger("config")
var params = require("./vcs_params.js").params 
const fs   = require("fs") 
const readline = require('readline');
const subprocess = require("./subprocess.js") //custom subprocess module I wrote 
const path      = require("path") 


//FIRST THING WE DO ... IS CONFIGURE THE PROCESS ITSELF 
require("./process_config.js").main({verbose :true})  


// get home dir  
let home = process.env.HOME; if (!home) {
    log.i("VCS requires that the $HOME environment variable is set in order to create a config directory in $HOME/.vcs\nPlease set this before proceeding") 
    log.i("Only configuration settings for database access, python environment recognition, etc will be written. VCS will never exfiltrate any of your data") 
    process.exit()
}

// set the config dir 
let delim = params.os.file_delimiter
let config_dir = home + delim + ".vcs/" 


log.i("Loading")

async function init_config() { 

    var config = null 
    var config_path = path.join(config_dir,"/config.json") 
    
    // check if the configuration directory exists 
    if (fs.existsSync(config_dir)) { 
	log.i("Detected and reading from configuration directory ~/.vcs") 
	try { 
	    config = require(config_path) 
	    log.i("Detected config file!") 	    
	} catch (e) { 
	    log.i(`\n\nERROR: Config file (${config_path}) is either missing or corrupted (see error below).\nPlease attempt to fix this and if you cannot then delete the ${config_dir} directory and relaunch to recreate the configuration directory.`) 
	    console.log(e) 
	    
	    console.log("\n\nAborting!")
	    process.exit(1) 
	}

    } else { 
	log.i("Could not detect configuration directory ~/.vcs") 
	//launch creation workflow 
	config = await create_configuration()
	if (config) { 
	    //creation was successful 
	    log.i("Successfully created configuration directory") 
	    //write the config to the config file 	    
	    fs.writeFileSync(config_path, JSON.stringify(config))	    
	    log.i("Wrote configuration file") 
	    
	} else { 
	    //creation failed for some reason 
	    log.i("Aborting vcs launch. Goodbye.") 
	}
    }
			    
    log.i("Handing off program with the following configuration: \n\n") 
    
    //obfuscate password 
    let copy = {...config} ; copy.db_config.pass = "***" 
    console.log(copy) 
    
    console.log("\n\n")
    
    // at this point the 'configuration' object should contain critical config information 
    // note that this file is imported by main.js / vcs_cli.js and run prior to program initialization 
    // they can validate the configuration object against the passed in launch parameters  
    return config 
    
}


async function create_configuration() { 
    /* Create the configuration directory ? ?   */
    var ans = (await prompt(`Would you like to create the configuration directory at ${config_dir}?\nThis is required for functionality of vcs, and removal of all files can be done with one command.\nThe directory is in your HOME, and thus will not touch system files.`)).toLowerCase() 
    if (ans == 'yes' || ans == 'y' ) { /*pass*/ } 
    else if (ans == 'no' || ans == 'n') { return false } 
    else {
	log.i("Please enter yes|y or no|n next time \n") 
	return (await create_configuration()) 
    }
    
    /* Create the configuration directory  */    
    log.i(`Creating ${config_dir}`)  
    fs.mkdirSync(config_dir) 
    
    /* Now we need to prompt the user for specific configurations */ 
    
    let db_config = await create_database_config() 
    let python_config = await create_python_config() 
    
    
    return {db_config, python_config} 
}


async function create_database_config() { 
    

    var ans = (await prompt(`Would you like to create a remote mongo database config?\nThis will allow vcs to offload data to an external database for persistence, a functionality used by several commands such as log`)).toLowerCase() 
    if (ans == 'yes' || ans == 'y' ) { /*pass*/ } 
    else if (ans == 'no' || ans == 'n') { return {} } 
    else {
	log.i("Please enter yes|y or no|n next time \n") 
	return (await create_database_config()) 
    }
    
    let ip   = (await prompt(`Input ip:`)).toLowerCase()     
    let user = (await prompt(`Input user:`)).toLowerCase()     
    let pass = (await prompt(`Input pass:`)).toLowerCase()     
    
    db_config = {ip,user,pass} 
    log.i("The following database configuration will be created:\n") 
    console.log(db_config) 
    
    var ans = (await prompt(`Is this correct?`)).toLowerCase() 
    if (ans == 'yes' || ans == 'y' ) { 
	log.i("OK") 
	return db_config 
    }
    else if (ans == 'no' || ans == 'n') { 
	log.i("RETRYING") 
	return (await create_database_config()) } 
    else {
	log.i("Please enter yes|y or no|n next time \n") 	
	return (await create_database_config()) 
    }    
    
}


async function create_python_config() { 
    

    var ans = (await prompt(`Would you like to configure the python (>= 3.6) environment?\nThis will allow vcs to make use of builtin python commands as well as for you to write voice commands using python in addition to javascript.`)).toLowerCase() 
    if (ans == 'yes' || ans == 'y' ) { /*pass*/ } 
    else if (ans == 'no' || ans == 'n') { return {} } 
    else {
	log.i("Please enter yes|y or no|n next time \n") 
	return (await create_python_config()) 
    }
    
    let binary   = (await prompt(`Input path to executable python (>=3.6):`)).toLowerCase()     
    
    /* ok  so if we have the binary -- theoretically we should be able to create a virtual env in the ~/.vcs/ directory 
       Then we should be able to activate it 
       Then we should be able to install all the dependencies 
       Then deactivate it 
       This seems relatively complex , but obviously not impossible. 
       */
    
    
    /* first we validate if the provided binary is valid and the version is > 3.6 */ 
    // - 
    log.i("Checking python binary") 
    var {success,error} = subprocess.check_python_binary_version(binary,3,6) 
    
    if (success) { 
	//will attempt to create a virtual env 
	//pass 
    } else { 
	//need a new one 
	log.i("There was a problem with the specified path (see error below). Please ensure that the version is greater than 3.6 and that the path you entered actually points to a working python installation. You can also skip this for now of course.") 
	console.log(`\n\n${error}\n\n`) 
	
	return (await create_python_config() ) 
    }
    
    /* now we attempt to create a virtual env in the .vcs directory */ 
    // - 
    let env_dir = path.join(process.env.HOME,".vcs/pyenv")
    var cmd = `${binary} -m venv ${env_dir}` 
    log.i(`Attempting to create virtual env at ${env_dir}`) 
    log.i(`Running: ${cmd}`) 
    
    var {success,error} = subprocess.run_cmd(cmd) 
    if (success) { 
	log.i("Virtual env successfully created!") 
    }
    else { 
	//failed to create virtual env for some reason 
	log.i("Virtual environment creation failed (see error). You wil have to manually configure it later :)")
	console.log(`\n\n${error}\n\n`) 
	let libs_installed = true 	
	let env_dir = false
	return  await complete_python_config({binary,env_dir,libs_installed})   // just return a config with a validated binary, but no venv  
    }

    /* at this point the virtual env is created, and now we just have to install the requirements */ 
    // can read the requirements.txt location from process.VCS_PYTHON_REQ

    let winPath = path.join(env_dir,"\Scripts\activate")
    let linPath = path.join(env_dir,"/bin/activate") 

    let step1 = "source " +  (process.VCS_OS_PLATFORM == 'win32' ? winPath : linPath)  //activate the env 
    let step2 = `pip install -r ${process.env.VCS_PYTHON_REQ}`              //install the deps
    var cmd   = [step1,step2].join("; ") 
	
    log.i(`Attempting to install required python libraries`) 
    log.i(`Running: ${cmd}`) 
    
    var {success,error} = subprocess.run_cmd(cmd) 
    if (success) { 
	log.i("All libraries were installed!") 
	let libs_installed = true 
	return 	await complete_python_config({binary, env_dir, libs_installed})   // return incomplete config	
    }
    else { 
	//failed to create virtual env for some reason 
	log.i("Library installation failed (see error). You wil have to manually install later :)")
	console.log(`\n\n${error}\n\n`) 
	let libs_installed = false
	return  await complete_python_config({binary, env_dir,libs_installed })   // return incomplete config
    }

    
    
}


async function complete_python_config(python_config) { 
    log.i("The following python configuration will be created:\n") 
    console.log(python_config) 
    
    var  ans = (await prompt(`Is this correct?`)).toLowerCase() 
    if (ans == 'yes' || ans == 'y' ) { 
	log.i("OK") 
	return python_config 
    }
    else if (ans == 'no' || ans == 'n') { 
	log.i("RETRYING") 
	return (await create_python_config()) } 
    else {
	log.i("Please enter yes|y or no|n next time \n") 	
	return (await complete_python_config(python_config)) 
    }    
        
}
																			
													


//https://stackoverflow.com/questions/18193953/waiting-for-user-to-enter-input-in-node-js
function prompt(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question("\n" + query+"\n\n=> ", ans => {
        rl.close();
        resolve(ans);
    }))
}

module.exports = { init_config  } 
