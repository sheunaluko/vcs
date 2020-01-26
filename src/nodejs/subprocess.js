

/* 
   wrapper around nodejs childprocess 
*/ 


const spawn = require("child_process").spawn
const execSync  = require("child_process").execSync
const log = console.log 


function run_cmd(c) { 
  try { 
      let result = execSync(c).toString() 
      return { success : true  , result} 
  } catch (e)  { 
      return { success : false , error : e }  
  }    
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
	let result = exec_python_binary_with_text(binary,python_version_check_string(maj,min)).result
	//log("got result: " + result)
	if (result == 'True\n') { 
	    return { success : true  } 
	} else { 
	    return { success : false , error : "Version incorrect" }  
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
    check_python_binary_version, 
}
