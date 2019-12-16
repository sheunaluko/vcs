//Sat Jul  6 14:43:56 PDT 2019
let vcs = require(process.env.VCS_DEV_LOC)
let id = "review_logs" 



class cmd extends vcs.base_command { 
    
    constructor(config) { 
	
	var initial_state = { 'entries' : {}  , 'logs' : []  , 'status' : 'selecting',
			      'current' : ""  , 'info' : {}  } 

	super({id, initial_state})
	
	this.batch_num = 200

    }
    
    static get_info() { 
	return {
	    id    : id , 
	    rules : [ "review logs"],
	    vars     : null 
	}
    } 

    async run() { 
	this.feedback("continue")	

	//initialization automatically handled when init function defined (see below) 

	while(true ) {
	    
	    // get user text 
	    let text = await this.get_input() 
	    if (text == undefined || text == "finished") { break }

	    // core switch logic 
	    switch (this.state.value.status) { 
		
	    case 'selecting' : 
		
		this.log.i("status: selecting")
		
		//if the text matches one of the logs then we select that log  
		var log_name = log_name_transform(text)
		var ind = this.state.value.logs.map((x)=>x.name).indexOf(log_name) 
		if (ind > -1 ) { 
		    //there's a match so we switch to that log by updating the state
		    this.state.update( ['current'] , ()=> log_name) 
		    this.state.update( ['status'] , ()=> 'reviewing' ) 
		    this.emit("OK")
		    
		} else { 
		    this.emit("That is not a recognized log") 
		}
		break 
		
		
	    case 'reviewing' : 
		this.log.i("status: reviewing")		
		if (text == "select log" ) { 
		    this.state.update( ['status'], ()=> 'selecting')
		    this.emit("Please enter log name") 
		} else if (text == "more" ) { 
		    this.log.i("Loading more data for current") 
		    this.load_data_for_collection(this.state.value.current)
		}
		break 
		
		
		
	    default : 
		this.log.i("Unrecognized status") 
		break 
	    }

	    
	}
	
	
	//input channel has been closed 
	this.finish({result : "OK" } )
    } 
    
    async init() { 
	
	//first retrieve log files 
	this.emit("Retrieving log files") 
	let log_names = await vcs.db.get_collections()  ; 	

	//set all the log names 
	this.state.update( ['logs'] , ()=> log_names )
	//and configure the entries as well 
	this.state.update( ['entries'] , function( e) { 
	    // using bundled Ramda.js library (R) to zip two arrays into dictionary 
	    for (var log_name of log_names) { 
		e[log_name.name] = new Array() 
	    }
	    return e 
	})

	//set up listeners for state transition events 
	this.state.listener( ['status'] , async function(s) { 
	    //when status changes this function will get called with the new value s 
	    if (s == "reviewing") { 
		let coll = this.state.value.current 
		this.log.i("Now reviewing collection: " + coll)
		
		//get data if necessary 
		if (this.state.value.entries[coll].length == 0 ) { 
		    
		    await this.load_data_for_collection(coll) 
		    
		} else { 
		    this.log.i("Data already has been loaded")
		}
		
	    } else { 
		this.log.i("Not reviewing") 
	    }
	    
	})
	    
	//notify user to proceed 
	this.emit("Please input log name") 
    }
	
    async get_data_for_collection(coll) {
	// check if we have info about this collection already 
	if (! this.state.value.info[coll] ) { 
	    this.state.value.info[coll] = {}  
	    this.state.value.info[coll].skip = 0 		    
	}
	
	let skip = this.state.value.info[coll].skip 
	// will retrieve some results and populate them 
	let cursor = await vcs.db.find(coll,{},true) 
	let results = cursor.skip(skip*this.batch_num).limit(this.batch_num).toArray()

	
	//update the skip for next retrieval 
	this.state.value.info[coll].skip += 1  
	
	return results 
    }
    
    async load_data_for_collection(coll) { 
	this.log.i("Loading data for coll: " + coll ) 
	let data = await this.get_data_for_collection(coll)
	this.log.i("Got num results: " + data.length) 	
	this.state.update( ['entries'] , function( e) { 
	    for (var d of data) {
		e[coll].push(d) 
	    }
	    return e 
	})
    }

    

}

var log_name_transform = vcs.util.identity 


module.exports = cmd 



