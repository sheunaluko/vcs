//Thu Aug 29 17:26:00 CDT 2019
let vcs = require(process.env.VCS_DEV_LOC)
let id = "typer"


class typer extends vcs.base_command { 
    
    constructor(config) { 
	
	let filters = [vcs.filters.string_dict_filter( 
	    {} 
	)]
	
	super({id, filters})
	
	this.mode = "dash"  
	this.delay = 1200 
    }
    
    //all commands have a static method returning their info (used for initialization)
    static get_info() { 
	return {
	    id    : id , 
	    rules : [ "start ?(typer|typing|writing)",
		      "typing mode" 
		    ]  , 
	    vars     : null 
	}
    } 
    
    //all commands must implement the async run method
    async run() { 
	
	this.emit("typing mode enabled") 
	
	//loop read from the input channel 
	while(true ) {

	    var text = await this.get_input() 
	    if (text == undefined || text == "finished") { break }
	    
	    //see if text has command
	    var c = this.get_command(text)
	    if (c) { continue } // skip to next iteration if a command was processed 
	                        // (dont want to type it) 
	    
	    //feedback that text will be entered 
	    this.feedback("continue")
	    
	    //transform text as necessary  (see below) 
	    text = this.transform(text) 
	    
	    //now type the stuff ... and press enter after its typed ... 
	    vcs.ui_map.type_chars(text)
	    let _ = await vcs.util.delay(this.delay) //will improve on this with better async 
	    vcs.ui_map.press_enter() 

	}
	//input channel has been closed 
	this.finish({payload : {result : "OK"}}) 
    }
    
    get_command(text)  { 
	switch (text) { 
	case 'switch to mode dash' : 
	    this.mode = 'dash' 
	    this.feedback('success')
	    return 1
	    break 
	case 'switch to mode default' : 	    
	    this.mode = 'default'
	    this.feedback('success')	    
	    return 1 
	    break 
	default : 
	    return 0 
	}
    }
    
    transform(text) { 
	switch (this.mode) { 
	case 'dash' : 
	    return "- " + text 
	    break 
	default : 
	    return text 
	}
	
    }
    
}


module.exports = typer
  
