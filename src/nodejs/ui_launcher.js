/* 
   Sun Jan 26 20:26:28 PST 2020
   Responsible for launching and managing the main CLIENT UI Interface 
*/

const path = require("path") 
const log  = require("./logger.js").get_logger("ui_launch")
const sp   = require("./subprocess.js") //my custom lib 

function launch() { 
    
    // define stuff  
    let ui_dir = process.env.VCS_UI_CLIENT_DIR

    // (1) change to  the ui dir src directory 
    let step1 = `cd ${ui_dir}`  //change to python directory 

    // (2) install deps (will return if already installed) 
    let step2 = `yarn install` 
    
    // (3) launch the development ui 
    let step3 = `yarn run start` 
    
    // -> build the cmd string
    var cmd   = [step1,step2,step3].join("; ") 
	
    log.i(`Attempting to launch ui_client subprocess:`) 
    log.i(`Running: ${cmd}`) 
    
    var {process_reference, promise} = sp.run_cmd_async(cmd) 
    
    return {process_reference, promise}
    
}

module.exports = {
    launch ,
}
