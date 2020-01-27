/* 
   Sun Jan 26 17:31:30 PST 2020
   Responsible for launching and managing the python subprocess 
*/

const path = require("path") 
const log  = require("./logger.js").get_logger("py_launch")
const sp   = require("./subprocess.js") //my custom lib 

function launch() { 
    
    // define stuff  
    let python = process.env.VCS_PYTHON_BINARY  //python binary 
    let env_dir = process.env.VCS_PYENV_DIR      //python virtualenv directory 
    let py_dir  = process.env.VCS_PYTHON_DIR     //vcs python src directory 
    let csi_adapter_loc = path.join(py_dir,"csi_adapter.py") //the path to the python file 

    
    // (1) activate the env 
    var step1 = null   
    if (process.VCS_OS_PLATFORM == 'win32') { 
	step1 =  path.join(env_dir,"\Scripts\activate") 
    } else { 
	step1 =  "source " + path.join(env_dir,"/bin/activate") 	
    }

    // (2) change to the python src directory 
    let step2 = `cd ${py_dir}`  //change to python directory 
    
    // (3) launch the python file 
    let step3 = `${python} ${csi_adapter_loc}` 
    
    // -> build the cmd string
    var cmd   = [step1,step2,step3].join("; ") 
	
    log.i(`Attempting to launch python subprocess:`) 
    log.i(`Running: ${cmd}`) 
    
    var {process_reference, promise} = sp.run_cmd_async(cmd) 
    
    return {process_reference, promise}
    
}



module.exports = {
    launch ,
}
