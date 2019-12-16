fs = require("fs") 
resolve = require('path').resolve
let vcs = require(process.env.VCS_DEV_LOC) 


fdelim = "/" ; 

var log = (x) => console.log("[cparse]:: " + x ) 

var ui_dir  = resolve(__dirname + "/../../client/react_ui/src/components/commands/")
var command_dir = resolve(__dirname +  "/../commands2/") 

function copy_to_ui_dest(f) { 
    //handle fname + loc 
    //fs.copyFile(f, 
}



//code modified from: 
//https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
var walk = function(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
	
	if (file[0] == ".") { 
	    return null  //hidden file 
	}
	
        file = dir + fdelim + file;
	
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            /* Recurse into a subdirectory */
            results = results.concat(walk(file));
        } else { 
            /* Is a file */
            results.push(resolve(file));
        }
    });
    return results;
}


/* define function for transforming minimal command into full command
   See module.exports.bundle below for how its used 
 */ 
function transform_minimal(min) { 
    var {id, rules, fn, vars , query, response  } = min 
    
    if (query && response ) { 
	id = query 
	rules  = [ query ] 
	
	if (typeof(response) == 'object') { 
	    //an array  (return rand nth) 
	    fn = ()=> { return response[Math.floor(Math.random() * response.length)] }
	} else { 
	    //assume a string 
	    fn = () => { return response }
	}
    }
    
    /* dynamically create the cmd class */
    class cmd extends vcs.base_command { 
	constructor(config) {
	    super({id}) 
	}
	
	static get_info() { 
	    return { 
		id , rules , vars 
	    }
	}
	
	async run() { 
	    this.log.i("Running minimal command") 
	    this.emit( fn() ) 
	    this.finish( { result : vcs.params.escape_indicator + "quiet" } ) 
	}
    }
    
    /* return the class */ 
    return cmd 
}

function get_command_files() { 
    return walk(command_dir) 
}


function get_command_info(fname) {  
    
    //exclude any dep files 
    if ( fname.indexOf(fdelim + "deps" + fdelim) != -1 ) { 
	return null 
    }
    
    //exclude files with IGNORE in path 
    if ( fname.indexOf("_IGNORE_") != -1 ) { 
	return null 
    }

    
    // - 
    truncated = fname.split(command_dir + fdelim)[1] 
    //log(truncated) 
    
    //tokenize 
    tokens = truncated.split(fdelim) 
    //log(tokens) 
    
    //get filetype 
    //log(tokens[tokens.length-1])
    ext = tokens[tokens.length-1].split(".")[1] 
    
    switch (ext) {
    case 'js' : 
	type = "JS" 
	break
	
    case 'jsx' : 
	type = "JSX" 
	break 
	
    case 'minimal' : 
	type = "MINIMAL" 
	break 
	
	
    default : 
	log("Unrecognized filetype: " + ext ) 
    }
    
    module = tokens[0] 
    name   = tokens[tokens.length-1].split(".")[0] 
    file_path = fname 
    
    return { type, module, name, file_path  }
    
}

function parse_command_dir() { 
    let parsed = get_command_files().map( get_command_info ).filter( x=> x !== null ) 
    let cmds = parsed.filter( x=> new Set(["JS","MINIMAL"]) .has (x.type) ) 
   
    //initialize the module object
    let all_modules = new Set( cmds.map(x=>x.module) ) 
    var modules = {} 
    for (mod of all_modules) { modules[mod] = {module : mod , 
					       bundle : [] } } 
    
    //populate the module objects appropiately 
    for (cmd of cmds) { 
	log("Loading " + cmd.name + " from module: " + cmd.module) 
	
	if (cmd.type == "JS") {
	    //regular class 
	    modules[cmd.module].bundle.push( require(cmd.file_path))
	    
	} else if (cmd.type == "MINIMAL") { 
	    //the file defines an array of minimal commands 
	    //for each of them we will transform them and add them to the module bundle 
	    mins = require(cmd.file_path) 
	    for (c of mins) { 
		modules[cmd.module].bundle.push( transform_minimal(c) ) 
	    }
	    
	} else { 
	    log("Unrecognized cmd type: " + cmd.type) 
	}
    }
    
    // now we deal with the UI files 
    let ui  = parsed.filter( x => x.type == "JSX") 
    
    return { modules, ui } 
    
    
}

module.exports =  {
    ui_dir, 
    command_dir, 
    walk, 
    get_command_files, 
    parse_command_dir, 
    
}


