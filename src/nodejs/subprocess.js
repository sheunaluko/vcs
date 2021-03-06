

/* 
   wrapper around nodejs childprocess 
*/ 


const spawn = require("child_process").spawn
const execSync  = require("child_process").execSync
const exec      = require("child_process").exec 
const log  = require("./logger.js").get_logger("subproc")


function run_cmd(c) { 
    
    //on linux and darwin (osx)  we use /bin/bash and 
    //for windows we dont change 
    let os = process.env.VCS_OS_PLATFORM ; 
    var shell = ( os == 'darwin' || os == 'linux' ) ? "/bin/bash" : process.env.ComSpec //last one for windows see execSync DOCS
    
    try { 
	let result = execSync(c, {shell}).toString() 
	return { success : true  , result} 
    } catch (e)  { 
	return { success : false , error : e }  
    }    
}



function run_cmd_async(cmd) { 
    
    //on linux and darwin (osx)  we use /bin/bash and 
    let os = process.env.VCS_OS_PLATFORM ; 
    var shell = ( os == 'darwin' || os == 'linux' ) ? "/bin/bash" : process.env.ComSpec //last one for windows see execSync DOCS
    
    var process_reference = null 
    
    //create a promise which will return the result upon command completion 
    var promise = new Promise( (resolve,reject) => {
	
	//create callback (inside of promise definition) 
	var callback = function(error, stdout, stderr) {
	    if (error) {
		//failure for some reason 
		log.i(`exec error: ${error}`);
		let result = stdout.toString() 
		resolve( {success : false , error , result } ) //resolve
		return;
	    } else { 
		let result = stdout.toString() 		    		    
		log.i(`exec success: ${stdout}`);		    
		resolve( {success : true ,  result  , stderr } ) //resolve	
	    }
	} 
	
	//now that the callback is defined we can launch the process at grab its ref 
	process_reference = exec(cmd, {shell}, callback)	
	
    })

    return {process_reference , promise } 
}




class generic_process { 
    
    constructor(binary,out="stdout") { 
	var ps   = spawn(binary) 
	
	/* configure output */ 
	var out   = function(msg) { console.log("[STD->]::\n" + msg) } 		
	ps.stdout.on("data" , out ) 
	
	/* set member vars */ 
	this.pid   = ps.pid 
	this.ps  = ps
	this.log   = function(msg) { console.log(`[ps]::\t + ${msg}`) } 
	this.log("Created process: " + binary) 
	
	return null 
    }
    
    send_input(t) { 
	this.ps.stdin.write(t+"\n") 	
    }     
}

function bash_process() { return new generic_process("bash") } 
function python_process() { return new generic_process("python3.8") } 

function exec_python_binary_with_text(binary,text) { return run_cmd(`${binary} -c ${text}`) } 

//checks if a given python binary is 1) working and 2) of version greater than maj.min
function check_python_binary_version(binary,maj,min) {
    try { 
	let result = exec_python_binary_with_text(binary,python_version_check_string(maj,min)) 

	if (result.success) { 
	    return { success : true  } 
	} else { 
	    return { success : false , error : result.error }  
	}
	
    } catch (e)  { 
	
	//console.log("ERROR (python check):")
	//console.log(e)
	return { success : false , error : e }  
    }
}




// the command below converts a short python file string into an command executable via python -c __ 
function convert_to_python_cmd(s) { return "'" +  s.trim().replace(/\s*\n\s+/g,";") + "'" } 

//for example 
var python_version_check_string = function(maj,min) { 
    return convert_to_python_cmd(`
    import sys
    v = sys.version.split(" ")[0] 
    maj = int(v.split(".")[0])
    min = int(v.split(".")[1]) 
    print(maj >= ${maj} and min >= ${min}) 
`) 
}

module.exports = { 
    generic_process , 
    bash_process , 
    python_process, 
    python_version_check_string,
    run_cmd, 
    run_cmd_async,     
    check_python_binary_version, 

}
